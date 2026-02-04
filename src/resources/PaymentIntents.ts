import type {
  PaymentIntent,
  CreatePaymentIntentParams,
  AttachPaymentIntentParams,
  PayMongoResponse,
} from '../types';
import type { HttpClient } from '../utils/http';
import { BaseResource } from './Base';

/**
 * PaymentIntents resource for managing payment intents
 * 
 * Payment Intents represent a single shopping cart or customer session.
 * They track the lifecycle of a payment from creation through completion.
 */
export class PaymentIntents extends BaseResource {
  constructor(http: HttpClient) {
    super(http, '/payment_intents');
  }

  /**
   * Creates a new Payment Intent
   * 
   * @param params - Payment intent creation parameters
   * @returns The created Payment Intent
   * 
   * @example
   * ```typescript
   * const intent = await paymongo.paymentIntents.create({
   *   amount: 10000, // PHP 100.00 in centavos
   *   currency: 'PHP',
   *   paymentMethodAllowed: ['card', 'gcash', 'paymaya'],
   *   description: 'Order #12345',
   * });
   * ```
   */
  async create(params: CreatePaymentIntentParams): Promise<PaymentIntent> {
    const body = this.wrapBody({
      amount: params.amount,
      currency: params.currency ?? 'PHP',
      paymentMethodAllowed: params.paymentMethodAllowed,
      description: params.description,
      statementDescriptor: params.statementDescriptor,
      metadata: params.metadata,
      captureType: params.captureType,
      setupFutureUsage: params.setupFutureUsage,
      paymentMethodOptions: params.paymentMethodOptions,
    });

    const response = await this.http.post<PayMongoResponse<PaymentIntent>>(
      this.buildPath(),
      body
    );

    return response.data;
  }

  /**
   * Retrieves a Payment Intent by ID
   * 
   * @param id - The Payment Intent ID (e.g., 'pi_xxxxx')
   * @param clientKey - Optional client key for client-side retrieval
   * @returns The Payment Intent
   * 
   * @example
   * ```typescript
   * const intent = await paymongo.paymentIntents.retrieve('pi_xxxxx');
   * ```
   */
  async retrieve(id: string, clientKey?: string): Promise<PaymentIntent> {
    const params = clientKey ? { client_key: clientKey } : undefined;
    
    const response = await this.http.get<PayMongoResponse<PaymentIntent>>(
      this.buildPath(id),
      params
    );

    return response.data;
  }

  /**
   * Attaches a Payment Method to a Payment Intent
   * 
   * This triggers the payment process. For card payments and e-wallets,
   * this may return a redirect URL for customer authentication.
   * 
   * @param id - The Payment Intent ID
   * @param params - Attach parameters including payment method ID
   * @returns The updated Payment Intent
   * 
   * @example
   * ```typescript
   * const intent = await paymongo.paymentIntents.attach('pi_xxxxx', {
   *   paymentMethod: 'pm_xxxxx',
   *   returnUrl: 'https://example.com/payment/complete',
   * });
   * 
   * if (intent.attributes.status === 'awaiting_next_action') {
   *   // Redirect customer to intent.attributes.next_action.redirect.url
   * }
   * ```
   */
  async attach(id: string, params: AttachPaymentIntentParams): Promise<PaymentIntent> {
    const body = this.wrapBody({
      paymentMethod: params.paymentMethod,
      clientKey: params.clientKey,
      returnUrl: params.returnUrl,
    });

    const response = await this.http.post<PayMongoResponse<PaymentIntent>>(
      this.buildPath(id, 'attach'),
      body
    );

    return response.data;
  }
}
