import React, { useState } from "react";
import { WalletUtils } from "../../utils/walletUtils";
import { Wallet, Plus, Users, AlertCircle, CheckCircle } from "lucide-react";

interface AdminWalletComponentProps {
  onWalletUpdated?: () => void; // Callback to refresh wallet data
}

const AdminWalletComponent: React.FC<AdminWalletComponentProps> = ({ onWalletUpdated }) => {
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Mock user list - in real app, this would come from API
  const mockUsers = [
    { id: "C-301", name: "Anita Sharma", email: "anita@gmail.com" },
    { id: "C-302", name: "Rahul Verma", email: "rahul@gmail.com" },
    { id: "C-303", name: "Priya Nair", email: "priya@gmail.com" },
  ];

  const handleAddMoney = async () => {
    // Validation
    if (!selectedUserId) {
      setError("Please select a user");
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (amountNum > 10000) {
      setError("Maximum amount per transaction is ₹10,000");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Add money to user's wallet
      const success = WalletUtils.addMoney(
        selectedUserId,
        amountNum,
        description || "Admin wallet credit"
      );

      if (success) {
        setSuccess(true);
        // Reset form
        setSelectedUserId("");
        setAmount("");
        setDescription("");
        
        // Notify parent component to refresh data
        if (onWalletUpdated) {
          onWalletUpdated();
        }

        // Close modal after success
        setTimeout(() => {
          setShowAddMoney(false);
          setSuccess(false);
        }, 2000);
      } else {
        setError("Failed to add money. Please try again.");
      }
    } catch (err) {
      console.error("Error adding money:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getWalletBalance = (userId: string): string => {
    const balance = WalletUtils.getBalance(userId);
    return WalletUtils.formatAmount(balance);
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Wallet Management</h3>
            <p className="text-sm text-gray-600">Add money to user wallets</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddMoney(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Money
        </button>
      </div>

      {/* User Wallet Summary */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">User Wallet Balances</h4>
        {mockUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-green-600">
                {getWalletBalance(user.id)}
              </p>
              <p className="text-xs text-gray-500">Balance</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Money Modal */}
      {showAddMoney && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Add Money to Wallet</h3>
              <button
                onClick={() => {
                  setShowAddMoney(false);
                  setSuccess(false);
                  setError("");
                }}
                className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <Plus className="w-3 h-3 text-gray-600 rotate-45" />
              </button>
            </div>

            {success ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Money Added Successfully!</h4>
                <p className="text-sm text-gray-600">
                  {WalletUtils.formatAmount(parseFloat(amount))} has been added to the user's wallet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* User Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select User
                  </label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Choose a user...</option>
                    {mockUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} - {user.email}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter amount"
                    min="1"
                    max="10000"
                    step="0.01"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum: ₹10,000 per transaction
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Enter description for this transaction"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {/* Current Balance Display */}
                {selectedUserId && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700">
                      Current balance: <strong>{getWalletBalance(selectedUserId)}</strong>
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowAddMoney(false);
                      setError("");
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddMoney}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Adding...
                      </>
                    ) : (
                      "Add Money"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWalletComponent;
