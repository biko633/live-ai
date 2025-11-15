import { create } from "zustand";
import { saveApiKey, getApiKey, deleteApiKey } from "../utils/secureStore";
import {
  saveChatHistory,
  loadChatHistory,
  clearChatHistory,
  clearLastMessage,
  setPersonality,
  getPersonality,
} from "../utils/chat_History";

export const useChatStore = create((set, get) => ({
  chatHistory: [],

  setApiKey: async (name, key) => {
    try {
      await saveApiKey(name, key);
      return true;
    } catch (e) {
      console.error("Error saving API key:", e);
      return false;
    }
  },

  loadApiKey: async (name) => {
    try {
      const key = await getApiKey(name);
      return key;
    } catch (e) {
      console.error("Error loading API key:", e);
      return null;
    }
  },

  clearApiKey: async (name) => {
    try {
      await deleteApiKey(name);
      return true;
    } catch (e) {
      console.error("Error deleting API key:", e);
      return false;
    }
  },

  addMessage: (msg) => {
    set((state) => {
      const newHistory = [...state.chatHistory, msg];
      (async () => {
        try {
          await saveChatHistory(newHistory);
        } catch (e) {
          console.error("Error saving chat history:", e);
        }
      })();
      return { chatHistory: newHistory };
    });
  },

  loadHistory: async () => {
    try {
      const history = await loadChatHistory();
      if (history) set({ chatHistory: history });
    } catch (e) {
      console.error("Error loading chat history:", e);
    }
  },

  clearHistory: async () => {
    try {
      await clearChatHistory();
      set({ chatHistory: [] });
    } catch (e) {
      console.error("Error clearing chat history:", e);
    }
  },

  clearLastMessage: async () => {
    try {
      await clearLastMessage();
      set((state) => ({ chatHistory: state.chatHistory.slice(0, -1) }));
    } catch (e) {
      console.error("Error clearing last message:", e);
    }
  },

  setPersonality: async (personality) => {
    try {
      await setPersonality(personality);
    } catch (e) {
      console.error("Error in setPersonality", e);
    }
  },

  getPersonality: async () => {
    try {
      const personality = (await getPersonality()) || "friendly";
      return personality;
    } catch (e) {
      console.error("Error in getPersonality", e);
    }
  },
}));
