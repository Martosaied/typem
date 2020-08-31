
import React, { useState, useEffect, useReducer, useCallback, useContext } from 'react';
import { UserContext } from 'providers/user-provider';
import reducer from './reducer';
import useTimer from 'hooks/useTimer';
import { practiceStates, wordStates } from 'views/type-practice/types';
import TypePractice from 'views/type-practice';
import { db } from '../../firebase';
const txtgen = require('txtgen');

const TypePracticeContainer = () => {    
	const text = txtgen.paragraph();
	const words = text.split(' ');
    
	const user = useContext(UserContext);
    
	const [state, dispatch] = useReducer(reducer, {
		currentLetterIndex: 0,
		currentWordIndex: 0,
		words: words.map((word, index) => ({
			word,
			state: !!index ? wordStates.DEFAULT : wordStates.CURRENT,
		})),
		userWords: words.map(() => []),
		practiceState: practiceStates.NOT_STARTED,
	});       
    
	useEffect(() => {
		if (state.practiceState === practiceStates.FINISHED) {
			db.collection('practices').add({
				text: text,
				wpm: wpm,
				userId: user.uid,
				timer: time,
				created: new Date(),
			});  
		}
	}, [state.practiceState]);
    
	const [userPractices, setUserPractices] = useState([]);

	useEffect(() => {
		fetchPractices();
	}, []);
    
	const fetchPractices = async () => {
		const practiceRef = db.collection('practices');
		practiceRef.where("userId", "==", user.uid)
			.get().then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					setUserPractices(prev => [...prev, doc.data()]);
				});
			});
	};
        
	const checkCorrectLetter = useCallback(key => {
		if (key === ' ') {
			dispatch({ type: 'SPACE' });
		} else if (key === 'Backspace') {
			dispatch({ type: 'BACKSPACE' });
		} else if (key.match(/^[0-9a-zñáéíóúü]$/i) && key.length === 1) {
			dispatch({ type: 'ADD_LETTER', key });
		}
	}, []);
    
	const [time, toggleTimer] = useTimer();
	const [wpm, setWPM] = useState(0);
    
	useEffect(() => {
		const handleUserKeyPress = event => {
			const { key } = event;
			checkCorrectLetter(key);
		};

		window.addEventListener('keyup', handleUserKeyPress);
    
		return () => {
			window.removeEventListener('keyup', handleUserKeyPress);
		};
	}, [checkCorrectLetter]);
    
	useEffect(() => {
		const completedWords = state.words.filter(userWord => userWord.state === wordStates.CORRECT);
		const newWpm = completedWords.length / (time / 60);
		setWPM(newWpm);
	}, [time, state.words]); 
    
	useEffect(() => {
		if ([practiceStates.NOT_STARTED, practiceStates.FINISHED].includes(state.practiceState)) {
			toggleTimer(false);
		} else {
			toggleTimer(true);
		}
	}, [state.practiceState, toggleTimer]);

	return (
		<TypePractice words={state.words} userPractices={userPractices} user={user} time={time} wpm={wpm} />
	);
};

export default TypePracticeContainer;