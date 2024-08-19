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
} from "firebase/auth";

// Add role to Firestore
const saveUserRoleInFirestore = async (userId, role) => {
    const userRef = doc(firestore, "users", userId);
    await setDoc(userRef, { role }, { merge: true });
};

export const doCreateUserWithEmailAndPassword = async (email, password, role) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save role to Firestore
    await saveUserRoleInFirestore(user.uid, role);

    return userCredential;
};

export const doSignInWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);//this is important because a popup is going to be opened, and we are going to select the Google account using which we need to login.
    const user = result.user; //if we want to save it to "fireStore"

    // add user to firestore

    return result;
};

export const doSignOut = () => {
    return auth.signOut();
};

export const doPasswordReset = (email) => {
    return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = (newPassword) => {
    return updatePassword(auth.currentUser, newPassword);
};

export const doSendEmailVerification = () => {
    return sendEmailVerification(auth.currentUser, {
        url: `${window.location.origin}/home`,
    });
};