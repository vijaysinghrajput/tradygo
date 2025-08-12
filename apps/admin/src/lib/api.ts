const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

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
// Note: Since we use httpOnly cookies, this will return null on client-side
// Server-side authentication is handled by middleware and server components
function getAuthToken(): string | null {
  if (typeof window === 'undefined') {
    // Server-side - httpOnly cookies are not accessible here
    return null;
  } else {
    // Client-side - httpOnly cookies are not accessible via document.cookie
    // Authentication state is managed by server components and middleware
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