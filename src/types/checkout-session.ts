import type { BaseAttributes, BaseResource, BillingDetails, Currency, Metadata } from './common';
import type { PaymentMethodType } from './payment-method';

/**
 * Checkout session status values
 */
export type CheckoutSessionStatus = 'active' | 'expired' | 'paid';

/**
 * Line item in a checkout session
 */
export interface LineItem {
  amount: number;
  currency: Currency;
  description?: string;
  images?: string[];
  name: string;
  quantity: number;
}

/**
 * Checkout session attributes
 */
export interface CheckoutSessionAttributes extends BaseAttributes {
  billing?: BillingDetails | null;
  billing_information_fields_editable?: 'enabled' | 'disabled';
  cancel_url?: string;
  checkout_url: string;
  client_key: string;
  description?: string;
  line_items: LineItem[];
  merchant?: string;
  metadata?: Metadata | null;
  payment_intent: {
    id: string;
    type: 'payment_intent';
    attributes: {
      amount: number;
      capture_type: 'automatic' | 'manual';
      client_key: string;
      currency: Currency;
      description?: string;
      livemode: boolean;
      statement_descriptor?: string;
      status: string;
      created_at: number;
      updated_at: number;
    };
  };
  payment_method_types: PaymentMethodType[];
  payments: Array<{
    id: string;
    type: 'payment';
  }>;
  reference_number?: string;
  send_email_receipt?: boolean;
  show_description?: boolean;
  show_line_items?: boolean;
  status: CheckoutSessionStatus;
  success_url: string;
}

/**
 * Checkout Session resource
 */
export type CheckoutSession = BaseResource<'checkout_session', CheckoutSessionAttributes>;

/**
 * Line item input for creating a checkout session
 */
export interface LineItemInput {
  /**
   * Amount in centavos
   */
  amount: number;

  /**
   * Currency code
   */
  currency?: Currency;

  /**
   * Item description
   */
  description?: string;

  /**
   * Array of image URLs for the item
   */
  images?: string[];

  /**
   * Item name
   */
  name: string;

  /**
   * Quantity of items
   */
  quantity: number;
}

/**
 * Parameters for creating a checkout session
 */
export interface CreateCheckoutSessionParams {
  /**
   * Line items for the checkout
   */
  lineItems: LineItemInput[];

  /**
   * Payment method types allowed
   */
  paymentMethodTypes: PaymentMethodType[];

  /**
   * URL to redirect on successful payment
   */
  successUrl: string;

  /**
   * URL to redirect on cancelled payment
   */
  cancelUrl?: string;

  /**
   * Description shown on checkout page
   */
  description?: string;

  /**
   * Pre-filled billing information
   */
  billing?: BillingDetails;

  /**
   * Whether billing fields are editable
   * @default 'enabled'
   */
  billingInformationFieldsEditable?: 'enabled' | 'disabled';

  /**
   * Whether to send email receipt
   */
  sendEmailReceipt?: boolean;

  /**
   * Whether to show description on checkout page
   */
  showDescription?: boolean;

  /**
   * Whether to show line items on checkout page
   */
  showLineItems?: boolean;

  /**
   * Your reference number for this checkout
   */
  referenceNumber?: string;

  /**
   * Custom metadata
   */
  metadata?: Metadata;
}
