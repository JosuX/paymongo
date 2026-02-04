// Main client export
export { PayMongo } from './PayMongo';

// Resource classes (for advanced usage / extension)
export { PaymentIntents } from './resources/PaymentIntents';
export { PaymentMethods } from './resources/PaymentMethods';
export { Payments } from './resources/Payments';
export { Customers } from './resources/Customers';
export { Refunds } from './resources/Refunds';
export { Webhooks } from './resources/Webhooks';
export { CheckoutSessions } from './resources/CheckoutSessions';

// Error classes
export {
  PayMongoError,
  PayMongoConfigError,
  PayMongoNetworkError,
  type PayMongoErrorDetail,
  type PayMongoErrorResponse,
} from './utils/errors';

// Type exports
export type {
  // Configuration
  PayMongoConfig,
  
  // Common types
  PayMongoResponse,
  PayMongoListResponse,
  BillingDetails,
  Address,
  Metadata,
  Currency,
  PaginationParams,
  
  // Payment Intent types
  PaymentIntent,
  PaymentIntentAttributes,
  PaymentIntentStatus,
  NextAction,
  PaymentError,
  PaymentMethodOptions,
  PaymentReference,
  CreatePaymentIntentParams,
  AttachPaymentIntentParams,
  
  // Payment Method types
  PaymentMethod,
  PaymentMethodAttributes,
  PaymentMethodType,
  CardDetails,
  CardInput,
  CreatePaymentMethodParams,
  UpdatePaymentMethodParams,
  
  // Payment types
  Payment,
  PaymentAttributes,
  PaymentStatus,
  PaymentSource,
  ListPaymentsParams,
  
  // Refund types
  Refund,
  RefundAttributes,
  RefundStatus,
  RefundReason,
  CreateRefundParams,
  ListRefundsParams,
  
  // Customer types
  Customer,
  CustomerAttributes,
  CreateCustomerParams,
  UpdateCustomerParams,
  ListCustomersParams,
  CustomerPaymentMethodsResponse,
  
  // Webhook types
  Webhook,
  WebhookAttributes,
  WebhookEventType,
  WebhookStatus,
  WebhookEvent,
  CreateWebhookParams,
  UpdateWebhookParams,
  
  // Checkout Session types
  CheckoutSession,
  CheckoutSessionAttributes,
  CheckoutSessionStatus,
  LineItem,
  LineItemInput,
  CreateCheckoutSessionParams,
} from './types';
