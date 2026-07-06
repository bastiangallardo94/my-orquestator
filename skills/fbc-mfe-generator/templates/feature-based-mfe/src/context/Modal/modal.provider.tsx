import { Dialog, DialogContent, DialogTitle, IconButton, ThemeProvider, useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { FC, ReactElement, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import CloseIcon from '../../shared/assets/images/cross.svg'
import { IOpenModal, ModalContext } from './modal.context';
import { MuiTheme } from '@shared/components/ui/MuiTheme';


interface IModalProvider {
	children: ReactNode;
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
	'& .MuiDialogContent-root': {
		padding: theme.spacing(3),
	},
	'& .MuiDialogActions-root': {
		padding: theme.spacing(1),

	},
}));
const ModalProvider: FC<IModalProvider> = (props) => {
	const { children } = props;
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
	const [modal, setModal] = useState<ReactElement<unknown>>(<></>);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [onOpen, setOnOpen] = useState<Function | null>();
	const [onClose, setOnClose] = useState<Function | null>();
	const [modalProps, setModalProps] = useState<IOpenModal>(null);

	useEffect(() => {
		if (isOpen) {
			if (onOpen) onOpen();
		} else if (onClose) {
			onClose();
		}
	}, [isOpen, onClose, onOpen]);

	const closeModal = () => {
		setIsOpen(false);
		setOnOpen(null);

		/*		setTimeout(() => {
					setModal(null);
					setOnClose(null);
				}, 500);*/
	};

	const setModalComponent = (newModalComponent: JSX.Element) => {
		setModal(newModalComponent);
	};

	const value = useMemo(
		() => ({
			openModal: (params: IOpenModal) => {
				const {
					modalComponent,

					onOpenModal,
					onCloseModal,
					...modalProps
				} = params;

				setIsOpen(true);
				setModal(modalComponent);

				if (modalProps) setModalProps(modalProps);
				if (onOpenModal) setOnOpen(() => onOpenModal);
				if (onCloseModal) setOnClose(() => onCloseModal);
			},

			closeModal,
			setModalComponent
		}),
		[]
	);

	return (
		<ThemeProvider theme={MuiTheme}>
		<ModalContext.Provider value={value}>
			<BootstrapDialog open={isOpen} maxWidth={modalProps?.size ?? "lg"} fullWidth onClose={closeModal} className="mf-template-scope">
				<DialogTitle className="mf-pt-[24px] mf-font-bold">{modalProps?.title}</DialogTitle>
				<IconButton
					aria-label="close"
					onClick={closeModal}
					sx={(theme) => ({
						position: 'absolute',
						right: 25,
						top: 25,
						color: theme.palette.grey[500],
					})}
				>
					<img  src={CloseIcon} alt="close icon"/>
				</IconButton>
				<DialogContent>
					{modal}
				</DialogContent>

			</BootstrapDialog>
			{children}
		</ModalContext.Provider>
		</ThemeProvider>
	);
};

export const useModal = () => useContext(ModalContext);

export default ModalProvider;
