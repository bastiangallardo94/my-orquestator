import configReducer, { languageChange } from './configSlice';

describe('configSlice', () => {
  const initialState = { language: 'es' };

  it('returns initial state', () => {
    expect(configReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('languageChange', () => {
    it('updates the language', () => {
      const state = configReducer(initialState, languageChange('en'));
      expect(state.language).toBe('en');
    });

    it('overwrites a previous language', () => {
      const state = configReducer({ language: 'en' }, languageChange('zh'));
      expect(state.language).toBe('zh');
    });

    it('sets the same language without error', () => {
      const state = configReducer(initialState, languageChange('es'));
      expect(state.language).toBe('es');
    });
  });
});
