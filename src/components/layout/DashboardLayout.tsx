import React, { useState } from "react";
import { useAuth, UserRole } from "@/context/AuthContext";
import {
  LayoutDashboard, Package, ShoppingCart, CreditCard, Bell, Settings,
  LogOut, Menu, X, TrendingUp, Users, FileText, BarChart3, Truck,
  Wheat, Building2, UserCircle, Shield, ChevronRight, Store, Check, AlertCircle, Info, Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import WhatsAppButton from "@/components/common/WhatsAppButton";

interface NavItem {
  label: string;
  icon: React.ElementType;
  id: string;
}

const farmerNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { label: "My Products", icon: Package, id: "products" },
  { label: "Orders", icon: ShoppingCart, id: "orders" },
  { label: "Payments", icon: CreditCard, id: "payments" },
  { label: "Notifications", icon: Bell, id: "notifications" },
  { label: "Analytics", icon: TrendingUp, id: "analytics" },
  { label: "Settings", icon: Settings, id: "settings" },
];

const b2bNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { label: "Product Discovery", icon: Store, id: "products" },
  { label: "Bulk Orders", icon: ShoppingCart, id: "orders" },
  { label: "Payments", icon: CreditCard, id: "payments" },
  { label: "Delivery Tracking", icon: Truck, id: "delivery" },
  { label: "Analytics", icon: BarChart3, id: "analytics" },
  { label: "Settings", icon: Settings, id: "settings" },
];

const customerNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { label: "Shop", icon: Store, id: "shop" },
  { label: "My Orders", icon: ShoppingCart, id: "orders" },
  { label: "Savings Tracker", icon: TrendingUp, id: "savings" },
  { label: "Payments", icon: CreditCard, id: "payments" },
  { label: "Settings", icon: Settings, id: "settings" },
];

const adminNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { label: "Farmers", icon: Wheat, id: "farmers" },
  { label: "Businesses", icon: Building2, id: "businesses" },
  { label: "Customers", icon: Users, id: "customers" },
  {label: "Delivery", icon: Truck, id: "delivery"},
  { label: "Transactions", icon: CreditCard, id: "transactions" },
  { label: "Wallet", icon: Wallet, id: "wallet" },
  { label: "Analytics", icon: BarChart3, id: "analytics" },
  { label: "Reports", icon: FileText, id: "reports" },
  { label: "Settings", icon: Shield, id: "settings" },
];

const roleNavMap: Record<string, NavItem[]> = {
  farmer: farmerNav,
  b2b: b2bNav,
  customer: customerNav,
  admin: adminNav,
};

const roleLabels: Record<string, string> = {
  farmer: "Farmer Portal",
  b2b: "B2B Business",
  customer: "Customer Portal",
  admin: "Admin Panel",
};

const roleIcons: Record<string, React.ElementType> = {
  farmer: Wheat,
  b2b: Building2,
  customer: UserCircle,
  admin: Shield,
};

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "warning" | "info";
  time: string;
  read: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, activeTab, onTabChange }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const role = user?.role ?? "farmer";
  const navItems = roleNavMap[role] || farmerNav;
  const RoleIcon = roleIcons[role] || Wheat;

  // Mock notifications data
  const notifications: Notification[] = [
    {
      id: "1",
      title: "New Order Received",
      message: "You have a new bulk order for Basmati Rice",
      type: "success",
      time: "2 min ago",
      read: false
    },
    {
      id: "2",
      title: "Payment Processed",
      message: "Payment of ₹45,000 has been processed successfully",
      type: "success",
      time: "15 min ago",
      read: false
    },
    {
      id: "3",
      title: "Low Stock Alert",
      message: "Your Turmeric stock is running low",
      type: "warning",
      time: "1 hour ago",
      read: true
    },
    {
      id: "4",
      title: "Delivery Update",
      message: "Order #ORD102 has been shipped",
      type: "info",
      time: "2 hours ago",
      read: true
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 dashboard-sidebar flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border/50">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "hsl(var(--sidebar-primary))" }}>
            <Wheat className="w-5 h-5" style={{ color: "hsl(var(--sidebar-primary-foreground))" }} />
          </div>
          <div>
            <div className="font-display font-bold text-base" style={{ color: "hsl(var(--sidebar-foreground))" }}>
              ASWAMITHRA
            </div>
            <div className="text-xs" style={{ color: "hsl(var(--sidebar-foreground) / 0.6)" }}>
              {roleLabels[role]}
            </div>
          </div>
          <button className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-4 h-4" style={{ color: "hsl(var(--sidebar-foreground))" }} />
          </button>
        </div>

        {/* User info */}
        <div className="flex items-center gap-3 px-4 py-4 mx-3 mt-3 rounded-xl" style={{ background: "hsl(var(--sidebar-accent))" }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm" style={{ background: "hsl(var(--sidebar-primary))", color: "hsl(var(--sidebar-primary-foreground))" }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate" style={{ color: "hsl(var(--sidebar-foreground))" }}>
              {user?.name}
            </div>
            <div className="text-xs capitalize" style={{ color: "hsl(var(--sidebar-foreground) / 0.6)" }}>
              {role} account
            </div>
          </div>
          <RoleIcon className="w-4 h-4 flex-shrink-0" style={{ color: "hsl(var(--sidebar-primary))" }} />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onTabChange(item.id); setSidebarOpen(false); }}
                className={`nav-item w-full text-left ${isActive ? "active" : ""}`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{item.label}</span>
                {item.id === "notifications" && (
                  <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ background: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" }}>
                    3
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-4">
          <button
            onClick={logout}
            className="nav-item w-full text-left"
            style={{ color: "hsl(var(--destructive))" }}
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-card border-b border-border px-4 lg:px-6 py-3 flex items-center gap-4 flex-shrink-0">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-foreground capitalize">
              {navItems.find(n => n.id === activeTab)?.label || "Dashboard"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Notifications Dropdown */}
            <div className="relative">
              <button 
                className="relative p-2 rounded-lg hover:bg-muted transition-colors"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-4 h-4 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: "hsl(var(--destructive))" }} />
                )}
              </button>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Notifications</h3>
                      <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                        {unreadCount} unread
                      </span>
                    </div>
                  </div>
                  
                  {/* Notifications List */}
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            notification.type === 'success' ? 'bg-green-100' :
                            notification.type === 'warning' ? 'bg-yellow-100' :
                            'bg-blue-100'
                          }`}>
                            {notification.type === 'success' && <Check className="w-4 h-4 text-green-600" />}
                            {notification.type === 'warning' && <AlertCircle className="w-4 h-4 text-yellow-600" />}
                            {notification.type === 'info' && <Info className="w-4 h-4 text-blue-600" />}
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-sm font-semibold text-gray-900 truncate">
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mb-1">{notification.message}</p>
                            <p className="text-xs text-gray-400">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Footer */}
                  <div className="p-3 bg-gray-50 border-t border-gray-200">
                    <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>

      {/* WhatsApp Button - Show for all pages */}
      <WhatsAppButton />
    </div>
  );
};

export default DashboardLayout;
