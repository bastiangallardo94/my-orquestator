import {AuthConfigDefault} from '@core/config/authConfig';
import {USER_ROLES} from '@core/constants/roles';
import {APP_PATH} from '@core/constants/routes';
import {HomePage} from '@features/home/pages/HomePage';
import {
  handleSubscribeToGlobalAuthenticationChange,
  handleSubscribeToGlobalLanguageChange,
  handleSubscribeToGlobalTenantAndCountryChange
} from '@infrastructure/services/globalStateService';
import store, {persistor} from '@infrastructure/store/store';
import {PrivateRoute} from '@shared/components/auth/PrivateRoute';
import {ProtectedRoute} from '@shared/components/auth/ProtectedRoute';
import {AppLayout} from '@shared/components/layouts/AppLayout';
import {ErrorModal} from '@shared/components/ui/ErrorModal';
import '@shared/i18n/i18n';
import React, {useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {Provider, useSelector} from 'react-redux';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import {PersistGate} from 'redux-persist/integration/react';
import {mountRootParcel} from 'single-spa';
import singleSpaReact from 'single-spa-react';
import Parcel from 'single-spa-react/parcel';
import {ErrorProvider} from './context/ErrorContext';
import './styles/globals.css';
import {MuiTheme} from '@shared/components/ui/MuiTheme';
import {ThemeProvider} from '@mui/material';
import ModalProvider from './context/Modal/modal.provider';
import ToastProvider from './context/Toast/toast.provider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import useUser from "@shared/hooks/useUser";

type ParcelLifecycles = {
  bootstrap: () => Promise<void>;
  mount: (props: any) => Promise<void>;
  unmount: (props: any) => Promise<void>;
};

/**
 * AppContent Component
 * 
 * Componente principal de la aplicación que maneja las rutas y la estructura.
 * Se renderiza dentro del Provider de Redux y PersistGate.
 */
function AppContent() {
  const {user, tenant} = useUser();

  useEffect(() => {
    // Subscribe to global state changes
    const unsubscribeAuth = handleSubscribeToGlobalAuthenticationChange();
    const unsubscribeLang = handleSubscribeToGlobalLanguageChange();
    const unsubscribeTenant = handleSubscribeToGlobalTenantAndCountryChange();

    return () => {
      unsubscribeAuth();
      unsubscribeLang();
      unsubscribeTenant();
    };
  }, []);

  return (
    <ThemeProvider theme={MuiTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ErrorProvider>
          <ModalProvider>
            <ToastProvider>
              <BrowserRouter basename={APP_PATH}>
                <ErrorModal/>
                <Routes>
                  {/* Public Route - Authentication */}
                  <Route
                    path="/auth"
                    element={
                      <Parcel
                        config={
                          () =>
                            System.import<ParcelLifecycles>('authentication')
                        }
                        authConfig={AuthConfigDefault}
                        mountParcel={mountRootParcel}
                      />
                    }
                  />

                  {/* Protected Routes - Require Authentication */}
                  <Route
                    element={
                      <PrivateRoute>
                        <AppLayout/>
                      </PrivateRoute>
                    }
                  >
                    {/* Home Page - Main Landing */}
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute
                          requiredRoles={[
                            USER_ROLES.ADMIN,
                            USER_ROLES.MAINTAINER,
                            USER_ROLES.VIEWER,
                          ]}
                        >
                          <HomePage/>
                        </ProtectedRoute>
                      }
                    />

                    {/* 
                      TODO: Add more routes here as you develop new features
                      Example:
                      
                      <Route
                        path="/example"
                        element={
                          <ProtectedRoute requiredRoles={[USER_ROLES.ADMIN]}>
                            <ExamplePage />
                          </ProtectedRoute>
                        }
                      />
                    */}
                  </Route>

                  {/* Fallback - Redirect to Home */}
                  <Route path="*" element={<Navigate to="/" replace/>}/>
                </Routes>
              </BrowserRouter>
            </ToastProvider>
          </ModalProvider>
        </ErrorProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

/**
 * App Component
 * 
 * Root component que envuelve la aplicación con Provider y PersistGate.
 */
function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent/>
      </PersistGate>
    </Provider>
  );
}

/**
 * Lifecycle Configuration for single-spa
 * 
 * Define bootstrap, mount, and unmount functions for the microfrontend.
 */
const lifecycles = singleSpaReact({
  React,
  ReactDOM: {createRoot},
  rootComponent: App,
  errorBoundary(err, info, props) {
    console.error('Error occurred in {{APP_NAME}} application:', err);
    return <div className="{{CSS_PREFIX}}-p-4 {{CSS_PREFIX}}-text-red-600">Error loading {{APP_NAME}} application</div>;
  },
});

export const {bootstrap, mount, unmount} = lifecycles;
