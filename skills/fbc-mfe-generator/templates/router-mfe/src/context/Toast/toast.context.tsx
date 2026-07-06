import React from 'react';
import { AlertColor } from '@mui/material/Alert/Alert';

export interface ToastContextType {
    showToast: (_params: { message: string; severity?: AlertColor }) => void;
    ToastComponent: React.FC;
}

export const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = React.useContext(ToastContext);
    
    const showToast = (params: { message: string; severity?: AlertColor }) => {
        if (context) {
            context.showToast(params);
        } else {
            console.error('Toast called but no ToastProvider found', params);
        }
    };

    if (!context) {
        return { showToast, ToastComponent: () => null };
    }
    return context;
};
