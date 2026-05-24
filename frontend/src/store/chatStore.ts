import { create } from 'zustand';
import { Chat, Message } from '@/types';

interface ChatState {
  chats: Chat[];
  activeChat: Chat | null;
  messages: Record<string, Message[]>;
  unreadTotal: number;
  typingUsers: Record<string, string[]>;

  setChats: (chats: Chat[]) => void;
  setActiveChat: (chat: Chat | null) => void;
  addMessage: (chatId: string, message: Message) => void;
  setMessages: (chatId: string, messages: Message[]) => void;
  setTyping: (chatId: string, userId: string, isTyping: boolean) => void;
  setUnreadTotal: (count: number) => void;
  markChatRead: (chatId: string, userId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  activeChat: null,
  messages: {},
  unreadTotal: 0,
  typingUsers: {},

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

  setTyping: (chatId, userId, isTyping) =>
    set((state) => {
      const current = state.typingUsers[chatId] || [];
      const updated = isTyping
        ? [...new Set([...current, userId])]
        : current.filter((id) => id !== userId);
      return { typingUsers: { ...state.typingUsers, [chatId]: updated } };
    }),

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
