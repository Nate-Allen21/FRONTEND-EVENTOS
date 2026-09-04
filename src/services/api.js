const normalizeBaseUrl = (value) => {
  if (!value) return value;
  return value.endsWith('/api') ? value : `${value.replace(/\/+$/, '')}/api`;
};

const BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_API_URL || (
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:8083'
      : 'https://eventos-backend.onrender.com'
  )
);

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = data?.message || data?.error || 'Erro ao realizar a operação.';
    throw new Error(message);
  }

  return data;
}

export async function get(path) {
  return request(path, { method: 'GET' });
}

export async function post(path, body) {
  return request(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function put(path, body) {
  return request(path, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function del(path) {
  return request(path, { method: 'DELETE' });
}
