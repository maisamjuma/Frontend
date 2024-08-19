// auth.js
//this will contain all the functions for authentication

import {auth,firestore } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
/*
we will be adding the individual functions to:
-create a new user with email and password
-sign in the user with email and password
-sign in a Google user
-and to sign out

also for future work we will implement the functions for
-password change
-password reset
-and email verification
*/
import {
    createUserWithEmailAndPassword,
    updateProfile,

    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification,
    updatePassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
} from "firebase/auth";

// Add role to Firestore
const saveUserRoleInFirestore = async (userId, role) => {
    const userRef = doc(firestore, "users", userId);
    await setDoc(userRef, { role }, { merge: true });
};

// Create a new user with email and password
export const doCreateUserWithEmailAndPassword = async (email, password, role) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save role to Firestore
        await saveUserRoleInFirestore(user.uid, role);

        return userCredential;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

// Sign in a user with email and password
export const doSignInWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

// Sign in a user with Google
export const doSignInWithGoogle = async () => {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Optionally save user to Firestore if needed
        return user;
    } catch (error) {
        console.error('Error signing in with Google:', error);
        throw error;
    }
};

// Sign out the current user
export const doSignOut = () => {
    return signOut(auth);
};

// Password reset
export const doPasswordReset = (email) => {
    return sendPasswordResetEmail(auth, email);
};

// Password change
export const doPasswordChange = (newPassword) => {
    return updatePassword(auth.currentUser, newPassword);
};

// Send email verification
export const doSendEmailVerification = () => {
    return sendEmailVerification(auth.currentUser, {
        url: `${window.location.origin}/home`,
    });
};
