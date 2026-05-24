import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';

@ApiTags('chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get()
  @ApiOperation({ summary: 'Get all my chats' })
  getUserChats(@CurrentUser('id') userId: string) {
    return this.chatService.getUserChats(userId);
  }

  @Get('unread')
  @ApiOperation({ summary: 'Get unread messages count' })
  getUnreadCount(@CurrentUser('id') userId: string) {
    return this.chatService.getUnreadCount(userId);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get chat for a project' })
  getChatByProject(@Param('projectId') projectId: string, @CurrentUser('id') userId: string) {
    return this.chatService.getChatByProject(projectId, userId);
  }

  @Get(':chatId/messages')
  @ApiOperation({ summary: 'Get chat messages' })
  getMessages(
    @Param('chatId') chatId: string,
    @CurrentUser('id') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.chatService.getMessages(chatId, userId, page, limit);
  }
}
