/**
 * Configuration options for the PayMongo client
 */
export interface PayMongoConfig {
  /**
   * Public API key (pk_test_* or pk_live_*)
   * Used for client-side operations like creating payment methods
   */
  publicKey?: string;

  /**
   * Secret API key (sk_test_* or sk_live_*)
   * Used for server-side operations with full API access
   * Never expose this key on the client-side
   */
  secretKey?: string;

  /**
   * Base URL for the PayMongo API
   * @default 'https://api.paymongo.com/v1'
   */
  baseUrl?: string;
}

/**
 * Internal resolved configuration
 */
export interface ResolvedConfig {
  apiKey: string;
  baseUrl: string;
  isPublicKey: boolean;
}
