/**
 * HTTP Client Interfaces
 * Interfaces para clientes HTTP siguiendo principios SOLID
 */

/* eslint-disable no-unused-vars */

export interface HttpResponse<T = unknown> {
    data: T;
    status: number;
    statusText: string;
}

export interface HttpError {
    message: string;
    status?: number;
    statusText?: string;
}

export interface HttpRequestConfig extends RequestInit {
    timeout?: number;
    retries?: number;
}

/**
 * Interfaz base para cliente HTTP
 * Define el contrato básico para cualquier cliente HTTP
 */
export interface IHttpClient {
    get<T>(endpoint: string, config?: HttpRequestConfig): Promise<HttpResponse<T>>;
    post<T>(endpoint: string, data?: unknown, config?: HttpRequestConfig): Promise<HttpResponse<T>>;
    put<T>(endpoint: string, data?: unknown, config?: HttpRequestConfig): Promise<HttpResponse<T>>;
    patch<T>(endpoint: string, data?: unknown, config?: HttpRequestConfig): Promise<HttpResponse<T>>;
    delete<T>(endpoint: string, config?: HttpRequestConfig): Promise<HttpResponse<T>>;
}

/**
 * Interfaz para cliente HTTP configurado
 * Extiende IHttpClient con configuración base
 */
export interface IConfiguredHttpClient extends IHttpClient {
    setBaseURL(baseURL: string): void;
    getBaseURL(): string;
    setDefaultHeaders(headers: Record<string, string>): void;
    setTimeout(timeout: number): void;
}

/**
 * Interfaz para API Client específico
 * Define el contrato para clientes de APIs específicas
 */
export interface IApiClient<T = unknown> {
    getClient(): IHttpClient;
    getBaseEndpoint(): string;
    findAll(): Promise<T[]>;
    findById(id: string | number): Promise<T>;
    create(data: Partial<T>): Promise<T>;
    update(id: string | number, data: Partial<T>): Promise<T>;
    delete(id: string | number): Promise<void>;
}

/* eslint-enable no-unused-vars */
