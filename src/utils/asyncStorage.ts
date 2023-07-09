import AsyncStorage from "@react-native-async-storage/async-storage"

export const saveUserData = async (userData: Record<string, any>) => {
  await AsyncStorage.setItem('userData', JSON.stringify(userData))
}

export const getUserData = async () => {
  const userData = await AsyncStorage.getItem('userData')
  if (!userData) return
  return JSON.parse(userData)
}

export const removeUserData = async () => {
  await AsyncStorage.removeItem('userData')
}

// Сохранение токена
export const saveToken = async (token: string) => {
  await AsyncStorage.setItem('token', token);
};

// Получение токена
export const getToken = async () => {
  const token = await AsyncStorage.getItem('token');
  return token;
};

// Удаление токена
export const removeToken = async () => {
  await AsyncStorage.removeItem('token');
};