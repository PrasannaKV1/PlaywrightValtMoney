import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory storage
let accounts = [];
let transactions = [];
let accountIdCounter = 1;
let transactionIdCounter = 1;

// ✅ Reset route for Playwright tests
app.post("/api/v1/reset", (req, res) => {
  accounts = [];
  transactions = [];
  accountIdCounter = 1;
  transactionIdCounter = 1;
  res.json({ success: true, message: "Test data reset successfully" });
});

// ✅ Auth route
app.get("/api/v1/auth", (req, res) => {
  res.json({ apiKey: "test-api-key-123" });
});

// ✅ Create account
app.post("/api/v1/accounts", (req, res) => {
  const { owner, balance, currency } = req.body;
  const newAccount = {
    id: accountIdCounter++,
    owner,
    balance,
    currency,
  };
  accounts.push(newAccount);
  res.status(201).json({ account: newAccount });
});

// ✅ Get account by ID
app.get("/api/v1/accounts/:id", (req, res) => {
  const account = accounts.find(a => a.id === parseInt(req.params.id));
  if (!account) return res.status(404).json({ error: "Account not found" });
  res.json({ account });
});

// ✅ Create transaction
app.post("/api/v1/transactions", (req, res) => {
  const { fromAccountId, toAccountId, amount, currency } = req.body;

  const fromAccount = accounts.find(a => a.id === fromAccountId);
  const toAccount = accounts.find(a => a.id === toAccountId);

  if (!fromAccount || !toAccount) {
    return res.status(400).json({ error: "Invalid accounts" });
  }
  if (fromAccount.balance < amount) {
    return res.status(400).json({ error: "Insufficient funds" });
  }

  fromAccount.balance -= amount;
  toAccount.balance += amount;

  const newTx = {
    id: transactionIdCounter++,
    fromAccountId,
    toAccountId,
    amount,
    currency,
  };
  transactions.push(newTx);

  res.status(201).json({ success: true, transaction: newTx });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 API Server running at http://localhost:${PORT}`);
});
