import { Alert } from "react-native";
import { useChatStore } from "../store/chatStore";
import { Buffer } from "buffer";
global.Buffer = Buffer;

export const Elevenlabs = () => {
  const loadApiKey = useChatStore((state) => state.loadApiKey);

  async function labsStream(text) {
    const apiKey = await loadApiKey("elevenlabs");

    if (!apiKey) {
      return "notFound";
    }

    try {
      const voiceId = "JBFqnCBsd6RMkjVDRZzb";

      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: "POST",
          headers: {
            Accept: "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": apiKey,
          },
          body: JSON.stringify({
            text,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.8,
            },
          }),
        }
      );

      if (!response.ok) {
        let message = "Something went wrong.";

        if (response.status === 401)
          message =
            "Invalid API key or quota exceeded remove api key to use normal.";
        else if (response.status === 429)
          message = "Too many requests. Try again later.";
        else if (response.status >= 500)
          message = "Server error at ElevenLabs.";

        Alert.alert("Error", message);
        return "error";
      }

      const arrayBuffer = await response.arrayBuffer();

      const base64Audio = `data:audio/mpeg;base64,${Buffer.from(
        arrayBuffer
      ).toString("base64")}`;

      return base64Audio;
    } catch (e) {
      console.log("elevenlabs error");

      console.error(e);
    }
  }

  return { labsStream };
};
