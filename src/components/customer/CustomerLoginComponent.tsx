import React, { useState } from "react";
import { User, Mail, Phone, Eye, EyeOff, LogIn, CheckCircle, XCircle } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  orders: number;
  spent: number;
  status: "Active" | "Blocked";
  joinDate: string;
  password: string;
}

const CustomerLoginComponent: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Mock customer data with passwords
  const customers: Customer[] = [
    {
      id: "customer_001",
      name: "Abhijeet Kumar",
      email: "abhijeet@example.com",
      phone: "+91 9876543210",
      orders: 47,
      spent: 15420,
      status: "Active",
      joinDate: "Jan 2024",
      password: "password123"
    },
    {
      id: "C-301",
      name: "Anita Sharma",
      email: "anita@gmail.com",
      phone: "+91 9876543211",
      orders: 14,
      spent: 28400,
      status: "Active",
      joinDate: "Feb 2024",
      password: "anita123"
    },
    {
      id: "C-302",
      name: "Rahul Verma",
      email: "rahul@gmail.com",
      phone: "+91 9876543212",
      orders: 6,
      spent: 7200,
      status: "Active",
      joinDate: "Jan 2024",
      password: "rahul123"
    },
    {
      id: "C-303",
      name: "Priya Nair",
      email: "priya@gmail.com",
      phone: "+91 9876543213",
      orders: 0,
      spent: 0,
      status: "Blocked",
      joinDate: "Mar 2024",
      password: "priya123"
    }
  ];

  const handleLogin = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowPassword(true);
  };

  const handlePasswordSubmit = (password: string) => {
    if (password === selectedCustomer?.password) {
      setLoginSuccess(true);
      // In real app, this would handle actual login
      setTimeout(() => {
        // Redirect to customer dashboard
        window.location.href = "/customer/dashboard";
      }, 2000);
    } else {
      alert("Invalid password");
    }
  };

  const handleBack = () => {
    setSelectedCustomer(null);
    setShowPassword(false);
    setLoginSuccess(false);
  };

  if (loginSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Login Successful!</h2>
            <p className="text-gray-600 mb-6">Welcome back, {selectedCustomer?.name}!</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-700">Redirecting to your dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showPassword && selectedCustomer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="mb-6">
            <button
              onClick={handleBack}
              className="mb-4 text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              <span>← Back</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedCustomer.name}</h3>
                <p className="text-sm text-gray-600">{selectedCustomer.email}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handlePasswordSubmit(e.currentTarget.value);
                  }
                }}
              />
            </div>

            <button
              onClick={() => {
                const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
                handlePasswordSubmit(passwordInput.value);
              }}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Login
            </button>

            <div className="text-center text-xs text-gray-500">
              <p>Hint: Try "{selectedCustomer.password}"</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Login</h1>
            <p className="text-gray-600">Select your account to continue</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Orders</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Spent</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{customer.id}</td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{customer.name}</p>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{customer.email}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{customer.phone}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {customer.orders}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-medium text-gray-900">₹{customer.spent.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        customer.status === "Active" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-red-100 text-red-700"
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleLogin(customer)}
                        disabled={customer.status === "Blocked"}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          customer.status === "Active"
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {customer.status === "Active" ? "Login" : "Blocked"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Login Information</h4>
            <div className="text-xs text-blue-700 space-y-1">
              <p>• Select your customer ID from the table above</p>
              <p>• Click "Login" to enter your password</p>
              <p>• Each customer has a default password for testing</p>
              <p>• Blocked customers cannot login</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerLoginComponent;
