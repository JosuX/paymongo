import type {
  Customer,
  CreateCustomerParams,
  UpdateCustomerParams,
  ListCustomersParams,
  PaymentMethod,
  PayMongoResponse,
  PayMongoListResponse,
  CustomerPaymentMethodsResponse,
} from '../types';
import type { HttpClient } from '../utils/http';
import { BaseResource } from './Base';

/**
 * Customers resource for managing customer records
 * 
 * Customers allow you to store payment methods and track
 * payment history for returning users.
 */
export class Customers extends BaseResource {
  constructor(http: HttpClient) {
    super(http, '/customers');
  }

  /**
   * Creates a new Customer
   * 
   * @param params - Customer creation parameters
   * @returns The created Customer
   * 
   * @example
   * ```typescript
   * const customer = await paymongo.customers.create({
   *   firstName: 'John',
   *   lastName: 'Doe',
   *   email: 'john@example.com',
   *   phone: '09171234567',
   * });
   * ```
   */
  async create(params: CreateCustomerParams): Promise<Customer> {
    const body = this.wrapBody({
      email: params.email,
      firstName: params.firstName,
      lastName: params.lastName,
      phone: params.phone,
      defaultPaymentMethodId: params.defaultPaymentMethodId,
      metadata: params.metadata,
    });

    const response = await this.http.post<PayMongoResponse<Customer>>(
      this.buildPath(),
      body
    );

    return response.data;
  }

  /**
   * Retrieves a Customer by ID
   * 
   * @param id - The Customer ID (e.g., 'cus_xxxxx')
   * @returns The Customer
   * 
   * @example
   * ```typescript
   * const customer = await paymongo.customers.retrieve('cus_xxxxx');
   * ```
   */
  async retrieve(id: string): Promise<Customer> {
    const response = await this.http.get<PayMongoResponse<Customer>>(
      this.buildPath(id)
    );

    return response.data;
  }

  /**
   * Lists all Customers
   * 
   * @param params - Optional pagination and filter parameters
   * @returns List of Customers with pagination info
   * 
   * @example
   * ```typescript
   * // Get all customers
   * const { data, hasMore } = await paymongo.customers.list({ limit: 10 });
   * 
   * // Filter by email
   * const customers = await paymongo.customers.list({ email: 'john@example.com' });
   * 
   * // Paginate
   * const nextPage = await paymongo.customers.list({ 
   *   after: data[data.length - 1].id, 
   *   limit: 10 
   * });
   * ```
   */
  async list(params?: ListCustomersParams): Promise<{ data: Customer[]; hasMore: boolean }> {
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
    if (params?.email) {
      queryParams['email'] = params.email;
    }
    if (params?.phone) {
      queryParams['phone'] = params.phone;
    }

    const response = await this.http.get<PayMongoListResponse<Customer>>(
      this.buildPath(),
      queryParams
    );

    return {
      data: response.data,
      hasMore: response.has_more,
    };
  }

  /**
   * Updates a Customer
   * 
   * @param id - The Customer ID
   * @param params - Update parameters
   * @returns The updated Customer
   * 
   * @example
   * ```typescript
   * const updated = await paymongo.customers.update('cus_xxxxx', {
   *   email: 'newemail@example.com',
   * });
   * ```
   */
  async update(id: string, params: UpdateCustomerParams): Promise<Customer> {
    const body = this.wrapBody({
      email: params.email,
      firstName: params.firstName,
      lastName: params.lastName,
      phone: params.phone,
      defaultPaymentMethodId: params.defaultPaymentMethodId,
      defaultDevice: params.defaultDevice,
      metadata: params.metadata,
    });

    const response = await this.http.patch<PayMongoResponse<Customer>>(
      this.buildPath(id),
      body
    );

    return response.data;
  }

  /**
   * Deletes a Customer
   * 
   * This will also remove all associated payment methods.
   * 
   * @param id - The Customer ID
   * @returns The deleted Customer
   * 
   * @example
   * ```typescript
   * await paymongo.customers.delete('cus_xxxxx');
   * ```
   */
  async delete(id: string): Promise<Customer> {
    const response = await this.http.delete<PayMongoResponse<Customer>>(
      this.buildPath(id)
    );

    return response.data;
  }

  /**
   * Gets all Payment Methods for a Customer
   * 
   * @param customerId - The Customer ID
   * @returns List of Payment Methods
   * 
   * @example
   * ```typescript
   * const methods = await paymongo.customers.getPaymentMethods('cus_xxxxx');
   * ```
   */
  async getPaymentMethods(customerId: string): Promise<PaymentMethod[]> {
    const response = await this.http.get<CustomerPaymentMethodsResponse>(
      this.buildPath(customerId, 'payment_methods')
    );

    return response.data;
  }

  /**
   * Deletes a Payment Method from a Customer
   * 
   * @param customerId - The Customer ID
   * @param paymentMethodId - The Payment Method ID to remove
   * @returns The deleted Payment Method
   * 
   * @example
   * ```typescript
   * await paymongo.customers.deletePaymentMethod('cus_xxxxx', 'pm_xxxxx');
   * ```
   */
  async deletePaymentMethod(customerId: string, paymentMethodId: string): Promise<PaymentMethod> {
    const response = await this.http.delete<PayMongoResponse<PaymentMethod>>(
      this.buildPath(customerId, `payment_methods/${paymentMethodId}`)
    );

    return response.data;
  }
}
