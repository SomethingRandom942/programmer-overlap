import express from "express";
import fs from "fs/promises";
import crypto from "crypto";
import path from "path";

const app = express();
app.use(express.json());

const DB_PATH = path.resolve("users.csv");
const PASSWORD_MIN_LENGTH = 12;

/* ---------------- Utility helpers ---------------- */

function hashPassword(password, salt = crypto.randomBytes(16)) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(`${salt.toString("hex")}:${derivedKey.toString("hex")}`);
    });
  });
}

function timingSafeEqual(a, b) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

async function readUsers() {
  const raw = await fs.readFile(DB_PATH, "utf8");
  const lines = raw.trim().split("\n");

  const headers = lines.shift().split(",");
  return lines.map(line => {
    const values = line.split(",");
    return Object.fromEntries(headers.map((h, i) => [h, values[i]]));
  });
}

async function writeUsers(users) {
  const headers = Object.keys(users[0]);
  const rows = users.map(u => headers.map(h => u[h]).join(","));
  const csv = [headers.join(","), ...rows].join("\n");
  await fs.writeFile(DB_PATH, csv, "utf8");
}

/* ---------------- Validation ---------------- */

function validatePassword(pw) {
  if (typeof pw !== "string") return "Password must be a string";
  if (pw.length < PASSWORD_MIN_LENGTH)
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
  return null;
}

/* ---------------- Endpoint ---------------- */

app.post("/users/:id/password", async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword, nonce } = req.body;

    if (!newPassword || !nonce) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      return res.status(400).json({ error: passwordError });
    }

    const users = await readUsers();
    const user = users.find(u => u.id === id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Nonce check (prevents replay / idempotency)
    if (!timingSafeEqual(user.nonce || "", nonce)) {
      return res.status(401).json({ error: "Invalid or expired nonce" });
    }

    // Prevent password reuse
    const [salt, oldHash] = user.passwordHash.split(":");
    const newHash = await hashPassword(newPassword, Buffer.from(salt, "hex"));

    if (timingSafeEqual(user.passwordHash, newHash)) {
      return res.status(409).json({ error: "New password must be different" });
    }

    // Apply update
    user.passwordHash = newHash;
    user.nonce = ""; // invalidate nonce (non-idempotent)

    await writeUsers(users);

    res.status(200).json({ message: "Password updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ---------------- Boot ---------------- */

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});