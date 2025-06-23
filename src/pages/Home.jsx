import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Target, Trophy, Users, Calendar, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';

const Home = () => {
  const [news, setNews] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from('news')
        .select('content')
        .limit(1)
        .single();

      if (error) {
        setError(error.message);
      } else if (data) {
        setNews(data.content);
      }
    };
    fetchNews();
  }, []);

  return (
    <>
      <Helmet>
        <title>CODM Legends Cup - L'élite du combat mobile commence ici !</title>
        <meta
          name="description"
          content="Rejoignez la CODM Legends Cup 2025, le tournoi ultime de Call of Duty Mobile. Inscriptions ouvertes pour les modes MJ et BR."
        />
      </Helmet>

      <div className="min-h-screen pt-20 text-white">
        {/* Bannière et Actualité */}
        <section className="relative overflow-hidden py-20">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <div
                className="glitch font-orbitron text-4xl md:text-6xl lg:text-7xl mb-8"
                data-text="CODM LEGENDS CUP"
              >
                CODM LEGENDS CUP
              </div>
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-xl md:text-2xl lg:text-3xl text-cyan-400 mb-8 font-medium"
              >
                Bienvenue dans la CODM Legends Cup – L'élite du combat mobile commence ici !
              </motion.h2>

              {/* ACTUALITÉS */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="cyber-card p-8 mb-12 max-w-2xl mx-auto"
              >
                <div className="flex items-center justify-center mb-4">
                  <Zap className="text-cyan-400 mr-2" size={24} />
                  <h3 className="text-xl font-orbitron font-bold text-cyan-300">ACTUALITÉS</h3>
                </div>
                {error ? (
                  <p className="text-red-500">Erreur chargement actualités : {error}</p>
                ) : (
                  <p className="text-lg text-gray-300 whitespace-pre-line mb-6">
                    {news || 'Chargement des actualités...'}
                  </p>
                )}
                <Link to="/inscription">
                  <Button className="cyber-button px-8 py-3 text-lg font-bold">S'INSCRIRE MAINTENANT</Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Décorations */}
          <div className="absolute top-20 left-10 opacity-20">
            <img
              alt="Soldat Call of Duty Mobile en action"
              src="https://images.unsplash.com/photo-1634315556998-81c64cfab8a8"
            />
          </div>
          <div className="absolute bottom-20 right-10 opacity-20">
            <img
              alt="Armes et équipements CODM"
              src="https://images.unsplash.com/photo-1669489890724-2088c1162f5e"
            />
          </div>
        </section>

        {/* MODES DE COMBAT */}
        <section className="py-20 bg-gradient-to-b from-transparent to-black/50">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-orbitron font-bold text-center mb-16 glow-text"
            >
              MODES DE COMBAT
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* MJ */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="cyber-card p-8 text-center"
              >
                <Target className="text-cyan-400 mx-auto mb-4" size={48} />
                <h3 className="text-2xl font-orbitron font-bold mb-4 text-cyan-300">MODE MJ</h3>
                <p className="text-gray-300 mb-6">
                  Affrontements tactiques en équipe. Stratégie, coordination et précision sont les clés de la
                  victoire.
                </p>
                <Link to="/inscription">
                  <Button className="cyber-button">REJOINDRE MJ</Button>
                </Link>
              </motion.div>

              {/* BR */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="cyber-card p-8 text-center"
              >
                <Trophy className="text-cyan-400 mx-auto mb-4" size={48} />
                <h3 className="text-2xl font-orbitron font-bold mb-4 text-cyan-300">MODE BR</h3>
                <p className="text-gray-300 mb-6">
                  Battle Royale intense. Survivez, éliminez et soyez le dernier debout dans l'arène ultime.
                </p>
                <Link to="/inscription">
                  <Button className="cyber-button">REJOINDRE BR</Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { icon: Users, label: 'Équipes Inscrites', value: '128+' },
                { icon: Trophy, label: 'Prix Total', value: '50K€' },
                { icon: Calendar, label: 'Jours de Combat', value: '14' },
                { icon: Zap, label: 'Matchs Prévus', value: '256' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="cyber-card p-6 mb-4">
                    <stat.icon className="text-cyan-400 mx-auto mb-2" size={32} />
                    <div className="text-2xl font-orbitron font-bold text-cyan-300 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-t from-cyan-900/20 to-transparent">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-6 glow-text">PRÊT POUR LE COMBAT ?</h2>
              <p className="text-lg text-gray-300 mb-8">
                Rejoignez l'élite des combattants mobiles et prouvez votre valeur dans l'arène la plus compétitive.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/inscription">
                  <Button className="cyber-button px-8 py-3 text-lg font-bold pulse-glow">
                    COMMENCER L'INSCRIPTION
                  </Button>
                </Link>
                <Link to="/reglement/mj">
                  <Button variant="outline" className="cyber-button px-8 py-3 text-lg">
                    VOIR LES RÈGLES
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
