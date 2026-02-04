import type { HttpClient } from '../utils/http';

/**
 * Base class for all PayMongo API resources
 * Provides common functionality and access to the HTTP client
 */
export abstract class BaseResource {
  /**
   * HTTP client for making API requests
   */
  protected readonly http: HttpClient;

  /**
   * Base path for this resource (e.g., '/payment_intents')
   */
  protected readonly basePath: string;

  constructor(http: HttpClient, basePath: string) {
    this.http = http;
    this.basePath = basePath;
  }

  /**
   * Builds the full path for a resource endpoint
   */
  protected buildPath(id?: string, suffix?: string): string {
    let path = this.basePath;
    
    if (id) {
      path = `${path}/${id}`;
    }
    
    if (suffix) {
      path = `${path}/${suffix}`;
    }
    
    return path;
  }

  /**
   * Transforms camelCase keys to snake_case for API requests
   */
  protected toSnakeCase(obj: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      
      if (value !== undefined && value !== null) {
        if (typeof value === 'object' && !Array.isArray(value)) {
          result[snakeKey] = this.toSnakeCase(value as Record<string, unknown>);
        } else {
          result[snakeKey] = value;
        }
      }
    }

    return result;
  }

  /**
   * Wraps request body in the standard PayMongo format
   */
  protected wrapBody(attributes: Record<string, unknown>): { data: { attributes: Record<string, unknown> } } {
    return {
      data: {
        attributes: this.toSnakeCase(attributes),
      },
    };
  }
}
