import * as SecureStore from "expo-secure-store";

export const saveApiKey = async (name, key) => {
  let trimmedKey = String(key).trim();
  await SecureStore.setItemAsync(name, trimmedKey);
};

export const getApiKey = async (name) => {
  return await SecureStore.getItemAsync(name);
};

export const deleteApiKey = async (name) => {
  await SecureStore.deleteItemAsync(name);
};
