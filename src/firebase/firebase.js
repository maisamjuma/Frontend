// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAuth,connectAuthEmulator} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

// import {getAnalytics} from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDCRW42bFr0nbvpuOx6cEQ7ogan34qCMJM",
    authDomain: "devtrack-eeff4.firebaseapp.com",
    projectId: "devtrack-eeff4",
    storageBucket: "devtrack-eeff4.appspot.com",
    messagingSenderId: "866511275444",
    appId: "1:866511275444:web:abc5f2d7bb245db6e89ee1",
    measurementId: "G-QK2D8V0FDC"
};

function getCustomAuth() {
    const auth = getAuth()
    connectAuthEmulator(auth, "http://localhost:9099");

    return auth
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// firestoreInstance=db;
// const auth = getAuth(app)
const auth = getCustomAuth(app)
// const analytics = getAnalytics(app);

export {app, auth};