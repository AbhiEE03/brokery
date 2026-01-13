import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function InventoryChart({ inventory }) {
  const isDark =
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark");

  const colors = isDark
    ? [
      "rgba(255,255,255,0.9)",
      "rgba(255,255,255,0.65)",
      "rgba(255,255,255,0.4)",
      "rgba(255,255,255,0.2)",
    ]
    : [
      "rgba(0,0,0,0.9)",
      "rgba(0,0,0,0.65)",
      "rgba(0,0,0,0.4)",
      "rgba(0,0,0,0.2)",
    ];

  const legendColor = isDark ? "#9CA3AF" : "#6B7280";

  return (
    <div
      className="
        rounded-xl p-6
        bg-black/[0.04] dark:bg-white/[0.05]
        backdrop-blur-sm
        border border-black/[0.06] dark:border-white/[0.08]
      "
    >
      <h3 className="font-medium text-slate-900 dark:text-white mb-4">
        Inventory Mix
      </h3>

      <Doughnut
        data={{
          labels: ["Plots", "Flats", "Kothis", "Commercial"],
          datasets: [
            {
              data: [
                inventory.plot,
                inventory.flat,
                inventory.kothi,
                inventory.commercial,
              ],
              backgroundColor: colors,
              borderWidth: 0,
            },
          ],
        }}
        options={{
          cutout: "72%",
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                color: legendColor,
                boxWidth: 10,
                padding: 16,
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
        }}
      />
    </div>
  );
}
