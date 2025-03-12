import axios from "axios";

// ~ ======= Token cache to avoid unnecessary requests ======= ~
let cachedToken: { token: string; expiresAt: number } | null = null;

/**
 * Gets a valid access token for Microsoft Graph API
 * Returns a cached token if it's still valid, otherwise requests a new one
 */
export const getGraphToken = async (): Promise<string> => {
  const { OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_TENANT_ID } = process.env;

  // ~ ======= Validate required environment variables ======= ~
  if (!OAUTH_CLIENT_ID || !OAUTH_CLIENT_SECRET || !OAUTH_TENANT_ID) {
    throw new Error("OAuth credentials are missing in environment variables");
  }

  // ~ ======= Check if we have a valid cached token ======= ~
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  // ~ ======= Request a new token if none cached or expired ======= ~
  try {
    const response = await axios.post(
      `https://login.microsoftonline.com/${OAUTH_TENANT_ID}/oauth2/v2.0/token`,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: OAUTH_CLIENT_ID,
        client_secret: OAUTH_CLIENT_SECRET,
        scope: "https://graph.microsoft.com/.default",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    const accessToken = response.data.access_token;
    const expiresIn = response.data.expires_in;

    // ~ ======= Cache the token with expiry time (with 1 minute buffer) ======= ~
    cachedToken = {
      token: accessToken,
      expiresAt: Date.now() + expiresIn * 1000 - 60000, // Expire 1 minute early as safety buffer
    };

    return accessToken;
  } catch (error) {
    console.error("Failed to obtain Microsoft Graph token:", error);
    throw new Error("Failed to authenticate with Microsoft Graph");
  }
};

/**
 * Example function to make a Graph API call
 * Uses the cached token mechanism
 */
export const sendEmailWithRetry = async (
  recipient: string,
  subject: string,
  body: string,
  retires: number = 3,
) => {
  let attempt = 0;

  while (attempt < retires) {
    try {
      const token = await getGraphToken();
      const emailData = {
        subject,
      };
    } catch (error) {
      if (attempt === retires - 1) {
        throw error;
      }
    }
  }
};
