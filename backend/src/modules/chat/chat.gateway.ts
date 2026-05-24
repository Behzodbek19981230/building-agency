import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ChatService } from './chat.service';

interface AuthSocket extends Socket {
	userId: string;
	userRole: string;
}

@WebSocketGateway({
	cors: { origin: '*', credentials: true },
	namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;
	private readonly logger = new Logger(ChatGateway.name);
	private connectedUsers = new Map<string, string>();

	constructor(
		private chatService: ChatService,
		private jwtService: JwtService,
		private configService: ConfigService,
	) {}

	async handleConnection(client: AuthSocket) {
		try {
			const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];
			if (!token) {
				client.disconnect();
				return;
			}

			const payload = this.jwtService.verify(token, {
				secret: this.configService.get('jwt.accessSecret'),
			});

			client.userId = payload.sub;
			client.userRole = payload.role;
			this.connectedUsers.set(payload.sub, client.id);

			client.emit('connected', { userId: payload.sub });
			this.logger.log(`User ${payload.sub} connected`);
		} catch {
			client.disconnect();
		}
	}

	handleDisconnect(client: AuthSocket) {
		if (client.userId) {
			this.connectedUsers.delete(client.userId);
			this.logger.log(`User ${client.userId} disconnected`);
		}
	}

	@SubscribeMessage('join_chat')
	async handleJoinChat(@ConnectedSocket() client: AuthSocket, @MessageBody() data: { chatId: string }) {
		const canAccess = await this.chatService.canAccessChat(data.chatId, client.userId);
		if (!canAccess) {
			client.emit('error', { message: 'Access denied' });
			return;
		}

		client.join(`chat:${data.chatId}`);
		client.emit('joined_chat', { chatId: data.chatId });
	}

	@SubscribeMessage('leave_chat')
	handleLeaveChat(@ConnectedSocket() client: AuthSocket, @MessageBody() data: { chatId: string }) {
		client.leave(`chat:${data.chatId}`);
	}

	@SubscribeMessage('send_message')
	async handleSendMessage(
		@ConnectedSocket() client: AuthSocket,
		@MessageBody() data: { chatId: string; content?: string; type?: string },
	) {
		try {
			const message = await this.chatService.createMessage(client.userId, data.chatId, {
				content: data.content,
				type: (data.type as any) || 'TEXT',
			});

			this.server.to(`chat:${data.chatId}`).emit('new_message', { data: message });
		} catch (err) {
			client.emit('error', { message: err.message });
		}
	}

	@SubscribeMessage('typing')
	handleTyping(@ConnectedSocket() client: AuthSocket, @MessageBody() data: { chatId: string; isTyping: boolean }) {
		client.to(`chat:${data.chatId}`).emit('user_typing', {
			userId: client.userId,
			isTyping: data.isTyping,
		});
	}

	@SubscribeMessage('mark_read')
	async handleMarkRead(@ConnectedSocket() client: AuthSocket, @MessageBody() data: { chatId: string }) {
		await this.chatService.markMessagesRead(data.chatId, client.userId);
		this.server.to(`chat:${data.chatId}`).emit('messages_read', {
			chatId: data.chatId,
			userId: client.userId,
		});
	}

	sendNotificationToUser(userId: string, event: string, data: any) {
		const socketId = this.connectedUsers.get(userId);
		if (socketId) {
			this.server.to(socketId).emit(event, data);
		}
	}
}
