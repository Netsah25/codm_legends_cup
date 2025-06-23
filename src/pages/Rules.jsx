import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Shield, AlertTriangle, Clock, Users } from 'lucide-react';

const Rules = () => {
  const { mode } = useParams(); // 'mj' ou 'br'
  const [generalRules, setGeneralRules] = useState([]);
  const [specificRules, setSpecificRules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRules = async () => {
      setLoading(true);

      const { data: generalData, error: generalError } = await supabase
        .from('rules')
        .select('content')
        .eq('mode', 'general');

      const { data: modeData, error: modeError } = await supabase
        .from('rules')
        .select('content')
        .eq('mode', mode);

      if (generalError || modeError) {
        console.error('Erreur de chargement des règles:', generalError || modeError);
        setLoading(false);
        return;
      }

      // Découper les règles ligne par ligne (si le contenu est un texte brut)
      const splitRules = (data) =>
        data
          .map((item) => item.content)
          .join('\n')
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean); // enlever les lignes vides

      setGeneralRules(splitRules(generalData));
      setSpecificRules(splitRules(modeData));
      setLoading(false);
    };

    fetchRules();
  }, [mode]);

  if (loading) {
    return <div className="text-center text-white mt-20">Chargement des règles...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Règlement {mode?.toUpperCase()} - CODM Legends Cup</title>
        <meta
          name="description"
          content={`Consultez le règlement officiel ${mode?.toUpperCase()} de la CODM Legends Cup 2025.`}
        />
      </Helmet>

      <div className="min-h-screen pt-20 py-12 text-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-orbitron font-bold mb-4 glow-text">
                RÈGLEMENT {mode?.toUpperCase()}
              </h1>
              <p className="text-lg text-gray-300">Règles officielles du tournoi</p>
            </div>

            {/* Règles Générales */}
            <section className="cyber-card p-6 mb-8">
              <div className="flex items-center mb-6">
                <Shield className="text-cyan-400 mr-3" size={24} />
                <h2 className="text-2xl font-orbitron font-bold text-cyan-300">
                  RÈGLES GÉNÉRALES
                </h2>
              </div>
              <div className="space-y-4">
                {generalRules.map((rule, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                  >
                    <AlertTriangle className="text-yellow-400 mr-3 mt-1" size={16} />
                    <p className="text-gray-300">{rule}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Règles Techniques */}
            <section className="cyber-card p-6 mb-8">
              <div className="flex items-center mb-6">
                <Users className="text-cyan-400 mr-3" size={24} />
                <h2 className="text-2xl font-orbitron font-bold text-cyan-300">
                  RÈGLES TECHNIQUES {mode?.toUpperCase()}
                </h2>
              </div>
              <div className="space-y-4">
                {specificRules.map((rule, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                  >
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3 mt-2" />
                    <p className="text-gray-300">{rule}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Sanctions (statique) */}
            <section className="cyber-card p-6 border-red-500/30">
              <div className="flex items-center mb-6">
                <AlertTriangle className="text-red-400 mr-3" size={24} />
                <h2 className="text-2xl font-orbitron font-bold text-red-400">SANCTIONS</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Clock className="text-yellow-400 mr-3 mt-1" size={16} />
                  <div>
                    <p className="text-white font-bold mb-1">Retard (5-10 minutes)</p>
                    <p className="text-gray-300">Avertissement officiel</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <AlertTriangle className="text-orange-400 mr-3 mt-1" size={16} />
                  <div>
                    <p className="text-white font-bold mb-1">Retard (10+ minutes)</p>
                    <p className="text-gray-300">Défaite par forfait</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Shield className="text-red-400 mr-3 mt-1" size={16} />
                  <div>
                    <p className="text-white font-bold mb-1">Triche détectée</p>
                    <p className="text-gray-300">Disqualification immédiate</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="text-red-400 mr-3 mt-1" size={16} />
                  <div>
                    <p className="text-white font-bold mb-1">Comportement antisportif</p>
                    <p className="text-gray-300">Avertissement puis exclusion</p>
                  </div>
                </div>
              </div>
            </section>

            <div className="text-center mt-8">
              <p className="text-gray-400 text-sm">
                Ces règles peuvent être modifiées. Consultez régulièrement cette page.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Rules;
