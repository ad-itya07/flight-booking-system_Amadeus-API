const AMADEUS_TOKEN_URL =
  "https://test.api.amadeus.com/v1/security/oauth2/token";
const AMADEUS_SEARCH_URL =
  "https://test.api.amadeus.com/v1/reference-data/locations";

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_CLIENT_SECRET;
const TOKEN_STORAGE_KEY = process.env.NEXT_PUBLIC_TOKEN_STORAGE_KEY;

const getStoredToken = () => {
  if (typeof window === "undefined") return null;
  const tokenData = JSON.parse(localStorage.getItem(TOKEN_STORAGE_KEY));
  if (!tokenData) return null;

  const { access_token, expires_at } = tokenData;
  const isExpired = new Date().getTime() > expires_at;

  return isExpired ? null : access_token;
};

const storeToken = (access_token, expires_in) => {
  const expires_at = new Date().getTime() + expires_in * 1000; // convert seconds to ms
  const tokenData = { access_token, expires_at };
  localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokenData));
};

const fetchNewToken = async () => {
  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: "client_credentials",
  });

  const response = await fetch(AMADEUS_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) throw new Error("Failed to fetch Amadeus access token");

  const data = await response.json();
  storeToken(data.access_token, data.expires_in);
  return data.access_token;
};

export const searchLocations = async ({ keyword }) => {
  try {
    let token = getStoredToken();
    if (!token) {
      token = await fetchNewToken();
    }

    const url = `${AMADEUS_SEARCH_URL}?subType=AIRPORT&keyword=${encodeURIComponent(
      keyword
    )}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      // If unauthorized, token may have expired
      if (res.status === 401) {
        token = await fetchNewToken();
        return await searchLocations({ keyword }); // Retry once
      }
      throw new Error("Failed to fetch locations");
    }

    return await res.json();
  } catch (err) {
    console.error("Amadeus API Error:", err);
    throw err;
  }
};
