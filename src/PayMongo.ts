import type { PayMongoConfig, ResolvedConfig } from './types/config';
import { HttpClient } from './utils/http';
import { PayMongoConfigError } from './utils/errors';
import { PaymentIntents } from './resources/PaymentIntents';
import { PaymentMethods } from './resources/PaymentMethods';
import { Payments } from './resources/Payments';
import { Customers } from './resources/Customers';
import { Refunds } from './resources/Refunds';
import { Webhooks } from './resources/Webhooks';
import { CheckoutSessions } from './resources/CheckoutSessions';

/**
 * Default base URL for PayMongo API
 */
const DEFAULT_BASE_URL = 'https://api.paymongo.com/v1';

/**
 * PayMongo API client
 * 
 * A class-based wrapper for the PayMongo REST API that supports
 * both singleton and direct instantiation patterns.
 * 
 * @example
 * ```typescript
 * // Singleton pattern (recommended for most cases)
 * const paymongo = PayMongo.getInstance({
 *   secretKey: process.env.PAYMONGO_SECRET_KEY,
 * });
 * 
 * // Direct instantiation (for multiple instances)
 * const paymongo = new PayMongo({
 *   publicKey: process.env.NEXT_PUBLIC_PAYMONGO_PUBLIC_KEY,
 * });
 * ```
 */
export class PayMongo {
  /**
   * Singleton instance
   */
  private static instance: PayMongo | null = null;

  /**
   * Resolved configuration
   */
  private readonly config: ResolvedConfig;

  /**
   * HTTP client for API requests
   */
  private readonly http: HttpClient;

  /**
   * Payment Intents resource
   * 
   * Use for creating and managing payment intents.
   * Server-side only for creation; client-side can retrieve with client_key.
   */
  public readonly paymentIntents: PaymentIntents;

  /**
   * Payment Methods resource
   * 
   * Use for creating and managing payment methods.
   * Can be used on both client and server side.
   */
  public readonly paymentMethods: PaymentMethods;

  /**
   * Payments resource
   * 
   * Use for retrieving payment records.
   * Server-side only.
   */
  public readonly payments: Payments;

  /**
   * Customers resource
   * 
   * Use for managing customer records and their payment methods.
   * Server-side only.
   */
  public readonly customers: Customers;

  /**
   * Refunds resource
   * 
   * Use for creating and managing refunds.
   * Server-side only.
   */
  public readonly refunds: Refunds;

  /**
   * Webhooks resource
   * 
   * Use for managing webhook endpoints.
   * Server-side only.
   */
  public readonly webhooks: Webhooks;

  /**
   * Checkout Sessions resource
   * 
   * Use for creating hosted checkout pages.
   * Server-side only.
   */
  public readonly checkoutSessions: CheckoutSessions;

  /**
   * Creates a new PayMongo client instance
   * 
   * @param config - Configuration options
   * @throws PayMongoConfigError if neither publicKey nor secretKey is provided
   */
  constructor(config: PayMongoConfig) {
    this.config = this.resolveConfig(config);
    this.http = new HttpClient(this.config);

    // Initialize resource handlers
    this.paymentIntents = new PaymentIntents(this.http);
    this.paymentMethods = new PaymentMethods(this.http);
    this.payments = new Payments(this.http);
    this.customers = new Customers(this.http);
    this.refunds = new Refunds(this.http);
    this.webhooks = new Webhooks(this.http);
    this.checkoutSessions = new CheckoutSessions(this.http);
  }

  /**
   * Gets the singleton instance of PayMongo client
   * 
   * Creates a new instance on first call, returns existing instance on subsequent calls.
   * Pass `forceNew: true` in config to reset the singleton.
   * 
   * @param config - Configuration options
   * @returns The singleton PayMongo instance
   * 
   * @example
   * ```typescript
   * // First call creates the instance
   * const paymongo1 = PayMongo.getInstance({ secretKey: 'sk_test_xxx' });
   * 
   * // Subsequent calls return the same instance
   * const paymongo2 = PayMongo.getInstance({ secretKey: 'sk_test_xxx' });
   * console.log(paymongo1 === paymongo2); // true
   * ```
   */
  static getInstance(config: PayMongoConfig & { forceNew?: boolean }): PayMongo {
    if (!PayMongo.instance || config.forceNew) {
      PayMongo.instance = new PayMongo(config);
    }
    return PayMongo.instance;
  }

  /**
   * Resets the singleton instance
   * 
   * Useful for testing or when you need to reconfigure the client.
   */
  static resetInstance(): void {
    PayMongo.instance = null;
  }

  /**
   * Checks if using a public key (client-side mode)
   */
  get isClientSide(): boolean {
    return this.config.isPublicKey;
  }

  /**
   * Checks if using a secret key (server-side mode)
   */
  get isServerSide(): boolean {
    return !this.config.isPublicKey;
  }

  /**
   * Resolves and validates configuration
   */
  private resolveConfig(config: PayMongoConfig): ResolvedConfig {
    const { publicKey, secretKey, baseUrl } = config;

    if (!publicKey && !secretKey) {
      throw new PayMongoConfigError(
        'PayMongo requires either a publicKey or secretKey. ' +
        'Use publicKey for client-side operations, secretKey for server-side operations.'
      );
    }

    // Prefer secretKey if both are provided (server-side has full access)
    const apiKey = secretKey || publicKey!;
    const isPublicKey = !secretKey && !!publicKey;

    // Validate key format
    if (isPublicKey && !apiKey.startsWith('pk_')) {
      throw new PayMongoConfigError(
        'Invalid public key format. Public keys should start with "pk_test_" or "pk_live_".'
      );
    }

    if (!isPublicKey && !apiKey.startsWith('sk_')) {
      throw new PayMongoConfigError(
        'Invalid secret key format. Secret keys should start with "sk_test_" or "sk_live_".'
      );
    }

    return {
      apiKey,
      baseUrl: baseUrl || DEFAULT_BASE_URL,
      isPublicKey,
    };
  }
}
