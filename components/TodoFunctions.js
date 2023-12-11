// TodoFunctions.js
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { FIREBASE_DB } from '../FirebaseConfig';


const firestore = FIREBASE_DB;
const TodoFunctions = ({clsoeModal}) => {
const todosRef = collection(firestore, 'todos');
const [todoName, setTodoName] = useState('');
const [todos, setTodos] = useState([]);


const addTodo = async (selectedCategory) => {
    if (todoName && todoName.length > 0 && selectedCategory) {
      const timestamp = new Date();
      try {
        const todosRef = collection(firestore, 'todos');
        await addDoc(todosRef, {
          category: selectedCategory.name,
          todo: todoName,
          completed: false,
          createdAt: timestamp,
        });
        setTodoName('');
        clsoeModal(); 
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    } else {
      console.error('Please enter a category name');
    }
  };
 const deleteTodo = async (todoId) => {
  try {
    const todoDocRef = doc(firestore, 'todos', todoId);
    await deleteDoc(todoDocRef);
    return true;
  } catch (error) {
    console.error('Error deleting todo:', error);
    return false;
  }
}};

export default TodoFunctions;
