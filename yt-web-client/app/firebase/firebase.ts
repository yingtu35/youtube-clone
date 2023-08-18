// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCCpBjcbByf42x6PUbyWtFKT3kFREcMxAY",
  authDomain: "video-processing-092021.firebaseapp.com",
  projectId: "video-processing-092021",
  storageBucket: "video-processing-092021.appspot.com",
  messagingSenderId: "724627008582", 
  appId: "1:724627008582:web:16ebf25c47bc7304d52e47",
  measurementId: "G-5EHYDZ6FGH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.useDeviceLanguage();

const provider = new GoogleAuthProvider();

/**
 * The function `signInWithGoogle` signs in a user with their Google account using a popup.
 * @returns A promise that resolves with the user's credentials.
 */
export const signInWithGoogle = () => {
  return signInWithPopup(auth, provider);
}


/**
 * The function signOut is used to sign out the user from the authentication system.
 * @returns A promise that resolves when the user is signed out.
 */
export const signOut = () => {
  return auth.signOut();
}


/**
 * The `onAuthStateChangedHelper` function is a TypeScript helper function that takes a callback
 * function as a parameter and returns the result of calling `onAuthStateChanged` with the `auth`
 * object and the callback.
 * @param callback - A function that takes a user object or null as its parameter and returns void.
 * This function will be called whenever the authentication state changes.
 * @returns a unsubscribe callback function.
 */
export const onAuthStateChangedHelper = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
}