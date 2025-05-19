import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Contact from "./pages/Contact";
import CreateAccount from "./pages/CreateAccount";
import Dashboard from "./pages/Dashboard";
import Demo from "./pages/Demo";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Pricing from "./pages/Pricing";
import Summarization from "./pages/Summarization";
import Work from "./pages/Work";

// Create a wrapper component to handle the navbar and footer logic
function AppContent() {
  const location = useLocation();
  const hideNavbarPaths = ["/dashboard", "/summarization"]; // Add any other paths where you want to hide navbar
  const showFooterPaths = ["/"]; // Only show footer on the Home page

  return (
    <>
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/work" element={<Work />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/summarization" element={<Summarization />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      {showFooterPaths.includes(location.pathname) && <Footer />}
    </>
  );
}

// Main App component
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
