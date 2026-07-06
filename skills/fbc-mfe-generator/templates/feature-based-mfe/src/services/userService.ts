import { API_ENDPOINTS } from '@shared/constants/apiEndpoints';
import { AxiosResponse } from 'axios';
import { UserInformation } from '../types/userInformation';
import apiClient from './apiClient';

interface RefreshSubscriber {
  resolve: (value: UserInformation) => void;
  reject: (error: any) => void;
}

/**
 * userService
 *
 * Singleton service responsible for fetching and caching user information from the BFF.
 *
 * Key Features:
 * - Fetches `UserInformation` from the backend via `apiClient` and `API_ENDPOINTS.USER_INFORMATION`.
 * - Implements caching with a default TTL (5 minutes) to avoid repeated calls to the BFF.
 * - Deduplicates concurrent requests: if a request is already in flight, subsequent calls
 *   return the same promise or subscribe to the refresh result.
 * - Provides methods to:
 *    • `getUserInformation`: fetch user info with optional force refresh or custom TTL.
 *    • `clearCache`: reset cache and pending promises.
 *    • `getCacheState`: inspect current cache metadata (useful for debugging).
 *    • `isCacheValid`: check if cached data is still valid.
 * - Handles error scenarios gracefully, including clearing cache on 401 Unauthorized responses.
 *
 * This service ensures efficient and consistent access to user information across the application,
 * minimizing redundant API calls and improving performance.
 */
class UserService {
  private userInfoCache: UserInformation | null = null;
  private userInfoPromise: Promise<UserInformation> | null = null;
  private cacheTimestamp: number = 0;
  private readonly DEFAULT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private isRefreshing: boolean = false;
  private refreshSubscribers: RefreshSubscriber[] = [];

  /**
   * Get user information with caching and request deduplication
   * @param forceRefresh - Skip cache and force fresh data
   * @param customTtl - Custom cache TTL in milliseconds
   * @returns Promise with user information data
   */
  async getUserInformation(
    forceRefresh: boolean = false,
    customTtl?: number
  ): Promise<UserInformation> {
    const now = Date.now();
    const ttl = customTtl || this.DEFAULT_CACHE_TTL;

    // Return cached data if still valid and not forcing refresh
    if (!forceRefresh &&
      this.userInfoCache &&
      (now - this.cacheTimestamp) < ttl) {
      return this.userInfoCache;
    }

    // If a request is already in flight, return the existing promise
    if (this.userInfoPromise && !forceRefresh) {
      return this.userInfoPromise;
    }

    // If we're already refreshing, add to subscribers and wait
    if (this.isRefreshing && !forceRefresh) {
      return new Promise<UserInformation>((resolve, reject) => {
        this.refreshSubscribers.push({ resolve, reject });
      });
    }

    // Make the API call
    this.isRefreshing = true;

    this.userInfoPromise = this.fetchUserInfo()
      .then((data: UserInformation) => {
        this.userInfoCache = data;
        this.cacheTimestamp = now;
        this.notifySubscribers(data, null);
        return data;
      })
      .catch((error: any) => {
        this.notifySubscribers(null, error);
        throw error;
      })
      .finally(() => {
        this.userInfoPromise = null;
        this.isRefreshing = false;
        this.refreshSubscribers = [];
      });

    return this.userInfoPromise;
  }

  /**
   * Internal method to fetch user info from API
   */
  private async fetchUserInfo(): Promise<UserInformation> {
    try {
      return apiClient.get<UserInformation>(`${API_ENDPOINTS.USER_INFORMATION}`)
        .then((response: AxiosResponse<UserInformation>) => response.data);
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.status === 401) {
        this.clearCache();
      }
      throw error;
    }
  }

  /**
   * Notify all subscribers of the refresh result
   */
  private notifySubscribers(data: UserInformation | null, error: any | null): void {
    this.refreshSubscribers.forEach(subscriber => {
      if (error) {
        subscriber.reject(error);
      } else if (data) {
        subscriber.resolve(data);
      }
    });
  }

  /**
   * Clear the cache and any pending promises
   */
  clearCache(): void {
    this.userInfoCache = null;
    this.userInfoPromise = null;
    this.cacheTimestamp = 0;
    this.isRefreshing = false;
    this.refreshSubscribers = [];
  }

  /**
   * Get current cache state (useful for debugging)
   */
  getCacheState(): {
    hasCache: boolean;
    timestamp: number;
    age: number | null;
    isRefreshing: boolean;
    subscribers: number;
  } {
    return {
      hasCache: !!this.userInfoCache,
      timestamp: this.cacheTimestamp,
      age: this.userInfoCache ? Date.now() - this.cacheTimestamp : null,
      isRefreshing: this.isRefreshing,
      subscribers: this.refreshSubscribers.length
    };
  }

  /**
   * Check if cache is valid (not expired)
   */
  isCacheValid(ttl?: number): boolean {
    const cacheTtl = ttl || this.DEFAULT_CACHE_TTL;
    return !!this.userInfoCache &&
      (Date.now() - this.cacheTimestamp) < cacheTtl;
  }
}

// Export a singleton instance
const userService = new UserService();
export default userService;
