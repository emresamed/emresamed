import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

async function canUseSecureStore() {
  if (Platform.OS === "web") {
    return false;
  }

  try {
    return await SecureStore.isAvailableAsync();
  } catch {
    return false;
  }
}

export const secureStorage = {
  async getItem(key: string) {
    if (await canUseSecureStore()) {
      return SecureStore.getItemAsync(key);
    }

    return AsyncStorage.getItem(key);
  },
  async removeItem(key: string) {
    if (await canUseSecureStore()) {
      await SecureStore.deleteItemAsync(key);
      return;
    }

    await AsyncStorage.removeItem(key);
  },
  async setItem(key: string, value: string) {
    if (await canUseSecureStore()) {
      await SecureStore.setItemAsync(key, value);
      return;
    }

    await AsyncStorage.setItem(key, value);
  }
};
