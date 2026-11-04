import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  IndianRupee,
  ShoppingBag,
  Users,
  Shirt,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  TrendingUp
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { adminService } from "../../services/adminService";
import { formatINR, formatDate } from "../../utils/currency";
import { Loader } from "../../components/common/Loader";
import { DatabaseConnector } from "../../components/admin/DatabaseConnector";
const PIE_COLORS = ["#6b1426", "#c59b27", "#14234b", "#0d5c3a"];
export const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartView, setChartView] = useState("monthly");
  useEffect(() => {
    adminService.getDashboardMetrics().then(setMetrics).finally(() => setLoading(false));
  }, []);
  if (loading || !metrics) return <Loader message="Compiling executive metrics..." />;
  return <div className="space-y-8">
      {
    /* Page Header */
  }
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Operations &amp; Revenue Overview
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time financial performance and fulfillment analytics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
    to="/admin/products"
    className="px-3.5 py-2 bg-[#6b1426] text-white text-xs font-semibold rounded-lg hover:bg-[#520f1d] transition-colors"
  >
            + Add New Saree
          </Link>
          <Link
    to="/admin/reports"
    className="px-3.5 py-2 bg-white border border-stone-300 text-stone-700 text-xs font-semibold rounded-lg hover:bg-stone-50 transition-colors"
  >
            Download CSV Report
          </Link>
        </div>
      </div>

      {
    /* Direct MongoDB Atlas Cloud Connection Panel */
  }
      <DatabaseConnector />

      {
    /* 6 Key Stat Cards */
  }
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {
    /* Total Revenue */
  }
        <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Revenue</span>
            <IndianRupee className="w-4 h-4 text-[#881930]" />
          </div>
          <p className="text-lg font-bold text-stone-900 font-mono tabular-nums">
            {formatINR(metrics.totalRevenue)}
          </p>
          <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> +18.4% vs last mo.
          </span>
        </div>

        {
    /* Total Orders */
  }
        <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Orders</span>
            <ShoppingBag className="w-4 h-4 text-stone-700" />
          </div>
          <p className="text-lg font-bold text-stone-900 font-mono tabular-nums">
            {metrics.totalOrders}
          </p>
          <span className="text-[10px] text-stone-400">All channels</span>
        </div>

        {
    /* Patrons */
  }
        <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Patrons</span>
            <Users className="w-4 h-4 text-stone-700" />
          </div>
          <p className="text-lg font-bold text-stone-900 font-mono tabular-nums">
            {metrics.totalCustomers}
          </p>
          <span className="text-[10px] text-stone-400">Registered</span>
        </div>

        {
    /* Total Saree Designs */
  }
        <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Catalogue</span>
            <Shirt className="w-4 h-4 text-stone-700" />
          </div>
          <p className="text-lg font-bold text-stone-900 font-mono tabular-nums">
            {metrics.totalProducts}
          </p>
          <span className="text-[10px] text-stone-400">Active SKUs</span>
        </div>

        {
    /* Low Stock Alerts */
  }
        <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Low Stock</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-lg font-bold text-amber-700 font-mono tabular-nums">
            {metrics.lowStockCount}
          </p>
          <Link to="/admin/inventory" className="text-[10px] text-[#881930] font-medium hover:underline">
            Restock Looms →
          </Link>
        </div>

        {
    /* Pending Fulfillment */
  }
        <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Pending</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-lg font-bold text-blue-700 font-mono tabular-nums">
            {metrics.pendingOrdersCount}
          </p>
          <Link to="/admin/orders" className="text-[10px] text-blue-800 font-medium hover:underline">
            Process Shipments →
          </Link>
        </div>
      </div>

      {
    /* Analytics Charts Grid */
  }
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {
    /* Main Revenue Bar Chart */
  }
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-stone-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h2 className="font-serif font-bold text-base text-stone-900">
                Revenue Trajectory (INR)
              </h2>
              <p className="text-xs text-stone-400">Monthly fiscal breakdown</p>
            </div>
            <div className="flex gap-1 bg-stone-100 p-1 rounded-md text-xs">
              <button
    onClick={() => setChartView("monthly")}
    className={`px-2.5 py-1 rounded transition-colors ${chartView === "monthly" ? "bg-white shadow-xs font-semibold text-stone-900" : "text-stone-500"}`}
  >
                Revenue (₹)
              </button>
              <button
    onClick={() => setChartView("orders")}
    className={`px-2.5 py-1 rounded transition-colors ${chartView === "orders" ? "bg-white shadow-xs font-semibold text-stone-900" : "text-stone-500"}`}
  >
                Order Volume
              </button>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.monthlyRevenue} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0ece6" />
                <XAxis dataKey="month" stroke="#78716c" fontSize={12} tickLine={false} />
                <YAxis
    stroke="#78716c"
    fontSize={11}
    tickLine={false}
    tickFormatter={(val) => chartView === "monthly" ? `\u20B9${val / 1e3}k` : `${val}`}
  />
                <Tooltip
    formatter={(val) => [
      chartView === "monthly" ? formatINR(Number(val)) : `${val} orders`,
      chartView === "monthly" ? "Revenue" : "Orders"
    ]}
    contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e7e5e4" }}
  />
                <Bar
    dataKey={chartView === "monthly" ? "revenue" : "orders"}
    fill="#6b1426"
    radius={[4, 4, 0, 0]}
    maxBarSize={40}
  />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {
    /* Category Contribution Donut */
  }
        <div className="bg-white p-6 rounded-xl border border-stone-200/90 shadow-xs space-y-4">
          <div>
            <h2 className="font-serif font-bold text-base text-stone-900">
              Fabric Sales Distribution
            </h2>
            <p className="text-xs text-stone-400">Share by volume</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
    data={metrics.categorySales}
    cx="50%"
    cy="50%"
    innerRadius={50}
    outerRadius={80}
    paddingAngle={4}
    dataKey="value"
  >
                  {metrics.categorySales.map((_entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs pt-2 border-t">
            {metrics.categorySales.map((cat, idx) => <div key={cat.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span
    className="w-2.5 h-2.5 rounded-full"
    style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
  />
                  <span className="text-stone-700">{cat.name}</span>
                </span>
                <span className="font-mono font-semibold text-stone-900">{cat.value}%</span>
              </div>)}
          </div>
        </div>
      </div>

      {
    /* Recent Orders Table */
  }
      <div className="bg-white rounded-xl border border-stone-200/90 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <h2 className="font-serif font-bold text-base text-stone-900">
            Recent Patron Orders
          </h2>
          <Link
    to="/admin/orders"
    className="text-xs font-semibold text-[#881930] hover:underline flex items-center gap-1"
  >
            <span>View All Orders</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider text-[11px] border-b border-stone-200">
              <tr>
                <th className="px-5 py-3 font-semibold">Order ID</th>
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Payment</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {metrics.recentOrders.map((order) => <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="px-5 py-3.5 font-mono font-bold text-stone-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-stone-900">{order.userName}</p>
                    <p className="text-[10px] text-stone-400">{order.userEmail}</p>
                  </td>
                  <td className="px-5 py-3.5 text-stone-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-stone-700">{order.paymentMethod}</span>
                    <span className="text-[10px] text-stone-400 block">{order.paymentStatus}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-stone-100 text-stone-800">
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono font-bold text-[#6b1426]">
                    {formatINR(order.totalAmount)}
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
};
