import type { BaseAttributes, BaseResource, BillingDetails, Currency, Metadata } from './common';
import type { PaymentMethodType } from './payment-method';

/**
 * Payment Intent status values
 */
export type PaymentIntentStatus =
  | 'awaiting_payment_method'
  | 'awaiting_next_action'
  | 'processing'
  | 'succeeded'
  | 'awaiting_capture'
  | 'cancelled';

/**
 * Next action type for payment intents requiring customer action
 */
export interface NextAction {
  type: 'redirect';
  redirect: {
    url: string;
    return_url: string;
  };
}

/**
 * Payment error details
 */
export interface PaymentError {
  code: string;
  detail: string;
  source?: {
    type: string;
    attribute: string;
  };
}

/**
 * Payment Intent attributes
 */
export interface PaymentIntentAttributes extends BaseAttributes {
  amount: number;
  capture_type: 'automatic' | 'manual';
  client_key: string;
  currency: Currency;
  description?: string;
  last_payment_error?: PaymentError | null;
  metadata?: Metadata | null;
  next_action?: NextAction | null;
  payment_method_allowed: PaymentMethodType[];
  payment_method_options?: PaymentMethodOptions | null;
  payments: PaymentReference[];
  setup_future_usage?: 'on_session' | 'off_session' | null;
  statement_descriptor?: string;
  status: PaymentIntentStatus;
}

/**
 * Payment method options for specific payment types
 */
export interface PaymentMethodOptions {
  card?: {
    request_three_d_secure?: 'any' | 'automatic';
  };
}

/**
 * Reference to a payment within a payment intent
 */
export interface PaymentReference {
  id: string;
  type: 'payment';
  attributes: {
    access_url?: string | null;
    amount: number;
    balance_transaction_id?: string;
    billing?: BillingDetails | null;
    currency: Currency;
    description?: string | null;
    disputed: boolean;
    external_reference_number?: string | null;
    fee: number;
    net_amount: number;
    payout?: string | null;
    source: {
      id: string;
      type: 'payment_intent';
    };
    statement_descriptor?: string;
    status: 'pending' | 'paid' | 'failed';
    tax_amount?: number | null;
    refunds: unknown[];
    taxes: unknown[];
    created_at: number;
    updated_at: number;
    paid_at?: number;
  };
}

/**
 * Payment Intent resource
 */
export type PaymentIntent = BaseResource<'payment_intent', PaymentIntentAttributes>;

/**
 * Parameters for creating a payment intent
 */
export interface CreatePaymentIntentParams {
  /**
   * Amount in centavos (e.g., 10000 = PHP 100.00)
   * Minimum: 10000 (PHP 100.00)
   */
  amount: number;

  /**
   * Three-letter ISO currency code
   */
  currency?: Currency;

  /**
   * Payment methods allowed for this intent
   */
  paymentMethodAllowed: PaymentMethodType[];

  /**
   * Description of the payment
   */
  description?: string;

  /**
   * Statement descriptor shown on customer's statement
   */
  statementDescriptor?: string;

  /**
   * Custom metadata
   */
  metadata?: Metadata;

  /**
   * Capture type for card payments
   * @default 'automatic'
   */
  captureType?: 'automatic' | 'manual';

  /**
   * Setup for future usage
   */
  setupFutureUsage?: 'on_session' | 'off_session';

  /**
   * Payment method options
   */
  paymentMethodOptions?: PaymentMethodOptions;
}

/**
 * Parameters for attaching a payment method to a payment intent
 */
export interface AttachPaymentIntentParams {
  /**
   * The ID of the payment method to attach
   */
  paymentMethod: string;

  /**
   * Client key from the payment intent (required for client-side calls)
   */
  clientKey?: string;

  /**
   * URL to redirect the customer after authentication
   */
  returnUrl?: string;
}
