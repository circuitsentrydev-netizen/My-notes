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

// Stable stack navigators (avoids re-mount issues)
function AllNotesStack() {
  return (
    <NotesStack.Navigator>
      <NotesStack.Screen
        name="NotesList"
        component={NotesScreen}
        initialParams={{ category: 'all' }}
        options={{ title: 'All Notes' }}
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

function WorkNotesStack() {
  return (
    <NotesStack.Navigator>
      <NotesStack.Screen
        name="NotesList"
        component={NotesScreen}
        initialParams={{ category: 'work' }}
        options={{ title: 'Work Notes' }}
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

function StudyNotesStack() {
  return (
    <NotesStack.Navigator>
      <NotesStack.Screen
        name="NotesList"
        component={NotesScreen}
        initialParams={{ category: 'study' }}
        options={{ title: 'Study Notes' }}
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

function PersonalNotesStack() {
  return (
    <NotesStack.Navigator>
      <NotesStack.Screen
        name="NotesList"
        component={NotesScreen}
        initialParams={{ category: 'personal' }}
        options={{ title: 'Personal Notes' }}
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
          let iconName: React.ComponentProps<typeof Ionicons>['name'] = 'list';

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
      <Tab.Screen name="All" component={AllNotesStack} options={{ title: 'All' }} />
      <Tab.Screen name="Work" component={WorkNotesStack} options={{ title: 'Work' }} />
      <Tab.Screen name="Study" component={StudyNotesStack} options={{ title: 'Study' }} />
      <Tab.Screen name="Personal" component={PersonalNotesStack} options={{ title: 'Personal' }} />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: true, title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}
