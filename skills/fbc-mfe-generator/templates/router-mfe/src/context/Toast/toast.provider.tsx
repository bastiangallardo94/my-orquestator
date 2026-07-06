import React, { useState, ReactNode } from 'react';
import { AlertColor } from '@mui/material/Alert/Alert';
import { ToastContext } from './toast.context';

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState<AlertColor>('info');

    const showToast = (params: { message: string; severity?: AlertColor }) => {
        setMessage(params.message);
        setSeverity(params.severity || 'info');
        setOpen(true);
    };

    const hideToast = () => {
        setOpen(false);
    };

    const ToastComponent = () => null;

    const value = {
        showToast,
        ToastComponent,
    };

    return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};
