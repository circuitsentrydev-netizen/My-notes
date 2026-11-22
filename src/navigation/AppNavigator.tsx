import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import NotesScreen from '../screens/NotesScreen';
import AddEditNoteScreen from '../screens/AddEditNoteScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Category } from '../types';

export type NotesStackParamList = {
  NotesList: { category: Category };
  AddEditNote: { noteId?: string; category?: Category };
};

export type AppTabParamList = {
  All: undefined;
  Work: undefined;
  Study: undefined;
  Personal: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();
const NotesStack = createNativeStackNavigator<NotesStackParamList>();

function NotesStackNavigator({ category }: { category: Category }) {
  return (
    <NotesStack.Navigator>
      <NotesStack.Screen
        name="NotesList"
        component={NotesScreen}
        initialParams={{ category }}
        options={{ title: category === 'all' ? 'All Notes' : `${category.charAt(0).toUpperCase() + category.slice(1)} Notes` }}
      />
      <NotesStack.Screen
        name="AddEditNote"
        component={AddEditNoteScreen}
        options={({ route }) => ({
          title: route.params?.noteId ? 'Edit Note' : 'New Note',
        })}
      />
    </NotesStack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'document-text';
          if (route.name === 'Work') iconName = 'briefcase';
          else if (route.name === 'Study') iconName = 'school';
          else if (route.name === 'Personal') iconName = 'person';
          else if (route.name === 'Profile') iconName = 'settings';
          else if (route.name === 'All') iconName = 'list';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="All" options={{ title: 'All' }}>
        {() => <NotesStackNavigator category="all" />}
      </Tab.Screen>
      <Tab.Screen name="Work" options={{ title: 'Work' }}>
        {() => <NotesStackNavigator category="work" />}
      </Tab.Screen>
      <Tab.Screen name="Study" options={{ title: 'Study' }}>
        {() => <NotesStackNavigator category="study" />}
      </Tab.Screen>
      <Tab.Screen name="Personal" options={{ title: 'Personal' }}>
        {() => <NotesStackNavigator category="personal" />}
      </Tab.Screen>
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: true, title: 'Profile' }} />
    </Tab.Navigator>
  );
}
