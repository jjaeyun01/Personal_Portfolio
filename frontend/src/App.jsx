import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";

import Loading from "./pages/Loading";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AboutAndSkills from "./pages/AboutAndSkills";
import Project from "./pages/Project";
import Contact from "./pages/Contact";
import MoreProjects from "./pages/MoreProjects";
import GlobeScene from "./components/GlobeScene";
import { useScrollProgress } from "./hooks/useScrollProgress";

import "./App.css";

function MainLayout({ senderPos, setSenderPos, sendKey, setSendKey }) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const scrollProgress = useScrollProgress();

  return (
    <>
      {isHome && (
        <div className="globe-fixed">
          <GlobeScene
            scrollProgress={scrollProgress}
            senderPos={senderPos}
            sendKey={sendKey}
          />
        </div>
      )}
      <Navbar />
      <main className={`main-layout${isHome ? ' main-layout--with-globe' : ''}`}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Home />
                <AboutAndSkills />
                <Project />
                <Contact
                  setSenderPos={setSenderPos}
                  setSendKey={setSendKey}
                />
              </>
            }
          />
          <Route path="/projects" element={<MoreProjects />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [senderPos, setSenderPos] = useState(null);
  const [sendKey, setSendKey] = useState(0);

  if (isLoading) {
    return <Loading onComplete={() => setIsLoading(false)} />;
  }

  return (
    <Router>
      <MainLayout
        senderPos={senderPos}
        setSenderPos={setSenderPos}
        sendKey={sendKey}
        setSendKey={setSendKey}
      />
    </Router>
  );
}

export default App;
