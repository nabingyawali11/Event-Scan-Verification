import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Scanner from "./pages/Scanner";
import Navbar from "./components/layout/Navbar";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        {user && <Navbar />}
        <main className="w-full min-h-[calc(100vh-64px)] px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to="/" />}
              />

              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/events"
                element={
                  <ProtectedRoute>
                    <Events />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/events/:id"
                element={
                  <ProtectedRoute>
                    <EventDetail />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/scanner"
                element={
                  <ProtectedRoute>
                    <Scanner />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
