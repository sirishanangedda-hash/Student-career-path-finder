import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

export default function SkillProgressChart({ data }) {
  return <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data} margin={{ left: -22, right: 8, top: 12, bottom: 0 }}>
      <defs>
        <linearGradient id="skillGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7868e8" stopOpacity={0.2} />
          <stop offset="95%" stopColor="#7868e8" stopOpacity={0.01} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 5" vertical={false} stroke="#edf0f6" />
      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#9398a8", fontSize: 11 }} />
      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9398a8", fontSize: 11 }} tickFormatter={(value) => `${value}%`} />
      <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eeeef4", boxShadow: "0 6px 20px #17213a12" }} />
      <Area type="monotone" dataKey="progress" stroke="#7565df" strokeWidth={2.5} fill="url(#skillGradient)" />
    </AreaChart>
  </ResponsiveContainer>;
}
