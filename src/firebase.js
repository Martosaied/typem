import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyCdOD9L538phK6oSQjqnPILiUtbSiLvTrE',
	authDomain: 'typing-practice-ms.firebaseapp.com',
	databaseURL: 'https://typing-practice-ms.firebaseio.com',
	projectId: 'typing-practice-ms',
	storageBucket: 'typing-practice-ms.appspot.com',
	messagingSenderId: '688694031971',
	appId: '1:688694031971:web:24794f5aa2f60d34bfea56',
	measurementId: 'G-2K0P9QT2FF'
};

firebase.initializeApp(firebaseConfig);

const provider = new firebase.auth.GoogleAuthProvider();

export const signInWithGoogle = () => {
	auth.signInWithPopup(provider);
};
export const auth = firebase.auth();
export const db = firebase.firestore();