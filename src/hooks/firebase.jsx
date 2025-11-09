// firebase-config.js
import { createContext, useContext } from "react";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

import { firebaseConfig } from "./firebase-config"; // Import the firebaseConfig from the separate file

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firebaseStorage = getStorage(firebaseApp);
const firebaseDB = getDatabase(firebaseApp)

// Create a Firebase context
const FirebaseContext = createContext();

export const FirebaseProvider = ({ children }) => {
    const auth = firebaseAuth;
    const storage = firebaseStorage;
    const db = firebaseDB;
    return (
        <FirebaseContext.Provider value={{
            auth,
            storage,
            db
        }}>
            {children}
        </FirebaseContext.Provider>
    );
};

// Custom hook to use Firebase
export const useFirebase = () => {
    return useContext(FirebaseContext);
};