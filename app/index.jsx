import "core-js/actual/structured-clone";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Alert,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import mainBackground from "../assets/mainBackground.png";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import { Link } from "expo-router";
import { useChatStore } from "../store/chatStore";
import { useChatStream } from "../apis/GoogleGenAI";
import { history_Format } from "../utils/history_Format";
import { Elevenlabs } from "../apis/Elevenlabs";
import { Audio } from "expo-av";

const HomeScreen = () => {
  const [text, setText] = useState("");
  const [loadMessage, setLoadMessage] = useState(false);
  const [backImage, setBackImage] = useState(mainBackground);
  const chatHistory = useChatStore((state) => state.chatHistory);
  const addMessage = useChatStore((state) => state.addMessage);
  const loadHistory = useChatStore((state) => state.loadHistory);
  const clearHistory = useChatStore((state) => state.clearHistory);
  const flatListRef = useRef(null);
  const { GoogleStream } = useChatStream();
  const { labsStream } = Elevenlabs();

  const handleSubmit = async (user, ai) => {
    let temp_text = text.trim();
    setText("");
    if (temp_text === "") {
      Alert.alert("Empty Message", "Please enter a message before sending.");
    } else {
      addMessage(history_Format(user, temp_text));
      let bot_message = await GoogleStream(temp_text);
      addMessage(history_Format(ai, bot_message));
      if (bot_message === "error") {
        console.log("error has happened in google api");
      } else {
        const audioUri = await labsStream(bot_message);
        if (audioUri === "error") {
          console.log("error has happened in elevenlabs api");
        } else if (audioUri === "notFound") {
          console.log("user did not add api key");
        } else {
          const { sound } = await Audio.Sound.createAsync({
            uri: audioUri,
          });

          await sound.playAsync();
        }
      }
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    if (chatHistory.length > 0 && flatListRef.current) {
      // Wait a short moment to ensure FlatList has rendered
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [chatHistory]);

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={backImage}
        resizeMode="cover"
        style={{ flex: 1 }}
      >
        <View
          style={{
            flexDirection: "row-reverse",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingVertical: 30,
          }}
        >
          <Link href="/SettingsScreen">
            <FontAwesome name="gear" size={30} color="black" />
          </Link>
          <MaterialIcons
            name="replay"
            size={30}
            color="black"
            onPress={async () => {
              await clearHistory();
              setLoadMessage(false);
            }}
          />
        </View>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"} // move input when keyboard opens
        >
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "center",
              marginBottom: 45,
            }}
          >
            <View style={styles.chatWindow}>
              <FlatList
                data={chatHistory}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View
                    style={[
                      styles.message,
                      item.role === "user"
                        ? styles.myMessage
                        : styles.theirMessage,
                    ]}
                  >
                    <Text style={styles.text}>{item.parts[0].text}</Text>
                  </View>
                )}
                ref={flatListRef}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 25,
                paddingHorizontal: 10,
                paddingVertical: 5,
              }}
            >
              <TextInput
                placeholder="Type here..."
                style={styles.input}
                value={text}
                onChangeText={setText}
                multiline={true}
                scrollEnabled={true}
              />
              {loadMessage ? (
                <Feather name="x" size={36} color="gray" />
              ) : (
                <Ionicons
                  name="send"
                  size={36}
                  color="gray"
                  disabled={loadMessage}
                  onPress={async () => {
                    setLoadMessage(true);
                    await handleSubmit("user", "model");
                    setLoadMessage(false);
                  }}
                />
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    flex: 1,
    borderColor: "#888",
    borderWidth: 1,
    borderRadius: 25,
    backgroundColor: "#fff",
  },
  chatWindow: {
    marginBottom: 20,
    width: "90%",
    height: "40%",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  message: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 15,
    maxWidth: "70%",
  },
  myMessage: {
    backgroundColor: "rgba(0,200,83,0.7)",
    alignSelf: "flex-end",
  },
  theirMessage: {
    backgroundColor: "rgba(255,255,255,0.8)",
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 16,
    color: "#000",
  },
});
