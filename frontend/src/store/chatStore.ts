import { create } from 'zustand';
import { Chat, Message } from '@/types';

interface ChatState {
  chats: Chat[];
  activeChat: Chat | null;
  messages: Record<string, Message[]>;
  unreadTotal: number;

  setChats: (chats: Chat[]) => void;
  setActiveChat: (chat: Chat | null) => void;
  addMessage: (chatId: string, message: Message) => void;
  setMessages: (chatId: string, messages: Message[]) => void;
  setUnreadTotal: (count: number) => void;
  markChatRead: (chatId: string, userId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  activeChat: null,
  messages: {},
  unreadTotal: 0,

  setChats: (chats) => set({ chats }),

  setActiveChat: (chat) => set({ activeChat: chat }),

  addMessage: (chatId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: [...(state.messages[chatId] || []), message],
      },
    })),

  setMessages: (chatId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [chatId]: messages },
    })),

  setUnreadTotal: (count) => set({ unreadTotal: count }),

  markChatRead: (chatId, currentUserId) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: (state.messages[chatId] || []).map((m) =>
          m.senderId !== currentUserId ? { ...m, isRead: true } : m,
        ),
      },
    })),
}));
