/**
 * Simple REST API with:
 * - File-based JSON storage
 * - Validation
 * - Idempotent endpoint
 * - Middleware error handling
 */
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
const express = require("express");
const fs = require("fs");
const path = require("path");


const app = express();
app.use(express.json());

const DATA_PATH = path.join(__dirname, "data.json");

/* ================================
   Utility functions
================================ */

function readData() {
  const raw = fs.readFileSync(DATA_PATH);
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

function validatePassword(password) {
  if (!password) throw { status: 400, message: "Password cannot be empty." };
  if (password.length < 6)
    throw { status: 400, message: "Password must be at least 6 characters." };
}

function validateId(id) {
  const parsed = parseInt(id);
  if (isNaN(parsed) || parsed <= 0)
    throw { status: 400, message: "Invalid ID format." };
  return parsed;
}

function validateJSONStructure(data) {
  if (!data.users || !data.subscriptions)
    throw { status: 500, message: "Invalid JSON structure." };
}

/* ================================
   Routes
================================ */

/**
 * POST /users
 * Creates new user
 */
app.post("/users", (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username)
      throw { status: 400, message: "Username is required." };

    validatePassword(password);

    const data = readData();
    validateJSONStructure(data);

    const existingUser = data.users.find(u => u.username === username);
    if (existingUser)
      throw { status: 409, message: "User already exists." };

    const newUser = {
      id: data.users.length + 1,
      username,
      password
    };

    data.users.push(newUser);
    writeData(data);

    res.status(201).json({ message: "User created." });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /auth/login
 */
app.post("/auth/login", (req, res, next) => {
  try {
    const { username, password } = req.body;

    const data = readData();
    validateJSONStructure(data);

    const user = data.users.find(u => u.username === username);

    if (!user || user.password !== password)
      throw { status: 401, message: "Invalid credentials." };

    res.status(200).json({ message: "Login successful", userId: user.id });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /users/:id/password
 */
app.put("/users/:id/password", (req, res, next) => {
  try {
    const id = validateId(req.params.id);
    const { password } = req.body;

    validatePassword(password);

    const data = readData();
    validateJSONStructure(data);

    const user = data.users.find(u => u.id === id);
    if (!user)
      throw { status: 404, message: "User not found." };

    if (user.password === password)
      throw { status: 409, message: "New password must be different." };

    user.password = password;
    writeData(data);

    res.status(200).json({ message: "Password updated." });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /subscriptions
 * IDempotent action:
 * If the same user subscribes to the same plan twice,
 * the server returns the existing subscription instead of creating a duplicate.
 */
app.post("/subscriptions", (req, res, next) => {
  try {
    const { userId, plan } = req.body;

    const parsedUserId = validateId(userId);

    if (!plan)
      throw { status: 400, message: "Plan is required." };

    const data = readData();
    validateJSONStructure(data);

    const user = data.users.find(u => u.id === parsedUserId);
    if (!user)
      throw { status: 404, message: "User not found." };

    const existing = data.subscriptions.find(
      s => s.userId === parsedUserId && s.plan === plan
    );

    // 🔁 Idempotent behavior
    if (existing) {
      return res.status(200).json({
        message: "Subscription already exists (idempotent).",
        subscription: existing
      });
    }

    const newSub = {
      id: data.subscriptions.length + 1,
      userId: parsedUserId,
      plan
    };

    data.subscriptions.push(newSub);
    writeData(data);

    res.status(201).json({ message: "Subscription created.", subscription: newSub });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /subscriptions/:id
 */
app.delete("/subscriptions/:id", (req, res, next) => {
  try {
    const id = validateId(req.params.id);

    const data = readData();
    validateJSONStructure(data);

    const index = data.subscriptions.findIndex(s => s.id === id);
    if (index === -1)
      throw { status: 404, message: "Subscription not found." };

    data.subscriptions.splice(index, 1);
    writeData(data);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

/* ================================
   Error Middleware
================================ */

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error"
  });
});

/* ================================
   Server Start
================================ */

app.listen(5173, () => {
  console.log("Server running on http://localhost:5173");
});