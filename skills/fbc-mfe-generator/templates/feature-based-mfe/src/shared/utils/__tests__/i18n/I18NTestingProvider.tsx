import { render, RenderOptions } from '@testing-library/react';
import React, { ReactElement, ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18nMockingToTest';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'; // Tu archivo de configuración anterior

// 1. Definimos el tipo para los props del Wrapper
interface AllTheProvidersProps {
	children: ReactNode;
}

// 2. Creamos el componente Wrapper con Tipado
const AllTheProviders = ({ children }: AllTheProvidersProps) => {
	return (
		<I18nextProvider i18n={i18n}>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				{children}
			</LocalizationProvider>
		</I18nextProvider>
	);
};

// 3. Sobrescribimos el método render
// Omitimos 'wrapper' de las opciones originales para evitar conflictos
const customRender = (
	ui: ReactElement,
	options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// 4. Exportamos todo lo de RTL y nuestro render personalizado
export * from '@testing-library/react';
export { customRender as render };
