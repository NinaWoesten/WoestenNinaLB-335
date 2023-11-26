import {Redirect} from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, SafeAreaView, TouchableOpacity, Keyboard, StatusBar } from 'react-native';
import {Stack, useRouter} from 'expo-router';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';


const Home = ({ navigation }) => {
    return (
      <View style={styles.container}>
        <Text>Home</Text>
      </View>
    );
  };
  
  Home.propTypes = {
    navigation: PropTypes.object, // Sie sollten einen genaueren Prop-Typ für navigation verwenden
  };
  
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  
  export default Home;
