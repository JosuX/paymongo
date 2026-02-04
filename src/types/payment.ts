import type { BaseAttributes, BaseResource, BillingDetails, Currency, Metadata, PaginationParams } from './common';
import type { Refund } from './refund';

/**
 * Payment status values
 */
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'expired';

/**
 * Payment source information
 */
export interface PaymentSource {
  id: string;
  type: 'payment_intent' | 'source';
}

/**
 * Payment attributes
 */
export interface PaymentAttributes extends BaseAttributes {
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
  origin?: string;
  payout?: string | null;
  source: PaymentSource;
  statement_descriptor?: string;
  status: PaymentStatus;
  tax_amount?: number | null;
  metadata?: Metadata | null;
  refunds: Refund[];
  taxes: unknown[];
  paid_at?: number | null;
}

/**
 * Payment resource
 */
export type Payment = BaseResource<'payment', PaymentAttributes>;

/**
 * Parameters for listing payments
 */
export interface ListPaymentsParams extends PaginationParams {
  // Additional filters can be added here if PayMongo supports them
}
