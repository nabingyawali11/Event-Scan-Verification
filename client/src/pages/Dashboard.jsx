import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { Users, Calendar, CheckCircle, Mail, ArrowUpRight, Loader2, ExternalLink, ScanLine } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Dashboard() {
  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data } = await api.get('/events');
      return data;
    }
  });

  const stats = [
    { name: 'Active Events', value: events?.length || 0, icon: Calendar, color: 'bg-blue-500' },
    { name: 'Total Registered', value: '...', icon: Users, color: 'bg-indigo-500' },
    { name: 'Total Checked In', value: '...', icon: CheckCircle, color: 'bg-green-500' },
    { name: 'Tickets Sent', value: '...', icon: Mail, color: 'bg-amber-500' },
  ];

  if (eventsLoading) return (
    <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Welcome Back</h1>
          <p className="text-slate-500">Here's what's happening with your events today</p>
        </div>
        <Link to="/scanner" className="btn-primary flex items-center space-x-2 w-full md:w-auto justify-center">
            <ScanLine size={20} />
            <span>Scan Ticket</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl text-white ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className="text-green-500 text-xs font-bold flex items-center bg-green-50 px-2 py-1 rounded-md">
                <ArrowUpRight size={12} className="mr-1" />
                Live
              </span>
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.name}</p>
            <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-slate-800">Event Activity</h3>
          </div>
          
          <div className="h-[300px] w-full">
            {events?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={events}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                            cursor={{ fill: '#f8fafc' }}
                        />
                        <Bar dataKey="name.length" radius={[4, 4, 0, 0]}>
                            {events.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={['#6366f1', '#8b5cf6', '#3b82f6'][index % 3]} />
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

        <div className="lg:col-span-1 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Recent Events</h3>
          <div className="space-y-6">
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
                    <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{event.name}</p>
                    <p className="text-xs text-slate-500">{new Date(event.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <ExternalLink size={16} className="text-slate-300 group-hover:text-indigo-600" />
              </Link>
            ))}
            {events?.length === 0 && (
                <p className="text-center text-slate-400 py-8 italic text-sm">No events created yet.</p>
            )}
            <Link to="/events" className="block text-center text-indigo-600 text-sm font-bold hover:underline mt-4">
              View All Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
