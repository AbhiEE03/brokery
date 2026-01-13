import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "../../components/ui/card";

import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import api from "../../services/api";
import BrokerLayout from "../../components/layout/BrokerLayout";

/* -----------------------------
   Animations
------------------------------*/
const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

/* -----------------------------
   Weekly Growth Badge
------------------------------*/
function WeeklyDeltaCorner({ value }) {
  if (value === 0 || value === undefined || value === null) return null;

  const positive = value > 0;

  return (
    <span
      className={`
        absolute bottom-2 right-3 text-sm font-semibold
        ${positive ? "text-emerald-500" : "text-red-500"}
      `}
    >
      {positive ? `+${value}` : value}
      <span className="ml-1 text-[10px] opacity-70">This week</span>
    </span>
  );
}

export default function BrokerDashboard() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/broker/dashboard").then((res) => {
      setData(res.data || res);
      setLoading(false);
    });
  }, []);

  const {
    stats = {},
    pipeline = {},
    actions = {},
    inventory = {},
    events = [],
    user,
    weekly = {}
  } = data || {};

  const pipelineChart = Object.entries(pipeline || {}).map(([k, v]) => ({
    stage: k.replace(/_/g, " "),
    value: Number(v) || 0,
    delta: weekly?.pipeline?.[k] || 0,
  }));

  const revenueSeries = [
    { month: "Jan", value: stats?.revenue || 0 },
    { month: "Feb", value: stats?.revenue || 0 },
    { month: "Mar", value: stats?.revenue || 0 },
  ];

  const inventoryPie = [
    { name: "Residential", value: inventory?.residential || 0 },
    { name: "Commercial", value: inventory?.commercial || 0 },
  ];

  if (loading) {
    return (
      <BrokerLayout>
        <div className="p-16 flex items-center justify-center">
          <motion.div
            className="w-8 h-8 rounded-full border border-slate-300/40 border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
        </div>
      </BrokerLayout>
    );
  }

  const kpis = [
    { label: "Total Clients", value: stats.totalClients, delta: weekly?.stats?.newClients },
    { label: "Active Leads", value: stats.activeLeads },
    { label: "Hot Leads", value: stats.hotLeads, delta: weekly?.stats?.newHotLeads },
    { label: "Deals Closed", value: stats.dealsClosed, delta: weekly?.stats?.dealsClosed },
    { label: "Revenue", value: `₹${stats.revenue || 0}`, delta: weekly?.stats?.revenue },
    { label: "Commission", value: `₹${stats.commission || 0}` },
  ];

  return (
    <BrokerLayout user={user}>
      <motion.div
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.05 }}
        className="space-y-10"
      >
        {/* HEADER */}
        <motion.div variants={fadeIn} className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            Broker Performance
          </h1>
          <p className="text-slate-500 dark:text-muted">
            Real-time insights with weekly indicators
          </p>
        </motion.div>

        {/* KPI STRIP */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {kpis.map((kpi) => (
            <motion.div key={kpi.label} variants={fadeIn}>
              <Card
                className="
                  relative rounded-2xl
                  bg-white/60 dark:bg-white/[0.04]
                  border border-slate-200/40 dark:border-white/[0.06]
                  shadow-[0_1px_2px_rgba(0,0,0,0.03)]
                  hover:shadow-[0_2px_6px_rgba(0,0,0,0.04)]
                  transition-all
                "
              >
                <CardHeader>
                  <CardTitle className="text-xs uppercase tracking-wide text-slate-500 dark:text-muted">
                    {kpi.label}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <h2 className="text-3xl font-semibold">
                    {kpi.value || 0}
                  </h2>
                </CardContent>

                <WeeklyDeltaCorner value={kpi.delta} />
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {[{
            title: "Pipeline Health",
            content: (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineChart}>
                  <XAxis dataKey="stage" />
                  <YAxis hide />
                  <Tooltip />
                  <Bar dataKey="value" radius={[10, 10, 4, 4]} />
                </BarChart>
              </ResponsiveContainer>
            )
          }, {
            title: "Revenue Pulse",
            content: (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueSeries}>
                  <XAxis dataKey="month" />
                  <YAxis hide />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )
          }, {
            title: "Inventory Mix",
            content: (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={inventoryPie}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={90}
                  >
                    {inventoryPie.map((_, i) => <Cell key={i} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )
          }].map((chart, i) => (
            <motion.div key={i} variants={fadeIn}>
              <Card
                className="
                  rounded-2xl
                  bg-white/60 dark:bg-white/[0.04]
                  border border-slate-200/40 dark:border-white/[0.06]
                  shadow-[0_1px_2px_rgba(0,0,0,0.03)]
                "
              >
                <CardHeader>
                  <CardTitle>{chart.title}</CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                  {chart.content}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </BrokerLayout>
  );
}
