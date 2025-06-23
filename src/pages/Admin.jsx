import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Settings, Users, Calendar, Trophy, FileText, MessageSquare, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '../lib/supabaseClient';

import ManageRegistrations from '@/components/admin/ManageRegistrations';
import ManageCalendar from '@/components/admin/ManageCalendar';
import ManageResults from '@/components/admin/ManageResults';
import ManageRules from '@/components/admin/ManageRules';
import ManageNews from '@/components/admin/ManageNews';
import ManageSettings from '@/components/admin/ManageSettings';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('inscriptions');
  const { toast } = useToast();

  // Persistance session
  useEffect(() => {
    if (localStorage.getItem('adminLoggedIn') === 'true') setIsAuthenticated(true);
  }, []);

  const handleLogin = () => {
    if (password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('adminLoggedIn', 'true');
      toast({ title: 'Connexion réussie', description: "Bienvenue dans l'admin." });
    } else {
      toast({ title: 'Erreur', description: 'Mot de passe incorrect', variant: 'destructive' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    setIsAuthenticated(false);
  };

  const adminTabs = [
    { id: 'inscriptions', name: 'Inscriptions', icon: Users, component: <ManageRegistrations supabase={supabase} /> },
    { id: 'calendrier', name: 'Calendrier', icon: Calendar, component: <ManageCalendar supabase={supabase} /> },
    { id: 'resultats', name: 'Résultats', icon: Trophy, component: <ManageResults supabase={supabase} /> },
    { id: 'regles', name: 'Règles', icon: FileText, component: <ManageRules supabase={supabase} /> },
    { id: 'actualites', name: 'Actualités', icon: MessageSquare, component: <ManageNews supabase={supabase} /> },
    { id: 'parametres', name: 'Paramètres', icon: Settings, component: <ManageSettings supabase={supabase} /> },
  ];

  if (!isAuthenticated) {
    return (
      <>
        <Helmet>
          <title>Admin — CODM Legends Cup</title>
        </Helmet>
        <div className="min-h-screen flex items-center justify-center bg-black">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="cyber-card p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <Lock className="text-cyan-400 mx-auto mb-4" size={48} />
              <h1 className="text-2xl font-orbitron font-bold text-cyan-300 mb-2">ADMINISTRATION</h1>
              <p className="text-gray-400">Accès restreint</p>
            </div>
            <div className="space-y-4">
              <Label htmlFor="password" className="text-cyan-400">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="admin123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
              <Button onClick={handleLogin} className="cyber-button w-full">Se connecter</Button>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Panneau d’Administration — CODM Legends Cup</title>
      </Helmet>
      <div className="min-h-screen bg-black pt-16 p-4">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="text-4xl font-orbitron font-bold glow-text mb-2">Panneau d'administration</h1>
            <p className="text-gray-400">Gestion complète du tournoi</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="cyber-card p-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {adminTabs.map((tab) => (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`cyber-button flex items-center justify-center space-x-2 ${activeTab === tab.id ? 'bg-cyan-500/30 ring-2 ring-cyan-400' : ''}`}
                >
                  <tab.icon size={16} />
                  <span className="hidden sm:inline">{tab.name}</span>
                </Button>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="cyber-card p-6">
            {adminTabs.find((tab) => tab.id === activeTab)?.component}
          </motion.div>

          <div className="text-center mt-6">
            <Button onClick={handleLogout} className="cyber-button">
              <Lock size={16} /> Se déconnecter
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
