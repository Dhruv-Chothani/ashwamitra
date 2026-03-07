import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, FileText, Calendar, User, Building2, CreditCard, CheckCircle, Clock, AlertCircle } from "lucide-react";

interface PaymentDetails {
  id: string;
  product: string;
  farmer: string;
  buyer: string;
  amount: string;
  status: "Pending" | "Completed";
  date: string;
  method: string;
  description?: string;
  transactionId?: string;
  bankReference?: string;
  dueDate?: string;
  completedDate?: string;
}

const mockPaymentDetails: { [key: string]: PaymentDetails } = {
  "PAY-101": {
    id: "PAY-101",
    product: "Tomatoes",
    farmer: "Ramesh Kumar",
    buyer: "FreshMart",
    amount: "₹4500",
    status: "Pending",
    date: "12 Feb 2026",
    method: "UPI",
    description: "Payment for 500kg of fresh tomatoes from Ramesh Kumar's farm",
    transactionId: "TXN123456789",
    dueDate: "15 Feb 2026",
  },
  "PAY-102": {
    id: "PAY-102",
    product: "Potatoes",
    farmer: "Suresh Patel",
    buyer: "City Grocery",
    amount: "₹6200",
    status: "Completed",
    date: "10 Feb 2026",
    method: "Bank Transfer",
    description: "Payment for 800kg of premium potatoes from Suresh Patel's farm",
    transactionId: "TXN987654321",
    bankReference: "BANK2024021001",
    completedDate: "10 Feb 2026",
  },
  "PAY-103": {
    id: "PAY-103",
    product: "Onions",
    farmer: "Mahesh Yadav",
    buyer: "Green Basket",
    amount: "₹3900",
    status: "Pending",
    date: "9 Feb 2026",
    method: "UPI",
    description: "Payment for 300kg of fresh onions from Mahesh Yadav's farm",
    transactionId: "TXN456789123",
    dueDate: "12 Feb 2026",
  },
};

const PaymentDetailsPage: React.FC = () => {
  const { paymentId } = useParams<{ paymentId: string }>();
  const navigate = useNavigate();
  const [payment, setPayment] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (paymentId) {
      // Simulate API call
      setTimeout(() => {
        const paymentData = mockPaymentDetails[paymentId];
        if (paymentData) {
          setPayment(paymentData);
        }
        setLoading(false);
      }, 500);
    }
  }, [paymentId]);

  const handleDownloadInvoice = () => {
    // Simulate invoice download
    alert("Invoice download started! This would download a PDF invoice.");
  };

  const handleDownloadReceipt = () => {
    // Simulate receipt download
    alert("Receipt download started! This would download a PDF receipt.");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 animate-spin">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <p className="text-lg font-semibold text-gray-700">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Payment Not Found</h1>
          <p className="text-gray-600 mb-6">
            The payment details you're looking for don't exist or may have been removed.
          </p>
          <button
            onClick={() => navigate("/b2b/dashboard")}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/b2b/dashboard")}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Payment Details</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Payment Status Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                payment.status === "Completed" 
                  ? "bg-green-100" 
                  : "bg-yellow-100"
              }`}>
                {payment.status === "Completed" ? (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                ) : (
                  <Clock className="w-8 h-8 text-yellow-600" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{payment.amount}</h2>
                <p className="text-sm text-gray-500">Payment Amount</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                payment.status === "Completed"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}>
                {payment.status}
              </span>
            </div>
          </div>

          {/* Payment Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Payment Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Payment ID:</span>
                    <span className="text-sm font-mono font-bold text-gray-900">{payment.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Transaction ID:</span>
                    <span className="text-sm font-mono font-bold text-gray-900">{payment.transactionId}</span>
                  </div>
                  {payment.bankReference && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Bank Reference:</span>
                      <span className="text-sm font-mono font-bold text-gray-900">{payment.bankReference}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Payment Method:</span>
                    <span className="text-sm font-bold text-gray-900">{payment.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Payment Date:</span>
                    <span className="text-sm font-bold text-gray-900">{payment.date}</span>
                  </div>
                  {payment.dueDate && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Due Date:</span>
                      <span className="text-sm font-bold text-orange-600">{payment.dueDate}</span>
                    </div>
                  )}
                  {payment.completedDate && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Completed Date:</span>
                      <span className="text-sm font-bold text-green-600">{payment.completedDate}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Transaction Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Product:</span>
                    <span className="text-sm font-bold text-gray-900">{payment.product}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Farmer:</span>
                    <span className="text-sm font-bold text-gray-900">{payment.farmer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Buyer:</span>
                    <span className="text-sm font-bold text-gray-900">{payment.buyer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Amount:</span>
                    <span className="text-sm font-bold text-green-700">{payment.amount}</span>
                  </div>
                </div>
              </div>

              {payment.description && (
                <div className="bg-purple-50 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
                  <p className="text-sm text-gray-700">{payment.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleDownloadInvoice}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:opacity-90 transition-opacity"
            >
              <Download className="w-4 h-4" />
              Download Invoice
            </button>
            <button
              onClick={handleDownloadReceipt}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:opacity-90 transition-opacity"
            >
              <FileText className="w-4 h-4" />
              Download Receipt
            </button>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            Important Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
              <h4 className="text-sm font-semibold text-yellow-800 mb-2">For Pending Payments</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Complete payment before due date</li>
                <li>• Keep transaction ID for reference</li>
                <li>• Contact support if issues arise</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <h4 className="text-sm font-semibold text-green-800 mb-2">For Completed Payments</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Download invoice for records</li>
                <li>• Keep receipt for warranty</li>
                <li>• Verify all transaction details</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsPage;
