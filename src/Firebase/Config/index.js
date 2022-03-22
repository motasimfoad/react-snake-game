import * as firebase from 'firebase';
import firestore from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyC_-r50Sm9RICezqP31MBUe4YcRo4yguk8",
    authDomain: "fir-orbitdb.firebaseapp.com",
    projectId: "fir-orbitdb",
    storageBucket: "fir-orbitdb.appspot.com",
    messagingSenderId: "340960676566",
    appId: "1:340960676566:web:6a6ee7203e1c6062cb1777",
    measurementId: "G-DETNQ7XJSM"

};

firebase.initializeApp(firebaseConfig);

export default firebase;