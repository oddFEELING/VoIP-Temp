import { NextRequest, NextResponse } from "next/server";
import { getTransactionsAndItemsById } from "@/actions/payment.actions";
import axios from "axios";
import { getGraphToken } from "@/services/ms-graph";
import { generateEmailHtml } from "@/components/email-templates/purchase-success";

// ~ ======= Send purchase success email -->
export async function POST(request: NextRequest) {
  const { transaction_id } = await request.json();

  try {
    const transaction = await getTransactionsAndItemsById(transaction_id);

    // ~ ======= If transaction is null, return an error ======= ~
    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 },
      );
    }

    console.log(transaction);
    const accessToken = await getGraphToken();

    // ~ ======= Generate HTML email content from the component ======= ~
    // @ts-ignore - Ignoring type issues for the transaction object
    const emailContent = generateEmailHtml(transaction);

    const emailData = {
      message: {
        subject: "Your Order has been placed",
        body: {
          ContentType: "HTML",
          content: emailContent,
        },
        toRecipients: [
          { emailAddress: { address: transaction.recieverDetails.email } },
        ],
        from: {
          emailAddress: {
            address: process.env.EMAIL_USERNAME,
            name: "LinkOrg Networks",
          },
        },
      },
      saveToSentItems: true,
    };

    // ~ ======= Send the email -->
    await axios.post(
      `https://graph.microsoft.com/v1.0/users/${process.env.EMAIL_USERNAME}/sendMail`,
      emailData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    return NextResponse.json({ message: "Email sent" }, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Failed to fetch transaction" },
      { status: 500 },
    );
  }
}
