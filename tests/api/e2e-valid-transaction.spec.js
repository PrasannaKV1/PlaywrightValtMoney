import { test, expect } from "@playwright/test";

let fromAccountId;
let toAccountId;


test.describe("E2E Valid Transaction", () => {
  test("should complete a fund transfer successfully", async ({ request }) => {
    // Step 1: Generate API Key
    const keyRes = await request.get("/api/v1/auth");
    expect(keyRes.status()).toBe(200);
    const { apiKey } = await keyRes.json();
    expect(apiKey).toBeTruthy();

    // Step 2: Create FromAccount
    const fromRes = await request.post("/api/v1/accounts", {
      data: { owner: "Alice - FromAccount", balance: 50, currency: "COSMIC_COINS" },
    });
    const fromBody = await fromRes.json();
    fromAccountId = fromBody.account.id;
    expect(fromAccountId).toBeGreaterThan(0);

    // Step 3: Create ToAccount
    const toRes = await request.post("/api/v1/accounts", {
      data: { owner: "Bob - ToAccount", balance: 0, currency: "COSMIC_COINS" },
    });
    const toBody = await toRes.json();
    toAccountId = toBody.account.id;
    expect(toAccountId).toBeGreaterThan(0);

    // Step 4: Create Transaction
    const txRes = await request.post("/api/v1/transactions", {
      headers: { "api-key": apiKey },
      data: { fromAccountId, toAccountId, amount: 20, currency: "COSMIC_COINS" },
    });
    const txBody = await txRes.json();
    expect(txBody.success).toBeTruthy();

    // Step 5: Verify ToAccount balance = 20
    const toBalance = await (await request.get(`/api/v1/accounts/${toAccountId}`)).json();
    expect(toBalance.account.balance).toBe(20);

    // Step 6: Verify FromAccount balance = 30
    const fromBalance = await (await request.get(`/api/v1/accounts/${fromAccountId}`)).json();
    expect(fromBalance.account.balance).toBe(30);
  });
});
