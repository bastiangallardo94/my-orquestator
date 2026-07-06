/**
 * HTTP Service
 * Servicio base para llamadas HTTP implementando IHttpClient
 */

import { IHttpClient, HttpResponse, HttpError, HttpRequestConfig } from './interfaces/httpClient';

export class HttpService implements IHttpClient {
    private baseURL: string;
    private defaultHeaders: Record<string, string> = {};
    private timeout: number = 10000; // 10 seconds default

    constructor(baseURL: string = '') {
        this.baseURL = baseURL;
    }

    setBaseURL(baseURL: string): void {
        this.baseURL = baseURL;
    }

    getBaseURL(): string {
        return this.baseURL;
    }

    setDefaultHeaders(headers: Record<string, string>): void {
        this.defaultHeaders = { ...this.defaultHeaders, ...headers };
    }

    setTimeout(timeout: number): void {
        this.timeout = timeout;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<HttpResponse<T>> {
        const url = this.baseURL + endpoint;

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...this.defaultHeaders,
                    ...options.headers,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            return {
                data,
                status: response.status,
                statusText: response.statusText,
            };
        } catch (error) {
            const httpError: HttpError = {
                message: error instanceof Error ? error.message : 'Unknown error',
                status: error instanceof Response ? error.status : undefined,
                statusText: error instanceof Response ? error.statusText : undefined,
            };
            throw httpError;
        }
    }

    async get<T>(endpoint: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'GET',
            ...config,
        });
    }

    async post<T>(endpoint: string, data?: unknown, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
            ...config,
        });
    }

    async put<T>(endpoint: string, data?: unknown, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
            ...config,
        });
    }

    async patch<T>(endpoint: string, data?: unknown, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
            ...config,
        });
    }

    async delete<T>(endpoint: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'DELETE',
            ...config,
        });
    }
}
