import type { BaseAttributes, BaseResource, Metadata, PaginationParams } from './common';
import type { PaymentMethod } from './payment-method';

/**
 * Customer attributes
 */
export interface CustomerAttributes extends BaseAttributes {
  default_device?: string | null;
  default_payment_method_id?: string | null;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  metadata?: Metadata | null;
}

/**
 * Customer resource
 */
export type Customer = BaseResource<'customer', CustomerAttributes>;

/**
 * Parameters for creating a customer
 */
export interface CreateCustomerParams {
  /**
   * Customer's email address
   */
  email?: string;

  /**
   * Customer's first name
   */
  firstName?: string;

  /**
   * Customer's last name
   */
  lastName?: string;

  /**
   * Customer's phone number
   */
  phone?: string;

  /**
   * ID of the default payment method
   */
  defaultPaymentMethodId?: string;

  /**
   * Custom metadata
   */
  metadata?: Metadata;
}

/**
 * Parameters for updating a customer
 */
export interface UpdateCustomerParams {
  /**
   * Customer's email address
   */
  email?: string;

  /**
   * Customer's first name
   */
  firstName?: string;

  /**
   * Customer's last name
   */
  lastName?: string;

  /**
   * Customer's phone number
   */
  phone?: string;

  /**
   * ID of the default payment method
   */
  defaultPaymentMethodId?: string;

  /**
   * ID of the default device
   */
  defaultDevice?: string;

  /**
   * Custom metadata
   */
  metadata?: Metadata;
}

/**
 * Customer payment method list response
 */
export interface CustomerPaymentMethodsResponse {
  data: PaymentMethod[];
}

/**
 * Parameters for listing customers
 */
export interface ListCustomersParams extends PaginationParams {
  /**
   * Filter by email address
   */
  email?: string;

  /**
   * Filter by phone number
   */
  phone?: string;
}
