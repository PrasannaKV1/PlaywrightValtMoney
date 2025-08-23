import { test, expect } from '@playwright/test';

test.describe('🧪 Postman Echo Basic API Tests', () => {
  const baseURL = 'https://postman-echo.com';

  test('GET /get should echo query params', async ({ request }) => {
    const res = await request.get(`${baseURL}/get?foo=bar`);
    expect(res.status()).toBe(200);

    const { args } = await res.json();
    console.log('GET Response:', args);
    expect(args.foo).toBe('bar');
  });

  test('POST /post should echo body', async ({ request }) => {
    const payload = { name: 'Playwright', type: 'API Test' };

    const res = await request.post(`${baseURL}/post`, {
      data: payload,
    });

    expect(res.status()).toBe(200);

    const { data } = await res.json();
    console.log('POST Response:', data);
    expect(data.name).toBe('Playwright');
    expect(data.type).toBe('API Test');
  });
});
