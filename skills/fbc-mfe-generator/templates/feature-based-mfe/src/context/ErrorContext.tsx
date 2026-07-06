import React, {createContext, useContext, useState, ReactNode} from 'react';

interface ErrorState {
    title: string;
    message: string;
    isOpen: boolean;
}

interface ErrorContextType {
    error: ErrorState;
    showError: (title: string, message: string) => void;
    hideError: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const [error, setError] = useState<ErrorState>({
        title: '',
        message: '',
        isOpen: false
    });

    const showError = (title: string, message: string) => {
        setError({title, message, isOpen:true});
    };

    const hideError = () => {
        setError(prev => ({...prev, isOpen: false}));
    };
    return (
        <ErrorContext.Provider value={{error, showError, hideError}}>{children}</ErrorContext.Provider>
    )

}

export const useError = () => {
    const context = useContext(ErrorContext);
    if (!context) {
        throw new Error('useError must be used within an ErrorProvider');
    }
    return context;
}