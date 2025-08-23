import { test, expect } from '@playwright/test';
import { getApiKey, createAccount } from './helpers/auth.util.js';

test.describe('E2E Invalid Transaction', () => {
  const baseURL = 'https://template.postman-echo.com';
  let apiKey;
  let fromAccountId;
  let toAccountId;

  test.beforeAll(async ({ request }) => {
    apiKey = await getApiKey(baseURL);
    fromAccountId = await createAccount(request, baseURL, apiKey, 'Edyth - FromAccount', 0);
    toAccountId = await createAccount(request, baseURL, apiKey, 'Waylon - ToAccount', 0);
  });

  test('should fail with insufficient funds', async ({ request }) => {
    const headers = {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    };

    const invalidTx = {
      fromAccountId,
      toAccountId,
      amount: 20,
      currency: 'COSMIC_COINS',
    };

    const res = await request.post(`${baseURL}/api/v1/transactions`, {
      headers,
      data: invalidTx,
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.name).toBe('invalidBody');
    expect(body.message).toContain('Insufficient balance');
  });
});
