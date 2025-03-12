import { NextRequest } from "next/server";
import {
  getTransactionById,
  getTransactionsAndItemsById,
} from "@/actions/payment.actions";
import { simpleOrderCreator } from "@/lib/utils";
import axios, { AxiosError } from "axios";

export async function POST(request: NextRequest) {
  const { transaction_id } = await request.json();

  try {
    const transaction = await getTransactionById(transaction_id);
    const transactionItems = await getTransactionsAndItemsById(transaction_id);

    if (transaction && transactionItems) {
      const lineItems = transactionItems.items.map((item) => ({
        Item: item.product.item,
        Quantity: item.quantity.toString(),
      }));

      console.log(lineItems);

      const simpleOrder = simpleOrderCreator({
        order: {
          OrderRef: transaction_id,
          Name: `${transaction.recieverFirstName}  ${transaction.recieverFirstName}`,
          Address: `${transaction.deliveryAddress?.houseNumber} ${transaction.deliveryAddress?.address}, ${transaction.deliveryAddress?.city}, ${transaction.deliveryAddress?.state}`,
          PostCode: transaction.deliveryAddress?.postCode as string,
          Phone: transaction.recieverPhone as string,
          lines: {
            line: lineItems,
          },
        },
      });

      const response = await axios.post(
        "https://secure.provu.co.uk/prosys/xml.php",
        simpleOrder,
        {
          headers: {
            "Content-Type": "application/xml",
          },
          auth: {
            username: process.env.PROVU_API_USERNAME as string,
            password: process.env.PROVU_API_PASSWORD as string,
          },
        },
      );

      // ~ ======= Return the API response data along with success status -->
      return Response.json({
        success: true,
        data: response.data,
      });
    }

    // ~ ======= If transaction or transactionItems is not found -->
    return Response.json(
      {
        success: false,
        error: "Transaction or transaction items not found",
      },
      { status: 404 },
    );
  } catch (error) {
    console.log(error);

    // ~ ======= Properly handle the error based on its type -->
    if (error instanceof AxiosError) {
      return Response.json(
        {
          success: false,
          error: error.message,
          status: error.response?.status,
          details: error.response?.data,
        },
        { status: error.response?.status || 500 },
      );
    }

    // ~ ======= For other types of errors -->
    return Response.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    );
  }
}
