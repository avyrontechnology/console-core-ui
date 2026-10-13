import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig } from "axios";

import type { ApiResponse } from "@/types/api";
import { logger } from "./logger";

export class ApiError extends Error {
  status?: number;
  detail?: string;

  constructor(message: string, status?: number, detail?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

interface ApiClientOptions {
  /** Bearer token provider (wired to the NextAuth session, no storage here). */
  getToken?: () => string | null;
  onUnauthorized?: () => void;
}

/** Single typed HTTP client. Auth lives in the session layer, never here. */
export class ApiClient {
  private client: AxiosInstance;
  private getToken: () => string | null;
  private onUnauthorized: () => void;

  constructor(options: ApiClientOptions = {}) {
    this.getToken = options.getToken ?? (() => null);
    this.onUnauthorized = options.onUnauthorized ?? (() => undefined);
    this.client = axios.create({ timeout: 30000 });
    this.client.interceptors.request.use((config) => {
      const token = this.getToken();
      if (token) config.headers.set("Authorization", `Bearer ${token}`);
      return config;
    });
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<{ detail?: string; message?: string }>) => {
        const status = error.response?.status;
        const payload = error.response?.data;
        const message = payload?.detail ?? payload?.message ?? "Something went wrong";
        if (status === 401) this.onUnauthorized();
        logger.warn("API request failed", { status });
        throw new ApiError(message, status);
      },
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await this.client.get<ApiResponse<T>>(url, config);
    return data.data;
  }

  async post<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await this.client.post<ApiResponse<T>>(url, body, config);
    return data.data;
  }

  async patch<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await this.client.patch<ApiResponse<T>>(url, body, config);
    return data.data;
  }

  async put<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await this.client.put<ApiResponse<T>>(url, body, config);
    return data.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await this.client.delete<ApiResponse<T>>(url, config);
    return data.data;
  }
}
