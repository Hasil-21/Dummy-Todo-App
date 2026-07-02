import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, StyleSheet, SafeAreaView
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos([...todos, { id: Date.now().toString(), text: input, done: false }]);
    setInput('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Todo App</Text>

      <Text style={styles.version}>
        v{DeviceInfo.getVersion()} (build {DeviceInfo.getBuildNumber()})
      </Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Add a task..."
        />
        <TouchableOpacity style={styles.addBtn} onPress={addTodo}>
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <TouchableOpacity onPress={() => toggleTodo(item.id)} style={{ flex: 1 }}>
              <Text style={[styles.todoText, item.done && styles.done]}>
                {item.text}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteTodo(item.id)}>
              <Text style={styles.deleteBtn}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
  version: { fontSize: 12, color: '#999', marginBottom: 16 },
  inputRow: { flexDirection: 'row', marginBottom: 20 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10 },
  addBtn: { backgroundColor: '#007AFF', padding: 10, borderRadius: 8, marginLeft: 10, justifyContent: 'center' },
  addBtnText: { color: '#fff', fontWeight: 'bold' },
  todoItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  todoText: { fontSize: 16 },
  done: { textDecorationLine: 'line-through', color: '#999' },
  deleteBtn: { color: 'red', fontSize: 18, paddingLeft: 10 },
});