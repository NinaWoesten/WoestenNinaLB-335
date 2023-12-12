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
  const [description, setDescription] = useState(''); 
  const [photo, setPhoto] = useState(null);
  const [completedTodos, setCompletedTodos] = useState([]);
 
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
          description: description,
          photo: photo,
        });
        setTodoName('');
        setDescription('');
        setPhoto(null);
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

  const handleTodoCompleted = (todoId) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    );

    setTodos(updatedTodos);

    const completedTodo = todos.find((todo) => todo.id === todoId);
    if (completedTodo) {
      setCompletedTodos((prevCompletedTodos) => [
        ...prevCompletedTodos,
        completedTodo,
      ]);
    }
  }
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
      
    <View style={styles.modalContainer}behavior="padding">
      <TouchableOpacity style={styles.categoryButton} onPress={closeModal}>
        <AntDesign style={styles.closeIcon} name='close' size={20} color='black' />
      </TouchableOpacity>
    <Modal animationType='slide' visible={modalVisible} onRequestClose={handleTodoPress}>
        <TodoDetails
          closeModal={() => setModalVisible(false)}
          handleEditTodo={handleEditTodo}
          selectedTodo={selectedTodo}
        />
      </Modal>
      <Text style={styles.modalTitle}>Add a new task for {selectedCategory?.name}</Text>
      <TextInput
        style={styles.input}
        placeholder="Add a new task"
        value={todoName}
        onChangeText={(text) => setTodoName(text)}
      />
       <TextInput
        style={styles.input}
        placeholder="Add a description"
        value={description}
        onChangeText={(text) => setDescription(text)}
      />
         <TouchableOpacity onPress={() => addTodo(selectedCategory)} style={styles.button}>
        <AntDesign name="plus" size={20} color="black" />
      </TouchableOpacity>

      <View style={styles.todosContainer}>
        {todos.map((todo) => (
          <View key={todo.id} style={styles.todoItem}>
             <TouchableOpacity onPress={() => handleTodoCompleted(todo.id)}>
              <Ionicons
                name={todo.completed ? 'ios-checkbox' : 'ios-square-outline'}
                size={20}
                color={todo.completed ? 'green' : 'grey'}
              />
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
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#ECEBEB',
  },
  categoryButton: {
    position: 'absolute',
    top: 60,
    right: 30,
},
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderRadius:4,
    width: '70%',
  },
   
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
      },
  button: {
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 4,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
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
    borderRadius: 4,
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
