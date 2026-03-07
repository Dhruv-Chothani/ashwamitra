import React, { useState, useEffect } from "react";
import { WalletUtils } from "../../utils/walletUtils";
import { Wallet, Check, AlertCircle, Info } from "lucide-react";

interface WalletCheckoutIntegrationProps {
  userId: string;
  orderTotal: number;
  onWalletAmountChange: (walletAmount: number) => void;
  onUseWalletChange: (useWallet: boolean) => void;
}

const WalletCheckoutIntegration: React.FC<WalletCheckoutIntegrationProps> = ({
  userId,
  orderTotal,
  onWalletAmountChange,
  onUseWalletChange
}) => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [useWallet, setUseWallet] = useState(false);
  const [maxUsableAmount, setMaxUsableAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load wallet balance
  useEffect(() => {
    const loadWalletBalance = () => {
      try {
        const balance = WalletUtils.getBalance(userId);
        const maxUsable = WalletUtils.getMaxUsableAmount(userId, orderTotal);
        
        setWalletBalance(balance);
        setMaxUsableAmount(maxUsable);
        
        // Auto-uncheck if wallet balance is 0
        if (balance <= 0) {
          setUseWallet(false);
          onUseWalletChange(false);
          onWalletAmountChange(0);
        }
      } catch (error) {
        console.error("Error loading wallet balance:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWalletBalance();
  }, [userId, orderTotal, onUseWalletChange, onWalletAmountChange]);

  // Handle wallet checkbox change
  const handleWalletToggle = (checked: boolean) => {
    setUseWallet(checked);
    onUseWalletChange(checked);
    
    if (checked) {
      onWalletAmountChange(maxUsableAmount);
    } else {
      onWalletAmountChange(0);
    }
  };

  // Calculate remaining amount after wallet deduction
  const remainingAmount = useWallet ? orderTotal - maxUsableAmount : orderTotal;
  const isFullyPaid = useWallet && maxUsableAmount >= orderTotal;

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-6 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Don't show wallet option if balance is 0
  if (walletBalance <= 0) {
    return null;
  }

  return (
    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Wallet className="w-4 h-4 text-green-600" />
        <h4 className="text-sm font-semibold text-green-900">Use Wallet Balance</h4>
      </div>

      {/* Wallet Info */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-green-700">Available Balance:</span>
          <span className="font-bold text-green-900">
            {WalletUtils.formatAmount(walletBalance)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-green-700">Usable for this order:</span>
          <span className="font-bold text-green-900">
            {WalletUtils.formatAmount(maxUsableAmount)}
          </span>
        </div>
      </div>

      {/* Wallet Checkbox */}
      <div className="flex items-start gap-3 mb-3">
        <input
          type="checkbox"
          id="use-wallet"
          checked={useWallet}
          onChange={(e) => handleWalletToggle(e.target.checked)}
          className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
        />
        <label htmlFor="use-wallet" className="flex-1 cursor-pointer">
          <span className="text-sm text-green-800">
            Use {WalletUtils.formatAmount(maxUsableAmount)} from wallet
          </span>
          {maxUsableAmount < orderTotal && (
            <span className="text-xs text-green-600 block mt-1">
              Partial payment - remaining {WalletUtils.formatAmount(remainingAmount)} will be paid via other methods
            </span>
          )}
        </label>
      </div>

      {/* Payment Summary */}
      {useWallet && (
        <div className="bg-white rounded-lg p-3 border border-green-300">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Order Total:</span>
              <span className="font-medium">{WalletUtils.formatAmount(orderTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Wallet Deduction:</span>
              <span className="font-medium text-green-600">
                -{WalletUtils.formatAmount(maxUsableAmount)}
              </span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between font-semibold">
                <span>Remaining Amount:</span>
                <span className={isFullyPaid ? "text-green-600" : "text-orange-600"}>
                  {isFullyPaid ? "PAID" : WalletUtils.formatAmount(remainingAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {isFullyPaid ? (
            <div className="flex items-center gap-2 mt-3 p-2 bg-green-100 rounded-lg">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-700">
                Order fully paid with wallet balance!
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 mt-3 p-2 bg-orange-100 rounded-lg">
              <Info className="w-4 h-4 text-orange-600" />
              <span className="text-xs text-orange-700">
                {WalletUtils.formatAmount(remainingAmount)} to be paid via selected payment method
              </span>
            </div>
          )}
        </div>
      )}

      {/* Info Note */}
      <div className="mt-3 flex items-start gap-2">
        <AlertCircle className="w-3 h-3 text-green-600 mt-0.5" />
        <p className="text-xs text-green-700">
          Wallet balance will be deducted immediately after order confirmation.
        </p>
      </div>
    </div>
  );
};

export default WalletCheckoutIntegration;
