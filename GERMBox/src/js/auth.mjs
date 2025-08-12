// auth.mjs - very simple localStorage-based mock auth
import { setLS, getLS } from './utils.mjs';

const USER_KEY = 'germbox:user';

export function currentUser() {
  return getLS(USER_KEY);
}

export function login(email, password) {
  // In real app: send request to backend.
  if (!email || !password) return false;
  const user = { email, loggedAt: Date.now() };
  setLS(USER_KEY, user);
  return user;
}

export function signup({email, password}) {
  // store user (mock)
  if (!email || !password) return false;
  const user = { email, createdAt: Date.now() };
  setLS(USER_KEY, user);
  return user;
}

export function logout() {
  setLS(USER_KEY, null);
}
