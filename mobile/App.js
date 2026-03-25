import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Recuperar token ao iniciar
  useEffect(() => {
    recoverToken();
  }, []);

  // Carregar tarefas quando autenticado
  useEffect(() => {
    if (token) {
      loadTasks();
    }
  }, [token]);

  async function recoverToken() {
    try {
      const savedToken = await AsyncStorage.getItem('token');
      const savedUser = await AsyncStorage.getItem('user');
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.error('Erro ao recuperar token:', err);
    }
  }

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha email e senha');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        senha: password
      });

      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.usuario));

      setToken(response.data.token);
      setUser(response.data.usuario);
      setEmail('');
      setPassword('');
    } catch (err) {
      Alert.alert('Erro', err.response?.data?.erro || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  }

  async function loadTasks() {
    try {
      const response = await axios.get(`${API_URL}/tarefas`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data);
    } catch (err) {
      console.error('Erro ao carregar tarefas:', err);
    }
  }

  async function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    try {
      await axios.put(
        `${API_URL}/tarefas/${id}`,
        {
          ...task,
          concluida: task.concluida ? 0 : 1,
          status: task.concluida ? 'pendente' : 'concluida'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadTasks();
    } catch (err) {
      Alert.alert('Erro', 'Erro ao atualizar tarefa');
    }
  }

  async function deleteTask(id) {
    Alert.alert('Confirmar', 'Deseja deletar esta tarefa?', [
      { text: 'Cancelar' },
      {
        text: 'Deletar',
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/tarefas/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            loadTasks();
          } catch (err) {
            Alert.alert('Erro', 'Erro ao deletar tarefa');
          }
        }
      }
    ]);
  }

  async function handleLogout() {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }

  if (!token) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loginContainer}>
          <Text style={styles.title}>📋 Tarefas 2.0</Text>
          <TextInput
            style={styles.input}
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
          </TouchableOpacity>
          <Text style={styles.hint}>Teste: vicentedesouza762@gmail.com / Admin@2026</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Minhas Tarefas</Text>
          <Text style={styles.headerSubtitle}>{user?.email}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={true}
        renderItem={({ item }) => (
          <View style={[styles.taskCard, item.concluida && styles.taskDone]}>
            <View style={styles.taskContent}>
              <Text
                style={[styles.taskTitle, item.concluida && styles.taskTitleDone]}
              >
                {item.titulo}
              </Text>
              {item.descricao ? (
                <Text style={styles.taskDesc}>{item.descricao}</Text>
              ) : null}
              <View style={styles.taskMeta}>
                <Text style={styles.taskBadge}>{item.categoria}</Text>
                <Text style={styles.taskBadge}>{item.prioridade}</Text>
              </View>
            </View>
            <View style={styles.taskActions}>
              <TouchableOpacity
                style={styles.taskCheckBtn}
                onPress={() => toggleTask(item.id)}
              >
                <Text style={styles.taskCheckText}>
                  {item.concluida ? '↩' : '✓'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.taskDeleteBtn}
                onPress={() => deleteTask(item.id)}
              >
                <Text style={styles.taskDeleteText}>🗑</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma tarefa. Crie uma nova!</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loginContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  hint: {
    marginTop: 20,
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
  },
  header: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  logoutBtn: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  logoutText: {
    color: '#333',
    fontWeight: 'bold',
  },
  taskCard: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginVertical: 8,
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
  },
  taskDone: {
    opacity: 0.6,
  },
  taskContent: {
    flex: 1,
    marginRight: 10,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  taskTitleDone: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  taskDesc: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  taskMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  taskBadge: {
    backgroundColor: '#e7f3ff',
    color: '#007bff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 11,
    fontWeight: '600',
  },
  taskActions: {
    flexDirection: 'row',
    gap: 8,
  },
  taskCheckBtn: {
    backgroundColor: '#e7f5e7',
    width: 40,
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskCheckText: {
    fontSize: 18,
    color: '#28a745',
    fontWeight: 'bold',
  },
  taskDeleteBtn: {
    backgroundColor: '#f8d7da',
    width: 40,
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskDeleteText: {
    fontSize: 18,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
    fontSize: 14,
  },
});
