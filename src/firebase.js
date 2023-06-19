// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB70DayxR-uC48qlu9kQzhhESCnWj8CdKM",
    authDomain: "social-chat-19c14.firebaseapp.com",
    projectId: "social-chat-19c14",
    storageBucket: "social-chat-19c14.appspot.com",
    messagingSenderId: "542992738479",
    appId: "1:542992738479:web:3a0773f03ed4cb08144c5a"
  }

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();