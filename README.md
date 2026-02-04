# josu-paymongo

A class-based PayMongo API wrapper for TypeScript/JavaScript with singleton support. Compatible with both client-side and server-side usage in Next.js projects.

## Installation

```bash
npm install josu-paymongo
```

## Requirements

- Node.js 18+ (uses native `fetch`)
- TypeScript 5.0+ (optional, but recommended)

## Quick Start

### Server-side (Next.js API Routes / Server Actions)

```typescript
import { PayMongo } from 'josu-paymongo';

// Singleton pattern (recommended)
const paymongo = PayMongo.getInstance({
  secretKey: process.env.PAYMONGO_SECRET_KEY!,
});

// Create a payment intent
const intent = await paymongo.paymentIntents.create({
  amount: 10000, // PHP 100.00 in centavos
  currency: 'PHP',
  paymentMethodAllowed: ['card', 'gcash', 'paymaya'],
  description: 'Order #12345',
});

// Return client_key to frontend
console.log(intent.attributes.client_key);
```

### Client-side (React/Next.js)

```typescript
import { PayMongo } from 'josu-paymongo';

// Use public key for client-side operations
const paymongo = new PayMongo({
  publicKey: process.env.NEXT_PUBLIC_PAYMONGO_PUBLIC_KEY!,
});

// Create a payment method (safe for client-side)
const method = await paymongo.paymentMethods.create({
  type: 'card',
  details: {
    cardNumber: '4343434343434345',
    expMonth: 12,
    expYear: 2025,
    cvc: '123',
  },
  billing: {
    name: 'John Doe',
    email: 'john@example.com',
  },
});

// Attach payment method to payment intent
const result = await paymongo.paymentIntents.attach(paymentIntentId, {
  paymentMethod: method.id,
  clientKey: clientKey, // from server
  returnUrl: 'https://yoursite.com/payment/complete',
});

// Handle redirect for 3DS or e-wallet authentication
if (result.attributes.status === 'awaiting_next_action') {
  window.location.href = result.attributes.next_action!.redirect.url;
}
```

## API Reference

### PayMongo Class

#### Constructor Options

```typescript
interface PayMongoConfig {
  publicKey?: string;  // For client-side (pk_test_*, pk_live_*)
  secretKey?: string;  // For server-side (sk_test_*, sk_live_*)
  baseUrl?: string;    // Default: 'https://api.paymongo.com/v1'
}
```

#### Singleton Pattern

```typescript
// Get or create singleton instance
const paymongo = PayMongo.getInstance({ secretKey: 'sk_...' });

// Force create new instance
const paymongo = PayMongo.getInstance({ secretKey: 'sk_...', forceNew: true });

// Reset singleton
PayMongo.resetInstance();
```

### Payment Intents

```typescript
// Create a payment intent
const intent = await paymongo.paymentIntents.create({
  amount: 10000,
  currency: 'PHP',
  paymentMethodAllowed: ['card', 'gcash', 'paymaya'],
  description: 'Order description',
  metadata: { orderId: '12345' },
});

// Retrieve a payment intent
const intent = await paymongo.paymentIntents.retrieve('pi_xxxxx');

// Retrieve with client key (client-side)
const intent = await paymongo.paymentIntents.retrieve('pi_xxxxx', clientKey);

// Attach payment method
const intent = await paymongo.paymentIntents.attach('pi_xxxxx', {
  paymentMethod: 'pm_xxxxx',
  returnUrl: 'https://yoursite.com/complete',
});
```

### Payment Methods

```typescript
// Create card payment method
const method = await paymongo.paymentMethods.create({
  type: 'card',
  details: {
    cardNumber: '4343434343434345',
    expMonth: 12,
    expYear: 2025,
    cvc: '123',
  },
  billing: {
    name: 'John Doe',
    email: 'john@example.com',
  },
});

// Create e-wallet payment method
const gcashMethod = await paymongo.paymentMethods.create({
  type: 'gcash',
  billing: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '09171234567',
  },
});

// Retrieve payment method
const method = await paymongo.paymentMethods.retrieve('pm_xxxxx');

// Update payment method
const updated = await paymongo.paymentMethods.update('pm_xxxxx', {
  billing: { email: 'newemail@example.com' },
});
```

### Payments

```typescript
// Retrieve a payment
const payment = await paymongo.payments.retrieve('pay_xxxxx');

// List all payments
const { data, hasMore } = await paymongo.payments.list({ limit: 10 });

// Paginate
const nextPage = await paymongo.payments.list({
  after: data[data.length - 1].id,
  limit: 10,
});
```

### Customers

```typescript
// Create a customer
const customer = await paymongo.customers.create({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '09171234567',
});

// List all customers
const { data, hasMore } = await paymongo.customers.list({ limit: 10 });

// Filter customers by email
const customers = await paymongo.customers.list({ email: 'john@example.com' });

// Retrieve a customer
const customer = await paymongo.customers.retrieve('cus_xxxxx');

// Update a customer
const updated = await paymongo.customers.update('cus_xxxxx', {
  email: 'newemail@example.com',
});

// Delete a customer
await paymongo.customers.delete('cus_xxxxx');

// Get customer's payment methods
const methods = await paymongo.customers.getPaymentMethods('cus_xxxxx');

// Delete a payment method from customer
await paymongo.customers.deletePaymentMethod('cus_xxxxx', 'pm_xxxxx');
```

### Refunds

```typescript
// Create a refund
const refund = await paymongo.refunds.create({
  amount: 5000, // PHP 50.00 in centavos
  paymentId: 'pay_xxxxx',
  reason: 'requested_by_customer',
  notes: 'Customer requested refund',
});

// Retrieve a refund
const refund = await paymongo.refunds.retrieve('ref_xxxxx');

// List all refunds
const { data, hasMore } = await paymongo.refunds.list({ limit: 10 });

// List refunds for a specific payment
const refunds = await paymongo.refunds.list({ paymentId: 'pay_xxxxx' });
```

### Webhooks

```typescript
// Create a webhook
const webhook = await paymongo.webhooks.create({
  url: 'https://yoursite.com/webhooks/paymongo',
  events: ['payment.paid', 'payment.failed'],
});

// Store the secret_key for verifying signatures
console.log(webhook.attributes.secret_key);

// Retrieve a webhook
const webhook = await paymongo.webhooks.retrieve('hook_xxxxx');

// List all webhooks
const { data } = await paymongo.webhooks.list();

// Update a webhook
const updated = await paymongo.webhooks.update('hook_xxxxx', {
  events: ['payment.paid', 'payment.failed', 'payment.refunded'],
});

// Enable a webhook
await paymongo.webhooks.enable('hook_xxxxx');

// Disable a webhook
await paymongo.webhooks.disable('hook_xxxxx');
```

### Checkout Sessions

```typescript
// Create a checkout session
const session = await paymongo.checkoutSessions.create({
  lineItems: [
    {
      name: 'Premium Plan',
      amount: 99900, // PHP 999.00
      currency: 'PHP',
      quantity: 1,
    },
  ],
  paymentMethodTypes: ['card', 'gcash', 'paymaya'],
  successUrl: 'https://yoursite.com/success',
  cancelUrl: 'https://yoursite.com/cancel',
  description: 'Subscription payment',
});

// Redirect customer to checkout page
window.location.href = session.attributes.checkout_url;

// Retrieve a checkout session
const session = await paymongo.checkoutSessions.retrieve('cs_xxxxx');

// Expire a checkout session
await paymongo.checkoutSessions.expire('cs_xxxxx');
```

## Error Handling

```typescript
import { PayMongoError, PayMongoConfigError, PayMongoNetworkError } from 'josu-paymongo';

try {
  await paymongo.paymentIntents.create({ ... });
} catch (error) {
  if (error instanceof PayMongoError) {
    console.error('API Error:', error.message);
    console.error('Status:', error.status);
    console.error('Code:', error.code);
    console.error('Details:', error.errors);
  } else if (error instanceof PayMongoNetworkError) {
    console.error('Network Error:', error.message);
  } else if (error instanceof PayMongoConfigError) {
    console.error('Config Error:', error.message);
  }
}
```

## Supported Payment Methods

| Type | Description |
|------|-------------|
| `card` | Visa/Mastercard credit and debit cards |
| `gcash` | GCash e-wallet |
| `paymaya` | Maya (formerly PayMaya) |
| `grab_pay` | GrabPay |
| `dob` | Direct Online Banking |
| `dob_ubp` | UnionBank Online |
| `brankas_bdo` | BDO via Brankas |
| `brankas_landbank` | LandBank via Brankas |
| `brankas_metrobank` | Metrobank via Brankas |
| `billease` | BillEase Buy Now Pay Later |
| `qrph` | QR Ph (InstaPay) |

## Payment Intent Flow

```
1. Create Payment Intent (server-side)
   └── Returns client_key

2. Create Payment Method (client-side)
   └── Collects billing info and card/e-wallet details

3. Attach Payment Method to Intent
   └── May return redirect URL for authentication

4. Customer completes authentication
   └── Redirected back to your return_url

5. Check Payment Intent status
   └── 'succeeded' = payment complete
```

## TypeScript Support

All types are exported for full TypeScript support:

```typescript
import type {
  PaymentIntent,
  PaymentMethod,
  Payment,
  Customer,
  Refund,
  Webhook,
  CheckoutSession,
  CreatePaymentIntentParams,
  PaymentIntentStatus,
  PaymentMethodType,
  WebhookEventType,
} from 'josu-paymongo';
```

## Available Resources

| Resource | Methods |
|----------|---------|
| `paymentIntents` | create, retrieve, attach |
| `paymentMethods` | create, retrieve, update |
| `payments` | retrieve, list |
| `customers` | create, retrieve, update, delete, list, getPaymentMethods, deletePaymentMethod |
| `refunds` | create, retrieve, list |
| `webhooks` | create, retrieve, list, update, enable, disable |
| `checkoutSessions` | create, retrieve, expire |

## License

MIT
