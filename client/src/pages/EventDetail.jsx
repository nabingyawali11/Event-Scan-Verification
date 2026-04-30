import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { 
  Mail, 
  Phone, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Send, 
  Download, 
  Upload, 
  Loader2, 
  Search,
  Calendar as CalendarIcon,
  MapPin
} from 'lucide-react';
import CsvDropzone from '../components/upload/CsvDropzone';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function EventDetail() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const { data } = await api.get(`/events/${id}`);
      return data;
    }
  });

  const { data: participants, isLoading: participantsLoading } = useQuery({
    queryKey: ['participants', id],
    queryFn: async () => {
      const { data } = await api.get(`/participants/${id}`);
      return data;
    }
  });

  const resendMutation = useMutation({
    mutationFn: (participantId) => api.post(`/participants/${participantId}/resend`),
    onSuccess: () => toast.success('Ticket resent!'),
    onError: () => toast.error('Failed to resend ticket')
  });

  const deleteMutation = useMutation({
    mutationFn: (participantId) => api.delete(`/participants/${participantId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['participants', id]);
      toast.success('Participant removed');
    }
  });

  const filteredParticipants = participants?.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingEmails = participants?.filter(p => !p.emailSent).length || 0;

  if (eventLoading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-2xl border border-slate-200 shadow-sm gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">{event?.name}</h1>
          <div className="flex items-center space-x-4 mt-2 text-slate-500">
             <span className="flex items-center"><CalendarIcon size={16} className="mr-1" /> {new Date(event?.date).toDateString()}</span>
             <span className="flex items-center"><MapPin size={16} className="mr-1" /> {event?.venue}</span>
          </div>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => window.print()} className="btn-secondary flex items-center space-x-2">
            <Download size={18} />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <Upload size={20} className="mr-2" />
              Upload Participants
            </h3>
            <p className="text-indigo-100 text-xs mb-4">
              Tickets with QR codes will be sent automatically to each participant's email after upload.
            </p>
            <CsvDropzone eventId={id} onSuccess={() => queryClient.invalidateQueries(['participants', id])} />
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Total Registered</span>
                <span className="font-bold text-slate-800 text-xl">{participants?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Tickets Sent</span>
                <span className="font-bold text-green-600 text-xl">
                    {participants?.filter(p => p.emailSent).length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Checked In</span>
                <span className="font-bold text-indigo-600 text-xl">
                    {participants?.filter(p => p.checkedIn).length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>


        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center space-x-4">
                <h3 className="text-xl font-bold text-slate-800">Participant List</h3>
              </div>

              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search participants..." 
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Email & Tickets</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {participantsLoading ? (
                    <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-400"><Loader2 className="animate-spin inline mr-2" size={20} />Loading...</td></tr>
                  ) : filteredParticipants?.length === 0 ? (
                    <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-400">No participants found</td></tr>
                  ) : (
                    filteredParticipants?.map((p) => (
                      <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-800">{p.name}</p>
                        </td>
                        <td className="px-6 py-4">
                          {p.checkedIn ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle size={12} className="mr-1" />Checked In
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                              <XCircle size={12} className="mr-1" />Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm text-slate-600 font-medium">{p.email}</span>
                            <div className="mt-1">
                               {p.emailSent ? (
                                 <span className="inline-flex items-center text-[10px] text-green-600 font-semibold uppercase tracking-wider">
                                   <CheckCircle size={10} className="mr-1" /> Ticket Sent
                                 </span>
                               ) : (
                                 <span className="inline-flex items-center text-[10px] text-amber-600 font-semibold uppercase tracking-wider">
                                   <XCircle size={10} className="mr-1" /> Not Sent
                                 </span>
                               )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <button onClick={() => resendMutation.mutate(p._id)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg" title="Resend Ticket"><Send size={18} /></button>
                            <button onClick={() => deleteMutation.mutate(p._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="Delete Participant"><Trash2 size={18} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}

                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

