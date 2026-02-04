/**
 * PayMongo API error detail from the response
 */
export interface PayMongoErrorDetail {
  code: string;
  detail: string;
  source?: {
    pointer?: string;
    attribute?: string;
  };
}

/**
 * PayMongo API error response structure
 */
export interface PayMongoErrorResponse {
  errors: PayMongoErrorDetail[];
}

/**
 * Custom error class for PayMongo API errors
 */
export class PayMongoError extends Error {
  /**
   * HTTP status code from the response
   */
  public readonly status: number;

  /**
   * Error code from PayMongo (e.g., 'parameter_invalid', 'resource_not_found')
   */
  public readonly code: string;

  /**
   * Array of all error details from the response
   */
  public readonly errors: PayMongoErrorDetail[];

  /**
   * The original response body
   */
  public readonly rawResponse: unknown;

  constructor(
    message: string,
    status: number,
    code: string,
    errors: PayMongoErrorDetail[],
    rawResponse: unknown
  ) {
    super(message);
    this.name = 'PayMongoError';
    this.status = status;
    this.code = code;
    this.errors = errors;
    this.rawResponse = rawResponse;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    const ErrorConstructor = Error as typeof Error & {
      captureStackTrace?: (target: object, constructor: Function) => void;
    };
    if (ErrorConstructor.captureStackTrace) {
      ErrorConstructor.captureStackTrace(this, PayMongoError);
    }
  }

  /**
   * Creates a PayMongoError from an API response
   */
  static fromResponse(status: number, body: unknown): PayMongoError {
    const errorResponse = body as PayMongoErrorResponse;
    const errors = errorResponse?.errors ?? [];
    const firstError = errors[0];

    const message = firstError?.detail ?? `PayMongo API error (status ${status})`;
    const code = firstError?.code ?? 'unknown_error';

    return new PayMongoError(message, status, code, errors, body);
  }
}

/**
 * Error thrown when the SDK is misconfigured
 */
export class PayMongoConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PayMongoConfigError';

    const ErrorConstructor = Error as typeof Error & {
      captureStackTrace?: (target: object, constructor: Function) => void;
    };
    if (ErrorConstructor.captureStackTrace) {
      ErrorConstructor.captureStackTrace(this, PayMongoConfigError);
    }
  }
}

/**
 * Error thrown for network-related issues
 */
export class PayMongoNetworkError extends Error {
  public readonly originalError: Error;

  constructor(message: string, originalError: Error) {
    super(message);
    this.name = 'PayMongoNetworkError';
    this.originalError = originalError;

    const ErrorConstructor = Error as typeof Error & {
      captureStackTrace?: (target: object, constructor: Function) => void;
    };
    if (ErrorConstructor.captureStackTrace) {
      ErrorConstructor.captureStackTrace(this, PayMongoNetworkError);
    }
  }
}
