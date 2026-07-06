import { createContext, ReactElement, ReactNode } from 'react';
import { ModalOwnProps } from '@mui/material/Modal'


export interface IOpenModal{
	modalComponent: ReactElement;
	onOpenModal?: () => void;
	onCloseModal?: () => void;
	title?: string;
  size?: string;
}

interface IModalMethods {
	closeModal: () => void;
	openModal: (params: IOpenModal) => void;
	setModalComponent: (newModalComponent: ReactElement) => void;
}

const modalMethods = {
	openModal: () => null,
	closeModal: () => null,
	setModalComponent: () => null,
};
export const ModalContext = createContext<IModalMethods>(modalMethods);
