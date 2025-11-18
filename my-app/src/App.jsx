import { useState } from 'react';
import Loading from './pages/Loading';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AboutAndSkills from './pages/AboutAndSkills';
import Project from './pages/Project';
import Contact from './pages/Contact';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <Loading onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="App">
      <Navbar />
      <Home />
      <AboutAndSkills />
      <Project />
      <Contact />
    </div>
  );
}

export default App;