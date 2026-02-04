import type {
  Refund,
  CreateRefundParams,
  ListRefundsParams,
  PayMongoResponse,
  PayMongoListResponse,
} from '../types';
import type { HttpClient } from '../utils/http';
import { BaseResource } from './Base';

/**
 * Refunds resource for managing payment refunds
 * 
 * Refunds allow you to return funds to your customers
 * for payments that have been completed.
 */
export class Refunds extends BaseResource {
  constructor(http: HttpClient) {
    super(http, '/refunds');
  }

  /**
   * Creates a new Refund
   * 
   * @param params - Refund creation parameters
   * @returns The created Refund
   * 
   * @example
   * ```typescript
   * const refund = await paymongo.refunds.create({
   *   amount: 5000, // PHP 50.00 in centavos
   *   paymentId: 'pay_xxxxx',
   *   reason: 'requested_by_customer',
   *   notes: 'Customer requested refund',
   * });
   * ```
   */
  async create(params: CreateRefundParams): Promise<Refund> {
    const body = this.wrapBody({
      amount: params.amount,
      paymentId: params.paymentId,
      reason: params.reason,
      notes: params.notes,
      metadata: params.metadata,
    });

    const response = await this.http.post<PayMongoResponse<Refund>>(
      this.buildPath(),
      body
    );

    return response.data;
  }

  /**
   * Retrieves a Refund by ID
   * 
   * @param id - The Refund ID (e.g., 'ref_xxxxx')
   * @returns The Refund
   * 
   * @example
   * ```typescript
   * const refund = await paymongo.refunds.retrieve('ref_xxxxx');
   * console.log(refund.attributes.status); // 'pending' | 'succeeded' | 'failed'
   * ```
   */
  async retrieve(id: string): Promise<Refund> {
    const response = await this.http.get<PayMongoResponse<Refund>>(
      this.buildPath(id)
    );

    return response.data;
  }

  /**
   * Lists all Refunds
   * 
   * @param params - Optional pagination and filter parameters
   * @returns List of Refunds with pagination info
   * 
   * @example
   * ```typescript
   * // Get all refunds
   * const { data, hasMore } = await paymongo.refunds.list({ limit: 10 });
   * 
   * // Get refunds for a specific payment
   * const refunds = await paymongo.refunds.list({ paymentId: 'pay_xxxxx' });
   * ```
   */
  async list(params?: ListRefundsParams): Promise<{ data: Refund[]; hasMore: boolean }> {
    const queryParams: Record<string, string | number | boolean | undefined> = {};

    if (params?.after) {
      queryParams['after'] = params.after;
    }
    if (params?.before) {
      queryParams['before'] = params.before;
    }
    if (params?.limit) {
      queryParams['limit'] = params.limit;
    }
    if (params?.paymentId) {
      queryParams['payment_id'] = params.paymentId;
    }

    const response = await this.http.get<PayMongoListResponse<Refund>>(
      this.buildPath(),
      queryParams
    );

    return {
      data: response.data,
      hasMore: response.has_more,
    };
  }
}
