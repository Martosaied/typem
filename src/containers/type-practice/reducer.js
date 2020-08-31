import update from 'immutability-helper';
import { wordStates, practiceStates } from 'views/type-practice/types';

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
	const newState = update(state, {
		practiceState: { $set: practiceStates.STARTED },
		userWords: {
			[state.currentWordIndex]: { $push: [action.key] } 
		},
	});
	return newState;
};

const handleSpace = (state) => {
	let newWordState = wordStates.WRONG;
	if (state.words[state.currentWordIndex].word.toLowerCase() ===  state.userWords[state.currentWordIndex].join('').toLowerCase()) {
		newWordState = wordStates.CORRECT;
	}
    
	let newWordIndex = state.currentWordIndex + 1;
	let newPracticeState = state.state;
	if (newWordIndex >= state.words.length) {
		newPracticeState = practiceStates.FINISHED;
		newWordIndex = state.words.length - 1;
	}
	const newState = update(state, {
		currentWordIndex: { $set: newWordIndex },
		practiceState: { $set: newPracticeState },
	    words: { 
			[newWordIndex]: { state: { $set: wordStates.CURRENT } },
			[state.currentWordIndex]: { state: { $set: newWordState } }, 
		},
	});
	return newState;
};

const handleBackspace = (state) => {
	let newCurrentWordIndex = state.currentWordIndex;
	if (state.userWords[state.currentWordIndex].length === 0) {
		newCurrentWordIndex = state.currentWordIndex - 1;
	}
    
	if (newCurrentWordIndex >= state.words.length) {
		newCurrentWordIndex = state.words.length - 1;
	}

	if (newCurrentWordIndex < 0) {
		newCurrentWordIndex = 0;
	}
    
	const newState = update(state, {
		currentWordIndex: { $set: newCurrentWordIndex },
		words: { 
			[state.currentWordIndex]: { state: { $set: wordStates.DEFAULT } },
			[newCurrentWordIndex]: { state: { $set: wordStates.CURRENT } } 
		},
		userWords: { 
			[state.currentWordIndex]: { $splice: [[-1]] }
		}
	});
	return newState;
};

export default reducer;