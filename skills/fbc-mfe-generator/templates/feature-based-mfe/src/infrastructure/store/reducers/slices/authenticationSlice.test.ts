import authReducer, { logInAction, logOutAction } from './authenticationSlice';

describe('authenticationSlice', () => {
  const initialState = { isLogged: false, token: undefined };

  it('returns initial state', () => {
    expect(authReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('logInAction', () => {
    it('sets isLogged to true and stores the token', () => {
      const state = authReducer(initialState, logInAction({ token: 'abc123' }));
      expect(state.isLogged).toBe(true);
      expect(state.token).toBe('abc123');
    });

    it('overwrites a previous token on re-login', () => {
      const loggedState = { isLogged: true, token: 'old-token' };
      const state = authReducer(loggedState, logInAction({ token: 'new-token' }));
      expect(state.token).toBe('new-token');
    });
  });

  describe('logOutAction', () => {
    it('sets isLogged to false and clears the token', () => {
      const loggedState = { isLogged: true, token: 'abc123' };
      const state = authReducer(loggedState, logOutAction());
      expect(state.isLogged).toBe(false);
      expect(state.token).toBeUndefined();
    });

    it('is idempotent when already logged out', () => {
      const state = authReducer(initialState, logOutAction());
      expect(state).toEqual(initialState);
    });
  });
});
