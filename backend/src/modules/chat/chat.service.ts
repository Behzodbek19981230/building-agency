import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { MessageType } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async canAccessChat(chatId: string, userId: string): Promise<boolean> {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: { project: true },
    });
    if (!chat) return false;

    const project = chat.project;
    if (project.clientId === userId) return true;

    const bid = await this.prisma.bid.findFirst({
      where: { projectId: project.id, workerId: userId, status: 'ACCEPTED' },
    });

    return !!bid;
  }

  async getChatByProject(projectId: string, userId: string) {
    const chat = await this.prisma.chat.findUnique({
      where: { projectId },
      include: { project: { select: { id: true, title: true, clientId: true, assignedWorkerId: true, status: true } } },
    });

    if (!chat) throw new NotFoundException('Chat not found');

    const hasAccess = await this.canAccessChat(chat.id, userId);
    if (!hasAccess) throw new ForbiddenException('Access denied');

    return { data: chat };
  }

  async getMessages(chatId: string, userId: string, page = 1, limit = 50) {
    const hasAccess = await this.canAccessChat(chatId, userId);
    if (!hasAccess) throw new ForbiddenException('Access denied');

    const skip = (page - 1) * limit;

    const [total, messages] = await Promise.all([
      this.prisma.message.count({ where: { chatId } }),
      this.prisma.message.findMany({
        where: { chatId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { sender: { select: { id: true, firstName: true, lastName: true, avatar: true, role: true } } },
      }),
    ]);

    return {
      data: messages.reverse(),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async createMessage(
    senderId: string,
    chatId: string,
    data: { content?: string; type?: MessageType; fileUrl?: string; fileName?: string },
  ) {
    const hasAccess = await this.canAccessChat(chatId, senderId);
    if (!hasAccess) throw new ForbiddenException('Access denied');

    const message = await this.prisma.message.create({
      data: {
        chatId,
        senderId,
        type: data.type || 'TEXT',
        content: data.content,
        fileUrl: data.fileUrl,
        fileName: data.fileName,
      },
      include: { sender: { select: { id: true, firstName: true, lastName: true, avatar: true, role: true } } },
    });

    return message;
  }

  async markMessagesRead(chatId: string, userId: string) {
    await this.prisma.message.updateMany({
      where: { chatId, senderId: { not: userId }, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async getUnreadCount(userId: string) {
    const chats = await this.prisma.chat.findMany({
      where: {
        project: {
          OR: [{ clientId: userId }, { assignedWorkerId: userId }],
        },
      },
      select: { id: true },
    });

    const chatIds = chats.map((c) => c.id);

    const count = await this.prisma.message.count({
      where: {
        chatId: { in: chatIds },
        senderId: { not: userId },
        isRead: false,
      },
    });

    return { data: { unreadCount: count } };
  }

  async getUserChats(userId: string) {
    const chats = await this.prisma.chat.findMany({
      where: {
        isActive: true,
        project: {
          OR: [{ clientId: userId }, { assignedWorkerId: userId }],
        },
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            status: true,
            clientId: true,
            assignedWorkerId: true,
            client: { select: { id: true, firstName: true, lastName: true, avatar: true } },
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: { sender: { select: { id: true, firstName: true } } },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return { data: chats };
  }
}
