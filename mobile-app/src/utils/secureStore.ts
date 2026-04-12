import * as SecureStore from 'expo-secure-store';

export async function saveAuthToken(value: string) {
  try {
    await SecureStore.setItemAsync('auth_token', value);
  } catch (error) {
    console.error('Error saving secure value', error);
  }
}

export async function getAuthToken() {
  try {
    return await SecureStore.getItemAsync('auth_token');
  } catch (error) {
    console.error('Error reading secure value', error);
    return null;
  }
}

export async function deleteAuthToken() {
  try {
    await SecureStore.deleteItemAsync('auth_token');
  } catch (error) {
    console.error('Error deleting secure value', error);
  }
}
