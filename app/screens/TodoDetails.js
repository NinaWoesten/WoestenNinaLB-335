import React, { useState } from 'react';
import { Modal, Text, TouchableOpacity, View, StyleSheet, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { updateDoc, doc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';

const firestore = FIREBASE_DB;
const TodoDetails = ({ closeModal, selectedTodo }) => {
  const [selectedImage, setSelectedImage] = useState(null); // State für das ausgewählte Bild

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setSelectedImage(result.uri);
      // Hier kannst du die Logik hinzufügen, um das Bild in der Firestore-Datenbank für das ausgewählte Todo zu speichern
      saveImageToFirestore(result.uri);
    }
  };

  const saveImageToFirestore = async (uri) => {
    try {
      const todoDocRef = doc(firestore, 'todos', selectedTodo.id);
      await updateDoc(todoDocRef, { image: uri }); // Angenommen, 'image' ist das Feld für das Bild in deinem Firestore-Dokument
    } catch (error) {
      console.error('Error saving image to Firestore:', error);
    }
  };

  return (
    <Modal animationType='slide' visible={!!selectedTodo} onRequestClose={closeModal}>
      <View style={styles.container}>
        <TouchableOpacity onPress={takePhoto} style={styles.button}>
          <AntDesign name="camerao" size={24} color="black" />
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>
        {/* Anzeige des ausgewählten Bildes */}
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
        ) : (
          <Text>No image selected</Text>
        )}
        {/* Weitere Inhalte des Modals */}
        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
          <Text style={styles.btnText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // ... andere Styles
  },
  selectedImage: {
    width: 200,
    height: 200,
    marginVertical: 20,
    // ... andere Styles
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    // ... andere Styles
  },
  buttonText: {
    marginLeft: 10,
    // ... andere Styles
  },
  closeButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    // ... andere Styles
  },
  btnText: {
    color: 'white',
    // ... andere Styles
  },
});

export default TodoDetails;