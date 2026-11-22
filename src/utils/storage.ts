import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Note } from '../types';

const USERS_KEY = '@notesapp_users';
const CURRENT_USER_KEY = '@notesapp_current_user';
const NOTES_KEY = '@notesapp_notes';

export const storage = {
  // Users
  async getUsers(): Promise<User[]> {
    const data = await AsyncStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  async saveUsers(users: User[]): Promise<void> {
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  async getCurrentUser(): Promise<User | null> {
    const data = await AsyncStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  async setCurrentUser(user: User | null): Promise<void> {
    if (user) {
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
    }
  },

  // Notes
  async getNotes(): Promise<Note[]> {
    const data = await AsyncStorage.getItem(NOTES_KEY);
    return data ? JSON.parse(data) : [];
  },

  async saveNotes(notes: Note[]): Promise<void> {
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  },
};
