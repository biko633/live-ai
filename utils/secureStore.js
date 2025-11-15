import * as SecureStore from "expo-secure-store";

export const saveApiKey = async (name, key) => {
  await SecureStore.setItemAsync(name, key);
};

export const getApiKey = async (name) => {
  return await SecureStore.getItemAsync(name);
};

export const deleteApiKey = async (name) => {
  await SecureStore.deleteItemAsync(name);
};
