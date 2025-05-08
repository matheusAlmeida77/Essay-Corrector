import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    if (error.response) {
      console.error("Resposta de erro do servidor:", error.response.data);
    }
    return Promise.reject(error);
  }
);

import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number = 500, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const API_ENDPOINTS = {
  users: `${API_BASE_URL}/user`,
  user: (id: string) => `${API_BASE_URL}/user/${id}`,
  userLogin: `${API_BASE_URL}/auth/login`,
  userRegister: `${API_BASE_URL}/auth/register`,
  essays: `${API_BASE_URL}/essay`,
  essayById: (id: string) => `${API_BASE_URL}/essay/${id}`,
  essayByTargetId: (targetId: string) =>
    `${API_BASE_URL}/essay/target/${targetId}`,
};

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

const REQUEST_TIMEOUT = 30000;

/**
 * Simplified fetch function with timeout and error handling
 */
async function apiFetch<T = any>(
  url: string,
  options: RequestInit & { timeout?: number } = {}
): Promise<T> {
  const { timeout = REQUEST_TIMEOUT, headers = {}, ...rest } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const token = localStorage.getItem("auth_token");

    const requestHeaders = {
      ...DEFAULT_HEADERS,
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(url, {
      ...rest,
      headers: requestHeaders,
      signal: controller.signal,
    });

    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new ApiError(
        data.message || `Request failed with status ${response.status}`,
        response.status,
        data
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("Request timeout", 408);
    }

    throw new ApiError(
      error instanceof Error ? error.message : "Unknown error occurred",
      500
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

const invalidateQueries = (queryKey: string | string[], id?: string) => {
  if (id) {
    queryClient.invalidateQueries({ queryKey: [queryKey, id] });
  } else {
    queryClient.invalidateQueries({ queryKey: [queryKey] });
  }
};

export const api = {
  getAll: async (entityType: "user" | "admin") => {
    const url = API_ENDPOINTS.users;

    try {
      const response = await apiFetch(url);
      const items = response[`${entityType}s`] || response;

      if (!items || !Array.isArray(items)) {
        console.error("Invalid response format from API");
        return [];
      }

      return items;
    } catch (error) {
      console.error(`Error fetching ${entityType}s:`, error);
      throw error;
    }
  },

  getById: async (entityType: "user" | "employee" | "user", id: string) => {
    try {
      if (!id) {
        throw new Error("Invalid ID format");
      }

      const url = API_ENDPOINTS.user(id);

      const response = await apiFetch(url);
      const item = response[entityType] || response;

      if (!item || !(item._id || item.id)) {
        throw new Error(`${entityType} not found or invalid data format`);
      }

      return item;
    } catch (error) {
      console.error(`Error fetching ${entityType} with ID ${id}:`, error);
      throw error;
    }
  },

  create: async (entityType: "user" | "admin", data: any) => {
    const url = API_ENDPOINTS.users;
    try {
      const response = await apiFetch(url, {
        method: "POST",
        body: JSON.stringify(data),
      });

      invalidateQueries(`${entityType}s`);
      invalidateQueries("management");

      return response;
    } catch (error) {
      console.error(`Error creating ${entityType}:`, error);
      throw error;
    }
  },

  update: async (entityType: "user" | "admin", id: string, updates: any) => {
    try {
      if (!id) {
        throw new Error("Invalid ID format");
      }

      const url = API_ENDPOINTS.user(id);

      const response = await apiFetch(url, {
        method: "PUT",
        body: JSON.stringify(updates),
      });

      invalidateQueries(`${entityType}`, id);
      invalidateQueries(`${entityType}s`);
      invalidateQueries("management");

      return response;
    } catch (error) {
      console.error(`Error updating ${entityType} with ID ${id}:`, error);
      throw error;
    }
  },

  delete: async (entityType: "user" | "employee" | "user", id: string) => {
    try {
      if (!id) {
        throw new Error("Invalid ID format");
      }

      const url = API_ENDPOINTS.user(id);

      await apiFetch(url, { method: "DELETE" });

      invalidateQueries(`${entityType}s`);
      invalidateQueries("management");

      return true;
    } catch (error) {
      console.error(`Error deleting ${entityType} with ID ${id}:`, error);
      throw error;
    }
  },

  getHistorical: async () => {
    const url = API_ENDPOINTS.essays;
    try {
      const response = await apiFetch(url);
      return response;
    } catch (error) {
      console.error(`Error fetching historical:`, error);
      throw error;
    }
  },

  getEssayById: async (id: string) => {
    try {
      if (!id) {
        throw new Error("Invalid ID format");
      }

      const url = API_ENDPOINTS.essayById(id);

      const response = await apiFetch(url);

      return response;
    } catch (error) {
      console.error(`Error fetching essay with ID ${id}:`, error);
      throw error;
    }
  },

  getEssayByTargetId: async (targetId: string) => {
    try {
      if (!targetId) throw new Error("Invalid target ID");

      const url = API_ENDPOINTS.essayByTargetId(targetId);
      const response = await apiFetch(url);
      return response;
    } catch (error) {
      console.error(`Error fetching essay for target ${targetId}:`, error);
      throw error;
    }
  },

  createEssay: async (entry: { description: string; targetId: string }) => {
    try {
      const url = API_ENDPOINTS.essays;
      const response = await apiFetch(url, {
        method: "POST",
        body: JSON.stringify(entry),
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response;
    } catch (error) {
      console.error("Error creating essay:", error);
      throw error;
    }
  },

  updateEssay: async (id: string, updates: any) => {
    try {
      if (!id) {
        throw new Error("Invalid ID format");
      }

      const url = API_ENDPOINTS.essayById(id);

      const response = await apiFetch(url, {
        method: "PUT",
        body: JSON.stringify(updates),
        headers: {
          "Content-Type": "application/json",
        },
      });

      invalidateQueries(id);

      return response;
    } catch (error) {
      console.error(`Error updating essay for user with ID ${id}:`, error);
      throw error;
    }
  },

  deletEessay: async (id: string) => {
    try {
      if (!id) throw new Error("Invalid ID format");

      const url = API_ENDPOINTS.essayById(id);

      const response = await apiFetch(url, {
        method: "DELETE",
      });

      invalidateQueries(id);

      return response;
    } catch (error) {
      console.error(`Error deleting essay with ID ${id}:`, error);
      throw error;
    }
  },

  auth: {
    login: async (credentials: { email: string; password: string }) => {
      return await apiFetch(API_ENDPOINTS.userLogin, {
        method: "POST",
        body: JSON.stringify(credentials),
      });
    },

    register: async (userData: {
      name: string;
      email: string;
      password: string;
      role: string;
    }) => {
      return await apiFetch(API_ENDPOINTS.userRegister, {
        method: "POST",
        body: JSON.stringify(userData),
      });
    },
  },

  invalidateQueries,
};
