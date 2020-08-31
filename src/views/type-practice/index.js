
import React, { useState, useEffect, useReducer, useCallback, useContext } from 'react';
import { UserContext } from 'providers/user-provider';
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
import useTimer from 'hooks/useTimer';
import { practiceStates, wordStates } from './types';
import { db } from '../../firebase';

const TypePractice = props => {
	const classes = useStyles();

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
							{ props.words.map((word, index) => {
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
										{ new Date(props.time * 1000).toISOString().substr(11, 8) }
									</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid item>
							<Card>
								<CardContent>
									<Typography variant="h3" component="p">
										{ `${Math.floor(props.wpm)} wpm` }
									</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid item>
							<Card>
								<CardContent>
									<Typography variant="h4" component="p">
										{ props.user.displayName }
									</Typography>
									<Typography variant="body1" component="p">
										{ props.user.email }
									</Typography>
								</CardContent>
							</Card>
						</Grid>
						{ props.userPractices.map((practice, index) => {
							return(
								<Grid key={index} item>
									<Card>
										<CardContent>
											<Typography variant="h4" component="p">
												WPM: { practice.wpm }
											</Typography>
											<Typography variant="body1" component="p">
												Timer: { practice.timer }
											</Typography>
											<Typography variant="body1" component="p">
												{ new Date(practice.created.seconds * 1000).toLocaleString() }
											</Typography>
										</CardContent>
									</Card>
								</Grid>
							);
						}) }
					</Grid>
				</form>
			</div>
		</Container>
	);
};

export default TypePractice;