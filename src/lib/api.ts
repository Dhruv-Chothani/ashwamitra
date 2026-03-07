// API Configuration - Update this to your backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Token management
export const getToken = () => localStorage.getItem("token");
export const setToken = (token: string) => localStorage.setItem("token", token);
export const removeToken = () => localStorage.removeItem("token");

// Base fetch wrapper with auth
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || "API Error");
  return data;
}

// ==================== AUTH ====================
export const authApi = {
  login: (email: string, password: string, role?: string) =>
    apiFetch<{ token: string; user: any; message: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, role }),
    }),

  register: (data: any) =>
    apiFetch<{ token: string; user: any; message: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMe: () => apiFetch<{ user: any; profile: any }>("/auth/me"),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiFetch<{ message: string }>("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
};

// ==================== PRODUCTS ====================
export const productsApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiFetch<{ products: any[] }>(`/products${query}`);
  },

  getById: (id: string) => apiFetch<any>(`/products/${id}`),

  create: (data: any) =>
    apiFetch<any>("/products", { method: "POST", body: JSON.stringify(data) }),

  update: (id: string, data: any) =>
    apiFetch<any>(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  delete: (id: string) =>
    apiFetch<any>(`/products/${id}`, { method: "DELETE" }),

  getMyProducts: () => apiFetch<any[]>("/products/farmer/my-products"),
};

// ==================== ORDERS ====================
export const ordersApi = {
  create: (data: any) =>
    apiFetch<any>("/orders", { method: "POST", body: JSON.stringify(data) }),

  getMyOrders: () => apiFetch<any[]>("/orders/my-orders"),

  getById: (id: string) => apiFetch<any>(`/orders/${id}`),

  updateStatus: (id: string, status: string) =>
    apiFetch<any>(`/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),

  cancel: (id: string) =>
    apiFetch<any>(`/orders/${id}/cancel`, { method: "PUT" }),
};

// ==================== PAYMENTS ====================
export const paymentsApi = {
  create: (data: any) =>
    apiFetch<any>("/payments", { method: "POST", body: JSON.stringify(data) }),

  getMyPayments: () => apiFetch<any[]>("/payments/my-payments"),

  getById: (id: string) => apiFetch<any>(`/payments/${id}`),

  settle: (id: string) =>
    apiFetch<any>(`/payments/${id}/settle`, { method: "PUT" }),
};

// ==================== FARMER ====================
export const farmerApi = {
  getProfile: () => apiFetch<any>("/farmers/profile"),

  updateProfile: (data: any) =>
    apiFetch<any>("/farmers/profile", { method: "PUT", body: JSON.stringify(data) }),

  getDashboard: () => apiFetch<any>("/farmers/dashboard"),

  getOrders: () => apiFetch<any[]>("/farmers/orders"),

  getPayments: () => apiFetch<any[]>("/farmers/payments"),
};

// ==================== BUSINESS (B2B) ====================
export const businessApi = {
  getProfile: () => apiFetch<any>("/businesses/profile"),

  updateProfile: (data: any) =>
    apiFetch<any>("/businesses/profile", { method: "PUT", body: JSON.stringify(data) }),

  getDashboard: () => apiFetch<any>("/businesses/dashboard"),

  getOrders: () => apiFetch<any[]>("/businesses/orders"),

  getPayments: () => apiFetch<any[]>("/businesses/payments"),
};

// ==================== CUSTOMER ====================
export const customerApi = {
  getProfile: () => apiFetch<any>("/customers/profile"),

  updateProfile: (data: any) =>
    apiFetch<any>("/customers/profile", { method: "PUT", body: JSON.stringify(data) }),

  getDashboard: () => apiFetch<any>("/customers/dashboard"),

  getOrders: () => apiFetch<any[]>("/customers/orders"),
};

// ==================== ADMIN ====================
export const adminApi = {
  getDashboard: () => apiFetch<any>("/admin/dashboard"),

  getUsers: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiFetch<{ users: any[]; total: number; page: number; totalPages: number }>(`/admin/users${query}`);
  },

  getFarmers: () => apiFetch<any[]>("/admin/farmers"),

  getBusinesses: () => apiFetch<any[]>("/admin/businesses"),

  getOrders: () => apiFetch<any[]>("/admin/orders"),

  getPayments: () => apiFetch<any[]>("/admin/payments"),

  approveFarmer: (id: string, approved: boolean) =>
    apiFetch<any>(`/admin/farmers/${id}/approve`, {
      method: "PUT",
      body: JSON.stringify({ approved }),
    }),

  verifyBusiness: (id: string, verified: boolean) =>
    apiFetch<any>(`/admin/businesses/${id}/verify`, {
      method: "PUT",
      body: JSON.stringify({ verified }),
    }),

  updateUserStatus: (id: string, status: string) =>
    apiFetch<any>(`/admin/users/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),

  exportReport: (type: string) =>
    apiFetch<any>(`/admin/export?type=${type}`),
};

// ==================== DELIVERY ====================
export const deliveryApi = {
  updateDelivery: (orderId: string, data: any) =>
    apiFetch<any>(`/delivery/orders/${orderId}/delivery`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  getInTransit: () => apiFetch<any[]>("/delivery/in-transit"),

  track: (orderId: string) => apiFetch<any>(`/delivery/track/${orderId}`),
};

// ==================== NOTIFICATIONS ====================
export const notificationsApi = {
  getAll: () => apiFetch<any[]>("/notifications"),
  markRead: (id: string) =>
    apiFetch<any>(`/notifications/${id}/read`, { method: "PUT" }),
  markAllRead: () =>
    apiFetch<any>("/notifications/read-all", { method: "PUT" }),
};
