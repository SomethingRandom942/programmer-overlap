<script setup>
import { ref } from "vue";

const username = ref("");
const password = ref("");
const userId = ref("");
const plan = ref("");
const message = ref("");

const API = "http://localhost:5173";

async function register() {
  const res = await fetch(`${API}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username.value,
      password: password.value
    })
  });

  const data = await res.json();
  message.value = data.message || data.error;
}

async function login() {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username.value,
      password: password.value
    })
  });

  const data = await res.json();
  message.value = data.message || data.error;
}

async function subscribe() {
  const res = await fetch(`${API}/subscriptions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: userId.value,
      plan: plan.value
    })
  });

  const data = await res.json();
  message.value = data.message || data.error;
}
</script>

<template>
  <div class="container">
    <h1>User API Demo</h1>

    <div class="card">
      <h2>Register / Login</h2>
      <input v-model="username" placeholder="Username" />
      <input v-model="password" type="password" placeholder="Password" />
      <button @click="register">Register</button>
      <button @click="login">Login</button>
    </div>

    <div class="card">
      <h2>Subscribe</h2>
      <input v-model="userId" placeholder="User ID" />
      <input v-model="plan" placeholder="Plan (basic/premium)" />
      <button @click="subscribe">Subscribe</button>
    </div>

    <div class="message">
      {{ message }}
    </div>
  </div>
</template>

<style>
.container {
  max-width: 500px;
  margin: auto;
  padding: 20px;
  font-family: Arial;
}

.card {
  background: #f4f4f4;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
}

input {
  display: block;
  margin: 8px 0;
  padding: 6px;
  width: 100%;
}

button {
  margin-right: 10px;
  padding: 6px 10px;
  border: none;
  background: #42b883;
  color: white;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background: #36996f;
}

.message {
  margin-top: 20px;
  font-weight: bold;
}
</style>