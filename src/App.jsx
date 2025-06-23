import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import Home from '@/pages/Home';
import Registration from '@/pages/Registration';
import Calendar from '@/pages/Calendar';
import Results from '@/pages/Results';
import Rules from '@/pages/Rules';
import Contact from '@/pages/Contact';
import Teams from '@/pages/Teams';
import Scores from '@/pages/Scores';
import Admin from '@/pages/Admin';
import FloatingParticles from '@/components/FloatingParticles';
import { DataProvider } from '@/context/DataContext';

function App() {
  return (
    <Router>
      <DataProvider>
        <div className="min-h-screen bg-black relative">
          <FloatingParticles />
          <div className="cyber-grid fixed inset-0 opacity-20 pointer-events-none" />
          <Header />
          <main className="relative z-10">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/inscription" element={<Registration />} />
              <Route path="/calendrier/:mode" element={<Calendar />} />
              <Route path="/resultats/:mode" element={<Results />} />
              <Route path="/reglement/:mode" element={<Rules />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/equipes" element={<Teams />} />
              <Route path="/scores" element={<Scores />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Toaster />
        </div>
      </DataProvider>
    </Router>
  );
}

export default App;