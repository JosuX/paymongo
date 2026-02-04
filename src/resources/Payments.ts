import type {
  Payment,
  ListPaymentsParams,
  PayMongoResponse,
  PayMongoListResponse,
} from '../types';
import type { HttpClient } from '../utils/http';
import { BaseResource } from './Base';

/**
 * Payments resource for retrieving payment records
 * 
 * Payments are created automatically when a Payment Intent succeeds
 * or fails. They represent the actual transaction record.
 */
export class Payments extends BaseResource {
  constructor(http: HttpClient) {
    super(http, '/payments');
  }

  /**
   * Retrieves a Payment by ID
   * 
   * @param id - The Payment ID (e.g., 'pay_xxxxx')
   * @returns The Payment
   * 
   * @example
   * ```typescript
   * const payment = await paymongo.payments.retrieve('pay_xxxxx');
   * console.log(payment.attributes.status); // 'paid' | 'pending' | 'failed'
   * ```
   */
  async retrieve(id: string): Promise<Payment> {
    const response = await this.http.get<PayMongoResponse<Payment>>(
      this.buildPath(id)
    );

    return response.data;
  }

  /**
   * Lists all Payments
   * 
   * Returns a paginated list of payments for your account.
   * 
   * @param params - Optional pagination parameters
   * @returns List of Payments with pagination info
   * 
   * @example
   * ```typescript
   * // Get first page of payments
   * const { data, hasMore } = await paymongo.payments.list({ limit: 10 });
   * 
   * // Get next page
   * if (hasMore) {
   *   const lastId = data[data.length - 1].id;
   *   const nextPage = await paymongo.payments.list({ after: lastId, limit: 10 });
   * }
   * ```
   */
  async list(params?: ListPaymentsParams): Promise<{ data: Payment[]; hasMore: boolean }> {
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

    const response = await this.http.get<PayMongoListResponse<Payment>>(
      this.buildPath(),
      queryParams
    );

    return {
      data: response.data,
      hasMore: response.has_more,
    };
  }
}
