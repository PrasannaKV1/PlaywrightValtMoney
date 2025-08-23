import { request } from '@playwright/test';

/**
 * Fetches an API key from the Intergalactic Bank API.
 */
export async function getApiKey(baseURL) {
  const req = await request.newContext();
  const res = await req.get(`${baseURL}/api/v1/auth`);

  if (res.status() !== 200) {
    throw new Error(`Auth failed: ${res.status()}`);
  }

  const body = await res.json();
  if (!body.apiKey) {
    throw new Error('No apiKey returned in response');
  }

  console.log('Fetched API Key:', body.apiKey);
  return body.apiKey;
}

/**
 * Creates an account with the given owner and balance.
 */
export async function createAccount(request, baseURL, apiKey, owner, balance) {
  const res = await request.post(`${baseURL}/api/v1/accounts`, {
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    data: {
      owner,
      balance,
      currency: 'COSMIC_COINS',
    },
  });

  if (res.status() !== 200) {
    throw new Error(`Failed to create account: ${res.status()}`);
  }

  const { account } = await res.json();
  return account.id;
}
