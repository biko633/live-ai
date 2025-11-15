import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { ApiBlock } from "../components/ApiBlock";
import DropDownPicker from "react-native-dropdown-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { useChatStore } from "../store/chatStore";
import { personalities_Array } from "../utils/chatPersonality";

const SettingsScreen = () => {
  const setPersonality = useChatStore((state) => state.setPersonality);
  const getPersonality = useChatStore((state) => state.getPersonality);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [items, setItems] = useState(personalities_Array());

  const setUp = async () => {
    setValue(await getPersonality());
  };

  useEffect(() => {
    setUp();
  }, []);

  const handlePersonalityChange = async (personality) => {
    setPersonality(personality);
  };

  return (
    <View
      style={{ paddingVertical: "20%", flex: 1, backgroundColor: "#11a1daff" }}
    >
      <View
        style={{
          position: "absolute",
          top: 45,
          left: 20,
          backgroundColor: "lightblue",
          borderRadius: 25,
          padding: 3,
        }}
      >
        <Link href="/">
          <Ionicons name="person" size={30} color="black" style={{}} />
        </Link>
      </View>
      <ApiBlock title="googlegenai" />
      <ApiBlock title="elevenlabs" />
      <View style={{ gap: 10, paddingHorizontal: 20, paddingTop: 20 }}>
        <Text>Select a personality</Text>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          onChangeValue={handlePersonalityChange}
          placeholder="Select a personality"
          style={styles.dropdown}
        />
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 6,
    paddingHorizontal: 8,
  },
});
