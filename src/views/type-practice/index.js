
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
    
	const text = 'Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500 cuando un impresor desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen No sólo sobrevivió 500 años sino que tambien ingresó como texto de relleno en documentos electrónicos quedando esencialmente igual al original Fue popularizado en los 60s con la creación de las hojas "Letraset" las cuales contenian pasajes de Lorem Ipsum y más recientemente con software de autoedición como por ejemplo Aldus PageMaker el cual incluye versiones de Lorem Ipsum';
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
		if (key === ' ') {
			dispatch({ type: 'SPACE' });
		} else if (key === 'Backspace') {
			dispatch({ type: 'BACKSPACE' });
		} else if (key.match(/^[0-9a-zA-Z]*^\w{0,1}$/i)) {
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

		window.addEventListener('keydown', handleUserKeyPress);
    
		return () => {
			window.removeEventListener('keydown', handleUserKeyPress);
		};
	}, [checkCorrectLetter]);
    
	useEffect(() => {
		const completedWords = state.userWords.filter(userWord => userWord.length !== 0);
		const newWpm = completedWords.length / (time / 60);
		setWPM(newWpm);
	}, [time, state.userWords]); 
    
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
						<Grid item spacing={2}>
							<Card>
								<CardContent>
									<Typography variant="h3" component="p">
										{ new Date(time * 1000).toISOString().substr(11, 8) }
									</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid item spacing={2}>
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