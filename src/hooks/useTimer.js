import { useState, useEffect, useCallback } from 'react';

const useTimer = (initialValue = 0) => {
	const [counter, setCounter] = useState(initialValue);
	const [started, setStarted] = useState(false);
	useEffect(() => {
		if (started) {
			counter >= 0 && setTimeout(() => setCounter(counter + 1), 1000);
		}
	}, [counter, started]);        
    
	return [counter, useCallback((newStatus) => setStarted(newStatus), [])];
};

export default useTimer;