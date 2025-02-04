import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  setDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyB_7In1Xy21QTRvSvmiSvR5tWZVprmTLH4",
  authDomain: "chat-app-caec2.firebaseapp.com",
  projectId: "chat-app-caec2",
  storageBucket: "chat-app-caec2.firebasestorage.app",
  messagingSenderId: "656747135058",
  appId: "1:656747135058:web:eb6c4261631caaba2adf8b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name: "",
      avatar: "",
      bio: "Hey, There I am using chat app",
      lastseen: Date.now(),
    });
    await setDoc(doc(db, "chats", user.uid), {
      chatsData: [],
    });
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
};

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    toast.success("Logged in successfully");
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
};

const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
};

const resetPassword = async (email) => {
  if (!email) {
    toast.error("Enter your email address");
    return null;
  }

  try {
    const userRef = collection(db, "users");
    const q = query(userRef, where("email", "==", email));
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      await sendPasswordResetEmail(auth, email);
      toast.success("Reset Email sent successfully!!!");
    } else {
      toast.error("Email doesn't exists ...");
    }
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
};

export { signup, login, logout, auth, db, resetPassword };
