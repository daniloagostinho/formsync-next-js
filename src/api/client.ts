import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_ENDPOINTS, STORAGE_KEYS } from '@/constants';
import { ApiResponse } from '@/types';
import { logger } from '@/utils/logger';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_ENDPOINTS.BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Não enviar token para endpoints de autenticação
        const isAuthEndpoint = config.url?.includes('/auth/') || 
                              (config.url?.includes('/usuarios') && config.method === 'post') ||
                              config.url?.includes('/login') ||
                              config.url?.includes('/registrar');
        
        if (!isAuthEndpoint) {
          // Only access localStorage in the browser
          if (typeof window !== 'undefined') {
            // Try to get token from localStorage first
            let token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
            
            // If no token in localStorage, try to get from cookies
            if (!token) {
              const cookies = document.cookie.split(';');
              const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth-token='));
              if (authCookie) {
                token = authCookie.split('=')[1];
              }
            }
            
            logger.info(`API Request: ${config.method} ${config.url}`, { tokenPresent: !!token }, { url: config.url, method: config.method });
            
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
              logger.info(`Authorization header set for: ${config.url}`, { 
                tokenLength: token.length,
                tokenStart: token.substring(0, 20),
                fullHeaders: config.headers
              }, { url: config.url, method: config.method });
            } else {
              logger.warn(`No token found for protected endpoint: ${config.url}`, null, { url: config.url, method: config.method });
            }
          } else {
            logger.info(`Running on server, no token available for: ${config.url}`, null, { url: config.url, method: config.method });
          }
        } else {
          logger.info(`Auth endpoint, skipping token for: ${config.url}`, null, { url: config.url, method: config.method });
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        logger.info(`API Response: ${response.status} ${response.config.url}`, null, { 
          url: response.config.url, 
          method: response.config.method, 
          status: response.status 
        });
        return response;
      },
      async (error) => {
        logger.error(`API Error: ${error.response?.status || 'Network'} ${error.config?.url}`, {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        }, { 
          url: error.config?.url, 
          method: error.config?.method, 
          status: error.response?.status 
        });
        
        if (error.response?.status === 401) {
          logger.warn('401 Unauthorized - clearing tokens and redirecting to login', null, { 
            url: error.config?.url, 
            method: error.config?.method 
          });
          // Handle token expiration
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          window.location.href = '/login';
        } else if (error.response?.status === 403) {
          logger.error(`403 Forbidden - access denied for: ${error.config?.url}`, {
            url: error.config?.url,
            method: error.config?.method,
            responseData: error.response?.data
          }, { 
            url: error.config?.url, 
            method: error.config?.method, 
            status: 403 
          });
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();







