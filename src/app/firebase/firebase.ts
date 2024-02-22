import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDbVUYaRZ1WDoqWbXZieR00rUFPqaq6Evo",
  authDomain: "video-calls-webrtc.firebaseapp.com",
  projectId: "video-calls-webrtc",
  storageBucket: "video-calls-webrtc.appspot.com",
  messagingSenderId: "186534807064",
  appId: "1:186534807064:web:f750c1c433f42ca131656d",
  measurementId: "G-G9G6Y2KEFB",
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}
export const database = firebase.firestore();
