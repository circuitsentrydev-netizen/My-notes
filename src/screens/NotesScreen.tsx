import React, { useState, useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { NotesStackParamList } from '../navigation/AppNavigator';
import { useNotes } from '../context/NotesContext';
import { Note, Category } from '../types';

type Nav = NativeStackNavigationProp<NotesStackParamList, 'NotesList'>;
type Route = RouteProp<NotesStackParamList, 'NotesList'>;

export default function NotesScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const category = route.params?.category || 'all';
  const { searchNotes, sortNotes, deleteNote } = useNotes();

  const [search, setSearch] = useState('');
  const [sortAsc, setSortAsc] = useState(false);

  const displayedNotes = useMemo(() => {
    const filtered = searchNotes(search, category);
    return sortNotes(filtered, sortAsc);
  }, [search, category, sortAsc, searchNotes, sortNotes]);

  const handleDelete = (id: string) => {
    Alert.alert('Delete Note', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteNote(id) },
    ]);
  };

  const renderItem = ({ item }: { item: Note }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('AddEditNote', { noteId: item.id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title || 'Untitled'}</Text>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
      <Text style={styles.cardContent} numberOfLines={2}>{item.content}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.badge}>{item.category}</Text>
        <Text style={styles.date}>
          {new Date(item.dateAdded).toLocaleDateString()}
          {item.dateUpdated ? ` • edited ${new Date(item.dateUpdated).toLocaleDateString()}` : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search notes..."
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.sortBtn} onPress={() => setSortAsc(!sortAsc)}>
          <Ionicons name={sortAsc ? 'arrow-up' : 'arrow-down'} size={20} color="#2563eb" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={displayedNotes}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        ListEmptyComponent={<Text style={styles.empty}>No notes found</Text>}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddEditNote', { category: category === 'all' ? 'personal' : category })}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  searchRow: { flexDirection: 'row', padding: 12, gap: 8 },
  searchInput: { flex: 1, backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  sortBtn: { backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', justifyContent: 'center' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 12, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 17, fontWeight: '600', flex: 1 },
  cardContent: { color: '#555', marginTop: 6 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, alignItems: 'center' },
  badge: { backgroundColor: '#e0e7ff', color: '#3730a3', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, fontSize: 12, overflow: 'hidden' },
  date: { fontSize: 12, color: '#888' },
  empty: { textAlign: 'center', marginTop: 40, color: '#888' },
  fab: { position: 'absolute', right: 20, bottom: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: '#2563eb', justifyContent: 'center', alignItems: 'center', elevation: 5 },
});
