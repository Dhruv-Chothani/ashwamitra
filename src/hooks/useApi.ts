import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  authApi, productsApi, ordersApi, paymentsApi,
  farmerApi, businessApi, customerApi, adminApi, deliveryApi, notificationsApi,
} from "@/lib/api";
import { toast } from "sonner";

// ==================== AUTH ====================
export const useCurrentUser = () =>
  useQuery({ queryKey: ["currentUser"], queryFn: authApi.getMe, retry: false });

// ==================== PRODUCTS ====================
export const useProducts = (params?: Record<string, string>) =>
  useQuery({ queryKey: ["products", params], queryFn: () => productsApi.getAll(params) });

export const useMyProducts = () =>
  useQuery({ queryKey: ["myProducts"], queryFn: productsApi.getMyProducts });

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["myProducts"] }); toast.success("Product created"); },
    onError: (e: Error) => toast.error(e.message),
  });
};

export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => productsApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["myProducts"] }); toast.success("Product updated"); },
    onError: (e: Error) => toast.error(e.message),
  });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["myProducts"] }); toast.success("Product deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });
};

// ==================== ORDERS ====================
export const useMyOrders = () =>
  useQuery({ queryKey: ["myOrders"], queryFn: ordersApi.getMyOrders });

export const useCreateOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ordersApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["myOrders"] }); toast.success("Order placed!"); },
    onError: (e: Error) => toast.error(e.message),
  });
};

export const useCancelOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ordersApi.cancel,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["myOrders"] }); toast.success("Order cancelled"); },
    onError: (e: Error) => toast.error(e.message),
  });
};

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => ordersApi.updateStatus(id, status),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["myOrders"] }); toast.success("Order updated"); },
    onError: (e: Error) => toast.error(e.message),
  });
};

// ==================== PAYMENTS ====================
export const useMyPayments = () =>
  useQuery({ queryKey: ["myPayments"], queryFn: paymentsApi.getMyPayments });

export const useCreatePayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: paymentsApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["myPayments"] }); toast.success("Payment initiated"); },
    onError: (e: Error) => toast.error(e.message),
  });
};

// ==================== FARMER ====================
export const useFarmerDashboard = () =>
  useQuery({ queryKey: ["farmerDashboard"], queryFn: farmerApi.getDashboard });

export const useFarmerProfile = () =>
  useQuery({ queryKey: ["farmerProfile"], queryFn: farmerApi.getProfile });

export const useUpdateFarmerProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: farmerApi.updateProfile,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["farmerProfile"] }); toast.success("Profile updated"); },
    onError: (e: Error) => toast.error(e.message),
  });
};

export const useFarmerOrders = () =>
  useQuery({ queryKey: ["farmerOrders"], queryFn: farmerApi.getOrders });

export const useFarmerPayments = () =>
  useQuery({ queryKey: ["farmerPayments"], queryFn: farmerApi.getPayments });

// ==================== BUSINESS ====================
export const useBusinessDashboard = () =>
  useQuery({ queryKey: ["businessDashboard"], queryFn: businessApi.getDashboard });

export const useBusinessProfile = () =>
  useQuery({ queryKey: ["businessProfile"], queryFn: businessApi.getProfile });

export const useUpdateBusinessProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: businessApi.updateProfile,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["businessProfile"] }); toast.success("Profile updated"); },
    onError: (e: Error) => toast.error(e.message),
  });
};

export const useBusinessOrders = () =>
  useQuery({ queryKey: ["businessOrders"], queryFn: businessApi.getOrders });

export const useBusinessPayments = () =>
  useQuery({ queryKey: ["businessPayments"], queryFn: businessApi.getPayments });

// ==================== CUSTOMER ====================
export const useCustomerDashboard = () =>
  useQuery({ queryKey: ["customerDashboard"], queryFn: customerApi.getDashboard });

export const useCustomerProfile = () =>
  useQuery({ queryKey: ["customerProfile"], queryFn: customerApi.getProfile });

export const useUpdateCustomerProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: customerApi.updateProfile,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["customerProfile"] }); toast.success("Profile updated"); },
    onError: (e: Error) => toast.error(e.message),
  });
};

export const useCustomerOrders = () =>
  useQuery({ queryKey: ["customerOrders"], queryFn: customerApi.getOrders });

// ==================== ADMIN ====================
export const useAdminDashboard = () =>
  useQuery({ queryKey: ["adminDashboard"], queryFn: adminApi.getDashboard });

export const useAdminUsers = (params?: Record<string, string>) =>
  useQuery({ queryKey: ["adminUsers", params], queryFn: () => adminApi.getUsers(params) });

export const useAdminFarmers = () =>
  useQuery({ queryKey: ["adminFarmers"], queryFn: adminApi.getFarmers });

export const useAdminBusinesses = () =>
  useQuery({ queryKey: ["adminBusinesses"], queryFn: adminApi.getBusinesses });

export const useAdminOrders = () =>
  useQuery({ queryKey: ["adminOrders"], queryFn: adminApi.getOrders });

export const useAdminPayments = () =>
  useQuery({ queryKey: ["adminPayments"], queryFn: adminApi.getPayments });

export const useApproveFarmer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, approved }: { id: string; approved: boolean }) => adminApi.approveFarmer(id, approved),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["adminFarmers"] }); toast.success("Farmer status updated"); },
    onError: (e: Error) => toast.error(e.message),
  });
};

export const useVerifyBusiness = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, verified }: { id: string; verified: boolean }) => adminApi.verifyBusiness(id, verified),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["adminBusinesses"] }); toast.success("Business status updated"); },
    onError: (e: Error) => toast.error(e.message),
  });
};

export const useUpdateUserStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => adminApi.updateUserStatus(id, status),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["adminUsers"] }); toast.success("User status updated"); },
    onError: (e: Error) => toast.error(e.message),
  });
};

export const useExportReport = () =>
  useMutation({
    mutationFn: adminApi.exportReport,
    onSuccess: (data) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Report exported");
    },
    onError: (e: Error) => toast.error(e.message),
  });

// ==================== DELIVERY ====================
export const useInTransitOrders = () =>
  useQuery({ queryKey: ["inTransit"], queryFn: deliveryApi.getInTransit });

export const useTrackOrder = (orderId: string) =>
  useQuery({ queryKey: ["trackOrder", orderId], queryFn: () => deliveryApi.track(orderId), enabled: !!orderId });

// ==================== NOTIFICATIONS ====================
export const useNotifications = () =>
  useQuery({ queryKey: ["notifications"], queryFn: notificationsApi.getAll, retry: false });
