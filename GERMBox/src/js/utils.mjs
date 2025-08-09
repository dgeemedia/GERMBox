// utils.js - small helpers
export function qs(sel, parent = document) {
  return parent.querySelector(sel);
}

export function qsa(sel, parent = document) {
  return Array.from(parent.querySelectorAll(sel));
}

// fetch an HTML partial/template from public or src path
export async function loadTemplate(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load template ${path}`);
  return await res.text();
}

// insert template into element; optionally call callback(data)
export function renderWithTemplate(template, parentElement, data = null, callback = null) {
  parentElement.innerHTML = template;
  if (typeof callback === 'function') callback(data);
}

// tiny localStorage helpers
export function getLS(key) {
  try { return JSON.parse(localStorage.getItem(key)); }
  catch { return null; }
}
export function setLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
