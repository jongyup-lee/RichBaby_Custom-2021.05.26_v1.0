import React, {useState, createContext} from 'react';
import Spinner from '../components';

const ProgressContext = createContext({
    inProgress: false,
    Spinner: {start: () => {}, stop: () => {}}
});

const ProgressProvider = ({children}) => {
    const [inProgress, setInProgress] = useState(false);
    const spinner = {
        start: () => setInProgress(true),
        stop: () => setInProgress(false),
    };

    const value = {inProgress, spinner};

    return (
        <ProgressContext.Provider value={value}>
            {children}
        </ProgressContext.Provider>
    );
};

export {ProgressContext, ProgressProvider};