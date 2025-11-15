import { GoogleGenAI } from "@google/genai";
import { Alert } from "react-native";
import { useChatStore } from "../store/chatStore";
import { personality_Object } from "../utils/chatPersonality";

export const useChatStream = () => {
  const chatHistory = useChatStore((state) => state.chatHistory).slice(-20);
  const loadApiKey = useChatStore((state) => state.loadApiKey);
  const clearLastMessage = useChatStore((state) => state.clearLastMessage);
  const getPersonality = useChatStore((state) => state.getPersonality);

  async function GoogleStream(prompt) {
    const apiKey = await loadApiKey("googlegenai");

    const personality = await getPersonality();
    const personality_Text = personality_Object[personality];

    if (!apiKey) {
      clearLastMessage();
      clearLastMessage();
      Alert.alert("Error", "Please enter your API key first in the settings.");
      return "error";
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
    });

    try {
      const chat = ai.chats.create({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: personality_Text,
          // thinkingConfig: 0,
        },
        history: chatHistory,
      });

      const streamResponse = await chat.sendMessage({
        message: prompt,
      });
      let end_message = streamResponse.text;
      return end_message;
    } catch (e) {
      console.log("google api error");
      let error_message = "Unknown error";
      let error_code = 500;
      const parsed = JSON.parse(e.message);
      error_message = parsed.error?.message || error_message;
      error_code = parsed.error?.code || error_code;
      clearLastMessage();
      clearLastMessage();
      if (error_code === 400) {
        if (error_message.includes("API key not valid")) {
          Alert.alert("Error", "Please enter a valid API key in the settings.");
        } else {
          Alert.alert("Error", error_message);
        }
      } else if (error_code === 429) {
        Alert.alert("Error", error_message);
      } else {
        Alert.alert(
          "Error",
          "something went wrong: " + error_code + " " + error_message
        );
      }
      return "error";
    }
  }
  return { GoogleStream };
};
