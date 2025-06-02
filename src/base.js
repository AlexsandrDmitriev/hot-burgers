import { initializeApp } from 'firebase/app';
//import 'firebase/database';
//import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC7Q8prLudMHqYo8vK1oA5qJ8THa2EbEJ4",
  authDomain: "hot-burgers-ebd8b.firebaseapp.com",
  databaseURL: "https://hot-burgers-ebd8b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "hot-burgers-ebd8b",
  storageBucket: "hot-burgers-ebd8b.firebasestorage.app",
  messagingSenderId: "632328515351",
  appId: "1:632328515351:web:da15e231595e15d3381152"
};

//const base = Rebase.createClass(firebaseApp.database());
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase
//const base = initializeApp(firebaseConfig);

export { firebaseApp };
