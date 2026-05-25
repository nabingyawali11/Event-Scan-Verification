import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { Link } from "react-router-dom";
import {
  Plus,
  MapPin,
  Calendar as CalendarIcon,
  Users,
  ChevronRight,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Events() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    venue: "",
  });
  const queryClient = useQueryClient();

  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data } = await api.get("/events");
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (newEvent) => api.post("/events", newEvent),
    onSuccess: () => {
      queryClient.invalidateQueries(["events"]);
      setShowModal(false);
      setFormData({ name: "", description: "", date: "", venue: "" });
      toast.success("Event created!");
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to create event"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  if (isLoading)
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
            Your Events
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1 sm:mt-2">
            Create and manage your upcoming events
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto h-11 sm:h-auto sm:px-6 sm:py-2.5"
        >
          <Plus size={20} />
          <span>New Event</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {events?.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-slate-300">
            <CalendarIcon className="mx-auto text-slate-300 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-slate-700">
              No events found
            </h3>
            <p className="text-slate-500 mb-6">
              Create your first event to start checking in participants
            </p>
            <button onClick={() => setShowModal(true)} className="btn-primary">
              Add Event
            </button>
          </div>
        ) : (
          events?.map((event) => (
            <Link
              key={event._id}
              to={`/events/${event._id}`}
              className="group bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all active:scale-[0.98]"
            >
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 bg-indigo-50 text-indigo-600 rounded-lg sm:rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <CalendarIcon size={20} className="sm:w-6 sm:h-6" />
                </div>
                <ChevronRight
                  className="text-slate-300 group-hover:text-indigo-600 transition-colors shrink-0"
                  size={18}
                />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">
                {event.name}
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                {event.description || "No description provided."}
              </p>

              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex items-center text-slate-600">
                  <CalendarIcon
                    size={14}
                    className="mr-2 opacity-70 shrink-0"
                  />
                  <span className="truncate">
                    {new Date(event.date).toLocaleDateString(undefined, {
                      dateStyle: "medium",
                    })}
                  </span>
                </div>
                <div className="flex items-center text-slate-600">
                  <MapPin size={14} className="mr-2 opacity-70 shrink-0" />
                  <span className="truncate">
                    {event.venue || "No venue set"}
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-60 p-3 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 sm:p-8 shadow-2xl scale-in max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
              Create New Event
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                  Event Name
                </label>
                <input
                  required
                  type="text"
                  className="input-field text-sm h-10 sm:h-auto"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  className="input-field min-h-20 sm:min-h-25 text-sm"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                    Date
                  </label>
                  <input
                    required
                    type="date"
                    className="input-field text-sm h-10 sm:h-auto"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                    Venue
                  </label>
                  <input
                    type="text"
                    className="input-field text-sm h-10 sm:h-auto"
                    value={formData.venue}
                    onChange={(e) =>
                      setFormData({ ...formData, venue: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex gap-2 sm:gap-3 mt-6 sm:mt-8">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn-secondary h-10 sm:h-auto text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1 btn-primary h-10 sm:h-auto text-sm sm:text-base"
                >
                  {createMutation.isPending ? "Creating..." : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
