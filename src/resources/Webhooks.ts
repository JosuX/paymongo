import type {
  Webhook,
  CreateWebhookParams,
  UpdateWebhookParams,
  PayMongoResponse,
  PayMongoListResponse,
} from '../types';
import type { HttpClient } from '../utils/http';
import { BaseResource } from './Base';

/**
 * Webhooks resource for managing webhook endpoints
 * 
 * Webhooks allow you to receive real-time notifications
 * when events occur in your PayMongo account.
 */
export class Webhooks extends BaseResource {
  constructor(http: HttpClient) {
    super(http, '/webhooks');
  }

  /**
   * Creates a new Webhook
   * 
   * @param params - Webhook creation parameters
   * @returns The created Webhook
   * 
   * @example
   * ```typescript
   * const webhook = await paymongo.webhooks.create({
   *   url: 'https://yoursite.com/webhooks/paymongo',
   *   events: ['payment.paid', 'payment.failed'],
   * });
   * 
   * // Store the secret_key for verifying webhook signatures
   * console.log(webhook.attributes.secret_key);
   * ```
   */
  async create(params: CreateWebhookParams): Promise<Webhook> {
    const body = this.wrapBody({
      url: params.url,
      events: params.events,
    });

    const response = await this.http.post<PayMongoResponse<Webhook>>(
      this.buildPath(),
      body
    );

    return response.data;
  }

  /**
   * Retrieves a Webhook by ID
   * 
   * @param id - The Webhook ID (e.g., 'hook_xxxxx')
   * @returns The Webhook
   * 
   * @example
   * ```typescript
   * const webhook = await paymongo.webhooks.retrieve('hook_xxxxx');
   * ```
   */
  async retrieve(id: string): Promise<Webhook> {
    const response = await this.http.get<PayMongoResponse<Webhook>>(
      this.buildPath(id)
    );

    return response.data;
  }

  /**
   * Lists all Webhooks
   * 
   * @returns List of Webhooks
   * 
   * @example
   * ```typescript
   * const { data } = await paymongo.webhooks.list();
   * ```
   */
  async list(): Promise<{ data: Webhook[]; hasMore: boolean }> {
    const response = await this.http.get<PayMongoListResponse<Webhook>>(
      this.buildPath()
    );

    return {
      data: response.data,
      hasMore: response.has_more,
    };
  }

  /**
   * Updates a Webhook
   * 
   * @param id - The Webhook ID
   * @param params - Update parameters
   * @returns The updated Webhook
   * 
   * @example
   * ```typescript
   * const updated = await paymongo.webhooks.update('hook_xxxxx', {
   *   events: ['payment.paid', 'payment.failed', 'payment.refunded'],
   * });
   * ```
   */
  async update(id: string, params: UpdateWebhookParams): Promise<Webhook> {
    const body = this.wrapBody({
      url: params.url,
      events: params.events,
    });

    const response = await this.http.patch<PayMongoResponse<Webhook>>(
      this.buildPath(id),
      body
    );

    return response.data;
  }

  /**
   * Enables a disabled Webhook
   * 
   * @param id - The Webhook ID
   * @returns The enabled Webhook
   * 
   * @example
   * ```typescript
   * const webhook = await paymongo.webhooks.enable('hook_xxxxx');
   * console.log(webhook.attributes.status); // 'enabled'
   * ```
   */
  async enable(id: string): Promise<Webhook> {
    const response = await this.http.post<PayMongoResponse<Webhook>>(
      this.buildPath(id, 'enable')
    );

    return response.data;
  }

  /**
   * Disables a Webhook
   * 
   * @param id - The Webhook ID
   * @returns The disabled Webhook
   * 
   * @example
   * ```typescript
   * const webhook = await paymongo.webhooks.disable('hook_xxxxx');
   * console.log(webhook.attributes.status); // 'disabled'
   * ```
   */
  async disable(id: string): Promise<Webhook> {
    const response = await this.http.post<PayMongoResponse<Webhook>>(
      this.buildPath(id, 'disable')
    );

    return response.data;
  }
}
