import React, { useState, useEffect } from "react";
import { WalletUtils, WalletTransaction, WalletData } from "../../utils/walletUtils";
import { Wallet, Plus, Minus, Clock, TrendingUp, TrendingDown, RefreshCw, User, Mail, Phone, Calendar, Package, CheckCircle, XCircle } from "lucide-react";

interface CustomerInfo {
  id: string;
  name: string;
  email: string;
  phone?: string;
  orders: number;
  spent: number;
  status: "Active" | "Blocked";
  joinDate: string;
}

interface WalletComponentProps {
  userId: string;
  userName?: string;
}

const WalletComponent: React.FC<WalletComponentProps> = ({ userId, userName }) => {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock customer data - in real app, this would come from API
  const getCustomerInfo = (userId: string): CustomerInfo => {
    const customers: Record<string, CustomerInfo> = {
      "customer_001": {
        id: "customer_001",
        name: "Abhijeet Kumar",
        email: "abhijeet@example.com",
        phone: "+91 9876543210",
        orders: 47,
        spent: 15420,
        status: "Active",
        joinDate: "Jan 2024"
      },
      "C-301": {
        id: "C-301",
        name: "Anita Sharma",
        email: "anita@gmail.com",
        phone: "+91 9876543211",
        orders: 14,
        spent: 28400,
        status: "Active",
        joinDate: "Feb 2024"
      },
      "C-302": {
        id: "C-302",
        name: "Rahul Verma",
        email: "rahul@gmail.com",
        phone: "+91 9876543212",
        orders: 6,
        spent: 7200,
        status: "Active",
        joinDate: "Jan 2024"
      },
      "C-303": {
        id: "C-303",
        name: "Priya Nair",
        email: "priya@gmail.com",
        phone: "+91 9876543213",
        orders: 0,
        spent: 0,
        status: "Blocked",
        joinDate: "Mar 2024"
      }
    };
    return customers[userId] || customers["customer_001"];
  };

  const customerInfo = getCustomerInfo(userId);

  // Load wallet data
  const loadWalletData = async () => {
    try {
      const data = WalletUtils.getWallet(userId);
      setWalletData(data);
    } catch (error) {
      console.error("Error loading wallet data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh wallet data
  const handleRefresh = () => {
    setRefreshing(true);
    loadWalletData();
  };

  // Initialize wallet on component mount
  useEffect(() => {
    // Initialize wallet if it doesn't exist
    WalletUtils.initializeWallet(userId, 100); // Give 100 INR welcome bonus
    loadWalletData();
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!walletData) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="text-center text-gray-500">
          <Wallet className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>Unable to load wallet data</p>
        </div>
      </div>
    );
  }

  const transactionSummary = WalletUtils.getTransactionSummary(userId);

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">My Wallet</h3>
            <p className="text-sm text-gray-600">Manage your wallet balance</p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          disabled={refreshing}
        >
          <RefreshCw className={`w-4 h-4 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Customer Information */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 border border-blue-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900">{customerInfo.name}</h4>
              <p className="text-sm text-gray-600">{customerInfo.email}</p>
              {customerInfo.phone && (
                <p className="text-xs text-gray-500">{customerInfo.phone}</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              customerInfo.status === "Active" 
                ? "bg-green-100 text-green-700" 
                : "bg-red-100 text-red-700"
            }`}>
              {customerInfo.status}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-gray-400" />
            <div>
              <p className="font-medium text-gray-700">{customerInfo.orders} Orders</p>
              <p className="text-gray-500">Total</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-gray-400" />
            <div>
              <p className="font-medium text-gray-700">₹{customerInfo.spent.toLocaleString()}</p>
              <p className="text-gray-500">Spent</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div>
              <p className="font-medium text-gray-700">{customerInfo.joinDate}</p>
              <p className="text-gray-500">Joined</p>
            </div>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6 border border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-green-700 font-medium">Available Balance</p>
            <p className="text-2xl font-bold text-green-900">
              {WalletUtils.formatAmount(walletData.walletBalance)}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
          <TrendingUp className="w-4 h-4 text-blue-600 mx-auto mb-1" />
          <p className="text-xs text-blue-700">Credits</p>
          <p className="text-sm font-bold text-blue-900">
            {WalletUtils.formatAmount(transactionSummary.totalCredits)}
          </p>
        </div>
        <div className="bg-red-50 rounded-lg p-3 text-center border border-red-100">
          <TrendingDown className="w-4 h-4 text-red-600 mx-auto mb-1" />
          <p className="text-xs text-red-700">Debits</p>
          <p className="text-sm font-bold text-red-900">
            {WalletUtils.formatAmount(transactionSummary.totalDebits)}
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 text-center border border-purple-100">
          <Clock className="w-4 h-4 text-purple-600 mx-auto mb-1" />
          <p className="text-xs text-purple-700">Transactions</p>
          <p className="text-sm font-bold text-purple-900">
            {transactionSummary.transactionCount}
          </p>
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Recent Transactions</h4>
        
        {walletData.transactions.length === 0 ? (
          <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
            <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No transactions yet</p>
            <p className="text-xs text-gray-400 mt-1">Your transaction history will appear here</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {walletData.transactions.slice(0, 10).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    transaction.type === "credit"
                      ? "bg-green-100"
                      : "bg-red-100"
                  }`}>
                    {transaction.type === "credit" ? (
                      <Plus className="w-4 h-4 text-green-600" />
                    ) : (
                      <Minus className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <div className={`text-sm font-bold ${
                  transaction.type === "credit"
                    ? "text-green-600"
                    : "text-red-600"
                }`}>
                  {transaction.type === "credit" ? "+" : "-"}
                  {WalletUtils.formatAmount(transaction.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Note */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-700">
          <strong>Tip:</strong> Use your wallet balance during checkout to get instant discounts on your orders!
        </p>
      </div>
    </div>
  );
};

export default WalletComponent;
