import React from 'react'
import { farmersData } from '../AdminDashboard'

const Farmers = () => {
  return (
    <div>
      <div className="space-y-6">
    <h1 className="font-display text-2xl font-bold">Farmers Management</h1>

    {/* Quick Stats */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="stat-card">
        <div className="text-xl font-bold">{farmersData.length}</div>
        <div className="text-xs text-muted-foreground">Total Farmers</div>
      </div>
      <div className="stat-card">
        <div className="text-xl font-bold">
          {farmersData.filter(f => f.status === "Approved").length}
        </div>
        <div className="text-xs text-muted-foreground">Approved</div>
      </div>
    </div>

    {/* Table */}
    <div className="bg-card border border-border rounded-xl overflow-x-auto">
      <table className="w-full min-w-[900px]">
        <thead className="bg-muted">
          <tr>
            {["ID", "Name", "Location", "Products", "Earnings", "Status"].map((h) => (
              <th key={h} className="px-5 py-3 text-left text-xs text-muted-foreground">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {farmersData.map((f) => (
            <tr key={f.id} className="data-table-row">
              <td className="px-5 py-3 text-xs font-mono">{f.id}</td>
              <td className="px-5 py-3 font-medium">{f.name}</td>
              <td className="px-5 py-3">{f.location}</td>
              <td className="px-5 py-3">{f.products}</td>
              <td className="px-5 py-3 font-semibold">{f.earnings}</td>
              <td className="px-5 py-3">
                <span className={
                  f.status === "Approved"
                    ? "badge-success"
                    : f.status === "Pending"
                    ? "badge-warning"
                    : "badge-destructive"
                }>
                  {f.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
    </div>
  )
}

export default Farmers
