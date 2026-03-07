import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useFarmerProfile, useUpdateFarmerProfile } from "@/hooks/useApi";
import { useAuth } from "@/context/AuthContext";

const FarmerSettings = () => {
  const { user } = useAuth();
  const { data: profile, isLoading } = useFarmerProfile();
  const updateProfile = useUpdateFarmerProfile();

  const [form, setForm] = useState({
    farmerName: "", phone: "", email: "", farmName: "", farmLocation: "",
    state: "", cropType: "", bankName: "", accountNumber: "", ifsc: "", aadhaar: "", pan: "",
  });

  useEffect(() => {
    if (profile && user) {
      setForm({
        farmerName: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
        farmName: profile.village || "",
        farmLocation: `${profile.village || ""}, ${profile.mandal || ""}`,
        state: profile.state || "",
        cropType: "",
        bankName: "",
        accountNumber: profile.bankAccountNumber || "",
        ifsc: profile.ifscCode || "",
        aadhaar: "",
        pan: profile.panNumber || "",
      });
    }
  }, [profile, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await updateProfile.mutateAsync({
      village: form.farmName,
      state: form.state,
      bankAccountNumber: form.accountNumber,
      ifscCode: form.ifsc,
      panNumber: form.pan,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
        <span className="ml-2">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-6 rounded-2xl text-white shadow">
        <h1 className="text-2xl font-bold">Farmer Profile & Verification</h1>
        <p className="text-sm opacity-90">Complete your profile and submit KYC for approval</p>
      </div>

      <div className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="font-semibold text-lg text-gray-700">Personal Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <input name="farmerName" placeholder="Farmer Name" value={form.farmerName} onChange={handleChange} className="border rounded-lg px-4 py-2" />
          <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} className="border rounded-lg px-4 py-2" />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border rounded-lg px-4 py-2" />
        </div>
      </div>

      <div className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="font-semibold text-lg text-gray-700">Farm Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <input name="farmName" placeholder="Village" value={form.farmName} onChange={handleChange} className="border rounded-lg px-4 py-2" />
          <input name="farmLocation" placeholder="Farm Location" value={form.farmLocation} onChange={handleChange} className="border rounded-lg px-4 py-2" />
          <input name="state" placeholder="State" value={form.state} onChange={handleChange} className="border rounded-lg px-4 py-2" />
        </div>
      </div>

      <div className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="font-semibold text-lg text-gray-700">Bank Details</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <input name="accountNumber" placeholder="Account Number" value={form.accountNumber} onChange={handleChange} className="border rounded-lg px-4 py-2" />
          <input name="ifsc" placeholder="IFSC Code" value={form.ifsc} onChange={handleChange} className="border rounded-lg px-4 py-2" />
          <input name="pan" placeholder="PAN Number" value={form.pan} onChange={handleChange} className="border rounded-lg px-4 py-2" />
        </div>
      </div>

      <div className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="font-semibold">Verification Status</h2>
          <p className="text-sm text-gray-500">
            Status: 
            <span className={`ml-2 px-3 py-1 text-xs rounded ${
              profile?.isApproved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
            }`}>
              {profile?.isApproved ? "Approved" : "Pending"}
            </span>
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={updateProfile.isPending}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50"
        >
          {updateProfile.isPending ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
};

export default FarmerSettings;
