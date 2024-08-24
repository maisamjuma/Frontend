
/*
// src/firebase/firestoreService.js
import { firestore } from '../firebase/firebaseConfig';
import { collection, addDoc, query, where, onSnapshot } from 'firebase/firestore';

// Listen to events
export const listenToEvents = (onUpdate) => {
    const eventsCollection = collection(firestore, 'events');
    const eventsQuery = query(eventsCollection, where('title', '!=', ''));
    return onSnapshot(eventsQuery, (querySnapshot) => {
        console.log('Updating events');
        onUpdate(querySnapshot.docs.map(doc => ({
            id: doc.id,
            title: doc.data().title,
            description: doc.data().description,
            duration: doc.data().duration,
            startTime: doc.data().startTime
        })));
    });
};

// Add a new event
export const addEvent = async (event) => {
    const eventsCollection = collection(firestore, 'events');
    await addDoc(eventsCollection, event);
};

 */