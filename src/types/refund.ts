import type { BaseAttributes, BaseResource, Currency, Metadata, PaginationParams } from './common';

/**
 * Refund status values
 */
export type RefundStatus = 'pending' | 'succeeded' | 'failed';

/**
 * Refund reason values
 */
export type RefundReason =
  | 'duplicate'
  | 'fraudulent'
  | 'requested_by_customer'
  | 'others';

/**
 * Refund attributes
 */
export interface RefundAttributes extends BaseAttributes {
  amount: number;
  balance_transaction_id?: string;
  currency: Currency;
  metadata?: Metadata | null;
  notes?: string | null;
  payment_id: string;
  payout?: string | null;
  reason: RefundReason;
  status: RefundStatus;
}

/**
 * Refund resource
 */
export type Refund = BaseResource<'refund', RefundAttributes>;

/**
 * Parameters for creating a refund
 */
export interface CreateRefundParams {
  /**
   * Amount to refund in centavos
   * If not specified, refunds the full payment amount
   */
  amount: number;

  /**
   * The ID of the payment to refund
   */
  paymentId: string;

  /**
   * Reason for the refund
   */
  reason: RefundReason;

  /**
   * Additional notes about the refund
   */
  notes?: string;

  /**
   * Custom metadata
   */
  metadata?: Metadata;
}

/**
 * Parameters for listing refunds
 */
export interface ListRefundsParams extends PaginationParams {
  /**
   * Filter by payment ID
   */
  paymentId?: string;
}
