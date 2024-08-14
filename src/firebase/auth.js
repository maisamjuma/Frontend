//this will contain all the functions for authentication

import { auth } from "./firebase";

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
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification,
    updatePassword,
    signInWithPopup,
    GoogleAuthProvider,
} from "firebase/auth";

export const doCreateUserWithEmailAndPassword = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
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