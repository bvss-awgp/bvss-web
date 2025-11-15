import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import GayatriMantra from "./components/GayatriMantra";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Blog from "./pages/Blog";
import Signin from "./pages/Signin";
import Contribute from "./pages/Contribute";
import AdminPanel from "./pages/AdminPanel";
import Repositories from "./pages/Repositories";

// Component to handle route changes and show mantra on each page load
const AppContent = () => {
  const location = useLocation();
  const [showMantra, setShowMantra] = useState(true);
  const [key, setKey] = useState(0);

  useEffect(() => {
    // Show mantra on route change
    setShowMantra(true);
    setKey((prev) => prev + 1);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      {showMantra && <GayatriMantra key={key} />}
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/blog" element={<Blog />} />
          <Route path="/signin" element={<Signin />} />
          <Route
            path="/contribute"
            element={
              <ProtectedRoute>
                <Contribute />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />
          <Route
            path="/repositories"
            element={
              <AdminRoute>
                <Repositories />
              </AdminRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
