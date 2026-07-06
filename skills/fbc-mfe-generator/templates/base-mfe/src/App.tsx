import { APP_PATH, ROUTES } from '@core/constants/routes';
import {
  handleSubscribeToGlobalAuthenticationChange,
  handleSubscribeToGlobalLanguageChange,
  handleSubscribeToGlobalTenantAndCountryChange
} from '@infrastructure/services/globalStateService';
import store, { persistor } from '@infrastructure/store/store';
import { AppLayout } from '@shared/components/layouts/AppLayout';
import '@shared/i18n/i18n';
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import singleSpaReact from 'single-spa-react';
import { ErrorProvider } from './context/ErrorContext';
import './styles/globals.css';
import { HomePage } from '@features/home/HomePage';

const App = () => {
  useEffect(() => {
    const unsubAuth = handleSubscribeToGlobalAuthenticationChange();
    const unsubLang = handleSubscribeToGlobalLanguageChange();
    const unsubTenant = handleSubscribeToGlobalTenantAndCountryChange();

    return () => {
      try { if (typeof unsubAuth === 'function') unsubAuth(); } catch (e) { console.error(e); }
      try { if (typeof unsubLang === 'function') unsubLang(); } catch (e) { console.error(e); }
      try { if (typeof unsubTenant === 'function') unsubTenant(); } catch (e) { console.error(e); }
    };
  }, []);

  return (
    <div className="{{SCOPE_CLASS}}">
      <Provider store={store}>
        <PersistGate loading={<div>Cargando...</div>} persistor={persistor}>
          <BrowserRouter basename={APP_PATH}>
            <ErrorProvider>
              <Routes>
                <Route path="/" element={<Navigate replace to="/home" />} />
                <Route
                  path={ROUTES.HOME}
                  element={
                    <AppLayout>
                      <HomePage />
                    </AppLayout>
                  }
                />
                <Route
                  path="*"
                  element={
                    <AppLayout>
                      <div className="{{CSS_PREFIX}}flex {{CSS_PREFIX}}items-center {{CSS_PREFIX}}justify-center {{CSS_PREFIX}}h-screen">
                        <div className="{{CSS_PREFIX}}text-center">
                          <h1 className="{{CSS_PREFIX}}text-4xl {{CSS_PREFIX}}font-bold {{CSS_PREFIX}}text-secondary-500">404</h1>
                          <p className="{{CSS_PREFIX}}text-neutral-600">Página no encontrada</p>
                        </div>
                      </div>
                    </AppLayout>
                  }
                />
              </Routes>
            </ErrorProvider>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </div>
  );
};

const lifecycles = singleSpaReact({
  React,
  ReactDOMClient: { createRoot },
  rootComponent: App,
  errorBoundary(err, errInfo, props) {
    console.error('Error occurred in {{APP_NAME}} application:', err, errInfo, props);
    return <div className="{{CSS_PREFIX}}p-4 {{CSS_PREFIX}}text-red-600">Error loading {{APP_NAME}} application</div>;
  }
});

export const { bootstrap, mount, unmount } = lifecycles;
export default App;