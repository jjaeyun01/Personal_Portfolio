import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Loading from "./pages/Loading";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AboutAndSkills from "./pages/AboutAndSkills";
import Project from "./pages/Project";
import Contact from "./pages/Contact";

import MoreProjects from "./pages/MoreProjects";

import "./App.css";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <Loading onComplete={handleLoadingComplete} />;
  }

  return (
    <Router>
      <Navbar />
      <main className="main-layout">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Home />
                <AboutAndSkills />
                <Project />
                <Contact />
              </>
            }
          />

          <Route path="/projects" element={<MoreProjects />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
