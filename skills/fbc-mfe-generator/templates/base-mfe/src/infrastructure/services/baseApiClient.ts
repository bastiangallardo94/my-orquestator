/**
 * Base API Client
 * Clase base abstracta para clientes de API siguiendo principios SOLID
 */

import { IHttpClient, IApiClient } from './interfaces/httpClient';

export abstract class BaseApiClient<T> implements IApiClient<T> {
    protected httpClient: IHttpClient;
    protected baseEndpoint: string;

    constructor(httpClient: IHttpClient, baseEndpoint: string) {
        this.httpClient = httpClient;
        this.baseEndpoint = baseEndpoint;
    }

    getClient(): IHttpClient {
        return this.httpClient;
    }

    getBaseEndpoint(): string {
        return this.baseEndpoint;
    }

    /**
     * Obtiene todos los recursos
     */
    async findAll(): Promise<T[]> {
        const response = await this.httpClient.get<T[]>(this.baseEndpoint);
        return response.data;
    }

    /**
     * Obtiene un recurso por ID
     */
    async findById(id: string | number): Promise<T> {
        const response = await this.httpClient.get<T>(`${this.baseEndpoint}/${id}`);
        return response.data;
    }

    /**
     * Crea un nuevo recurso
     */
    async create(data: Partial<T>): Promise<T> {
        const response = await this.httpClient.post<T>(this.baseEndpoint, data);
        return response.data;
    }

    /**
     * Actualiza un recurso existente (reemplaza completamente)
     */
    async update(id: string | number, data: Partial<T>): Promise<T> {
        const response = await this.httpClient.put<T>(`${this.baseEndpoint}/${id}`, data);
        return response.data;
    }

    /**
     * Actualiza parcialmente un recurso existente
     */
    async patch(id: string | number, data: Partial<T>): Promise<T> {
        const response = await this.httpClient.patch<T>(`${this.baseEndpoint}/${id}`, data);
        return response.data;
    }

    /**
     * Elimina un recurso
     */
    async delete(id: string | number): Promise<void> {
        await this.httpClient.delete(`${this.baseEndpoint}/${id}`);
    }
}
