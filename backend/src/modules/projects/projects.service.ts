import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateProjectDto, UpdateProjectDto, ProjectQueryDto } from './dto/project.dto';
import { toFileUrl } from '../../common/utils/upload.util';
import { ProjectStatus, UserRole } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(clientId: string, dto: CreateProjectDto, files?: Express.Multer.File[]) {
    const project = await this.prisma.project.create({
      data: {
        clientId,
        title: dto.title,
        description: dto.description,
        categoryId: dto.categoryId,
        urgency: dto.urgency,
        budgetMin: dto.budgetMin,
        budgetMax: dto.budgetMax,
        latitude: dto.latitude,
        longitude: dto.longitude,
        address: dto.address,
        city: dto.city,
        region: dto.region,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        status: 'OPEN',
      },
      include: { images: true, category: true, client: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
    });

    if (files?.length) {
      await this.prisma.projectImage.createMany({
        data: files.map((file, index) => ({
          projectId: project.id,
          url: toFileUrl(file),
          mimeType: file.mimetype,
          size: file.size,
          order: index,
        })),
      });
    }

    return { data: project, message: 'Project created successfully' };
  }

  async findAll(query: ProjectQueryDto, _userId?: string) {
    const { page = 1, limit = 10, search, categoryId, urgency, city, budgetMin, budgetMax, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where: any = { status: { in: ['OPEN', 'IN_PROGRESS'] } };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (categoryId) where.categoryId = categoryId;
    if (urgency) where.urgency = urgency;
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (budgetMin) where.budgetMin = { gte: budgetMin };
    if (budgetMax) where.budgetMax = { lte: budgetMax };

    const [total, items] = await Promise.all([
      this.prisma.project.count({ where }),
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          images: { take: 1, orderBy: { order: 'asc' } },
          category: true,
          client: { select: { id: true, firstName: true, lastName: true, avatar: true } },
          _count: { select: { bids: true } },
        },
      }),
    ]);

    return {
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string, _userId?: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: 'asc' } },
        category: true,
        client: { select: { id: true, firstName: true, lastName: true, avatar: true, phone: true } },
        bids: {
          include: {
            workerProfile: { select: { id: true, rating: true, completedProjects: true, isVerified: true } },
            worker: { select: { id: true, firstName: true, lastName: true, avatar: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        reviews: { include: { reviewer: { select: { id: true, firstName: true, lastName: true, avatar: true } } } },
      },
    });

    if (!project) throw new NotFoundException('Project not found');

    await this.prisma.project.update({ where: { id }, data: { viewCount: { increment: 1 } } });

    return { data: project };
  }

  async update(id: string, userId: string, dto: UpdateProjectDto) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.clientId !== userId) throw new ForbiddenException('Not your project');
    if (project.status !== 'OPEN' && project.status !== 'DRAFT') {
      throw new BadRequestException('Cannot edit project in current status');
    }

    const updated = await this.prisma.project.update({
      where: { id },
      data: dto,
      include: { images: true, category: true },
    });

    return { data: updated, message: 'Project updated' };
  }

  async cancel(id: string, userId: string, userRole: UserRole) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');

    if (userRole !== 'ADMIN' && project.clientId !== userId) {
      throw new ForbiddenException('Not authorized');
    }

    if (project.status === 'COMPLETED') {
      throw new BadRequestException('Cannot cancel completed project');
    }

    await this.prisma.project.update({ where: { id }, data: { status: 'CANCELLED' } });

    if (project.assignedWorkerId) {
      await this.prisma.workerProfile.updateMany({
        where: { userId: project.assignedWorkerId },
        data: { status: 'AVAILABLE' },
      });
    }

    return { message: 'Project cancelled' };
  }

  async getMyProjects(userId: string, status?: ProjectStatus, role?: string) {
    const where: any =
      role === 'WORKER'
        ? { assignedWorkerId: userId }
        : { clientId: userId };

    if (status) where.status = status;

    const projects = await this.prisma.project.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        images: { take: 1 },
        category: true,
        client: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        _count: { select: { bids: true } },
      },
    });

    return { data: projects };
  }

  async assignWorker(projectId: string, workerId: string, bidId: string, clientId: string) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.clientId !== clientId) throw new ForbiddenException('Not your project');

    const bid = await this.prisma.bid.findUnique({ where: { id: bidId } });
    if (!bid || bid.projectId !== projectId) throw new NotFoundException('Bid not found');

    await this.prisma.$transaction([
      this.prisma.project.update({
        where: { id: projectId },
        data: { status: 'IN_PROGRESS', assignedWorkerId: workerId, finalPrice: bid.amount },
      }),
      this.prisma.bid.update({ where: { id: bidId }, data: { status: 'ACCEPTED' } }),
      this.prisma.bid.updateMany({
        where: { projectId, id: { not: bidId } },
        data: { status: 'REJECTED' },
      }),
      this.prisma.chat.upsert({
        where: { projectId },
        create: { projectId },
        update: { isActive: true },
      }),
    ]);

    return { message: 'Worker assigned and project started' };
  }

  async completeProject(projectId: string, clientId: string) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.clientId !== clientId) throw new ForbiddenException('Not your project');
    if (project.status !== 'IN_PROGRESS') throw new BadRequestException('Project is not in progress');

    await this.prisma.project.update({
      where: { id: projectId },
      data: { status: 'COMPLETED' },
    });

    if (project.assignedWorkerId) {
      await this.prisma.workerProfile.updateMany({
        where: { userId: project.assignedWorkerId },
        data: { status: 'AVAILABLE' },
      });
    }

    return { message: 'Project marked as completed' };
  }
}
