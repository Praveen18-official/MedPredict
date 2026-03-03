// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, where, Timestamp, doc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA41HntGWF09PaUe4C2OPf-b8K4E9geA8A",
  authDomain: "medpredict-3ef29.firebaseapp.com",
  projectId: "medpredict-3ef29",
  storageBucket: "medpredict-3ef29.firebasestorage.app",
  messagingSenderId: "668860754645",
  appId: "1:668860754645:web:da5687e0f82f7d66bbd05c",
  measurementId: "G-S94H4WCPT4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Firebase Auth Functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Store user profile in Firestore
    await storeUserProfile(result.user);
    
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const signUpWithEmail = async (email: string, password: string, name: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Store user profile in Firestore
    await storeUserProfile(userCredential.user, name);
    
    return userCredential.user;
  } catch (error) {
    console.error("Error signing up with email:", error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Error signing in with email:", error);
    throw error;
  }
};

export const firebaseSignOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Store user profile in Firestore
const storeUserProfile = async (user: User, displayName?: string) => {
  try {
    const userRef = doc(db, "users", user.uid);
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: displayName || user.displayName || user.email?.split('@')[0],
      photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${displayName || user.displayName || user.email}&background=14b8a6&color=fff`,
      createdAt: Timestamp.now(),
      lastLoginAt: Timestamp.now(),
      emailVerified: user.emailVerified
    };

    await setDoc(userRef, userData, { merge: true });
    console.log("User profile stored in Firestore");
  } catch (error) {
    console.error("Error storing user profile:", error);
    throw error;
  }
};

// Firestore Functions
export const savePatientData = async (userId: string, patientData: any, prediction: any) => {
  try {
    const docRef = await addDoc(collection(db, "patientAssessments"), {
      userId,
      patientData,
      prediction,
      timestamp: Timestamp.now()
    });
    console.log("Patient data saved with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving patient data:", error);
    throw error;
  }
};

export const getUserAssessments = async (userId: string) => {
  try {
    const q = query(collection(db, "patientAssessments"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const assessments: any[] = [];
    
    querySnapshot.forEach((doc) => {
      assessments.push({ id: doc.id, ...doc.data() });
    });
    
    return assessments;
  } catch (error) {
    console.error("Error fetching user assessments:", error);
    throw error;
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    // Note: In a real app, you'd use getDoc here
    // For now, we'll return the current user data
    const user = getCurrentUser();
    if (user && user.uid === userId) {
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const saveContactMessage = async (contactData: any) => {
  try {
    const docRef = await addDoc(collection(db, "contactMessages"), {
      ...contactData,
      timestamp: Timestamp.now()
    });
    console.log("Contact message saved with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving contact message:", error);
    throw error;
  }
};

export const getContactMessages = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "contactMessages"));
    const messages: any[] = [];
    
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort by timestamp (newest first)
    return messages.sort((a, b) => b.timestamp?.toDate() - a.timestamp?.toDate());
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    throw error;
  }
};

export const updateContactStatus = async (messageId: string, status: string) => {
  try {
    const messageRef = doc(db, "contactMessages", messageId);
    await setDoc(messageRef, { status, updatedAt: Timestamp.now() }, { merge: true });
    console.log("Contact message status updated:", messageId, status);
  } catch (error) {
    console.error("Error updating contact status:", error);
    throw error;
  }
};

// Auth State Observer
export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  return auth.onAuthStateChanged(callback);
};

export { auth, db };
export default app;
