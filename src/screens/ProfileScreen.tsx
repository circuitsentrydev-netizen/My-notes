import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { user, updateCredentials, logout } = useAuth();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync form when user data is available
  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setUsername(user.username);
    }
  }, [user]);

  const handleUpdate = async () => {
    if (!email.trim() || !username.trim()) {
      Alert.alert('Error', 'Email and username are required');
      return;
    }

    setLoading(true);

    const updates: {
      email?: string;
      username?: string;
      password?: string;
    } = {
      email: email.trim(),
      username: username.trim(),
    };

    if (password.trim()) {
      updates.password = password;
    }

    const result = await updateCredentials(updates);
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Profile updated');
      setPassword('');
    } else {
      Alert.alert('Error', result.message || 'Update failed');
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  };

  if (!user) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.info}>Logged in as: {user.username}</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Email"
      />

      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        placeholder="Username"
      />

      <Text style={styles.label}>New Password (leave blank to keep current)</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="New password"
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleUpdate}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Updating...' : 'Update Credentials'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.logoutBtn]}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f5f5f5',
    flexGrow: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  info: {
    color: '#666',
    marginBottom: 24,
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  logoutBtn: {
    backgroundColor: '#ef4444',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
