let requestInterceptor: any;
let responseInterceptor: any;

// Mock store BEFORE importing apiClient
jest.mock('@infrastructure/store/store', () => ({
  getState: jest.fn(),
}));

describe('apiClient interceptors', () => {
    beforeEach(() => {
        jest.resetModules(); // reset module registry

        // 1. Mock axios BEFORE loading apiClient
        jest.doMock('axios', () => {
        return {
            create: jest.fn(() => ({
            interceptors: {
                request: {
                use: jest.fn((fulfilled) => {
                    requestInterceptor = fulfilled;
                    return 0;
                }),
                },
                response: {
                use: jest.fn((fulfilled, rejected) => {
                    responseInterceptor = rejected;
                    return 0;
                }),
                },
            },
            })),
        };
        });

        // 2. Now import apiClient AFTER mocks
        require('./apiClient');
    });

    it('adds Authorization header when token exists', async () => {
        const store = require('@infrastructure/store/store');
        store.getState.mockReturnValue({
            authentication: { token: 'ABC123' },
        });

        const config = { headers: {} };

        const result = await requestInterceptor(config);

        expect(result.headers.Authorization).toBe('Bearer ABC123');
    });

    it('does not add Authorization header when token is missing', async () => {
        const store = require('@infrastructure/store/store');
        store.getState.mockReturnValue({
            authentication: { token: null },
        });

        const config = { headers: {} };

        const result = await requestInterceptor(config);

        expect(result.headers.Authorization).toBeUndefined();
    });

    it('throws ValidationError for 400', () => {
        const error = {
            response: { status: 400, data: { message: 'Invalid' } },
        };

        let thrown: any;
        try {
            responseInterceptor(error);
        } catch (err) {
            thrown = err;
        }

        expect(thrown.name).toBe('ValidationError');
        expect(thrown.message).toBe('Invalid');

    });

    it('throws UnauthorizedError for 401', async () => {
        const error = {
            response: { status: 401, data: { message: 'Unauthorized' } },
        };

        let thrown: any;
        try {
            responseInterceptor(error);
        } catch (err) {
            thrown = err;
        }

        expect(thrown.name).toBe('UnauthorizedError');
        expect(thrown.message).toBe('Unauthorized');
    });

    it('throws NotFoundError for 404', async () => {
        const error = {
            response: { status: 404, data: { message: 'Missing' } },
        };
        let thrown: any;
        try {
            responseInterceptor(error);
        } catch (err) {
            thrown = err;
        }

        expect(thrown.name).toBe('NotFoundError');
        expect(thrown.message).toBe('Missing');
    });

    it('throws ApiError when no response but request exists', async () => {
        const error = { request: {}, response: undefined };

        let thrown: any;
        try {
            responseInterceptor(error);
        } catch (err) {
            thrown = err;
        }

        expect(thrown.name).toBe('ApiError');
        expect(thrown.message).toBe('Network error - no response received');
    });

    it('throws ApiError when neither response nor request exists', async () => {
        const error = { request: undefined, response: undefined, message: 'Oops' };

        let thrown: any;
        try {
            responseInterceptor(error);
        } catch (err) {
            thrown = err;
        }

        expect(thrown.name).toBe('ApiError');
        expect(thrown.message).toBe('Request error: Oops');
    });
});
