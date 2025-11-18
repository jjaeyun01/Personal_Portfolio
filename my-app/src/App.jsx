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
      <Routes>
        {/* 메인 페이지 */}
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

        {/* More Projects 페이지 */}
        <Route path="/projects" element={<MoreProjects />} />
      </Routes>
    </Router>
  );
}

export default App;
