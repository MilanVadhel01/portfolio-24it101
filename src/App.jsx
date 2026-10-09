import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
// Note: the file is NavBar.jsx — the import path must match its exact
// case because Linux (Docker) file systems are case-sensitive
import Navbar from './components/NavBar';
import Home from './pages/Home';

// Lazy-loaded routes for code splitting
const Projects = lazy(() => import('./pages/Projects'));
const Contact = lazy(() => import('./pages/Contact'));

function LoadingFallback() {
  return (
    <div className="state-container">
      <div className="spinner"></div>
      <p className="state-text">Loading...</p>
    </div>
  );
}

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Suspense>
      </main>
    </>
  );
}

export default App;