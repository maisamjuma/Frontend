/*
// src/Services/authService.js
import { auth, firestore } from '../firebase/firebaseConfig.js';
import { updateProfile,sendPasswordResetEmail,sendEmailVerification,updatePassword,createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc,getDoc  } from 'firebase/firestore';

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

// Password reset
export const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
};

// Password change
export const changePassword = (newPassword) => {
    return updatePassword(auth.currentUser, newPassword);
};

// Send email verification
export const sendVerificationEmail = () => {
    return sendEmailVerification(auth.currentUser, {
        url: `${window.location.origin}/home`,
    });
};

// Check user roles
export const checkUserRoles = async (userId) => {
    try {
        const docRef = doc(firestore, 'users', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data(); // Return role information
        } else {
            throw new Error('No such document!');
        }
    } catch (error) {
        console.error("Error fetching user roles:", error);
        throw error;
    }
};
////////////////////////////////////////////////////////////
// const saveUserRoleInFirestore = async (userId, role) => {
//     const userRef = doc(firestore, "users", userId);
//     await setDoc(userRef, { role }, { merge: true });
// };

// Check user roles
// export const checkUserRoles = async (userId) => {
//     try {
//         const docRef = doc(firestore, 'users', userId);
//         const docSnap = await getDoc(docRef);
//
//         if (docSnap.exists()) {
//             return docSnap.data(); // Return role information
//         } else {
//             throw new Error('No such document!');
//         }
//     } catch (error) {
//         console.error("Error fetching user roles:", error);
//         throw error;
//     }
// };

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
// export const doPasswordReset = (email) => {
//     retfurn sendPasswordResetEmail(auth, email);
// };

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

// Add role to Firestore
const saveUserRoleInFirestore = async (userId, role) => {
    const userRef = doc(firestore, "users", userId);
    await setDoc(userRef, { role }, { merge: true });
};


 */