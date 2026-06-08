"use client";
import { useEffect, useState } from "react";
import { useStore } from "../../lib/store";
import { ActivityLog } from "../../components/ActivityLog";
import { Leaf, Zap, Map, Database } from "lucide-react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = {
  transport: "#14b8a6", // teal
  food: "#f87171", // red/peach
  energy: "#fbbf24", // yellow
  shopping: "#a78bfa", // purple
};

export default function Dashboard() {
  const {
    activities,
    loadSampleData,
    dailyFootprint,
    recommendations,
    insight,
  } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const chartData = activities.reduce(
    (acc, curr) => {
      const existing = acc.find((item) => item.name === curr.category);
      if (existing) {
        existing.value += curr.co2e;
      } else {
        acc.push({ name: curr.category, value: curr.co2e });
      }
      return acc;
    },
    [] as { name: string; value: number }[],
  );

  if (!mounted) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-[40px] font-medium text-ink tracking-[-1.0px] mb-2">
          Welcome back.
        </h1>
        <p className="text-muted font-medium">
          Here is your carbon footprint overview for today.
        </p>
      </header>

      <div className="mb-12">
        <ActivityLog />
      </div>

      {activities.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="col-span-1 bg-brand-teal text-white rounded-[24px] p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-[18px] font-semibold mb-4 flex items-center gap-2">
                <Leaf className="w-6 h-6 text-brand-mint" />
                Daily Footprint
              </h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-[64px] font-medium leading-none tracking-[-1.5px]">
                  {dailyFootprint.toFixed(1)}
                </span>
                <span className="text-white/80 font-medium">kg CO2e</span>
              </div>
            </div>

            {chartData.length > 0 && (
              <div className="h-[200px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            COLORS[entry.name as keyof typeof COLORS] ||
                            "#94a3b8"
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      formatter={(value: any) => [
                        `${Number(value).toFixed(2)} kg`,
                        "Emissions",
                      ]}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="bg-black/20 rounded-xl p-4 mt-6">
              <p className="text-[15px] font-medium text-white/90">
                {insight || "Every small step counts towards a greener future."}
              </p>
            </div>
          </div>

          <div className="col-span-2 bg-brand-peach text-ink rounded-[24px] p-8">
            <h3 className="text-[20px] font-semibold mb-6 flex items-center gap-2 tracking-tight">
              <Zap className="w-6 h-6" />
              AI Leverage Points
            </h3>
            <div className="grid gap-4">
              {recommendations.length > 0 ? (
                recommendations.map((rec, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={rec.id}
                    className="bg-canvas/60 rounded-xl p-5 flex justify-between items-center border border-ink/5 shadow-sm"
                  >
                    <div>
                      <h4 className="font-semibold text-[16px] mb-1">
                        {rec.title}
                      </h4>
                      <p className="text-ink/80 text-[14px]">
                        {rec.description}
                      </p>
                    </div>
                    <div className="text-right ml-4 shrink-0">
                      <span className="block text-brand-teal font-bold text-[18px]">
                        -{rec.potentialSavings}kg
                      </span>
                      <span className="text-[12px] text-ink/70 uppercase tracking-wider font-semibold">
                        {rec.difficulty}
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-ink/60 text-[15px] font-medium p-6 text-center border-2 border-dashed border-ink/20 rounded-xl bg-canvas/40">
                  Log more activities to get personalized leverage point
                  recommendations.
                </div>
              )}
            </div>
          </div>

          <div className="col-span-3 bg-surface-card rounded-[24px] p-8 mt-4 border border-hairline shadow-sm">
            <h3 className="text-[20px] font-semibold text-ink mb-6 flex items-center gap-2 tracking-tight">
              <Map className="w-6 h-6 text-brand-pink" />
              Recent Logs
            </h3>
            <div className="flex flex-col">
              {activities
                .slice()
                .reverse()
                .map((act) => (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={act.id}
                    className="flex justify-between items-center py-4 border-b border-hairline last:border-0 hover:bg-surface-strong rounded-xl px-4 -mx-4 transition-colors"
                  >
                    <div>
                      <div className="text-ink font-semibold text-[16px] capitalize">
                        {act.amount}
                        {act.unit} {act.subCategory}
                      </div>
                      <div className="text-muted text-[14px] font-medium mt-1">
                        {act.rawInput || "Quick Log"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-ink font-semibold text-[16px]">
                        {act.co2e.toFixed(2)} kg
                      </div>
                      <div className="text-muted text-[13px] font-medium">
                        {act.equivalent}
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="py-24 px-6 text-center bg-canvas border border-dashed border-hairline rounded-[24px] max-w-2xl mx-auto shadow-sm">
          <div className="w-20 h-20 bg-surface-soft rounded-full flex items-center justify-center mx-auto mb-6">
            <Leaf className="w-10 h-10 text-muted" />
          </div>
          <h2 className="text-[24px] font-semibold text-ink mb-3">
            No activities logged yet
          </h2>
          <p className="text-muted font-medium text-[16px] mb-8 max-w-md mx-auto">
            Start by typing what you did today in the command palette above,
            like &quot;I drove 15km&quot; or &quot;I ate a burger&quot;. Our AI
            will handle the rest.
          </p>
          <button
            onClick={() => loadSampleData()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-strong text-ink font-semibold text-[15px] hover:bg-hairline transition-colors border border-hairline shadow-sm"
          >
            <Database className="w-4 h-4" />
            Load Demo Data
          </button>
        </div>
      )}
    </div>
  );
}
