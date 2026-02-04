/**
 * Standard PayMongo API response wrapper
 */
export interface PayMongoResponse<T> {
  data: T;
}

/**
 * Standard PayMongo API list response wrapper
 */
export interface PayMongoListResponse<T> {
  data: T[];
  has_more: boolean;
}

/**
 * Base resource attributes shared across all PayMongo resources
 */
export interface BaseAttributes {
  created_at: number;
  updated_at: number;
  livemode: boolean;
}

/**
 * Base resource structure for all PayMongo resources
 */
export interface BaseResource<T extends string, A extends BaseAttributes> {
  id: string;
  type: T;
  attributes: A;
}

/**
 * Billing information used across resources
 */
export interface BillingDetails {
  name?: string;
  email?: string;
  phone?: string;
  address?: Address;
}

/**
 * Address structure
 */
export interface Address {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

/**
 * Metadata object for custom data
 */
export type Metadata = Record<string, string | number | boolean | null>;

/**
 * Supported currencies
 */
export type Currency = 'PHP' | 'USD';

/**
 * Pagination parameters for list endpoints
 */
export interface PaginationParams {
  /**
   * A cursor for pagination. This is the ID of the object to start after.
   */
  after?: string;

  /**
   * A cursor for pagination. This is the ID of the object to end before.
   */
  before?: string;

  /**
   * Number of objects to return (1-100)
   * @default 10
   */
  limit?: number;
}
