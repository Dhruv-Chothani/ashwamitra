import React, { useState } from "react";

const Settings = () => {

  const [kycStatus, setKycStatus] = useState("Pending");

  return (
    <div className="space-y-8">

      {/* <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
          Business Settings
        </h1>

        <p className="text-gray-500 text-sm">
          Complete business verification
        </p>
      </div> */}
       <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-2xl p-6 shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">    Business Settings</h1>
          <p className="text-blue-100 text-sm">
          Complete business verification
          </p>
        </div>
      </div>

      <div className="bg-white shadow-sm border rounded-xl p-6 space-y-4">

        <h2 className="font-semibold text-lg">
          Business Information
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            placeholder="Business Name"
            className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-400"
          />

          <input
            placeholder="Owner Name"
            className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-400"
          />

          <input
            placeholder="Email"
            className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-400"
          />

          <input
            placeholder="Phone"
            className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-400"
          />

        </div>

      </div>

      <div className="bg-white shadow-sm border rounded-xl p-6 flex justify-between items-center">

        <div>

          <h2 className="font-semibold">
            KYC Verification
          </h2>

          <p className="text-sm text-gray-500">
            Status: {kycStatus}
          </p>

        </div>

        <button
          onClick={() => setKycStatus("Submitted")}
          className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg"
        >
          Submit KYC
        </button>

      </div>

    </div>
  );
};

export default Settings;