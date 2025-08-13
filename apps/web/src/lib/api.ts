const BASE_URL = process.env.NEXT_PUBLIC_API_URL + '/api/v1';

interface ApiRequestConfig {
  headers?: Record<string, string>;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
}

interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
}

class ApiError extends Error {
  status: number;
  statusText: string;
  
  constructor(status: number, statusText: string, message?: string) {
    super(message || `API Error: ${status} ${statusText}`);
    this.status = status;
    this.statusText = statusText;
  }
}

// Get auth token from cookies
function getAuthToken(): string | null {
  try {
    // Client-side cookie access
    if (typeof window !== 'undefined') {
      // Try localStorage first
      const token = localStorage.getItem('auth-token');
      if (token) return token;
      
      // Fallback to document.cookie
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'auth-token') {
          return decodeURIComponent(value);
        }
      }
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

// Create request headers
function createHeaders(config?: ApiRequestConfig): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...config?.headers,
  };

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

// Make API request
async function makeRequest<T>(
  url: string,
  options: RequestInit & { config?: ApiRequestConfig } = {}
): Promise<ApiResponse<T>> {
  const { config, ...fetchOptions } = options;
  
  const response = await fetch(`${BASE_URL}${url}`, {
    ...fetchOptions,
    headers: createHeaders(config),
    ...config,
  });

  if (!response.ok) {
    throw new ApiError(response.status, response.statusText);
  }

  const data = await response.json();
  
  return {
    data,
    status: response.status,
    statusText: response.statusText,
  };
}

// API methods
export const api = {
  get: <T = any>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>> =>
    makeRequest<T>(url, { method: 'GET', config }),
  
  post: <T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<ApiResponse<T>> =>
    makeRequest<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      config,
    }),
  
  put: <T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<ApiResponse<T>> =>
    makeRequest<T>(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      config,
    }),
  
  patch: <T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<ApiResponse<T>> =>
    makeRequest<T>(url, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      config,
    }),
  
  delete: <T = any>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>> =>
    makeRequest<T>(url, { method: 'DELETE', config }),
};

export default api;