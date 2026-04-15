/**
 * API Client - Real backend integration
 * Replaces all mock data with real API calls
 */
import type { User } from '../store/useAuthStore';

const getAPIBaseURL = (): string => {
  // Environment-based URL
  if (typeof window !== 'undefined') {
    // Browser environment (Frontend/Mobile)
    return process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:8080';
  }
  // Server environment
  return process.env.BACKEND_URL || 'http://localhost:8080';
};

const BASE_URL = getAPIBaseURL();

export class APIClient {
  private static baseURL = BASE_URL;
  private static currentUser: User | null = null;

  static setBaseURL(url: string) {
    this.baseURL = url;
  }

  static setUser(user: User | null) {
    this.currentUser = user;
  }

  static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add user context headers for authenticated requests (mock auth headers)
    if (this.currentUser) {
      headers['X-User-Id'] = this.currentUser.id;
      headers['X-User-Name'] = this.currentUser.name;
      headers['X-User-Email'] = this.currentUser.email;
      headers['X-User-Role'] = this.currentUser.role;
      if (this.currentUser.farm) {
        headers['X-User-Farm'] = this.currentUser.farm;
      }
    }

    // Add auth headers if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
        errorData.error ||
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  static async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  static async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export default APIClient;
