import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { js2xml } from "xml-js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ~ ======= DiceBear utility function ======= ~
export const generateDiceBearUrl = (seed: string) => {
  // Generate a deterministic abstract image based on the product's item code
  return `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(seed)}&backgroundColor=transparent&radius=12`;
};

/**
 * Converts a given string to sentence case.
 * The function will capitalize the first letter of the first word and make all other letters lowercase.
 *
 * @param {string} str - The input string to be converted.
 * @returns {string} - The converted string in sentence case.
 */
export function toSentenceCase(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Retrieves the first result from a query that returns an array of results.
 * If the array is empty, it returns null.
 *
 * @template T - The type of the items in the array.
 * @param {Promise<T[]>} query - A promise that resolves to an array of items.
 * @returns {Promise<T | null>} - A promise that resolves to the first item in the array, or null if the array is empty.
 */
export async function getSingle<T>(query: Promise<T[]>): Promise<T | null> {
  const results = await query;
  return results.length > 0 ? results[0] : null;
}

/**
 * Generates a reference number with a given prefix.
 * The reference number will be 8 characters long, excluding the prefix.
 * It will be a mix of uppercase, lowercase letters, and numbers.
 *
 * @param {string} prefix - The prefix to be added to the reference number.
 * @returns {string} - The generated reference number with the prefix.
 */
export function generateReferenceNumber(prefix: string): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let referenceNumber = "";

  // Generate a random 8-character string
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    referenceNumber += characters[randomIndex];
  }

  // Return the reference number with the prefix
  return `${prefix}${referenceNumber}`;
}

/**
 * Formats a number to a human-readable string with k (thousands) or M (millions) suffix.
 * Examples:
 * - 800 → "800"
 * - 6400 → "6.4k"
 * - 1500000 → "1.5M"
 *
 * @param {number} value - The number to format
 * @returns {string} - The formatted string with appropriate suffix
 */
export function formatLargeNumber(value: number): string {
  if (!value) return "0";

  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }

  return value.toString();
}

/**
 * Converts a given amount to a sub-currency value.
 * The sub-currency value will be the amount multiplied by the factor.
 *
 * @param {number} amount - The amount to convert.
 * @param {number} [factor=100] - The factor to multiply the amount by.
 * @returns {number} - The converted sub-currency value.
 */
export const convertToSubCurrency = (amount: number, factor = 100) => {
  return Math.round(amount * factor);
};

/**
 * Converts a sub-currency value to a currency value.
 * The sub-currency value will be divided by 100.
 *
 * @param {number} amount - The amount to convert.
 * @returns {number} - The converted currency value.
 */
export const convertSubCurrencyToCurrency = (amount: number): number => {
  return amount / 100;
};

export const simpleOrderCreator = (args: OrderCreatorType) => {
  return js2xml(args, {
    compact: true,
    ignoreComment: true,
    spaces: 4,
  });
};
