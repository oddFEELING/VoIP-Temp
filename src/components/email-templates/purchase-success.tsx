import React from "react";
import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import { convertSubCurrencyToCurrency } from "@/lib/utils";

// ~ ======= Type for transaction items ======= ~
type TransactionItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string | null;
    imageUrl: string;
    price: string | null;
    item: string;
    category: string | null;
    class: string;
    subclass: string | null;
  };
};

// ~ ======= Type for transaction ======= ~
type TransactionProps = {
  id: string;
  status: string;
  amount: number;
  createdAt: string;
  intentId: string | null;
  ownerId: string;
  recieverDetails: {
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    deliveryAddress: string | null;
  };
  items: TransactionItem[];
};

// ~ ======= Email template props ======= ~
interface PurchaseSuccessEmailProps {
  transaction: TransactionProps;
}

// ~ ======= Format date to readable string ======= ~
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// ~ ======= Format address object to string ======= ~
const formatAddress = (address: any) => {
  if (!address) return "";

  // Handle different address object structures
  if (typeof address === "string") return address;

  // Assume address is an object with address details
  const {
    houseNumber = "",
    address: streetAddress = "",
    city = "",
    state = "",
    country = "",
    postCode = "",
  } = address;

  const addressParts = [
    houseNumber ? `${houseNumber} ${streetAddress}` : streetAddress,
    city,
    state,
    postCode,
    country,
  ].filter(Boolean);

  return addressParts.join(", ");
};

// ~ ======= Format currency to GBP ======= ~
const formatCurrency = (amount: number) => {
  // Convert from subcurrency (pence to pounds)
  const convertedAmount = convertSubCurrencyToCurrency(amount);

  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(convertedAmount);
};

// ~ ======= Generate HTML email template ======= ~
export const generateEmailHtml = (transaction: TransactionProps) => {
  const { id, createdAt, amount, recieverDetails, items } = transaction;

  // ~ ======= Ensure items is always an array ======= ~
  const productItems = Array.isArray(items) ? items : [items].filter(Boolean);

  // Format items HTML
  const itemsHtml =
    productItems.length > 0
      ? productItems
          .map((item) => {
            const itemPrice = parseFloat(item.product.price || "0");
            const itemTotal = itemPrice * item.quantity;

            return `
          <tr style="border-bottom: 1px solid #e6ebf1;">
            <td style="padding: 15px 10px;">
              <div style="display: flex;">
                <div style="margin-right: 10px;">
                  <img src="${item.product.imageUrl}" width="60" height="60" alt="${item.product.name || "Product"}" style="border-radius: 4px;" />
                </div>
                <div>
                  <p style="margin: 0; font-weight: 500; color: #374151;">${item.product.name || "Product"}</p>
                  <p style="margin: 0; color: #6b7280; font-size: 12px;">${item.product.category || ""} ${item.product.subclass ? `- ${item.product.subclass}` : ""}</p>
                </div>
              </div>
            </td>
            <td style="padding: 15px 10px; text-align: center; color: #374151;">${item.quantity}</td>
            <td style="padding: 15px 10px; text-align: center; color: #374151;">${formatCurrency(itemPrice)}</td>
            <td style="padding: 15px 10px; text-align: right; color: #374151; font-weight: 500;">${formatCurrency(itemTotal)}</td>
          </tr>
        `;
          })
          .join("")
      : `
      <tr>
        <td colspan="4" style="padding: 15px 10px; text-align: center; color: #6b7280;">
          No items found in this order.
        </td>
      </tr>
    `;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center" style="padding: 30px 0;">
            <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
              <!-- Header -->
              <tr>
                <td style="padding: 25px; text-align: center; border-bottom: 1px solid #e6ebf1;">
                  <img src="https://example.com/logo.png" width="120" height="40" alt="LinkOrgNet" style="margin: 0 auto;" />
                </td>
              </tr>
              
              <!-- Main Content -->
              <tr>
                <td style="padding: 30px 25px;">
                  <h1 style="font-size: 26px; font-weight: bold; color: #111827; margin: 0 0 20px; text-align: center; line-height: 1.3;">Order Confirmation</h1>
                  <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin: 0 0 22px;">Thank you for your purchase! Your order has been confirmed and will be processed shortly.</p>
                  
                  <!-- Order Details -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0; padding: 20px; background-color: #f9fafb; border-radius: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.03);">
                    <tr>
                      <td colspan="2">
                        <h2 style="font-size: 18px; font-weight: bold; color: #111827; margin: 0 0 20px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Order Details</h2>
                      </td>
                    </tr>
                    <tr>
                      <td width="30%" style="padding: 7px 0; font-size: 14px; color: #6b7280; font-weight: 600;">Order Number:</td>
                      <td width="70%" style="padding: 7px 0; font-size: 14px; color: #374151;">${id}</td>
                    </tr>
                    <tr>
                      <td style="padding: 7px 0; font-size: 14px; color: #6b7280; font-weight: 600;">Date:</td>
                      <td style="padding: 7px 0; font-size: 14px; color: #374151;">${formatDate(createdAt)}</td>
                    </tr>
                    <tr>
                      <td style="padding: 7px 0; font-size: 14px; color: #6b7280; font-weight: 600;">Total Amount:</td>
                      <td style="padding: 7px 0; font-size: 14px; color: #111827; font-weight: bold;">${formatCurrency(amount)}</td>
                    </tr>
                  </table>
                  
                  <!-- Customer Information -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0; padding: 20px; background-color: #f9fafb; border-radius: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.03);">
                    <tr>
                      <td colspan="2">
                        <h2 style="font-size: 18px; font-weight: bold; color: #111827; margin: 0 0 20px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Customer Information</h2>
                      </td>
                    </tr>
                    <tr>
                      <td width="30%" style="padding: 7px 0; font-size: 14px; color: #6b7280; font-weight: 600;">Name:</td>
                      <td width="70%" style="padding: 7px 0; font-size: 14px; color: #374151;">${recieverDetails.firstName || ""} ${recieverDetails.lastName || ""}</td>
                    </tr>
                    <tr>
                      <td style="padding: 7px 0; font-size: 14px; color: #6b7280; font-weight: 600;">Email:</td>
                      <td style="padding: 7px 0; font-size: 14px; color: #374151;">${recieverDetails.email || ""}</td>
                    </tr>
                    ${
                      recieverDetails.phone
                        ? `
                    <tr>
                      <td style="padding: 7px 0; font-size: 14px; color: #6b7280; font-weight: 600;">Phone:</td>
                      <td style="padding: 7px 0; font-size: 14px; color: #374151;">${recieverDetails.phone}</td>
                    </tr>
                    `
                        : ""
                    }
                    ${
                      recieverDetails.deliveryAddress
                        ? `
                    <tr>
                      <td style="padding: 7px 0; font-size: 14px; color: #6b7280; font-weight: 600;">Delivery Address:</td>
                      <td style="padding: 7px 0; font-size: 14px; color: #374151;">${formatAddress(recieverDetails.deliveryAddress)}</td>
                    </tr>
                    `
                        : ""
                    }
                  </table>
                  
                  <!-- Order Items -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0; padding: 20px; background-color: #f9fafb; border-radius: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.03); overflow-x: auto;">
                    <tr>
                      <td colspan="4">
                        <h2 style="font-size: 18px; font-weight: bold; color: #111827; margin: 0 0 20px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Order Items</h2>
                      </td>
                    </tr>
                    
                    <!-- Table Headers -->
                    <tr style="border-bottom: 2px solid #e5e7eb;">
                      <th style="padding: 10px; text-align: left; font-size: 14px; color: #6b7280; font-weight: 600;">Product</th>
                      <th style="padding: 10px; text-align: center; font-size: 14px; color: #6b7280; font-weight: 600;">Qty</th>
                      <th style="padding: 10px; text-align: center; font-size: 14px; color: #6b7280; font-weight: 600;">Price</th>
                      <th style="padding: 10px; text-align: right; font-size: 14px; color: #6b7280; font-weight: 600;">Total</th>
                    </tr>
                    
                    <!-- Item Rows -->
                    ${itemsHtml}
                    
                    <!-- Order Total -->
                    <tr>
                      <td colspan="3" style="padding: 15px 10px; text-align: right; font-size: 16px; font-weight: bold; color: #111827;">Total</td>
                      <td style="padding: 15px 10px; text-align: right; font-size: 16px; font-weight: bold; color: #111827;">${formatCurrency(amount)}</td>
                    </tr>
                  </table>
                  
                  <!-- Thank You Message -->
                  <div style="text-align: center; margin: 30px 0;">
                    <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin: 0 0 22px;">Thank you for your purchase! If you have any questions about your order, please contact our customer support team.</p>
                    <a href="https://example.com/support" style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 500; margin-top: 10px;">Contact Support</a>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 25px; text-align: center; color: #6b7280; font-size: 14px; background-color: #f9fafb; border-radius: 0 0 8px 8px;">
                  <p style="margin: 0 0 10px;">© ${new Date().getFullYear()} LinkOrg Networks. All rights reserved.</p>
                  <p style="margin: 0 0 10px;">123 Business Street, London, UK</p>
                  <p style="margin: 0;">
                    <a href="https://example.com/privacy" style="color: #2563eb; text-decoration: none; margin: 0 5px;">Privacy Policy</a> •
                    <a href="https://example.com/terms" style="color: #2563eb; text-decoration: none; margin: 0 5px;">Terms of Service</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

export const PurchaseSuccessEmail: React.FC<PurchaseSuccessEmailProps> = ({
  transaction,
}) => {
  const { id, createdAt, amount, recieverDetails, items } = transaction;

  // ~ ======= Calculate order total ======= ~
  const calculateTotal = () => {
    return amount;
  };

  // ~ ======= Ensure items is always an array ======= ~
  const productItems = Array.isArray(items) ? items : [items].filter(Boolean);

  // ~ ======= Debug ======= ~
  console.log("Transaction items:", JSON.stringify(productItems, null, 2));

  return (
    <Html>
      <Head />
      <Preview>Thank you for your purchase! Order #{id.slice(0, 8)}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* ~ ======= Header section ======= ~ */}
          <Section style={headerSection}>
            <Img
              src="https://example.com/logo.png"
              width="120"
              height="40"
              alt="LinkOrgNet"
              style={logo}
            />
          </Section>

          {/* ~ ======= Main content ======= ~ */}
          <Section style={contentSection}>
            <Heading style={heading}>Order Confirmation</Heading>
            <Text style={paragraph}>
              Thank you for your purchase! Your order has been confirmed and
              will be processed shortly.
            </Text>

            {/* ~ ======= Order details ======= ~ */}
            <Section style={orderDetailSection}>
              <Heading as="h2" style={subheading}>
                Order Details
              </Heading>
              <Row>
                <Column style={labelColumn}>
                  <Text style={labelText}>Order Number:</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={valueText}>{id}</Text>
                </Column>
              </Row>
              <Row>
                <Column style={labelColumn}>
                  <Text style={labelText}>Date:</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={valueText}>{formatDate(createdAt)}</Text>
                </Column>
              </Row>
              <Row>
                <Column style={labelColumn}>
                  <Text style={labelText}>Total Amount:</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={valueTextHighlight}>
                    {formatCurrency(amount)}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* ~ ======= Customer information ======= ~ */}
            <Section style={orderDetailSection}>
              <Heading as="h2" style={subheading}>
                Customer Information
              </Heading>
              <Row>
                <Column style={labelColumn}>
                  <Text style={labelText}>Name:</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={valueText}>
                    {recieverDetails.firstName} {recieverDetails.lastName}
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column style={labelColumn}>
                  <Text style={labelText}>Email:</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={valueText}>{recieverDetails.email}</Text>
                </Column>
              </Row>
              {recieverDetails.phone && (
                <Row>
                  <Column style={labelColumn}>
                    <Text style={labelText}>Phone:</Text>
                  </Column>
                  <Column style={valueColumn}>
                    <Text style={valueText}>{recieverDetails.phone}</Text>
                  </Column>
                </Row>
              )}
              {recieverDetails.deliveryAddress && (
                <Row>
                  <Column style={labelColumn}>
                    <Text style={labelText}>Delivery Address:</Text>
                  </Column>
                  <Column style={valueColumn}>
                    <Text style={valueText}>
                      {typeof recieverDetails.deliveryAddress === "string"
                        ? recieverDetails.deliveryAddress
                        : formatAddress(recieverDetails.deliveryAddress)}
                    </Text>
                  </Column>
                </Row>
              )}
            </Section>

            {/* ~ ======= Order items ======= ~ */}
            <Section style={orderItemsSection}>
              <Heading as="h2" style={subheading}>
                Order Items
              </Heading>

              {/* ~ ======= Item headers ======= ~ */}
              <Row style={tableHeaderRow}>
                <Column style={productColumn}>
                  <Text style={tableHeaderText}>Product</Text>
                </Column>
                <Column style={quantityColumn}>
                  <Text style={tableHeaderText}>Qty</Text>
                </Column>
                <Column style={priceColumn}>
                  <Text style={tableHeaderText}>Price</Text>
                </Column>
                <Column style={totalColumn}>
                  <Text style={tableHeaderText}>Total</Text>
                </Column>
              </Row>

              <Hr style={divider} />

              {/* ~ ======= Item rows ======= ~ */}
              {productItems.length > 0 ? (
                productItems.map((item) => {
                  const itemPrice = parseFloat(item.product.price || "0");
                  const itemTotal = itemPrice * item.quantity;

                  return (
                    <React.Fragment key={item.id}>
                      <Row style={tableRow}>
                        <Column style={productColumn}>
                          <Row>
                            <Column style={{ width: "25%" }}>
                              <Img
                                src={item.product.imageUrl}
                                width="60"
                                height="60"
                                alt={item.product.name || "Product"}
                                style={productImage}
                              />
                            </Column>
                            <Column style={{ width: "75%" }}>
                              <Text style={productName}>
                                {item.product.name}
                              </Text>
                              <Text style={productCategory}>
                                {item.product.category}{" "}
                                {item.product.subclass
                                  ? `- ${item.product.subclass}`
                                  : ""}
                              </Text>
                            </Column>
                          </Row>
                        </Column>
                        <Column style={quantityColumn}>
                          <Text style={itemText}>{item.quantity}</Text>
                        </Column>
                        <Column style={priceColumn}>
                          <Text style={itemText}>
                            {formatCurrency(itemPrice)}
                          </Text>
                        </Column>
                        <Column style={totalColumn}>
                          <Text style={itemText}>
                            {formatCurrency(itemTotal)}
                          </Text>
                        </Column>
                      </Row>
                      <Hr style={itemDivider} />
                    </React.Fragment>
                  );
                })
              ) : (
                <Row>
                  <Column>
                    <Text
                      style={{
                        ...itemText,
                        textAlign: "center",
                        padding: "15px 0",
                      }}
                    >
                      No items found in this order.
                    </Text>
                  </Column>
                </Row>
              )}

              {/* ~ ======= Order total ======= ~ */}
              <Row style={totalRow}>
                <Column style={{ width: "75%" }}>
                  <Text style={totalText}>Total</Text>
                </Column>
                <Column style={{ width: "25%" }}>
                  <Text style={totalAmountText}>
                    {formatCurrency(calculateTotal())}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* ~ ======= Thank you message ======= ~ */}
            <Section style={ctaSection}>
              <Text style={paragraph}>
                Thank you for your purchase! If you have any questions about
                your order, please contact our customer support team.
              </Text>
              <Link href="https://example.com/support" style={ctaButton}>
                Contact Support
              </Link>
            </Section>
          </Section>

          {/* ~ ======= Footer ======= ~ */}
          <Section style={footerSection}>
            <Text style={footerText}>
              © {new Date().getFullYear()} Your Company. All rights reserved.
            </Text>
            <Text style={footerText}>123 Business Street, London, UK</Text>
            <Text style={footerLinks}>
              <Link href="https://example.com/privacy" style={footerLink}>
                Privacy Policy
              </Link>{" "}
              •
              <Link href="https://example.com/terms" style={footerLink}>
                {" "}
                Terms of Service
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default PurchaseSuccessEmail;

// ~ ======= Styles ======= ~
const main = {
  backgroundColor: "#f8fafc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "30px 0",
  maxWidth: "620px",
};

const headerSection = {
  padding: "25px",
  backgroundColor: "#ffffff",
  borderRadius: "8px 8px 0 0",
  borderBottom: "1px solid #e6ebf1",
  textAlign: "center" as const,
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
};

const logo = {
  margin: "0 auto",
};

const contentSection = {
  padding: "30px 25px",
  backgroundColor: "#ffffff",
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
};

const heading = {
  fontSize: "26px",
  fontWeight: "bold",
  color: "#111827",
  margin: "0 0 20px",
  textAlign: "center" as const,
  lineHeight: "1.3",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#4b5563",
  margin: "0 0 22px",
};

const orderDetailSection = {
  margin: "30px 0",
  padding: "20px",
  backgroundColor: "#f9fafb",
  borderRadius: "6px",
  boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
};

const orderItemsSection = {
  margin: "30px 0",
  padding: "20px",
  backgroundColor: "#f9fafb",
  borderRadius: "6px",
  boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
  overflowX: "auto" as const,
};

const subheading = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#111827",
  margin: "0 0 20px",
  borderBottom: "1px solid #e5e7eb",
  paddingBottom: "10px",
};

const labelColumn = {
  width: "30%",
};

const valueColumn = {
  width: "70%",
};

const labelText = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "7px 0",
  fontWeight: "600",
};

const valueText = {
  fontSize: "14px",
  color: "#374151",
  margin: "7px 0",
};

const valueTextHighlight = {
  fontSize: "14px",
  color: "#111827",
  margin: "7px 0",
  fontWeight: "bold",
};

const tableHeaderRow = {
  backgroundColor: "#f3f4f6",
  borderRadius: "6px 6px 0 0",
  padding: "10px 0",
};

const tableHeaderText = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#4b5563",
  margin: "0",
  padding: "8px",
};

const tableRow = {
  padding: "14px 0",
};

const productColumn = {
  width: "50%",
};

const quantityColumn = {
  width: "15%",
  textAlign: "center" as const,
};

const priceColumn = {
  width: "15%",
  textAlign: "right" as const,
};

const totalColumn = {
  width: "20%",
  textAlign: "right" as const,
};

const productImage = {
  borderRadius: "6px",
  border: "1px solid #e5e7eb",
  margin: "0 auto",
  display: "block",
  objectFit: "cover" as const,
};

const productName = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#111827",
  margin: "0 0 5px",
};

const productCategory = {
  fontSize: "12px",
  color: "#6b7280",
  margin: "0",
};

const itemText = {
  fontSize: "14px",
  color: "#374151",
  margin: "0",
};

const divider = {
  borderTop: "1px solid #e5e7eb",
  margin: "10px 0",
};

const itemDivider = {
  borderTop: "1px dashed #e5e7eb",
  margin: "8px 0",
};

const totalRow = {
  padding: "18px 0 5px",
  borderTop: "2px solid #e5e7eb",
  marginTop: "15px",
};

const totalText = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#111827",
  margin: "0",
  textAlign: "right" as const,
};

const totalAmountText = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#2563eb",
  margin: "0",
  textAlign: "right" as const,
};

const ctaSection = {
  margin: "30px 0 15px",
  textAlign: "center" as const,
  padding: "10px",
};

const ctaButton = {
  backgroundColor: "#2563eb",
  color: "#ffffff",
  padding: "12px 28px",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  borderRadius: "6px",
  display: "inline-block",
  margin: "10px 0",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
};

const footerSection = {
  backgroundColor: "#ffffff",
  padding: "25px",
  borderRadius: "0 0 8px 8px",
  borderTop: "1px solid #e6ebf1",
  textAlign: "center" as const,
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
};

const footerText = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "6px 0",
};

const footerLinks = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "18px 0 0",
};

const footerLink = {
  color: "#2563eb",
  textDecoration: "none",
};
