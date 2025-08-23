import { test, expect } from '@playwright/test';
import { getApiKey, createAccount } from './helpers/auth.util.js';

test.describe('E2E Valid Transaction', () => {
  const baseURL = 'https://template.postman-echo.com';
  let apiKey;
  let fromAccountId;
  let toAccountId;

  test.beforeAll(async () => {
    apiKey = await getApiKey(baseURL);
  });

  test('should complete a fund transfer successfully', async ({ request }) => {
    const headers = {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    };

    fromAccountId = await createAccount(request, baseURL, apiKey, 'Alice - FromAccount', 50);
    toAccountId = await createAccount(request, baseURL, apiKey, 'Bob - ToAccount', 0);

    const txRes = await request.post(`${baseURL}/api/v1/transactions`, {
      headers,
      data: {
        fromAccountId,
        toAccountId,
        amount: 20,
        currency: 'COSMIC_COINS',
      },
    });

    expect(txRes.status()).toBe(200);
    const txBody = await txRes.json();
    expect(txBody.success).toBeTruthy();

    const toBalanceRes = await request.get(`${baseURL}/api/v1/accounts/${toAccountId}`, { headers });
    const { account: toBalance } = await toBalanceRes.json();
    expect(toBalance.balance).toBe(20);

    const fromBalanceRes = await request.get(`${baseURL}/api/v1/accounts/${fromAccountId}`, { headers });
    const { account: fromBalance } = await fromBalanceRes.json();
    expect(fromBalance.balance).toBe(30);
  });
});
