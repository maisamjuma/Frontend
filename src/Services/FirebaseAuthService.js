// FirebaseAuthService.js
import { auth, firestore } from '../firebase/firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

// Create a new user with email and password
export const createUser = async (user) => {
    const { email, password, username, firstName, lastName, role, isTeamLeader } = user;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        // Save user details and role to Firestore
        await setDoc(doc(firestore, "users", firebaseUser.uid), {
            username,
            email,
            firstName,
            lastName,
            role,
            isTeamLeader
        });

        return firebaseUser;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

// Sign in a user with email and password
export const signInUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

// Sign in a user with Google
export const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const firebaseUser = result.user;

    // Optionally, save user to Firestore if needed
    return firebaseUser;
};

// Sign out the current user
export const signOutUser = () => {
    return signOut(auth);
};
