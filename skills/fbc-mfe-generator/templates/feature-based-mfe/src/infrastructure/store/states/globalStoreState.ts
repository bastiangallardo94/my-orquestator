/**
 * Global Store State Interface
 * Define la estructura del estado global compartido entre microfrontends
 */

export interface GlobalStoreState {
    authentication: {
        token: string;
        isLogged: boolean;
    };
    configuration: {
        language: string;
        selectedTenant: {
            country: {
                name: string;
            };
            commerce: {
                name: string;
            };
        };
    };
    ui?: {
        sidebarOpen?: boolean;
    };
}
