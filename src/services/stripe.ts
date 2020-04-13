import config from "config/index";
import Stripe from "stripe";

export const stripe = new Stripe(config.stripeKey, {
  apiVersion: "2020-03-02",
  typescript: true,
  maxNetworkRetries: 2,
});
export default class StripeService {
  public static async createCustomer(
    customerDetails: Stripe.CustomerCreateParams
  ) {
    const customer = await stripe.customers.create({ ...customerDetails });
    return customer;
  }

  public static async createPaymentIntent(
    paymentIntentParams: Stripe.PaymentIntentCreateParams
  ) {
    const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.create(
      {
        ...paymentIntentParams,
        // Verify your integration in this guide by including this parameter
        //   metadata: { integration_check: "accept_a_payment" },
      }
    );

    return paymentIntent;
  }
}
