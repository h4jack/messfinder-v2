import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useFirebase } from "./firebase";
import { userRTB } from "./firebase-rtb";
import { useNavigate, useLocation } from "react-router-dom";

const useGoogleAuth = () => {
    const firebase = useFirebase();
    const navigate = useNavigate();
    const location = useLocation();
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState("");

    const handleGoogleSignIn = async (selectedRole) => {
        setAuthLoading(true);
        setAuthError(""); // Clear previous errors

        if (!selectedRole) {
            setAuthError("A role must be selected before signing in with Google.");
            setAuthLoading(false);
            return;
        }

        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(firebase.auth, provider);
            const user = result.user;

            if (user) {
                const { getData, saveData } = userRTB(firebase);

                // Check if user data already exists in Realtime Database
                const existingUserData = await getData(user.uid);

                if (existingUserData && existingUserData.role) {
                    // User exists and has a role, navigate to their profile
                    setAuthError(""); // Clear any previous error
                    navigate(`/${existingUserData.role}/profile`, { state: { from: location } });
                } else {
                    // User is new or doesn't have a role set in RTB, create/update data
                    const userData = {
                        id: user.uid,
                        displayName: user.displayName || "",
                        username: "", // You might want to prompt for username later
                        email: user.email,
                        phoneNumber: "",
                        photoURL: user.photoURL || "",
                        dob: "",
                        role: selectedRole, // Use the role passed to the hook
                        about: "",
                    };
                    await saveData(userData.id, { ...userData });
                    setAuthError(""); // Clear any previous error
                    navigate(`/${selectedRole}/profile`, { state: { from: location } });
                }
            } else {
                setAuthError("Google sign-in failed: No user information received.");
            }
        } catch (error) {
            console.error("Google sign-in error:", error);
            if (error.code === "auth/popup-closed-by-user") {
                setAuthError("Google sign-in cancelled by user.");
            } else if (error.code === "auth/cancelled-popup-request") {
                setAuthError("Google sign-in request already in progress.");
            }
            else {
                setAuthError("Google sign-in failed. Please try again.");
            }
        } finally {
            setAuthLoading(false);
        }
    };

    return { handleGoogleSignIn, authLoading, authError };
};

export default useGoogleAuth;