import axios from "axios";
import db from "@/services/db";
import { products } from "@/services/db/schema/product.schema";

/* ~ =================================== ~ */
/* -- Type definition for the API response item -- */
/* ~ =================================== ~ */
type ApiProduct = {
  item: string;
  description: string;
  class: string;
  subclass: string;
  Catergory: string;
  retail_price: string;
  price_each: string;
  free_stock: string;
  weight: string;
  description_short: string;
  web_name: string;
  description_long: string;
  accessory: string;
  ean: string;
  MPN: string;
  availability: string;
  image_url: string;
  virtual: string;
  psu_item: string | null;
  features: string | null;
  box_contents: string | null;
};

/* ~ =================================== ~ */
/* -- Transform API product to database schema -- */
/* ~ =================================== ~ */
const mapProductToSchema = (
  apiProduct: ApiProduct,
): typeof products.$inferInsert => {
  return {
    item: apiProduct.item,
    description: apiProduct.description,
    class: apiProduct.class,
    subclass: apiProduct.subclass || null,
    category: apiProduct.Catergory,
    retailPrice: apiProduct.retail_price ? apiProduct.retail_price : null,
    priceEach: apiProduct.price_each ? apiProduct.price_each : null,
    freeStock: apiProduct.free_stock,
    weight: apiProduct.weight,
    descriptionShort: apiProduct.description_short,
    webName: apiProduct.web_name,
    descriptionLong: apiProduct.description_long,
    accessory: apiProduct.accessory,
    ean: apiProduct.ean,
    mpn: apiProduct.MPN,
    availability: apiProduct.availability,
    imageUrl: apiProduct.image_url,
    virtual: apiProduct.virtual,
    psuItem: apiProduct.psu_item,
    features: apiProduct.features,
    boxContents: apiProduct.box_contents,
    inStock: parseInt(apiProduct.free_stock) > 0,
  };
};

export async function GET() {
  const providers = ["cisco", "yealink", "fanvil", "grandstream"];

  try {
    // ~ ======= Get the products from the API -->
    const response = await axios.get(
      "https://secure.provu.co.uk/prosys/price_list.php?LongDesc=yes&json=yes",
      {
        auth: {
          username: process.env.PROVU_API_USERNAME as string,
          password: process.env.PROVU_API_PASSWORD as string,
        },
      },
    );

    if (response.data?.items) {
      // ~ ======= Clear the database -->
      await db.delete(products);

      // ~ ======= Filter and transform products -->
      const availableProducts = Object.values(response.data.items)
        .filter(
          (item: unknown): item is ApiProduct =>
            typeof item === "object" &&
            item !== null &&
            "class" in item &&
            "image_url" in item &&
            providers.includes((item as ApiProduct).class),
        )
        .map(mapProductToSchema);

      // ~ ======= Insert the products into the database -->
      await db.insert(products).values(availableProducts);

      return Response.json({ success: true, count: availableProducts.length });
    }

    return Response.json({
      success: false,
      message: "No items found in response",
    });
  } catch (error) {
    console.error("Error updating products:", error);
    return Response.json(
      { success: false, error: "Failed to update products" },
      { status: 500 },
    );
  }
}
