import tenantReducer, { setTenantSelected } from './tenantSlice';

describe('tenantSlice', () => {
  const initialState = {
    selectedTenant: { country: { name: '' }, commerce: { name: '' } },
  };

  it('returns initial state', () => {
    expect(tenantReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('setTenantSelected', () => {
    it('updates the selected tenant', () => {
      const tenant = { country: { name: 'Chile' }, commerce: { name: 'SOD' } };
      const state = tenantReducer(initialState, setTenantSelected(tenant));
      expect(state.selectedTenant).toEqual(tenant);
    });

    it('replaces the previous tenant completely', () => {
      const firstTenant = { country: { name: 'Chile' }, commerce: { name: 'SOD' } };
      const secondTenant = { country: { name: 'Peru' }, commerce: { name: 'SO' } };
      const stateAfterFirst = tenantReducer(initialState, setTenantSelected(firstTenant));
      const stateAfterSecond = tenantReducer(stateAfterFirst, setTenantSelected(secondTenant));
      expect(stateAfterSecond.selectedTenant).toEqual(secondTenant);
    });

    it('supports partial tenant shapes', () => {
      const tenant = { country: { name: 'Mexico' } };
      const state = tenantReducer(initialState, setTenantSelected(tenant));
      expect(state.selectedTenant.country?.name).toBe('Mexico');
    });
  });
});
