import type { ResolvedConfig } from '../types/config';
import { PayMongoError, PayMongoNetworkError } from './errors';

/**
 * HTTP methods supported by the client
 */
export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

/**
 * Options for HTTP requests
 */
export interface RequestOptions {
  method: HttpMethod;
  path: string;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
}

/**
 * Fetch-based HTTP client for PayMongo API
 */
export class HttpClient {
  private readonly config: ResolvedConfig;

  constructor(config: ResolvedConfig) {
    this.config = config;
  }

  /**
   * Builds the full URL with query parameters
   */
  private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = new URL(path, this.config.baseUrl);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  /**
   * Creates the Authorization header value using Basic Auth
   */
  private getAuthHeader(): string {
    // PayMongo uses Basic Auth with API key as username and empty password
    const credentials = `${this.config.apiKey}:`;
    
    // Use btoa in browser, Buffer in Node.js
    const encoded = typeof btoa === 'function'
      ? btoa(credentials)
      : Buffer.from(credentials).toString('base64');

    return `Basic ${encoded}`;
  }

  /**
   * Makes an HTTP request to the PayMongo API
   */
  async request<T>(options: RequestOptions): Promise<T> {
    const { method, path, body, params } = options;
    const url = this.buildUrl(path, params);

    const headers: Record<string, string> = {
      'Authorization': this.getAuthHeader(),
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    if (body && (method === 'POST' || method === 'PATCH')) {
      fetchOptions.body = JSON.stringify(body);
    }

    let response: Response;

    try {
      response = await fetch(url, fetchOptions);
    } catch (error) {
      throw new PayMongoNetworkError(
        'Network error while communicating with PayMongo API',
        error as Error
      );
    }

    let responseBody: unknown;

    try {
      const text = await response.text();
      responseBody = text ? JSON.parse(text) : null;
    } catch {
      // If response isn't valid JSON, use empty object
      responseBody = null;
    }

    if (!response.ok) {
      throw PayMongoError.fromResponse(response.status, responseBody);
    }

    return responseBody as T;
  }

  /**
   * GET request
   */
  get<T>(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    return this.request<T>({ method: 'GET', path, params });
  }

  /**
   * POST request
   */
  post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>({ method: 'POST', path, body });
  }

  /**
   * PATCH request
   */
  patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>({ method: 'PATCH', path, body });
  }

  /**
   * DELETE request
   */
  delete<T>(path: string): Promise<T> {
    return this.request<T>({ method: 'DELETE', path });
  }
}
