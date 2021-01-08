import firebase from "firebase";
import "firebase/messaging";
import firebaseConfig from './FirebaseConfig';

const initializedFirebaseApp = firebase.initializeApp(firebaseConfig);

const messaging = initializedFirebaseApp.messaging();
export { messaging };
