import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Modal, Button, Text, SafeAreaView, TouchableOpacity, View, StyleSheet, Image, TextInput } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, where, query} from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';
import { AntDesign, Ionicons } from '@expo/vector-icons';


const firestore = FIREBASE_DB;

const TodoDetails = ({ closeModal, selectedTodo }) => {
  const [todos, setTodos] = useState([]);
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState(selectedTodo?.photo || null);
  const cameraRef = useRef();
  const [description, setDescription] = useState(selectedTodo?.description || '');

  const takePhoto = useCallback(async () => {
    if (cameraRef.current) {
      let options = {
        quality: 1,
        base64: true,
        exif: false,
      };
      let newPhoto = await cameraRef.current.takePictureAsync(options);
      setPhoto(newPhoto);
    } else {
      console.error('Camera reference not initialized');
    }
  }, []);

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: mediaLibraryStatus } = await MediaLibrary.requestPermissionsAsync();

      setHasCameraPermission(cameraStatus === 'granted');
      setHasMediaLibraryPermission(mediaLibraryStatus === 'granted');
    })();
  }, []);

  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>;
  } else if (!hasCameraPermission) {
    return <Text>Permission for the camera not granted. Please change this in settings.</Text>;
  }

  if (photo) {
    let savePhoto = () => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };
    return (
      <SafeAreaView style={styles.container}>
        <Image style={styles.preview} source={{ uri: photo.uri }} />
        {hasMediaLibraryPermission ? <Button title="Save" onPress={savePhoto} /> : undefined}
        <Button title="Delete" onPress={() => setPhoto(undefined)} />
      </SafeAreaView>
    );
  }


  const saveDescription = async() => {
    try {
      if (selectedTodo) {
        const todosRef = doc(firestore, 'todos', selectedTodo.id);
        await updateDoc(todosRef, {
          description: description,
        });
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === selectedTodo.id ? { ...todo, description: description } : todo
          )
        );
      }
    } catch (error) {
      console.error('Error updating todo description:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.categoryButton} onPress={closeModal}>
        <AntDesign style={styles.closeIcon} name='close' size={20} color='black' />
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <Button title="Take Photo" onPress={takePhoto} />
      </View>

      {photo ? (
        <View>
          <Image style={styles.preview} source={{ uri: photo.uri }} />
          {hasMediaLibraryPermission ? <Button title="Save Photo" onPress={savePhoto} /> : undefined}
          <Button title="Delete Photo" onPress={() => setPhoto(null)} />
        </View>
      ) : (
        <View>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Enter ToDo description..."
            multiline
            value={description}
            onChangeText={(text) => setDescription(text)}
          />
          <TouchableOpacity style={styles.button} onPress={saveDescription}>
            <Text>Save Description</Text>
          </TouchableOpacity>
        </View>
      )}
        <TouchableOpacity onPress={closeModal} style={[styles.button, styles.closeButton]}>
        <Text style={styles.btnText}>Close</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryButton: {
    position: 'absolute',
    top: 60,
    right: 30,
},
  buttonContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  preview: {
    alignSelf: 'stretch',
    flex: 1,
  },
  descriptionInput: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
});

export default TodoDetails;