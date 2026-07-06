import { useAppSelector } from '@infrastructure/store/hooks/useStore';
import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
    children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const isLogged = useAppSelector((state) => state.authentication.isLogged);

    if (!isLogged) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};