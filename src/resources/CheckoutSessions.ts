import type {
  CheckoutSession,
  CreateCheckoutSessionParams,
  PayMongoResponse,
} from '../types';
import type { HttpClient } from '../utils/http';
import { BaseResource } from './Base';

/**
 * CheckoutSessions resource for managing hosted checkout pages
 * 
 * Checkout Sessions provide a pre-built, hosted payment page
 * that handles the entire payment flow for you.
 */
export class CheckoutSessions extends BaseResource {
  constructor(http: HttpClient) {
    super(http, '/checkout_sessions');
  }

  /**
   * Creates a new Checkout Session
   * 
   * @param params - Checkout session creation parameters
   * @returns The created Checkout Session
   * 
   * @example
   * ```typescript
   * const session = await paymongo.checkoutSessions.create({
   *   lineItems: [
   *     {
   *       name: 'Premium Plan',
   *       amount: 99900, // PHP 999.00
   *       currency: 'PHP',
   *       quantity: 1,
   *     },
   *   ],
   *   paymentMethodTypes: ['card', 'gcash', 'paymaya'],
   *   successUrl: 'https://yoursite.com/success',
   *   cancelUrl: 'https://yoursite.com/cancel',
   *   description: 'Subscription payment',
   * });
   * 
   * // Redirect customer to checkout page
   * console.log(session.attributes.checkout_url);
   * ```
   */
  async create(params: CreateCheckoutSessionParams): Promise<CheckoutSession> {
    // Transform line items to snake_case
    const lineItems = params.lineItems.map((item) => ({
      amount: item.amount,
      currency: item.currency ?? 'PHP',
      description: item.description,
      images: item.images,
      name: item.name,
      quantity: item.quantity,
    }));

    const body = {
      data: {
        attributes: {
          line_items: lineItems,
          payment_method_types: params.paymentMethodTypes,
          success_url: params.successUrl,
          cancel_url: params.cancelUrl,
          description: params.description,
          billing: params.billing,
          billing_information_fields_editable: params.billingInformationFieldsEditable,
          send_email_receipt: params.sendEmailReceipt,
          show_description: params.showDescription,
          show_line_items: params.showLineItems,
          reference_number: params.referenceNumber,
          metadata: params.metadata,
        },
      },
    };

    const response = await this.http.post<PayMongoResponse<CheckoutSession>>(
      this.buildPath(),
      body
    );

    return response.data;
  }

  /**
   * Retrieves a Checkout Session by ID
   * 
   * @param id - The Checkout Session ID (e.g., 'cs_xxxxx')
   * @returns The Checkout Session
   * 
   * @example
   * ```typescript
   * const session = await paymongo.checkoutSessions.retrieve('cs_xxxxx');
   * console.log(session.attributes.status); // 'active' | 'expired' | 'paid'
   * ```
   */
  async retrieve(id: string): Promise<CheckoutSession> {
    const response = await this.http.get<PayMongoResponse<CheckoutSession>>(
      this.buildPath(id)
    );

    return response.data;
  }

  /**
   * Expires an active Checkout Session
   * 
   * This prevents the session from being used for payment.
   * 
   * @param id - The Checkout Session ID
   * @returns The expired Checkout Session
   * 
   * @example
   * ```typescript
   * const session = await paymongo.checkoutSessions.expire('cs_xxxxx');
   * console.log(session.attributes.status); // 'expired'
   * ```
   */
  async expire(id: string): Promise<CheckoutSession> {
    const response = await this.http.post<PayMongoResponse<CheckoutSession>>(
      this.buildPath(id, 'expire')
    );

    return response.data;
  }
}
