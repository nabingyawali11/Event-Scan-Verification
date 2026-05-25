import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import {
  Users,
  Calendar,
  CheckCircle,
  Mail,
  ArrowUpRight,
  Loader2,
  ExternalLink,
  ScanLine,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function Dashboard() {
  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data } = await api.get("/events");
      return data;
    },
  });

  const stats = [
    {
      name: "Active Events",
      value: events?.length || 0,
      icon: Calendar,
      color: "bg-blue-500",
    },
    {
      name: "Total Registered",
      value: "...",
      icon: Users,
      color: "bg-indigo-500",
    },
    {
      name: "Total Checked In",
      value: "...",
      icon: CheckCircle,
      color: "bg-green-500",
    },
    { name: "Tickets Sent", value: "...", icon: Mail, color: "bg-amber-500" },
  ];

  if (eventsLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800">
            Welcome Back
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1 sm:mt-2">
            Here's what's happening with your events today
          </p>
        </div>
        <Link
          to="/scanner"
          className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto h-11 sm:h-auto sm:px-6 sm:py-2.5"
        >
          <ScanLine size={20} />
          <span>Scan Ticket</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <div
                className={`p-2 sm:p-3 rounded-lg sm:rounded-xl text-white ${stat.color}`}
              >
                <stat.icon size={18} className="sm:size-20" />
              </div>
              <span className="text-green-500 text-[10px] sm:text-xs font-bold flex items-center bg-green-50 px-2 py-1 rounded-md">
                <ArrowUpRight size={12} className="mr-1" />
                Live
              </span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">
              {stat.name}
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mt-2">
              {stat.value}
            </h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        <div className="lg:col-span-2 bg-white p-4 sm:p-8 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-slate-800">
              Event Activity
            </h3>
          </div>

          <div className="h-64 sm:h-75 w-full -mx-4 sm:mx-0 sm:px-0 px-4">
            {events?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={events}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    }}
                    cursor={{ fill: "#f8fafc" }}
                  />
                  <Bar dataKey="name.length" radius={[4, 4, 0, 0]}>
                    {events.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={["#6366f1", "#8b5cf6", "#3b82f6"][index % 3]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                No event data to display
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 bg-white p-4 sm:p-8 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-4 sm:mb-6">
            Recent Events
          </h3>
          <div className="space-y-4 sm:space-y-6">
            {events?.slice(0, 5).map((event) => (
              <Link
                key={event._id}
                to={`/events/${event._id}`}
                className="flex justify-between items-center group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    {event.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {event.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <ExternalLink
                  size={16}
                  className="text-slate-300 group-hover:text-indigo-600"
                />
              </Link>
            ))}
            {events?.length === 0 && (
              <p className="text-center text-slate-400 py-8 italic text-sm">
                No events created yet.
              </p>
            )}
            <Link
              to="/events"
              className="block text-center text-indigo-600 text-sm font-bold hover:underline mt-4"
            >
              View All Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
