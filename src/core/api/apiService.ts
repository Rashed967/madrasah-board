import { getAuthHeader } from "../auth/authService";


export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

interface ApiError {
  message: string;
  status: number;
}

interface RequestInit extends globalThis.RequestInit {
  method: string;
  headers?: { [key: string]: string };
  body?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_MAIN_URL;
const apiToken = process.env.NEXT_PUBLIC_API_TOKEN;

export const request = async <T>(
  endpoint: string,
  options: RequestInit = { method: 'GET' }
): Promise<ApiResponse<T>> => {
  try {
    const url = `${baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'X-API-Token': apiToken || '',
      ...getAuthHeader(),
      ...options.headers,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized access
        window.location.href = '/login';
        return {
          success: false,
          statusCode: 401,
          message: 'Unauthorized access',
          data: null,
        };
      }

      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        statusCode: response.status,
        message: errorData.message || 'Server error occurred',
        data: errorData.data || null,
      };
    }

    const data = await response.json();

    return {
      success: data.success ?? true,
      statusCode: response.status,
      message: data.message,
      data: data.data || data,
      meta: data.meta
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          statusCode: 408,
          message: 'Request timeout',
          data: null,
        };
      }
      return {
        success: false,
        statusCode: 500,
        message: error.message,
        data: null,
      };
    }
    return {
      success: false,
      statusCode: 500,
      message: 'An unknown error occurred',
      data: null,
    };
  }
};

// GET request
export const get = <T>(endpoint: string): Promise<ApiResponse<T>> => {
  return request<T>(endpoint, { method: 'GET' });
};

// POST request
export const post = <T>(endpoint: string, body: any): Promise<ApiResponse<T>> => {
  return request<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

// PUT request
export const put = <T>(endpoint: string, body: any): Promise<ApiResponse<T>> => {
  return request<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
};

// PATCH request
export const patch = async <T>(endpoint: string, body: any): Promise<ApiResponse<T>> => {

  try {
    const response = await request<T>(endpoint, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// DELETE request
export const del = <T>(endpoint: string): Promise<ApiResponse<T>> => {
  return request<T>(endpoint, { method: 'DELETE' });
};
