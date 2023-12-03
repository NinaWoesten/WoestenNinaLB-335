import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { FlatList } from 'react-native-gesture-handler';
import {AntDesign} from '@expo/vector-icons';
import Todo from '../../components/Todo';

const Home = () => {
  const auth = FIREBASE_AUTH;
  const firestore = FIREBASE_DB;
  const navigation = useNavigation();
  const [todos, setTodos] = useState([]);
  const [addTodo, setAddTodo] = useState('');

  const todosRef = collection(firestore, 'todos');

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigation.replace('Login');
      })
      .catch((error) => alert(error.message));
  };
const fetchTodos = async () => {
  const querySnapshot = await getDocs(collection(firestore, 'todos'));
  const todos = [];
  querySnapshot.forEach((doc) => {
    const { heading, description, completed, createdAt } = doc.data();
    todos.push({
      id: doc.id,
      heading,
      description,
      completed,
      createdAt,
      userId: auth.currentUser.uid,
    });
  });
  setTodos(todos);
};

useEffect(() => {
  fetchTodos();
}, []);

const addTodoItem = async () => {
  if (addTodo && addTodo.length > 0) {
    const timestamp = new Date();
    try {
      await addDoc(todosRef, {
        heading: addTodo,
        description: 'Sample description',
        completed: false,
        createdAt: timestamp,
      });
      setAddTodo('');
      fetchTodos(); 
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  }
};

const deleteTodoItem = async (todoId) => {
  try {
    const todoDocRef = doc(firestore, 'todos', todoId);
    await deleteDoc(todoDocRef);
    fetchTodos();
  } catch (error) {
    console.error('Error deleting todo:', error);
  }
};


return (
  <View style={styles.container}>
    <Text>User: {auth.currentUser?.email}</Text>
    <Text style={styles.title}>
      --- ToDo List ---
    </Text>
    <TextInput
      style={styles.input}
      placeholder="Add a new todo"
      value={addTodo}
      onChangeText={(text) => setAddTodo(text)}
    />
    <View style={{marginVertical: 48}}>
    <TouchableOpacity onPress={addTodoItem} style={styles.button}>
      <AntDesign name='plus' size={20} color='black' />
      {/*<Text style={styles.btnText}>Add Todo</Text>*/}
    </TouchableOpacity>
    </View>
    {/* Render your todos here if needed */}
    <View style={styles.todosContainer}>
    
    {todos.map((todo) => (
      <View key={todo.id}>
        <Text>{todo.heading}</Text>
        <Text>{todo.description}</Text>
        <TouchableOpacity onPress={() => deleteTodoItem(todo.id)} style={styles.button}>
          <Text style={styles.btnText}>Delete Todo</Text>
        </TouchableOpacity>
      </View>
    ))}
    </View>
    <TouchableOpacity onPress={handleSignOut} style={styles.button}>
      <Text style={styles.btnText}>Sign out</Text>
    </TouchableOpacity>
    <View style={styles.todosContainer}>
    <FlatList 
      data={todos}
      renderItem={({ item }) => (
        
        <Todo list={item} />
      )}
      keyExtractor={(item) => item.id.toString()}
    />
  </View>
</View>
);
};


const styles = StyleSheet.create({
container: {
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
},
input: {
  height: 40,
  borderColor: 'gray',
  borderWidth: 1,
  marginBottom: 10,
  paddingHorizontal: 8,
},
button: {
  borderWidth: 2,
  borderColor: 'gray',
  borderRadius: 4,
  padding: 10,
  alignItems: 'center',
  justifyContent: 'center',
},
btnText: {
  color: 'black',
},
title: {
  fontSize: 38,
  fontWeight: 'bold',
  color: 'black',
  paddingHorizontal: 20,
},
todosContainer: {
  height: 275,
  paddingLeft: 30,
}

});

export default Home;