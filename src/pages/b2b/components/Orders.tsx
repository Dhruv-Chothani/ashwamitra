import React, { useState } from "react";
import { useBusinessOrders } from "@/hooks/useApi";
import { Package, MapPin, Calendar, Truck, CheckCircle, Clock, XCircle, Loader2 } from "lucide-react";

type Order = {
  _id: string;
  items: Array<{
    productName: string;
    quantity: number;
    pricePerUnit: number;
    total: number;
  }>;
  totalAmount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  deliveryAddress: string;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
};

const Orders: React.FC = () => {
  const { data: orders, isLoading, error } = useBusinessOrders();
  const [filter, setFilter] = useState<string>("All");

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-700 border border-yellow-300",
      processing: "bg-blue-100 text-blue-700 border border-blue-300",
      completed: "bg-green-100 text-green-700 border border-green-300",
      cancelled: "bg-red-100 text-red-700 border border-red-300",
    };
    
    const icons: Record<string, React.ReactNode> = {
      pending: <Clock className="w-3 h-3" />,
      processing: <Truck className="w-3 h-3" />,
      completed: <CheckCircle className="w-3 h-3" />,
      cancelled: <XCircle className="w-3 h-3" />,
    };
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full font-medium ${styles[status] || styles.pending}`}>
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading orders...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load orders</h3>
          <p className="text-gray-500">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h3>
          <p className="text-gray-500">You haven't placed any bulk orders yet.</p>
        </div>
      </div>
    );
  }

  const filteredOrders = filter === "All" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Bulk Orders</h2>
        <div className="flex gap-2">
          {["All", "pending", "processing", "completed", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order #{order._id.slice(-8)}
                  </h3>
                  {getStatusBadge(order.status)}
                </div>
                
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 text-sm">
                      <span className="font-medium text-gray-900">{item.productName}</span>
                      <span className="text-gray-500">{item.quantity} units</span>
                      <span className="text-gray-500">₹{item.pricePerUnit}/unit</span>
                      <span className="font-medium text-blue-600">₹{item.total}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  ₹{order.totalAmount}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4" />
                <span>{order.deliveryAddress}</span>
              </div>
              
              {order.trackingNumber && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Truck className="w-4 h-4" />
                  <span>Tracking: {order.trackingNumber}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
