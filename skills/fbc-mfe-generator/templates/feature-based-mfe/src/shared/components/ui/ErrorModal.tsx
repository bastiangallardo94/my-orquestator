import React from "react";
import { useError } from "../../../context/ErrorContext";
import ErrorIcon from '../../assets/images/cancel-icon-modal.svg';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export const ErrorModal: React.FC = () => {
    const {error, hideError} = useError();

    if (!error.isOpen) return null;

    return (
        <Dialog 
            open={error.isOpen}
            onClose={hideError}
            aria-labelledby="error-dialog-title"
            aria-describedby="error-dialog-description"
        >
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <img src={ErrorIcon} alt="Error" style={{ width: '60px', marginBottom: '16px' }} />
                <DialogTitle id="error-dialog-title">
                    {error.title}
                </DialogTitle>
                <DialogContent id="error-dialog-description">
                    {error.message}
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center' }}>
                    <Button onClick={hideError} variant="outlined">
                        Close
                    </Button>
                </DialogActions>
            </div>
        </Dialog>
    )
}