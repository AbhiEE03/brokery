import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import SectionHeader from "./components/SectionHeader";
import StatCard from "./components/StatCard";
import LeadsRevenueChart from "./components/LeadsRevenueChart";
import InventoryChart from "./components/InventoryChart";
import { getAdminDashboard } from "../../services/admin.service"

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboard()
      .then(res => {
        if (res.success) {
          setData(res);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <p className="text-muted">Loading dashboard...</p>
      </AdminLayout>
    );
  }

  const { stats, charts } = data;

  return (
    <AdminLayout>
      <SectionHeader
        title="System Overview"
        subtitle="Live operational metrics"
      />

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Clients" value={stats.totalClients} />
        <StatCard label="Active Inventory" value={stats.totalProperties} />
        <StatCard label="Active Deals" value={stats.activeDeals} />
        <StatCard
          label="Monthly Conversion"
          value={`${stats.conversionRate}%`}
        />
      </div>

      {/* CHARTS */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LeadsRevenueChart
            leads={charts.leads}
            revenue={charts.revenue}
          />
        </div>

        <InventoryChart inventory={charts.inventory} />
      </div>

      <p className="mt-6 text-xs text-muted text-right">
        Powered by <span className="text-white">BackendBots</span>
      </p>
    </AdminLayout>
  );
}
