import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Download, CheckCircle, Clock, AlertCircle, Shield,
  User, Package, CreditCard, Calendar, MapPin, Phone,
  Mail, FileText, Receipt, TrendingUp, Eye, Share2,
  Printer, MessageSquare, RefreshCw, Truck
} from "lucide-react";

interface PaymentDetails {
  id: string;
  product: string;
  farmer: string;
  buyer: string;
  amount: string;
  status: "Pending" | "Completed" | "Failed" | "Processing";
  date: string;
  method: string;
  transactionId?: string;
  invoiceNumber?: string;
  gatewayFee?: string;
  netAmount?: string;
  paymentDate?: string;
  settlementDate?: string;
  refundStatus?: string;
  notes?: string;
  farmerDetails?: {
    phone: string;
    email: string;
    address: string;
    gstin: string;
  };
  buyerDetails?: {
    phone: string;
    email: string;
    address: string;
    gstin: string;
  };
}

// Mock payment data - in real app this would come from API
const allPaymentsData: PaymentDetails[] = [
  {
    id: "PAY-101",
    product: "Premium Basmati Rice - 500kg",
    farmer: "Ramesh Kumar",
    buyer: "FreshMart Pvt Ltd",
    amount: "₹4,500.00",
    status: "Completed",
    date: "12 Feb 2026",
    method: "Bank Transfer",
    transactionId: "TXN2026021200001",
    invoiceNumber: "INV-2026-001234",
    gatewayFee: "₹45.00",
    netAmount: "₹4,455.00",
    paymentDate: "12 Feb 2026, 10:30 AM",
    settlementDate: "14 Feb 2026, 2:15 PM",
    refundStatus: "N/A",
    notes: "Payment processed successfully. Quality inspection completed.",
    farmerDetails: {
      phone: "+91 98765 43210",
      email: "ramesh.kumar@farmmail.com",
      address: "123 Farm Road, Nalgonda, Telangana 508001",
      gstin: "36AABCS1234F1Z5"
    },
    buyerDetails: {
      phone: "+91 87654 32109",
      email: "accounts@freshmart.com",
      address: "456 Market St, Hyderabad, Telangana 500001",
      gstin: "36AAFCG5678H1Z2"
    }
  },
  {
    id: "PAY-102",
    product: "Fresh Tomatoes - 200kg",
    farmer: "Suresh Patel",
    buyer: "City Grocery Store",
    amount: "₹6,200.00",
    status: "Pending",
    date: "13 Feb 2026",
    method: "UPI",
    transactionId: "TXN2026021300002",
    invoiceNumber: "INV-2026-001235",
    gatewayFee: "₹62.00",
    netAmount: "₹6,138.00",
    paymentDate: "13 Feb 2026, 2:45 PM",
    settlementDate: "Pending",
    refundStatus: "N/A",
    notes: "Payment awaiting confirmation. Quality check in progress.",
    farmerDetails: {
      phone: "+91 98765 54321",
      email: "suresh.patel@farmmail.com",
      address: "456 Agricultural Area, Pune, Maharashtra 411028",
      gstin: "27AACPA4567C1Z2"
    },
    buyerDetails: {
      phone: "+91 87654 21098",
      email: "contact@citygrocery.com",
      address: "789 Commercial St, Mumbai, Maharashtra 400001",
      gstin: "27AAFCG8901I2Z3"
    }
  },
  {
    id: "PAY-103",
    product: "Organic Onions - 150kg",
    farmer: "Mahesh Yadav",
    buyer: "Green Basket Organics",
    amount: "₹3,900.00",
    status: "Processing",
    date: "14 Feb 2026",
    method: "Net Banking",
    transactionId: "TXN2026021400003",
    invoiceNumber: "INV-2026-001236",
    gatewayFee: "₹39.00",
    netAmount: "₹3,861.00",
    paymentDate: "14 Feb 2026, 11:20 AM",
    settlementDate: "Pending",
    refundStatus: "N/A",
    notes: "Payment being processed through secure gateway.",
    farmerDetails: {
      phone: "+91 87654 10987",
      email: "mahesh.yadav@farmmail.com",
      address: "321 Farm Lane, Ahmedabad, Gujarat 382001",
      gstin: "24AAAPM5678G1Z1"
    },
    buyerDetails: {
      phone: "+91 87654 32109",
      email: "orders@greenbasket.com",
      address: "654 Organic Market, Bangalore, Karnataka 560001",
      gstin: "29AAABG2345L1Z4"
    }
  }
];

const PaymentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);

  // Find the payment data based on ID from URL
  const paymentData = allPaymentsData.find(payment => payment.id === id) || allPaymentsData[0];

  const handleDownloadReceipt = () => {
    setLoading(true);
    setTimeout(() => {
      // Simulate receipt download
      const receiptData = {
        ...paymentData,
        downloadedAt: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(receiptData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payment-receipt-${paymentData.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      setLoading(false);
    }, 1000);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleSharePayment = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Payment Details - ${paymentData.id}`,
          text: `Payment of ${paymentData.amount} for ${paymentData.product}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Payment link copied to clipboard!');
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Completed": return "text-green-600 bg-green-100 border-green-200";
      case "Pending": return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "Processing": return "text-blue-600 bg-blue-100 border-blue-200";
      case "Failed": return "text-red-600 bg-red-100 border-red-200";
      default: return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "Completed": return <CheckCircle className="w-5 h-5" />;
      case "Pending": return <Clock className="w-5 h-5" />;
      case "Processing": return <RefreshCw className="w-5 h-5" />;
      case "Failed": return <AlertCircle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Payments</span>
              </button>
              <div className="h-8 w-px bg-gray-300" />
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-purple-600" />
                <span className="font-bold text-gray-900">Payment Details</span>
                <span className="text-sm text-gray-500">({paymentData.id})</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleSharePayment}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button
                onClick={handlePrintReceipt}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button
                onClick={handleDownloadReceipt}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 disabled:opacity-50 rounded-lg transition-all"
              >
                <Download className="w-4 h-4" />
                {loading ? 'Downloading...' : 'Download Receipt'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Banner */}
        <div className={`rounded-2xl p-6 mb-8 border-2 ${getStatusColor(paymentData.status)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getStatusColor(paymentData.status)}`}>
                {getStatusIcon(paymentData.status)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Payment {paymentData.status}</h2>
                <p className="text-gray-600">Transaction processed successfully</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900">{paymentData.amount}</p>
              <p className="text-sm text-gray-600">Total Amount</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { id: "overview", label: "Overview", icon: Eye },
                { id: "parties", label: "Parties Involved", icon: User },
                { id: "transaction", label: "Transaction Details", icon: CreditCard },
                { id: "documents", label: "Documents", icon: FileText }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "text-purple-600 border-purple-600 bg-purple-50"
                      : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Payment Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                    <h3 className="text-lg font-bold text-blue-900 mb-4">Payment Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Product:</span>
                        <span className="font-bold text-blue-900">{paymentData.product}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Payment Method:</span>
                        <span className="font-bold text-blue-900">{paymentData.method}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Transaction Date:</span>
                        <span className="font-bold text-blue-900">{paymentData.paymentDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Settlement Date:</span>
                        <span className="font-bold text-blue-900">{paymentData.settlementDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                    <h3 className="text-lg font-bold text-green-900 mb-4">Financial Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-green-700">Gross Amount:</span>
                        <span className="font-bold text-green-900">{paymentData.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Gateway Fee:</span>
                        <span className="font-bold text-green-900">{paymentData.gatewayFee}</span>
                      </div>
                      <div className="flex justify-between border-t border-green-200 pt-3">
                        <span className="text-green-700">Net Amount:</span>
                        <span className="font-bold text-xl text-green-900">{paymentData.netAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200">
                  <h3 className="text-lg font-bold text-purple-900 mb-4">Additional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-purple-700 mb-1">Transaction ID:</p>
                      <p className="font-mono text-sm font-bold text-purple-900">{paymentData.transactionId}</p>
                    </div>
                    <div>
                      <p className="text-purple-700 mb-1">Invoice Number:</p>
                      <p className="font-mono text-sm font-bold text-purple-900">{paymentData.invoiceNumber}</p>
                    </div>
                    <div>
                      <p className="text-purple-700 mb-1">Refund Status:</p>
                      <p className="font-bold text-purple-900">{paymentData.refundStatus}</p>
                    </div>
                    <div>
                      <p className="text-purple-700 mb-1">Notes:</p>
                      <p className="text-sm text-purple-900">{paymentData.notes}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "parties" && (
              <div className="space-y-6">
                {/* Farmer Details */}
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-5 border border-orange-200">
                  <h3 className="text-lg font-bold text-orange-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Farmer (Supplier) Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-orange-700 mb-1">Name:</p>
                      <p className="font-bold text-orange-900">{paymentData.farmer}</p>
                    </div>
                    <div>
                      <p className="text-orange-700 mb-1">Phone:</p>
                      <p className="font-bold text-orange-900">{paymentData.farmerDetails?.phone}</p>
                    </div>
                    <div>
                      <p className="text-orange-700 mb-1">Email:</p>
                      <p className="font-bold text-orange-900">{paymentData.farmerDetails?.email}</p>
                    </div>
                    <div>
                      <p className="text-orange-700 mb-1">GSTIN:</p>
                      <p className="font-mono text-sm font-bold text-orange-900">{paymentData.farmerDetails?.gstin}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-orange-700 mb-1">Address:</p>
                      <p className="font-bold text-orange-900">{paymentData.farmerDetails?.address}</p>
                    </div>
                  </div>
                </div>

                {/* Buyer Details */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                  <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Buyer Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-blue-700 mb-1">Company Name:</p>
                      <p className="font-bold text-blue-900">{paymentData.buyer}</p>
                    </div>
                    <div>
                      <p className="text-blue-700 mb-1">Phone:</p>
                      <p className="font-bold text-blue-900">{paymentData.buyerDetails?.phone}</p>
                    </div>
                    <div>
                      <p className="text-blue-700 mb-1">Email:</p>
                      <p className="font-bold text-blue-900">{paymentData.buyerDetails?.email}</p>
                    </div>
                    <div>
                      <p className="text-blue-700 mb-1">GSTIN:</p>
                      <p className="font-mono text-sm font-bold text-blue-900">{paymentData.buyerDetails?.gstin}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-blue-700 mb-1">Address:</p>
                      <p className="font-bold text-blue-900">{paymentData.buyerDetails?.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "transaction" && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-5 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Transaction Processing Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-700 mb-1">Payment Gateway:</p>
                        <p className="font-bold text-gray-900">Razorpay Secure</p>
                      </div>
                      <div>
                        <p className="text-gray-700 mb-1">Payment Method:</p>
                        <p className="font-bold text-gray-900">{paymentData.method}</p>
                      </div>
                      <div>
                        <p className="text-gray-700 mb-1">Transaction ID:</p>
                        <p className="font-mono text-sm font-bold text-gray-900">{paymentData.transactionId}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-700 mb-1">Authorization Code:</p>
                        <p className="font-mono text-sm font-bold text-gray-900">AUTH_20260212_001</p>
                      </div>
                      <div>
                        <p className="text-gray-700 mb-1">Settlement ID:</p>
                        <p className="font-mono text-sm font-bold text-gray-900">SETTLE_20260214_001</p>
                      </div>
                      <div>
                        <p className="text-gray-700 mb-1">Bank Reference:</p>
                        <p className="font-mono text-sm font-bold text-gray-900">BANK_REF_20260212_001</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Information */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                  <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security & Compliance
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-900">Payment verified and secured</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-900">PCI DSS compliant transaction</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-900">GST compliant with proper invoicing</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-900">Audit trail maintained</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "documents" && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200">
                  <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Available Documents
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-between p-4 bg-white rounded-lg border border-purple-200 hover:bg-purple-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <Receipt className="w-5 h-5 text-purple-600" />
                          <div className="text-left">
                            <p className="font-bold text-purple-900">Payment Receipt</p>
                            <p className="text-xs text-purple-700">Official payment receipt</p>
                          </div>
                        </div>
                        <Download className="w-5 h-5 text-purple-600" />
                      </button>
                      
                      <button className="w-full flex items-center justify-between p-4 bg-white rounded-lg border border-purple-200 hover:bg-purple-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-purple-600" />
                          <div className="text-left">
                            <p className="font-bold text-purple-900">Tax Invoice</p>
                            <p className="text-xs text-purple-700">GST compliant invoice</p>
                          </div>
                        </div>
                        <Download className="w-5 h-5 text-purple-600" />
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-between p-4 bg-white rounded-lg border border-purple-200 hover:bg-purple-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <Package className="w-5 h-5 text-purple-600" />
                          <div className="text-left">
                            <p className="font-bold text-purple-900">Quality Certificate</p>
                            <p className="text-xs text-purple-700">Product quality verification</p>
                          </div>
                        </div>
                        <Eye className="w-5 h-5 text-purple-600" />
                      </button>
                      
                      <button className="w-full flex items-center justify-between p-4 bg-white rounded-lg border border-purple-200 hover:bg-purple-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <Truck className="w-5 h-5 text-purple-600" />
                          <div className="text-left">
                            <p className="font-bold text-purple-900">Delivery Challan</p>
                            <p className="text-xs text-purple-700">Transport document</p>
                          </div>
                        </div>
                        <Download className="w-5 h-5 text-purple-600" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Communication History */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                  <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Communication History
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                      <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-blue-900">Payment Confirmation Sent</p>
                        <p className="text-xs text-blue-700">12 Feb 2026, 11:00 AM - To both parties</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                      <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-blue-900">Settlement Notification</p>
                        <p className="text-xs text-blue-700">14 Feb 2026, 3:00 PM - To farmer</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsPage;
