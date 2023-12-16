import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB,  } from '../../FirebaseConfig';
import { AntDesign } from '@expo/vector-icons';
import TodoScreen from './TodoScreen';


const Home = () => {
  const auth = FIREBASE_AUTH;
  const firestore = FIREBASE_DB;
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [addCategory, setAddCategory] = useState('');
  const [addTodo, setAddTodo] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const backgroundColors = ['#E881A6', '#FFBE98', '#FFA74F', '#60C8B3', '#279D9F', '#1B5091'];
  const [color, setColor] = useState(backgroundColors[0]);
  const categoriesRef = collection(firestore, 'categories');
  const todoRef = collection(firestore, 'todos');

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigation.replace('Login');
      })
      .catch((error) => alert(error.message));
  };

  const fetchCategories = async () => {
    const querySnapshot = await getDocs(collection(firestore, 'categories'));
    const categories = [];
    querySnapshot.forEach((doc) => {
      const { name, color } = doc.data();
      categories.push({
        id: doc.id,
        name,
        color,
      });
    });
    setCategories(categories);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategoryItem = async () => {
    if (addCategory && addCategory.length > 0) {
      try {
        await addDoc(categoriesRef, {
          name: addCategory,
          color: color,
        });
        setAddCategory('');
        fetchCategories();
      } catch (error) {
        console.error('Error adding category:', error);
      }
    }
  };
  const renderColor = () => {
    return backgroundColors.map((bgColor) => {
      return (
        <TouchableOpacity
          key={bgColor}
          style={[styles.colorSelector, { backgroundColor: bgColor }]}
          onPress={() => setColor(bgColor)}
        >
          <View style={[styles.color, { backgroundColor: bgColor }]}></View>
        </TouchableOpacity>
      );
    });
  };

  const deleteCategory = async (categoryId) => {
    try {
      const categoryDocRef = doc(firestore, 'categories', categoryId);
      await deleteDoc(categoryDocRef);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    setModalVisible(true);
  };

  const handleAddTodo = async () => {
    const success = await addTodo(selectedCategory, addTodoName);
    if (success) {
      setAddTodo('');
      setModalVisible(false);
    } else {
    }
  };

  return (
    <View style={styles.container}>
      <Modal animationType='slide' visible={modalVisible} onRequestClose={handleCategoryPress} selectedCategory={selectedCategory}>
        <TodoScreen
          closeModal={() => setModalVisible(false)}
          handleAddTodo={handleAddTodo}
          selectedCategory={selectedCategory}
        />
      </Modal>

      <Text style={styles.user}>User: {auth.currentUser?.email}</Text>
      <Text style={styles.title}>--- Categories ---</Text>
      <TextInput
        style={styles.input}
        placeholder="Add a new category"
        value={addCategory}
        onChangeText={(text) => setAddCategory(text)}
      /> 
      <View style={styles.colorCube}>{renderColor()}</View>
      <TouchableOpacity
        style={[styles.createCategory, { backgroundColor: color }]}
        onPress={addCategoryItem}
      >
        <AntDesign name="plus" size={30} color="black" />
      </TouchableOpacity>
      <View style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => handleCategoryPress(category)}
            style={[
              styles.categoryItem,
              { backgroundColor: category.color },
            ]}>
            <Text>{category.name}</Text>
            <TouchableOpacity
              onPress={() => deleteCategory(category.id)}
              style={styles.deleteButton}
            >
               <AntDesign name= "delete" size={20} color="black" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
      
      <TouchableOpacity onPress={handleSignOut} style={styles.button}>
        <Text style={styles.btnText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor:'#ECEBEB',
  },
  user: {
    color: 'gray',
   
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
  button: {
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 4,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  btnText: {
    color: 'black',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 20,
  },
  categoriesContainer: {
    marginTop: 10,
    width: '100%',
    borderRadius:4, 
  },
  categoryItem: {
    borderRadius:4, 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 3,
    borderBottomColor: '#ECEBEB',
  },
  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },  
  colorSelector: {
    width: 40,
    height: 40,
    marginHorizontal: 2.7,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
},
colorCube:{
   flexDirection: 'row',
   flexWrap: 'wrap',
   justifyContent:'space-between', 
   marginVertical: 20,
   marginHorizontal: 1,
},
createCategory:{
  height: 40,
  width:40,
  margin:7,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 4,
}
 
});

export default Home;
