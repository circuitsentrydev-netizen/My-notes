import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NotesStackParamList } from '../navigation/AppNavigator';
import { useNotes } from '../context/NotesContext';
import { Category } from '../types';

type Nav = NativeStackNavigationProp<NotesStackParamList, 'AddEditNote'>;
type Route = RouteProp<NotesStackParamList, 'AddEditNote'>;

const CATEGORIES: Category[] = ['work', 'study', 'personal'];

export default function AddEditNoteScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { noteId, category: initialCategory } = route.params || {};
  const { notes, addNote, updateNote } = useNotes();

  const existing = noteId ? notes.find(n => n.id === noteId) : null;

  const [title, setTitle] = useState(existing?.title || '');
  const [content, setContent] = useState(existing?.content || '');
  const [category, setCategory] = useState<Category>(existing?.category || initialCategory || 'personal');

  useEffect(() => {
    if (existing) {
      setTitle(existing.title || '');
      setContent(existing.content);
      setCategory(existing.category);
    }
  }, [existing]);

  const handleSave = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Note content is required');
      return;
    }

    if (existing) {
      await updateNote(existing.id, { title: title.trim() || undefined, content: content.trim(), category });
    } else {
      await addNote({ title: title.trim() || undefined, content: content.trim(), category });
    }
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Title (optional)</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Enter title" />

        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryRow}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.catBtn, category === cat && styles.catBtnActive]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.catText, category === cat && styles.catTextActive]}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Note *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={content}
          onChangeText={setContent}
          placeholder="Write your note..."
          multiline
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>{existing ? 'Update Note' : 'Save Note'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontWeight: '600', marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12 },
  textArea: { height: 180 },
  categoryRow: { flexDirection: 'row', gap: 8 },
  catBtn: { flex: 1, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', alignItems: 'center' },
  catBtnActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  catText: { color: '#333' },
  catTextActive: { color: '#fff', fontWeight: '600' },
  saveBtn: { backgroundColor: '#2563eb', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  saveText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
