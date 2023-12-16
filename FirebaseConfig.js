// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getReactNativePersistence } from '@firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDb39Q6EPGqc77Q5xt4mNGZPBbflBksA-0",
  authDomain: "woestenninalb-335.firebaseapp.com",
  projectId: "woestenninalb-335",
  storageBucket: "woestenninalb-335.appspot.com",
  messagingSenderId: "953532831514",
  appId: "1:953532831514:web:aed810e6f08b657dea7ea3",
  measurementId: "G-FBD7K2XY9H"
};

// Initialize Firebase
const FIREBASE_APP = initializeApp(firebaseConfig);

export { FIREBASE_APP };
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export { getReactNativePersistence};