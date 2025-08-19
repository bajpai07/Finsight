import React from "react";
import {
  LayoutDashboard,
  BarChart3,
  Eye,
  Settings,
  User2,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";

/**
 * FinSight360 Dashboard
 * ---------------------
 * Drop this file in src/App.jsx (or any route/component) of a React + Tailwind project.
 * Dependencies: `npm i recharts lucide-react framer-motion`
 */

const stockLine = [
  { d: "Apr 3", v: 4100 },
  { d: "Apr 5", v: 4125 },
  { d: "Apr 10", v: 4150 },
  { d: "Apr 13", v: 4090 },
  { d: "Apr 16", v: 4170 },
  { d: "Apr 19", v: 4200 },
  { d: "Apr 22", v: 4165 },
  { d: "Apr 25", v: 4232 },
];

const cryptoSeries = [
  { d: "Apr 3", v: 26800 },
  { d: "Apr 6", v: 27500 },
  { d: "Apr 9", v: 28100 },
  { d: "Apr 12", v: 28750 },
  { d: "Apr 15", v: 29100 },
  { d: "Apr 18", v: 29750 },
  { d: "Apr 21", v: 30200 },
  { d: "Apr 24", v: 28123 },
];

const topStocks = [
  { s: "AAPL", name: "Apple Inc.", price: 165.3, pct: 0.92 },
  { s: "MSFT", name: "Microsoft Corp.", price: 329.11, pct: 0.54 },
  { s: "GOOG", name: "Alphabet Inc.", price: 1434.67, pct: 0.31 },
  { s: "AMZN", name: "Amazon.com Inc.", price: 3184.02, pct: 0.77 },
];

const portfolio = [
  { name: "Tech", value: 45 },
  { name: "Finance", value: 25 },
  { name: "Healthcare", value: 18 },
  { name: "Energy", value: 12 },
];

const donutColors = ["#60a5fa", "#34d399", "#fbbf24", "#f87171"]; // blue/green/amber/red

function clsx(...s) {
  return s.filter(Boolean).join(" ");
}

function Stat({ label, value, delta, positive = true }) {
  return (
    <div>
      <div className="text-sm text-slate-300">{label}</div>
      <div className="mt-1 flex items-baseline gap-3">
        <div className="text-4xl font-semibold text-white tracking-tight">{value}</div>
        {typeof delta === "number" && (
          <span
            className={clsx(
              "text-sm font-medium",
              positive ? "text-emerald-400" : "text-rose-400"
            )}
          >
            {positive ? "↑" : "↓"} {delta.toFixed(2)}%
          </span>
        )}
      </div>
    </div>
  );
}

function Card({ children, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={clsx(
        "rounded-2xl bg-slate-900/70 border border-white/5 shadow-2xl shadow-black/40 p-6",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

function Sidebar() {
  const NavItem = ({ icon: Icon, label, active = false }) => (
    <button
      className={clsx(
        "w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
        active
          ? "bg-slate-800 text-white"
          : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:gap-4 md:border-r md:border-white/5 md:bg-slate-950/60 md:p-4">
      <div className="flex items-center gap-2 px-2 py-2">
        <div className="h-3 w-3 rounded-full bg-emerald-400" />
        <div className="text-lg font-semibold tracking-tight text-white">
          FinSight<span className="text-slate-400">360</span>
        </div>
      </div>
      <nav className="mt-2 flex flex-col gap-1">
        <NavItem icon={LayoutDashboard} label="Dashboard" active />
        <NavItem icon={BarChart3} label="Markets" />
        <NavItem icon={Eye} label="Watchlist" />
        <NavItem icon={Settings} label="Settings" />
      </nav>
      <div className="mt-auto rounded-xl border border-white/5 bg-slate-900/60 p-3 text-xs text-slate-300">
        <p className="font-medium text-white">Tip</p>
        Use the sidebar to switch views.
      </div>
    </aside>
  );
}

function TopBar() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/5 bg-slate-950/60 px-4 py-3 backdrop-blur">
      <h1 className="text-xl font-semibold tracking-tight text-white">Dashboard</h1>
      <div className="flex items-center gap-3 text-slate-300">
        <span>Admin</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800">
          <User2 className="h-4 w-4" />
        </div>
      </div>
    </header>
  );
}

function StockChartCard() {
  return (
    <Card>
      <div className="mb-4">
        <div className="text-slate-300">Stock Market</div>
        <Stat label="" value="4,232.46" delta={0.56} positive />
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={stockLine} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="d" tick={{ fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis hide domain={[4000, 4300]} />
            <Tooltip
              contentStyle={{
                background: "#0b1220",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                color: "white",
              }}
            />
            <Line type="monotone" dataKey="v" stroke="url(#lineGrad)" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function CryptoChartCard() {
  return (
    <Card>
      <div className="mb-4">
        <div className="text-slate-300">Cryptocurrency</div>
        <Stat label="" value="$28,123" delta={2.34} positive />
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={cryptoSeries} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#34d399" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="d" tick={{ fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis hide domain={[26000, 30500]} />
            <Tooltip
              contentStyle={{
                background: "#0b1220",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                color: "white",
              }}
            />
            <Area type="monotone" dataKey="v" stroke="#34d399" fill="url(#areaGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function TopStocksCard() {
  return (
    <Card>
      <div className="mb-4 text-slate-300">Top Stocks</div>
      <div className="divide-y divide-white/5">
        {topStocks.map((row) => (
          <div key={row.s} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-6">
              <div className="w-16 font-semibold text-white">{row.s}</div>
              <div className="text-slate-300">{row.name}</div>
            </div>
            <div className="flex items-center gap-8">
              <div className="tabular-nums text-white">${row.price.toLocaleString()}</div>
              <div className="tabular-nums font-medium text-emerald-400">+ {row.pct}%</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function PortfolioCard() {
  const total = portfolio.reduce((a, b) => a + b.value, 0);
  return (
    <Card>
      <div className="mb-4 text-slate-300">Portfolio</div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={portfolio}
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {portfolio.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={donutColors[i % donutColors.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col justify-center gap-2">
          <Stat label="Total Value" value="$25,683" delta={3.56} positive />
          <ul className="mt-2 space-y-1 text-sm text-slate-300">
            {portfolio.map((p, i) => (
              <li key={p.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-sm"
                    style={{ backgroundColor: donutColors[i] }}
                  />
                  {p.name}
                </div>
                <span className="tabular-nums">{p.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[120rem]">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <TopBar />

          <main className="mx-auto w-full max-w-7xl p-4 md:p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <StockChartCard />
              <CryptoChartCard />
              <TopStocksCard />
              <PortfolioCard />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
