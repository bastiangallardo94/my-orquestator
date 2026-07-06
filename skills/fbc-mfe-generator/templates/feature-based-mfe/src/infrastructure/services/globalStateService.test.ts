import {
  handleSubscribeToGlobalAuthenticationChange,
  handleSubscribeToGlobalLanguageChange,
  handleSubscribeToGlobalTenantAndCountryChange,
  handleSubscribeToGlobalSidebarChange,
} from './globalStateService';

import globalStore from '@infrastructure/store/globalStore';
import localStore from '@infrastructure/store/store';
import { logInAction } from '@infrastructure/store/reducers/slices/authenticationSlice';
import { languageChange } from '@infrastructure/store/reducers/slices/configSlice';
import { setTenantSelected } from '@infrastructure/store/reducers/slices/tenantSlice';

jest.mock('@infrastructure/store/globalStore', () => ({
  SubscribeToGlobalState: jest.fn(),
}));

jest.mock('@infrastructure/store/store', () => ({
  getState: jest.fn(),
  dispatch: jest.fn(),
}));

describe('globalStateService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('subscribes to authentication changes and dispatches logInAction when token differs', () => {
    (localStore.getState as jest.Mock).mockReturnValue({ authentication: { token: 'old-token' } });

    let callback: any;
    (globalStore.SubscribeToGlobalState as jest.Mock).mockImplementation((_appName, cb) => {
      callback = cb;
    });

    handleSubscribeToGlobalAuthenticationChange();

    // simulate global state change
    callback({ authentication: { token: 'new-token' } });

    expect(localStore.dispatch).toHaveBeenCalledWith(logInAction({ token: 'new-token' }));
  });

  it('subscribes to language changes and dispatches languageChange + event when language differs', () => {
    (localStore.getState as jest.Mock).mockReturnValue({ config: { language: 'en' } });

    let callback: any;
    (globalStore.SubscribeToGlobalState as jest.Mock).mockImplementation((_appName, cb) => {
      callback = cb;
    });

    const dispatchSpy = jest.spyOn(window, 'dispatchEvent');

    handleSubscribeToGlobalLanguageChange();

    callback({ configuration: { language: 'es' } });

    expect(localStore.dispatch).toHaveBeenCalledWith(languageChange('es'));
    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(CustomEvent));

    const event = (dispatchSpy.mock.calls[0][0] as CustomEvent);
    expect(event.type).toBe('portal-language-changed');
    expect(event.detail).toEqual({ language: 'es' });
  });

  it('subscribes to tenant changes and dispatches setTenantSelected when tenant exists', () => {
    (localStore.getState as jest.Mock).mockReturnValue({});

    let callback: any;
    (globalStore.SubscribeToGlobalState as jest.Mock).mockImplementation((_appName, cb) => {
      callback = cb;
    });

    handleSubscribeToGlobalTenantAndCountryChange();
    const tenant = {
        country: { name: 'CL'},
        commerce: {name: 'SOD'}
    }
    callback({ configuration: { selectedTenant: tenant } });

    expect(localStore.dispatch).toHaveBeenCalledWith(setTenantSelected(tenant));
  });

  it('subscribes to sidebar changes and dispatches correct events', () => {
    let callback: any;
    (globalStore.SubscribeToGlobalState as jest.Mock).mockImplementation((_appName, cb) => {
      callback = cb;
    });

    const dispatchSpy = jest.spyOn(window, 'dispatchEvent');

    handleSubscribeToGlobalSidebarChange();

    // sidebar open
    callback({ ui: { sidebarOpen: true } });
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'sidebar-opened', detail: { requestOpen: true } })
    );

    // sidebar closed
    callback({ ui: { sidebarOpen: false } });
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'sidebar-closed', detail: { requestOpen: false } })
    );
  });
});
