/**
 * Loading Component
 * Indicador de carga con overlay que bloquea la interacción
 */

import React from 'react';
import { Backdrop, CircularProgress } from '@mui/material';

interface LoadingProps {
	isLoading: boolean;
	message?: string;
}

export const Loading: React.FC<LoadingProps> = ({ isLoading }) => {
	if (!isLoading) return null;

	return (
		<Backdrop open={isLoading} sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}>
			<CircularProgress color="inherit"/>
		</Backdrop>
	);
};
