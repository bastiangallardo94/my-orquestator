import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import localInspectionStore, { persistor } from './localStore';
import rootReducer from './reducers/rootReducer';

jest.mock('@reduxjs/toolkit', () => ({
  configureStore: jest.fn(() => ({ dispatch: jest.fn(), getState: jest.fn() })),
}));

jest.mock('redux-persist', () => ({
  persistReducer: jest.fn((_config, reducer) => reducer),
  persistStore: jest.fn(() => ({ flush: jest.fn() })),
}));

jest.mock('redux-persist/lib/storage', () => ({}));

jest.mock('./reducers/rootReducer', () => jest.fn());

describe('localStore', () => {
  it('configures store with persisted reducer', () => {
    expect(persistReducer).toHaveBeenCalledWith(
      {
        key: 'root',
        storage,
        whitelist: ['authentication', 'config', 'inspection', 'purchaseOrder', "inspector"],
      },
      rootReducer
    );

    expect(configureStore).toHaveBeenCalledWith(
      expect.objectContaining({
        reducer: expect.any(Function),
        devTools: true,
      })
    );
  });

  it('creates persistor with the store', () => {
    expect(persistStore).toHaveBeenCalledWith(localInspectionStore);
    expect(persistor).toBeDefined();
  });

  it('exports a valid store', () => {
    expect(localInspectionStore).toHaveProperty('dispatch');
    expect(localInspectionStore).toHaveProperty('getState');
  });
});
