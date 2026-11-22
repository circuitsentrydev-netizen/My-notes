import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { Note, Category } from '../types';
import { storage } from '../utils/storage';
import { useAuth } from './AuthContext';

interface NotesContextType {
  notes: Note[];
  isLoading: boolean;
  addNote: (note: Omit<Note, 'id' | 'userId' | 'dateAdded'>) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  getNotesByCategory: (category: Category) => Note[];
  searchNotes: (query: string, category?: Category) => Note[];
  sortNotes: (notes: Note[], ascending: boolean) => Note[];
  refreshNotes: () => Promise<void>;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshNotes = useCallback(async () => {
    if (!user) {
      setNotes([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const all = await storage.getNotes();
      setNotes(all.filter(n => n.userId === user.id));
    } catch (e) {
      console.error('Failed to load notes', e);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshNotes();
  }, [refreshNotes]);

  const addNote = useCallback(async (data: Omit<Note, 'id' | 'userId' | 'dateAdded'>) => {
    if (!user) return;
    const newNote: Note = {
      ...data,
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      userId: user.id,
      dateAdded: new Date().toISOString(),
    };
    const all = await storage.getNotes();
    all.push(newNote);
    await storage.saveNotes(all);
    await refreshNotes();
  }, [user, refreshNotes]);

  const updateNote = useCallback(async (id: string, updates: Partial<Note>) => {
    const all = await storage.getNotes();
    const index = all.findIndex(n => n.id === id);
    if (index === -1) return;
    all[index] = {
      ...all[index],
      ...updates,
      dateUpdated: new Date().toISOString(),
    };
    await storage.saveNotes(all);
    await refreshNotes();
  }, [refreshNotes]);

  const deleteNote = useCallback(async (id: string) => {
    const all = await storage.getNotes();
    const filtered = all.filter(n => n.id !== id);
    await storage.saveNotes(filtered);
    await refreshNotes();
  }, [refreshNotes]);

  const getNotesByCategory = useCallback((category: Category) => {
    if (category === 'all') return notes;
    return notes.filter(n => n.category === category);
  }, [notes]);

  const searchNotes = useCallback((query: string, category: Category = 'all') => {
    const base = getNotesByCategory(category);
    if (!query.trim()) return base;
    const q = query.toLowerCase();
    return base.filter(
      n =>
        n.content.toLowerCase().includes(q) ||
        (n.title && n.title.toLowerCase().includes(q))
    );
  }, [getNotesByCategory]);

  const sortNotes = useCallback((list: Note[], ascending: boolean) => {
    return [...list].sort((a, b) => {
      const da = new Date(a.dateAdded).getTime();
      const db = new Date(b.dateAdded).getTime();
      return ascending ? da - db : db - da;
    });
  }, []);

  return (
    <NotesContext.Provider
      value={{
        notes,
        isLoading,
        addNote,
        updateNote,
        deleteNote,
        getNotesByCategory,
        searchNotes,
        sortNotes,
        refreshNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export const useNotes = () => {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used within NotesProvider');
  return ctx;
};
