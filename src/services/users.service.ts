import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import createMollieClient, { Subscription } from '@mollie/api-client';
import 'dotenv/config';
import { uid } from 'uid';
import { con } from '@/app';

class UserService {
  public async findAllUser() {
    const mollieClient = createMollieClient({ apiKey: process.env.APIKEY });
    const customers = await mollieClient.customers.page();
    const payments = await mollieClient.payments.page();

    const listSubscriptions = customers.map(customer => {
      const paymentsList = payments.filter(payment => payment.customerId == customer.id);
      customer.payments = paymentsList;

      return customer;
    });

    if (!listSubscriptions) return customers;
    return listSubscriptions;
  }

  public async findSubscription(userId: string) {
    const mollieClient = createMollieClient({ apiKey: process.env.APIKEY });
    const listSubscriptions = mollieClient.customerSubscriptions.page({ customerId: userId });
    if (!listSubscriptions) throw new HttpException(409, "User doesn't exist");
    return listSubscriptions;
  }

  public async findPayments(userId: string) {
    try {
      const mollieClient = createMollieClient({ apiKey: process.env.APIKEY });
      const listPayments = await mollieClient.customerPayments.page({ customerId: userId });

      if (!listPayments) throw new HttpException(409, "User doesn't exist");
      return listPayments;
    } catch (error) {
      console.log('error');
    }
  }

  public async createPayment(paymentData) {
    try {
      const mollieClient = createMollieClient({ apiKey: process.env.APIKEY });
      console.log(paymentData.data.paymentMethod);

      const payment = await mollieClient.customerPayments.create({
        customerId: paymentData.data.customerId,
        amount: {
          currency: paymentData.data.currency,
          value: paymentData.data.value,
        },
        description: paymentData.data.description,
        redirectUrl: paymentData.data.redirectUrl,
        metadata: {
          customerId: paymentData.data.customerId,
        },
        mandateId: paymentData.data.mandateId.id,
        method: paymentData.data.paymentMethod,
      });

      return payment;
    } catch (error) {
      console.log(error);

      return error;
    }
  }

  public async createMandate(mandateData, userId: string) {
    try {
      const mollieClient = createMollieClient({ apiKey: process.env.APIKEY });

      const foundMandates = await this.getMandates(userId);

      if (foundMandates.length > 0) return foundMandates[0];

      console.log(mandateData.data.signatureDate);

      const mandate = await mollieClient.customerMandates.create({
        customerId: userId,
        method: mandateData.data.method,
        consumerName: mandateData.data.customerName,
        consumerAccount: mandateData.data.customerAccount,
        consumerBic: mandateData.data.customerBic,
        signatureDate: mandateData.data.signatureDate,
        mandateReference: uid(16),
      });

      return mandate[0];
    } catch (error) {
      return error;
    }
  }

  public async getMandates(userId: string) {
    try {
      const mollieClient = createMollieClient({ apiKey: process.env.APIKEY });
      const mandates = await mollieClient.customerMandates.page({ customerId: userId });

      return mandates;
    } catch (error) {
      console.log(error);
    }
  }

  public async createSubscription(subscriptionData) {
    try {
      const mollieClient = createMollieClient({ apiKey: process.env.APIKEY });
      const subscription = await mollieClient.customerSubscriptions.create({
        customerId: subscriptionData.data.customerId,
        amount: {
          currency: subscriptionData.data.currency,
          value: subscriptionData.data.value,
        },
        interval: subscriptionData.data.interval,
        description: subscriptionData.data.description,
        mandateId: subscriptionData.data.mandateId,
        times: subscriptionData.data.times,
      });

      return subscription;
    } catch (error) {
      return error;
    }
  }

  public async findUserById(userId: string) {
    const mollieClient = createMollieClient({ apiKey: process.env.APIKEY });

    const customer = mollieClient.customers.get(userId);
    if (!customer) throw new HttpException(409, "User doesn't exist");

    return customer;
  }

  public async createCustomer(userData) {
    try {
      if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

      const mollieClient = createMollieClient({ apiKey: process.env.APIKEY });

      const findCustomers = await mollieClient.customers.page();

      const found = findCustomers.find(x => x.email == userData.data.email);

      if (found) return { message: 'customer already exist' };

      const customer = mollieClient.customers.create({
        name: userData.data.name,
        email: userData.data.email,
        metadata: {
          facturationAddress1: userData.data.facturationAddress1,
          facturationAddress2: userData.data.facturationAddress2,
          city: userData.data.city,
          postalCode: userData.data.postalCode,
          country: userData.data.country,
          nSiren: userData.data.isCompany ? userData.data.nSiren : '',
          isCompany: userData.data.isCompany,
          status: userData.data.status,
        },
      });

      return customer;
    } catch (error) {
      console.log(error);
    }
  }

  public async updateCustomer(userId: string, userData) {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const mollieClient = createMollieClient({ apiKey: process.env.APIKEY });

    const findCustomer = await mollieClient.customers.get(userId);

    if (!findCustomer) return { message: "customer doesn't exist" };

    if (userData.data.isCompany) {
      if (!userData.data.nSiren) userData.data.nSiren = findCustomer.metadata.nSiren;
    }
    if (!userData.data.name) userData.data.name = findCustomer.name;
    if (!userData.data.email) userData.data.email = findCustomer.email;
    if (!userData.data.city) userData.data.city = findCustomer.metadata.city;
    if (!userData.data.facturationAddress1) userData.data.facturationAddress1 = findCustomer.metadata.facturationAddress1;
    if (!userData.data.facturationAddress2) userData.data.facturationAddress2 = findCustomer.metadata.facturationAddress2;
    if (!userData.data.country) userData.data.country = findCustomer.metadata.country;
    if (!userData.data.postalCode) userData.data.postalCode = findCustomer.metadata.postalCode;
    if (!userData.data.isCompany) userData.data.isCompany = findCustomer.metadata.isCompany;
    if (!userData.data.status) userData.data.status = findCustomer.metadata.status;

    const updatedCustomer = mollieClient.customers.update(userId, {
      name: userData.data.name,
      email: userData.data.email,
      metadata: {
        facturationAddress1: userData.data.facturationAddress1,
        facturationAddress2: userData.data.facturationAddress2,
        city: userData.data.city,
        postalCode: userData.data.postalCode,
        country: userData.data.country,
        nSiren: userData.data.nSiren,
        isCompany: userData.data.isCompany,
        status: userData.data.status,
      },
    });

    return updatedCustomer;
  }

  public async deleteCustomer(userId) {
    const mollieClient = createMollieClient({ apiKey: process.env.APIKEY });

    const findCustomer = await mollieClient.customers.get(userId);

    if (!findCustomer) return { message: "customer doesn't exist" };

    const deleteUserData = mollieClient.customers.delete(userId);
    return deleteUserData;
  }
}

export default UserService;
