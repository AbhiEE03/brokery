import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);
export default function LeadsRevenueChart({ leads, revenue }) {
  const isDark =
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark");

  const primaryLine = isDark
    ? "rgba(255,255,255,0.9)"
    : "rgba(0,0,0,0.9)";

  const secondaryLine = isDark
    ? "rgba(255,255,255,0.35)"
    : "rgba(0,0,0,0.35)";

  const gridColor = isDark
    ? "rgba(255,255,255,0.06)"
    : "rgba(0,0,0,0.05)";

  const tickColor = isDark ? "#9CA3AF" : "#6B7280";

  return (
    <div
      className="
        h-[380px] p-6 rounded-xl
        bg-black/[0.04] dark:bg-white/[0.05]
        backdrop-blur-sm
        border border-black/[0.06] dark:border-white/[0.08]
      "
    >
      <div className="mb-4">
        <h3 className="font-medium text-slate-900 dark:text-white">
          Leads vs Revenue
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Last 7 days performance
        </p>
      </div>

      <Line
        data={{
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              label: "Leads",
              data: leads,
              borderColor: primaryLine,
              tension: 0.4,
              borderWidth: 2,
              pointRadius: 0,
            },
            {
              label: "Revenue (₹ Lakhs)",
              data: revenue,
              borderColor: secondaryLine,
              tension: 0.4,
              borderWidth: 2,
              pointRadius: 0,
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: tickColor,
                boxWidth: 10,
                usePointStyle: true,
              },
            },
            tooltip: {
              backgroundColor: isDark
                ? "rgba(30,30,30,0.95)"
                : "rgba(0,0,0,0.75)",
              titleColor: "#fff",
              bodyColor: "#E5E7EB",
              cornerRadius: 8,
              padding: 10,
            },
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: {
                color: tickColor,
                font: { size: 11 },
              },
            },
            y: {
              grid: { color: gridColor },
              ticks: {
                color: tickColor,
                font: { size: 11 },
              },
            },
          },
        }}
      />
    </div>
  );
}

