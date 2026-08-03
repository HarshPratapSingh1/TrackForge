import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import CFTracker from "./pages/CFTracker";
import GateTracker from "./pages/GateTracker";
import Login from "./pages/Login";
import StudyLog from "./pages/StudyLog";
import Profile from "./pages/Profile";
import GoalTracker from "./pages/GoalTracker";
import Achievements from "./pages/Achievements";
import GateSubject from "./pages/GateSubject";
import Landing from "./pages/Landing";

// The authenticated shell: Navbar + all the app's inner pages, nested under /app
function AuthenticatedApp() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white overflow-x-hidden">
      <Navbar />
      <main className="w-full px-3 sm:px-6 py-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/cf" element={<CFTracker />} />
          <Route path="/gate" element={<GateTracker />} />
          <Route path="/gate/:subject" element={<GateSubject />} />
          <Route path="/study" element={<StudyLog />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/goals" element={<GoalTracker />} />
          <Route path="/achievements" element={<Achievements />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing page — always accessible, logged in or not */}
        <Route path="/" element={<Landing />} />

        {/* /app and everything under it requires auth */}
        <Route
          path="/app/*"
          element={user ? <AuthenticatedApp /> : <Login />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;