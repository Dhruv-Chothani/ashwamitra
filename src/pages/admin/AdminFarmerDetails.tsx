import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, MapPin, CreditCard, CheckCircle, X, AlertCircle, Phone, Mail, Tractor } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FarmerDetails {
  id: string;
  farmerName: string;
  mobile: string;
  email: string;
  aadhaar: string;
  address: string;
  village: string;
  district: string;
  state: string;
  pincode: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  status: "pending" | "approved" | "rejected";
  registrationDate: string;
}

const mockFarmerDetails: { [key: string]: FarmerDetails } = {
  "FAR001": {
    id: "FAR001",
    farmerName: "Ramesh Kumar",
    mobile: "+91 98765 43210",
    email: "ramesh@farmer.com",
    aadhaar: "123456789012",
    address: "123, Farm Road, Near Temple",
    village: "Malkapur",
    district: "Nalgonda",
    state: "Telangana",
    pincode: "508001",
    accountHolderName: "Ramesh Kumar",
    accountNumber: "9876543210",
    ifscCode: "HDFC0001234",
    bankName: "HDFC Bank",
    status: "pending",
    registrationDate: "2024-03-01",
  },
  "FAR002": {
    id: "FAR002",
    farmerName: "Suresh Patel",
    mobile: "+91 87654 32109",
    email: "suresh@farmer.com",
    aadhaar: "987654321098",
    address: "456, Agricultural Colony",
    village: "Shapur",
    district: "Warangal",
    state: "Telangana",
    pincode: "506001",
    accountHolderName: "Suresh Patel",
    accountNumber: "1234567890",
    ifscCode: "ICIC0000123",
    bankName: "ICICI Bank",
    status: "approved",
    registrationDate: "2024-02-28",
  },
};

const AdminFarmerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [farmer, setFarmer] = useState<FarmerDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (id) {
      // Simulate API call
      setTimeout(() => {
        const farmerData = mockFarmerDetails[id];
        if (farmerData) {
          setFarmer(farmerData);
        }
        setLoading(false);
      }, 500);
    }
  }, [id]);

  const handleApprove = async () => {
    if (!farmer) return;
    
    setActionLoading(true);
    // Simulate API call
    setTimeout(() => {
      setFarmer({ ...farmer, status: "approved" });
      setActionLoading(false);
      alert("Farmer account approved successfully!");
    }, 1500);
  };

  const handleReject = async () => {
    if (!farmer) return;
    
    setActionLoading(true);
    // Simulate API call
    setTimeout(() => {
      setFarmer({ ...farmer, status: "rejected" });
      setActionLoading(false);
      alert("Farmer account rejected!");
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4 animate-spin">
            <Tractor className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-lg font-semibold text-gray-700">Loading farmer details...</p>
        </div>
      </div>
    );
  }

  if (!farmer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Farmer Not Found</h1>
          <p className="text-gray-600 mb-6">
            The farmer details you're looking for don't exist.
          </p>
          <Button onClick={() => navigate("/admin/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/admin/dashboard")}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900">Farmer Details</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              farmer.status === "approved" 
                ? "bg-green-100 text-green-700"
                : farmer.status === "rejected"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}>
              {farmer.status.charAt(0).toUpperCase() + farmer.status.slice(1)}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Personal Details Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-green-600" />
              Personal Details
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Farmer ID</span>
                <span className="text-sm font-medium text-gray-900">{farmer.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Farmer Name</span>
                <span className="text-sm font-medium text-gray-900">{farmer.farmerName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Mobile</span>
                <span className="text-sm font-medium text-gray-900">{farmer.mobile}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Email</span>
                <span className="text-sm font-medium text-gray-900">{farmer.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Aadhaar Number</span>
                <span className="text-sm font-medium text-gray-900">••••••••{farmer.aadhaar.slice(-4)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Registration Date</span>
                <span className="text-sm font-medium text-gray-900">{farmer.registrationDate}</span>
              </div>
            </div>
          </div>

          {/* Address Details Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              Address Details
            </h2>
            <div className="space-y-3">
              <div className="py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600 block">Address</span>
                <span className="text-sm font-medium text-gray-900 mt-1 block">{farmer.address}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Village</span>
                <span className="text-sm font-medium text-gray-900">{farmer.village}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">District</span>
                <span className="text-sm font-medium text-gray-900">{farmer.district}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">State</span>
                <span className="text-sm font-medium text-gray-900">{farmer.state}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Pincode</span>
                <span className="text-sm font-medium text-gray-900">{farmer.pincode}</span>
              </div>
            </div>
          </div>

          {/* Bank Details Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-green-600" />
              Bank Details
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Account Holder Name</span>
                <span className="text-sm font-medium text-gray-900">{farmer.accountHolderName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Account Number</span>
                <span className="text-sm font-medium text-gray-900">••••••{farmer.accountNumber.slice(-4)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">IFSC Code</span>
                <span className="text-sm font-medium text-gray-900">{farmer.ifscCode}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Bank Name</span>
                <span className="text-sm font-medium text-gray-900">{farmer.bankName}</span>
              </div>
            </div>
          </div>

          {/* Farm Information Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Tractor className="w-5 h-5 text-green-600" />
              Farm Information
            </h2>
            <div className="space-y-3">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-sm text-green-800">
                  <CheckCircle className="w-4 h-4 inline mr-1" />
                  Registered Farmer
                </p>
                <p className="text-xs text-green-700 mt-1">
                  This farmer is registered and verified with the platform
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-xs text-gray-600 block">Village</span>
                  <span className="text-sm font-medium text-gray-900">{farmer.village}</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-xs text-gray-600 block">District</span>
                  <span className="text-sm font-medium text-gray-900">{farmer.district}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        {farmer.status === "pending" && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Action</h3>
            <div className="flex gap-4">
              <Button
                onClick={handleApprove}
                disabled={actionLoading}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {actionLoading ? (
                  "Processing..."
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Account
                  </>
                )}
              </Button>
              <Button
                onClick={handleReject}
                disabled={actionLoading}
                variant="destructive"
                className="flex-1"
              >
                {actionLoading ? (
                  "Processing..."
                ) : (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Reject Account
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {farmer.status === "approved" && (
          <div className="mt-8 bg-green-50 rounded-xl border border-green-200 p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-green-800">Account Approved</h3>
                <p className="text-green-700">This farmer account has been approved and can now access the farmer dashboard.</p>
              </div>
            </div>
          </div>
        )}

        {farmer.status === "rejected" && (
          <div className="mt-8 bg-red-50 rounded-xl border border-red-200 p-6">
            <div className="flex items-center gap-3">
              <X className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="text-lg font-semibold text-red-800">Account Rejected</h3>
                <p className="text-red-700">This farmer account has been rejected and cannot access the platform.</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminFarmerDetails;
