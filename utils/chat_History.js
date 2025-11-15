import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveChatHistory = async (historyArray) => {
  try {
    await AsyncStorage.setItem("chatHistory", JSON.stringify(historyArray));
  } catch (e) {
    console.error("Error saving chat history:", e);
  }
};

export const loadChatHistory = async () => {
  try {
    const saved = await AsyncStorage.getItem("chatHistory");
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error("Error loading chat history:", e);
    return [];
  }
};

export const clearChatHistory = async () => {
  await AsyncStorage.removeItem("chatHistory");
};

export const clearLastMessage = async () => {
  try {
    const chatHistory = await loadChatHistory();
    if (chatHistory.length > 0) {
      chatHistory.pop();
      await AsyncStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    }
  } catch (e) {
    console.error("Error clearing last message:", e);
  }
};

export const setPersonality = async (personality) => {
  try {
    await AsyncStorage.setItem("botPersonality", personality);
  } catch (e) {
    console.error("Error in setPersonality", e);
  }
};

export const getPersonality = async () => {
  try {
    const personality = await AsyncStorage.getItem("botPersonality");
    return personality;
  } catch (e) {
    console.log("Error in getPersonality", e);
  }
};
