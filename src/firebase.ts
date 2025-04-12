import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCOa_tTly-MBkraG1MtlQcUx1yb5k2piBU",
  authDomain: "fluencyapp-37ad5.firebaseapp.com",
  projectId: "fluencyapp-37ad5",
  storageBucket: "fluencyapp-37ad5.firebasestorage.app",
  messagingSenderId: "135947529307",
  appId: "1:135947529307:web:4886c941d78d2fbd96e37e",
  measurementId: "G-1LKRZJZLXH"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

enableIndexedDbPersistence(db).catch(console.warn);

export { auth, provider, db };
