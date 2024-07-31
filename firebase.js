// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import { getAnalytics } from "firebase/analytics";
import { myKeys } from "./firebaseKeys.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: myKeys[0],
  authDomain: myKeys[1],
  projectId: myKeys[2],
  storageBucket: myKeys[3],
  messagingSenderId: myKeys[4],
  appId: myKeys[5],
  measurementId: myKeys[6]
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
export {app, firestore}