import type { BaseAttributes, BaseResource } from './common';

/**
 * Webhook event types
 */
export type WebhookEventType =
  | 'payment.paid'
  | 'payment.failed'
  | 'payment.refunded'
  | 'payment.refund.updated'
  | 'source.chargeable'
  | 'checkout_session.payment.paid'
  | 'subscription.payment.paid'
  | 'subscription.payment.failed';

/**
 * Webhook status values
 */
export type WebhookStatus = 'enabled' | 'disabled';

/**
 * Webhook attributes
 */
export interface WebhookAttributes extends BaseAttributes {
  events: WebhookEventType[];
  secret_key: string;
  status: WebhookStatus;
  url: string;
}

/**
 * Webhook resource
 */
export type Webhook = BaseResource<'webhook', WebhookAttributes>;

/**
 * Parameters for creating a webhook
 */
export interface CreateWebhookParams {
  /**
   * The URL where webhook events will be sent
   */
  url: string;

  /**
   * List of events to subscribe to
   */
  events: WebhookEventType[];
}

/**
 * Parameters for updating a webhook
 */
export interface UpdateWebhookParams {
  /**
   * Updated URL for webhook events
   */
  url?: string;

  /**
   * Updated list of events to subscribe to
   */
  events?: WebhookEventType[];
}

/**
 * Webhook event payload
 */
export interface WebhookEvent<T = unknown> {
  id: string;
  type: 'event';
  attributes: {
    type: WebhookEventType;
    livemode: boolean;
    data: T;
    previous_data?: Partial<T>;
    created_at: number;
    updated_at: number;
  };
}
