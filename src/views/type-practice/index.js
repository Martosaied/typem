
import React, { useState, useEffect, useReducer, useCallback } from 'react';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import useStyles from './styles';
import reducer from './reducer';
import useTimer from 'hooks/useTimer';
import { practiceStates, wordStates } from './types';

const TypePractice = () => {
	const classes = useStyles();
    
	const text = 'Lorem Ipsum is simply the filler text of the printers and typesetters Lorem Ipsum has been the standard filler text of the industries since the 1500s when an unknown printer used a gallery of texts and mixed them in such a way that he managed to make a textbook specimen Not only did it survive 500 years but it also entered as filler text in electronic documents, remaining essentially the same as the original. It was popularized in the 60s with the creation of the Letraset sheets which contained passages from Lorem Ipsum and more recently with desktop publishing software such as Aldus PageMaker which includes versions of Lorem Ipsum';
	const words = text.split(' ');
    
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
    
	const checkCorrectLetter = useCallback(key => {
		console.log(key);
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
			console.log(event);
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
					<Grid container spacing={2}>
						<Grid item>
							<Card>
								<CardContent>
									<Typography variant="h3" component="p">
										{ new Date(time * 1000).toISOString().substr(11, 8) }
									</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid item>
							<Card>
								<CardContent>
									<Typography variant="h3" component="p">
										{ `${Math.floor(wpm)} wpm` }
									</Typography>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				</form>
			</div>
		</Container>
	);
};

export default TypePractice;