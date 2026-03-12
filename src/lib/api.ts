const configuredApiBase = import.meta.env.VITE_API_BASE_URL as string | undefined;
const configuredApiHost = import.meta.env.VITE_API_URL as string | undefined;
const LIVE_API_URL = "https://ashwamitra-backend.onrender.com/api";
const LOCAL_API_URL = "http://localhost:5000/api";

const API_BASE_URL = configuredApiBase
  || (configuredApiHost ? `${configuredApiHost.replace(/\/$/, "")}/api` : LIVE_API_URL);

export const getToken = () => localStorage.getItem("token");
export const setToken = (token: string) => localStorage.setItem("token", token);
export const removeToken = () => localStorage.removeItem("token");

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  // Always try live API first
  const liveUrl = `${LIVE_API_URL}${endpoint}`;
  const localUrl = `${LOCAL_API_URL}${endpoint}`;
  
  console.log(`🌐 Trying live API: ${liveUrl}`);
  
  try {
    const res = await fetch(liveUrl, { ...options, headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message || "API Error");
    console.log(`✅ Live API success: ${liveUrl}`);
    return data;
  } catch (error) {
    console.warn(`❌ Live API failed: ${liveUrl}`, error);
    console.log(`🔄 Trying localhost: ${localUrl}`);
    
    try {
      const localRes = await fetch(localUrl, { ...options, headers });
      const localData = await localRes.json();
      if (!localRes.ok) throw new Error(localData.error || localData.message || "API Error");
      console.log(`✅ Localhost success: ${localUrl}`);
      return localData;
    } catch (localError) {
      console.error(`❌ Both APIs failed. Live: ${liveUrl}, Local: ${localUrl}`);
      throw error; // Throw the original error
    }
  }
}

// ==================== AUTH ====================
export const authApi = {
  login: (email: string, password: string, role?: string) =>
    apiFetch<{ token: string; user: any; message: string }>("/auth/login", {
      method: "POST", body: JSON.stringify({ email, password, role }),
    }),
  register: (data: any) =>
    apiFetch<{ token: string; user: any; message: string }>("/auth/register", {
      method: "POST", body: JSON.stringify(data),
    }),
  getMe: () => apiFetch<{ user: any; profile: any }>("/auth/me"),
  changePassword: (currentPassword: string, newPassword: string) =>
    apiFetch<{ message: string }>("/auth/change-password", {
      method: "PUT", body: JSON.stringify({ currentPassword, newPassword }),
    }),
};

// ==================== PRODUCTS ====================
export const productsApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiFetch<{ products: any[] }>(`/products${query}`);
  },
  getById: (id: string) => apiFetch<any>(`/products/${id}`),
  create: (data: any) => apiFetch<any>("/products", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiFetch<any>(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => apiFetch<any>(`/products/${id}`, { method: "DELETE" }),
  getMyProducts: () => apiFetch<any[]>("/products/farmer/my-products"),
};

// ==================== ORDERS ====================
export const ordersApi = {
  create: (data: any) => apiFetch<any>("/orders", { method: "POST", body: JSON.stringify(data) }),
  getMyOrders: () => apiFetch<any[]>("/orders/my-orders"),
  getById: (id: string) => apiFetch<any>(`/orders/${id}`),
  updateStatus: (id: string, status: string) =>
    apiFetch<any>(`/orders/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }),
  cancel: (id: string) => apiFetch<any>(`/orders/${id}/cancel`, { method: "PUT" }),
};

// ==================== PAYMENTS ====================
export const paymentsApi = {
  create: (data: any) => apiFetch<any>("/payments", { method: "POST", body: JSON.stringify(data) }),
  getMyPayments: () => apiFetch<any[]>("/payments/my-payments"),
  getById: (id: string) => apiFetch<any>(`/payments/${id}`),
  settle: (id: string) => apiFetch<any>(`/payments/${id}/settle`, { method: "PUT" }),
};

// ==================== FARMER ====================
export const farmerApi = {
  getProfile: () => apiFetch<any>("/farmers/profile"),
  updateProfile: (data: any) => apiFetch<any>("/farmers/profile", { method: "PUT", body: JSON.stringify(data) }),
  getDashboard: () => apiFetch<any>("/farmers/dashboard"),
  getOrders: () => apiFetch<any[]>("/farmers/orders"),
  getPayments: () => apiFetch<any[]>("/farmers/payments"),
};

// ==================== BUSINESS (B2B) ====================
export const businessApi = {
  getProfile: () => apiFetch<any>("/businesses/profile"),
  updateProfile: (data: any) => apiFetch<any>("/businesses/profile", { method: "PUT", body: JSON.stringify(data) }),
  getDashboard: () => apiFetch<any>("/businesses/dashboard"),
  getOrders: () => apiFetch<any[]>("/businesses/orders"),
  getPayments: () => apiFetch<any[]>("/businesses/payments"),
};

// ==================== CUSTOMER ====================
export const customerApi = {
  getProfile: () => apiFetch<any>("/customers/profile"),
  updateProfile: (data: any) => apiFetch<any>("/customers/profile", { method: "PUT", body: JSON.stringify(data) }),
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
  getFarmerById: (id: string) => apiFetch<any>(`/admin/farmers/${id}`),
  getBusinesses: () => apiFetch<any[]>("/admin/businesses"),
  getBusinessById: (id: string) => apiFetch<any>(`/admin/businesses/${id}`),
  getOrders: () => apiFetch<any[]>("/admin/orders"),
  getPayments: () => apiFetch<any[]>("/admin/payments"),
  approveFarmer: (id: string, approved: boolean) =>
    apiFetch<any>(`/admin/farmers/${id}/approve`, { method: "PUT", body: JSON.stringify({ approved }) }),
  verifyBusiness: (id: string, verified: boolean) =>
    apiFetch<any>(`/admin/businesses/${id}/verify`, { method: "PUT", body: JSON.stringify({ verified }) }),
  updateUserStatus: (id: string, status: string) =>
    apiFetch<any>(`/admin/users/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }),
  exportReport: (type: string) => apiFetch<any>(`/admin/export?type=${type}`),
  getContactMessages: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiFetch<any[]>(`/contact-messages${query}`);
  },
  updateContactMessageStatus: (id: string, status: "pending" | "read" | "responded") =>
    apiFetch<any>(`/contact-messages/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
};

// ==================== CONTACT ====================
export const contactApi = {
  submitMessage: (data: { name: string; email: string; phone: string; message: string }) =>
    apiFetch<any>("/contact-messages", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ==================== DELIVERY ====================
export const deliveryApi = {
  updateDelivery: (orderId: string, data: any) =>
    apiFetch<any>(`/delivery/orders/${orderId}/delivery`, { method: "PUT", body: JSON.stringify(data) }),
  getInTransit: () => apiFetch<any[]>("/delivery/in-transit"),
  track: (orderId: string) => apiFetch<any>(`/delivery/track/${orderId}`),
};

// ==================== NOTIFICATIONS ====================
export const notificationsApi = {
  getAll: () => apiFetch<any[]>("/notifications"),
  markRead: (id: string) => apiFetch<any>(`/notifications/${id}/read`, { method: "PUT" }),
  markAllRead: () => apiFetch<any>("/notifications/read-all", { method: "PUT" }),
};

// ==================== WALLET ====================
export const walletApi = {
  getMyWallet: () => apiFetch<any>("/wallet/my-wallet"),
  addMoney: (userId: string, amount: number, description?: string) =>
    apiFetch<any>("/wallet/add-money", { method: "POST", body: JSON.stringify({ userId, amount, description }) }),
  deduct: (amount: number, description?: string) =>
    apiFetch<any>("/wallet/deduct", { method: "POST", body: JSON.stringify({ amount, description }) }),
  getAll: () => apiFetch<any[]>("/wallet/all"),
};

// ==================== RAZORPAY ====================
export const razorpayApi = {
  getConfig: () => apiFetch<{ keyId: string }>("/razorpay/config"),
  createOrder: (orderId: string) =>
    apiFetch<{
      orderId: string;
      amount: number;
      currency: string;
      paymentRecordId: string;
      marketplaceOrderId: string;
    }>("/razorpay/create-order", {
      method: "POST",
      body: JSON.stringify({ orderId }),
    }),
  verify: (payload: {
    orderId: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) =>
    apiFetch<any>("/razorpay/verify", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  refund: (paymentId: string, amount?: number) =>
    apiFetch<any>("/razorpay/refund", {
      method: "POST",
      body: JSON.stringify({ paymentId, amount }),
    }),
};
