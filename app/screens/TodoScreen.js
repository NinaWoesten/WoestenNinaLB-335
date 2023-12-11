import React, { useState, useEffect } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { collection, getDocs, addDoc, deleteDoc, doc, where, query} from 'firebase/firestore';
import TodoDetails from './TodoDetails';

import { FIREBASE_DB } from '../../FirebaseConfig';

const firestore = FIREBASE_DB;
const TodoScreen = ({ closeModal, selectedCategory }) => {

  const [todos, setTodos] = useState([]);
  const [todoName, setTodoName] = useState('');
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editTodo, setEditTodo] = useState('');
 
    const fetchTodos = async () => {
      if (selectedCategory) {
        try {
          const todosCollection = collection(firestore, 'todos');
          const querySnapshot = await getDocs(query(todosCollection, where('category', '==', selectedCategory.name)));
          const todos = [];
          querySnapshot.forEach((doc) => {
            todos.push({ id: doc.id, ...doc.data() });
          });
          setTodos(todos);
        } catch (error) {
          console.error('Error fetching todos:', error);
        }
      }
    };
    useEffect(() => {
    fetchTodos();
  }, [selectedCategory]);
  

  const addTodo = async () => {
    if (todoName && todoName.length > 0 && selectedCategory) {
      const timestamp = new Date();
      try {
        const todosRef = collection(firestore, 'todos');
        await addDoc(todosRef, {
          category: selectedCategory.name, // Setze die Kategorie des Todos
          todo: todoName,
          completed: false,
          createdAt: timestamp,
        });
        setTodoName('');
        closeModal(); 
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    } else {
      console.error('Please enter a TODO name');
    }
  };
  
  const deleteTodo = async (todoId) => {
    try {
      const todo = todos.find(todo => todo.id === todoId);
      if (todo && todo.category === selectedCategory.name) { // Überprüfe, ob das Todo zur ausgewählten Kategorie gehört
        const todosRef = doc(firestore, 'todos', todoId);
        await deleteDoc(todosRef);
        fetchTodos();
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };
  const handleTodoPress = (todo) => {
    setSelectedTodo(todo);
    setModalVisible(true);
  };
  const handleEditTodo = async () => {
    const success = await editTodo(selectedCategory);
    if (success) {
      setEditTodo('');
      setModalVisible(true);
    } else {
      // Handle error case
    }
  };

  return (
      
    <View style={styles.modalContainer}>
    <Modal animationType='slide' visible={modalVisible} onRequestClose={handleTodoPress} selectedTodo={selectedTodo}>
        <TodoDetails
          closeModal={() => setModalVisible(false)}
          handleEditTodo={handleEditTodo}
          selectedTodo={selectedTodo}
        />
      </Modal>
      <Text style={styles.modalTitle}>Add Todo for {selectedCategory?.name}</Text>
      <TextInput
        style={styles.input}
        placeholder="Add a new todo"
        value={todoName}
        onChangeText={(text) => setTodoName(text)}
      />
         <TouchableOpacity onPress={() => addTodo(selectedCategory)} style={styles.button}>
        <AntDesign name="plus" size={20} color="black" />
      </TouchableOpacity>

      <View style={styles.todosContainer}>
        {todos.map((todo) => (
          <View key={todo.id} style={styles.todoItem}>
            <TouchableOpacity onPress={() => handleTodoCompleted(todo.id)}>
              <Ionicons name="ios-square" size={20} color="grey" />
            </TouchableOpacity>
            <Text style={styles.todoText}>{todo.todo}</Text>
            <TouchableOpacity onPress={() => deleteTodo(todo.id)}>
              <AntDesign name="delete" size={20} color="red" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleTodoPress(todo)}>
              <AntDesign name="edit" size={20} color="blue" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity onPress={closeModal} style={[styles.button, styles.closeButton]}>
        <Text style={styles.btnText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
      },
      todosContainer: {
        marginTop: 20,
        width: '100%',
        paddingHorizontal: 20,
      },
      todoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 8,
      },
      todoText: {
        flex: 1,
        marginHorizontal: 10,
      },
      closeButton: {
        borderWidth: 2,
        borderColor: 'darkgray',
        borderRadius: 4,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
      },
    });
export default TodoScreen;
