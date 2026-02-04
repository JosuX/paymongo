import type {
  PaymentMethod,
  CreatePaymentMethodParams,
  UpdatePaymentMethodParams,
  PayMongoResponse,
} from '../types';
import type { HttpClient } from '../utils/http';
import { BaseResource } from './Base';

/**
 * PaymentMethods resource for managing payment methods
 * 
 * Payment Methods store customer billing details and payment-specific
 * information such as card details or e-wallet selection.
 */
export class PaymentMethods extends BaseResource {
  constructor(http: HttpClient) {
    super(http, '/payment_methods');
  }

  /**
   * Creates a new Payment Method
   * 
   * For card payments, this can be called from the client-side using
   * the public API key. Never send card details to your backend.
   * 
   * @param params - Payment method creation parameters
   * @returns The created Payment Method
   * 
   * @example
   * ```typescript
   * // Card payment method
   * const method = await paymongo.paymentMethods.create({
   *   type: 'card',
   *   details: {
   *     cardNumber: '4343434343434345',
   *     expMonth: 12,
   *     expYear: 2025,
   *     cvc: '123',
   *   },
   *   billing: {
   *     name: 'John Doe',
   *     email: 'john@example.com',
   *   },
   * });
   * 
   * // E-wallet payment method (GCash)
   * const gcashMethod = await paymongo.paymentMethods.create({
   *   type: 'gcash',
   *   billing: {
   *     name: 'John Doe',
   *     email: 'john@example.com',
   *     phone: '09171234567',
   *   },
   * });
   * ```
   */
  async create(params: CreatePaymentMethodParams): Promise<PaymentMethod> {
    const attributes: Record<string, unknown> = {
      type: params.type,
      billing: params.billing,
      metadata: params.metadata,
    };

    // Handle card details specially - transform to snake_case for API
    if (params.details && params.type === 'card') {
      attributes.details = {
        card_number: params.details.cardNumber,
        exp_month: params.details.expMonth,
        exp_year: params.details.expYear,
        cvc: params.details.cvc,
      };
    }

    const body = {
      data: {
        attributes,
      },
    };

    const response = await this.http.post<PayMongoResponse<PaymentMethod>>(
      this.buildPath(),
      body
    );

    return response.data;
  }

  /**
   * Retrieves a Payment Method by ID
   * 
   * @param id - The Payment Method ID (e.g., 'pm_xxxxx')
   * @returns The Payment Method
   * 
   * @example
   * ```typescript
   * const method = await paymongo.paymentMethods.retrieve('pm_xxxxx');
   * ```
   */
  async retrieve(id: string): Promise<PaymentMethod> {
    const response = await this.http.get<PayMongoResponse<PaymentMethod>>(
      this.buildPath(id)
    );

    return response.data;
  }

  /**
   * Updates a Payment Method
   * 
   * Only billing information and metadata can be updated.
   * Card details cannot be modified after creation.
   * 
   * @param id - The Payment Method ID
   * @param params - Update parameters
   * @returns The updated Payment Method
   * 
   * @example
   * ```typescript
   * const updated = await paymongo.paymentMethods.update('pm_xxxxx', {
   *   billing: {
   *     email: 'newemail@example.com',
   *   },
   * });
   * ```
   */
  async update(id: string, params: UpdatePaymentMethodParams): Promise<PaymentMethod> {
    const body = this.wrapBody({
      billing: params.billing,
      metadata: params.metadata,
    });

    const response = await this.http.patch<PayMongoResponse<PaymentMethod>>(
      this.buildPath(id),
      body
    );

    return response.data;
  }
}
