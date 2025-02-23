import { NextRequest, NextResponse } from "next/server";
import { getTransactionById } from "@/actions/payment.actions";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request: NextRequest) {
  const { amount, transactionId } = await request.json();

  try {
    // ~ ======= Get transaction  -->
    const transaction = await getTransactionById(transactionId);
    console.log(transaction);

    // ~ ======= Create payment intent  -->
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "gbp",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        transaction_id: transactionId,
        delivery_address: JSON.stringify(transaction?.deliveryAddress),
        customer_id: transaction?.ownerId,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  const transaction = await getTransactionById(id);
  await stripe.paymentIntents.cancel(transaction?.id);

  return NextResponse.json({
    message: "Transaction cancelled",
  });
}
