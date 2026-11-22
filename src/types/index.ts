export interface User {
  id: string;
  email: string;
  username: string;
  password: string; // stored in plain text for this educational task only
}

export interface Note {
  id: string;
  userId: string;
  title?: string;
  content: string;
  category: 'work' | 'study' | 'personal';
  dateAdded: string;      // ISO string
  dateUpdated?: string;   // ISO string
}

export type Category = 'all' | 'work' | 'study' | 'personal';
