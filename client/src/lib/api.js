const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";

const buildQueryString = (query = {}) =>
  new URLSearchParams(
    Object.entries(query).filter(([, value]) => value !== "" && value !== undefined && value !== null)
  ).toString();

const request = async (path, options = {}) => {
  const { token, headers, ...fetchOptions } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    },
    ...fetchOptions
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
};

export const api = {
  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  login: (payload) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  forgotPassword: (payload) =>
    request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  resetPassword: (token, payload) =>
    request(`/auth/reset-password/${token}`, {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  getComponents: (query, signal) => request(`/components?${buildQueryString(query)}`, { signal }),
  getPricingQuote: (components) =>
    request("/pricing/quote", {
      method: "POST",
      body: JSON.stringify({ components })
    }),
  getPerformanceEstimate: (parts) =>
    request("/performance/estimate", {
      method: "POST",
      body: JSON.stringify({ parts })
    }),
  generateAutoBuild: (payload) =>
    request("/auto-build/generate", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  saveBuild: (payload, token) =>
    request("/build/save", {
      method: "POST",
      token,
      body: JSON.stringify(payload)
    }),
  updateBuild: (id, payload, token) =>
    request(`/build/${id}`, {
      method: "PUT",
      token,
      body: JSON.stringify(payload)
    }),
  deleteBuild: (id, token) =>
    request(`/build/${id}`, {
      method: "DELETE",
      token
    }),
  getSavedBuilds: (token) =>
    request("/build/user/list", {
      token
    }),
  getBuild: (id) => request(`/build/${id}`)
};