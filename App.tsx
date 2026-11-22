import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/context/AuthContext';
import { NotesProvider } from './src/context/NotesContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NotesProvider>
          <StatusBar style="auto" />
          <RootNavigator />
        </NotesProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
