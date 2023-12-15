import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Modal, Button, Text, SafeAreaView, TouchableOpacity, View, StyleSheet, Image, TextInput } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { collection, doc, updateDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';
import { AntDesign } from '@expo/vector-icons';

const firestore = FIREBASE_DB;

const TodoDetails = ({ closeModal, selectedTodo }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showCamera, setShowCamera] = useState(true);
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
      setShowCamera(false);
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

  const savePhoto = async () => {
    if (photo) {
      try {
        await MediaLibrary.saveToLibraryAsync(photo.uri);
        setPhoto(null);
        setShowCamera(false);
       
        alert ('Photo successfully saved in your Gallery');
      } catch (error) {
        console.error('Error saving photo to library:', error);
      }
    }
  };
  const editTodo = async () => {
    try {
      if (selectedTodo) {
        const todosRef = doc(firestore, 'todos', selectedTodo.id);
        await updateDoc(todosRef, {
          description: description,
        });
        setModalVisible(false); // Schließe das Modal nach der Aktualisierung
      }
    } catch (error) {
      console.error('Error updating todo description:', error);
    }
  };
  const saveDescription = async () => {
    try {
      if (selectedTodo && description.trim() !== '') {
        await editTodo(); 
        const todosRef = doc(firestore, 'todos', selectedTodo.id);
        await updateDoc(todosRef, {
          description: description,
        });
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
          <Camera
            style={styles.camera}
            type={Camera.Constants.Type.back}
            ref={cameraRef}
          />
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
    top: 10,
    left: 10,
  },
  closeIcon: {
    fontSize: 24,
  },
  buttonContainer: {
    marginVertical: 20,
  },
  preview: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginVertical: 20,
  },
  camera: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginVertical: 20,
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
  closeButton: {
    backgroundColor: 'red',
  },
  btnText: {
    color: 'white',
  },
});

export default TodoDetails;
