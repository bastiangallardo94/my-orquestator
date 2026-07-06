import React, { FC, ReactNode, useContext, useMemo, useState } from 'react';
import { showToastProps, ToastContext } from './toast.context';
import { IOpenModal } from '../Modal/modal.context';
import { Alert, AlertTitle, Snackbar } from '@mui/material';

interface ToastProviderProps {
	children: ReactNode;
}

const ToastProvider: FC<ToastProviderProps> = (props: ToastProviderProps) => {

	const { children } = props;
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [onHideToast, setOnHideToast] = useState<Function | null>(null);
	const [toastProps, setToastProps] = useState<showToastProps | null>(null);

	const hideToast = () => {
		setIsOpen(false);
	};
	const value = useMemo(
		() => ({
			showToast: (params: showToastProps) => {
				const {
					...toastProps
				} = params;
				setIsOpen(true);
				if (toastProps) setToastProps(toastProps);
			},
			hideToast
		}),
		[]
	);

	return (
		<ToastContext.Provider value={value}>
			<Snackbar open={isOpen} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} autoHideDuration={6000} onClose={hideToast}>
				<Alert

					sx={{ width: '100%' }}
					severity={toastProps?.status}
				>
					{toastProps?.title &&
						<AlertTitle>{toastProps?.title}</AlertTitle>
					}
					{toastProps?.message}
				</Alert>
			</Snackbar>
			{children}
		</ToastContext.Provider>
	);
};

export const useToast = () => useContext(ToastContext);

export default ToastProvider;
