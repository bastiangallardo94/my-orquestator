import { createContext } from 'react';
import { AlertColor } from '@mui/material/Alert/Alert';

export interface showToastProps {
	message: string;
	status: AlertColor;
	closeable?: boolean;
	title?: string;
	onHideToast?: () => void;
}

export interface ToastMethods {
	showToast: (params: showToastProps) => void;
	hideToast: () => void;
}

const toastMethods: ToastMethods = {
	hideToast: () => {},
	showToast: () => {},
}

export const ToastContext = createContext<ToastMethods>(toastMethods);
