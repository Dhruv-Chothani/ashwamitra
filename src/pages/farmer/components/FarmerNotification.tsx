import React from "react";
import { Bell, Loader2 } from "lucide-react";
import { useNotifications } from "@/hooks/useApi";

const FarmerNotification = () => {
  const { data: notifications, isLoading } = useNotifications();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
        <span className="ml-2">Loading notifications...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-6 rounded-2xl text-white shadow flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6" />
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-sm opacity-90">Stay updated with your farm activity</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-green-100 rounded-2xl shadow-sm divide-y">
        {(notifications || []).map((note: any) => (
          <div key={note._id || note.id} className="p-5 hover:bg-green-50 transition flex justify-between items-start cursor-pointer">
            <div className="flex items-start gap-3">
              {!note.isRead && <span className="w-2 h-2 bg-green-500 rounded-full mt-2"></span>}
              <div>
                <p className="text-sm font-medium text-gray-800">{note.title || note.message}</p>
                <p className="text-xs text-gray-600 mt-0.5">{note.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {note.createdAt ? new Date(note.createdAt).toLocaleString() : ""}
                </p>
              </div>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
              note.type === "payment_received" ? "bg-blue-100 text-blue-700" :
              note.type === "approval" ? "bg-green-100 text-green-700" :
              "bg-yellow-100 text-yellow-700"
            }`}>
              {note.type || "info"}
            </span>
          </div>
        ))}
        {(!notifications || notifications.length === 0) && (
          <div className="p-8 text-center text-gray-400">No notifications yet</div>
        )}
      </div>
    </div>
  );
};

export default FarmerNotification;
