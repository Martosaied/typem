
import React, { useState, useEffect, useReducer } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import useStyles from './styles';
import update from 'immutability-helper';

const wordStates = {
	CURRENT: 'current',
	CORRECT: 'correct',
	WRONG: 'wrong',
	DEFAULT: 'default',
};

const reducer = (state, action) => {
	switch (action.type) {
	    case 'ADD_LETTER': 
		    return handleAddLetter(state, action);
	    case 'SPACE': 
		    return handleSpace(state);
	    case 'BACKSPACE':
		    return handleBackspace(state);
	    default:
		    throw new Error();
	}
};

const handleAddLetter = (state, action) => {
	const correct = action.key === (!state.words[state.currentWordIndex].word[state.currentLetterIndex] ? 
		'' : 
		state.words[state.currentWordIndex].word[state.currentLetterIndex].toLowerCase());
	const newCurrentLetterIndex = state.currentLetterIndex + 1;
	const newState = update(state, {
		currentLetterIndex: { $set: newCurrentLetterIndex },
		corrects: { [state.currentWordIndex]: { $push: [correct] } },
	});
	return newState;
};

const handleSpace = (state) => {
	let newWordState = wordStates.WRONG;
	const wordLength = state.words[state.currentWordIndex].word.length;
	if (state.corrects[state.currentWordIndex].length === wordLength
        && !state.corrects[state.currentWordIndex].includes(false)) {
		newWordState = wordStates.CORRECT;
	}
    
	const newWordIndex = state.currentWordIndex + 1;
	const newState = update(state, {
		currentLetterIndex: { $set: 0 },
		currentWordIndex: { $set: state.currentWordIndex + 1 },
	    words: { 
			[state.currentWordIndex]: { state: { $set: newWordState } }, 
			[newWordIndex]: { state: { $set: wordStates.CURRENT } } 
		},
	});
	return newState;
};

const handleBackspace = (state) => {
	let newCurrentLetterIndex = state.currentLetterIndex;
	let newCurrentWordIndex = state.currentWordIndex;
	if (state.currentLetterIndex > 0) {
		newCurrentLetterIndex--;
	} else {
		newCurrentWordIndex--;
		newCurrentLetterIndex = state.words[newCurrentWordIndex].word.length;
	}

	const newState = update(state, {
		currentLetterIndex: { $set: newCurrentLetterIndex },
		currentWordIndex: { $set: newCurrentWordIndex },
		corrects: { [state.currentWordIndex]: { $splice: [[-1]] } },
		words: { 
			[state.currentWordIndex]: { state: { $set: wordStates.DEFAULT } },
			[newCurrentWordIndex]: { state: { $set: wordStates.CURRENT } } 
		}
	});
	console.log(newState);
	return newState;
};

const TypePractice = props => {
	const classes = useStyles();
    
	const text = 'Lorem Ipsum es simplemente el texto de relleno de las imprentas';
	const words = text.split(' ');
    
	const [state, dispatch] = useReducer(reducer, {
		currentLetterIndex: 0,
		currentWordIndex: 0,
		words: words.map((word, index) => ({
			word,
			state: !!index ? wordStates.DEFAULT : wordStates.CURRENT,
		})),
		corrects: words.map(() => []),
	});       
    
	const checkCorrectLetter = key => {
		if (key === ' ') {
			dispatch({ type: 'SPACE' });
		} else if (key === 'Backspace') {
			dispatch({ type: 'BACKSPACE' });
		} else if (key.match(/[a-z]/i)) {
			dispatch({ type: 'ADD_LETTER', key });
		}
	};
    
	const handleUserKeyPress = event => {
		const { key } = event;
		checkCorrectLetter(key);
	};
    
	useEffect(() => {
		window.addEventListener('keydown', handleUserKeyPress);
    
		return () => {
			window.removeEventListener('keydown', handleUserKeyPress);
		};
	}, [handleUserKeyPress]);

	return (
		<Container component="main" maxWidth="md">
			<CssBaseline />
			<div className={classes.paper}>
				<Avatar className={classes.avatar}>
					<KeyboardIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
                    Type Practice
				</Typography>
				<Card className={classes.root}>
					<CardContent>
						<Typography variant="body2" component="p">
							{ state.words.map((word, index) => {
								return (<span key={index} className={classes[word.state]}>{word.word} </span>);
							}) }
						</Typography>
					</CardContent>
				</Card>
				<form className={classes.form} noValidate>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								multiline
								fullWidth
								rows={2}
								rowsMax={4}
							/>
						</Grid>
					</Grid>
					<Button
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
					>
                        Practice
					</Button>
				</form>
			</div>
		</Container>
	);
};

export default TypePractice;