import type { BaseAttributes, BaseResource, BillingDetails, Metadata } from './common';

/**
 * Supported payment method types
 */
export type PaymentMethodType =
  | 'card'
  | 'gcash'
  | 'grab_pay'
  | 'paymaya'
  | 'dob'
  | 'dob_ubp'
  | 'brankas_bdo'
  | 'brankas_landbank'
  | 'brankas_metrobank'
  | 'billease'
  | 'qrph';

/**
 * Card details within a payment method
 */
export interface CardDetails {
  brand: 'visa' | 'mastercard' | 'jcb' | 'amex' | 'discover' | 'diners' | 'unknown';
  country: string;
  exp_month: number;
  exp_year: number;
  last4: string;
  issuer?: string;
  cvc_check?: 'pass' | 'fail' | 'unavailable' | 'unchecked';
  three_d_secure_status?: 'authenticated' | 'not_authenticated' | 'not_enrolled' | 'error' | null;
}

/**
 * Payment Method attributes
 */
export interface PaymentMethodAttributes extends BaseAttributes {
  type: PaymentMethodType;
  billing?: BillingDetails | null;
  details?: CardDetails | null;
  metadata?: Metadata | null;
}

/**
 * Payment Method resource
 */
export type PaymentMethod = BaseResource<'payment_method', PaymentMethodAttributes>;

/**
 * Card input details for creating a card payment method
 */
export interface CardInput {
  /**
   * Card number (digits only, no spaces)
   */
  cardNumber: string;

  /**
   * Expiration month (1-12)
   */
  expMonth: number;

  /**
   * Expiration year (4-digit year)
   */
  expYear: number;

  /**
   * Card verification code (3-4 digits)
   */
  cvc: string;
}

/**
 * Parameters for creating a payment method
 */
export interface CreatePaymentMethodParams {
  /**
   * Type of payment method
   */
  type: PaymentMethodType;

  /**
   * Card details (required when type is 'card')
   */
  details?: CardInput;

  /**
   * Billing information
   */
  billing?: BillingDetails;

  /**
   * Custom metadata
   */
  metadata?: Metadata;
}

/**
 * Parameters for updating a payment method
 */
export interface UpdatePaymentMethodParams {
  /**
   * Updated billing information
   */
  billing?: BillingDetails;

  /**
   * Updated metadata
   */
  metadata?: Metadata;
}
