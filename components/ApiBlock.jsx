import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useChatStore } from "../store/chatStore";

export const ApiBlock = ({ title }) => {
  const setApiKey = useChatStore((state) => state.setApiKey);
  const loadApiKey = useChatStore((state) => state.loadApiKey);
  const clearApiKey = useChatStore((state) => state.clearApiKey);
  const [key, setKey] = useState("");
  const [change, setChange] = useState(false);

  useEffect(() => {
    async function loadKey() {
      const tempKey = await loadApiKey(title);
      if (tempKey) setKey(tempKey);
    }
    loadKey();
  }, []);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Text style={{ color: "black", fontSize: 20 }}>{title}</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            justifyContent: "space-between",
          }}
        >
          <TextInput
            placeholder="Type api here..."
            style={styles.input}
            value={key}
            onChangeText={(text) => {
              setKey(text);
              setChange(true);
            }}
          />
          {change ? (
            <FontAwesome
              name="check"
              size={30}
              color="black"
              style={{
                backgroundColor: "lightblue",
                borderRadius: 15,
                padding: 5,
              }}
              onPress={async () => {
                await setApiKey(title, key);
                setChange(false);
                alert(`${title} API key saved.`);
              }}
            />
          ) : (
            <MaterialIcons
              name="delete"
              size={30}
              color="black"
              style={{
                backgroundColor: "lightblue",
                borderRadius: 15,
                padding: 5,
              }}
              onPress={async () => {
                await clearApiKey(title);
                setKey("");
                alert(`${title} API key cleared.`);
              }}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 5,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#11a1daff",
  },
  input: {
    flex: 1,
    borderColor: "#888",
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: "#fff",
  },
});
