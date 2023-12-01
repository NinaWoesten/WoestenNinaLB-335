import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import Login from './app/screens/Login';
import Home from './app/screens/Home';
import { FIREBASE_APP, getAuth } from './FirebaseConfig';
import { User } from 'firebase/auth';

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();



export default function App(){
  return (
    <NavigationContainer>
      <Stack.Navigator>
          <Stack.Screen options={{ headerShown: false}} name='Login' component={Login} />
          <Stack.Screen name="My ToDos" component={Home} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


