import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { MessageCircle, Phone, Mail, HelpCircle, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Contact = () => {
  const faqItems = [
    { question: 'Comment puis-je m\'inscrire au tournoi ?', answer: 'Rendez-vous sur la page d\'inscription, choisissez votre mode (MJ ou BR), remplissez le formulaire et vous serez automatiquement redirigé vers le groupe WhatsApp correspondant.' },
    { question: 'Puis-je changer d\'équipe après inscription ?', answer: 'Les changements d\'équipe sont possibles jusqu\'à 48h avant le début du tournoi. Contactez les administrateurs via WhatsApp.' },
    { question: 'Que se passe-t-il si mon équipe est en retard ?', answer: 'Un retard de 5-10 minutes entraîne un avertissement. Au-delà de 10 minutes, c\'est une défaite par forfait.' },
    { question: 'Comment sont calculés les points en BR ?', answer: 'Les points sont calculés selon votre position finale + le nombre d\'éliminations.' },
    { question: 'Y a-t-il des prix à gagner ?', answer: 'Oui ! Des prix en espèces et des récompenses in-game sont prévus pour les meilleures équipes.' },
    { question: 'Puis-je participer aux deux modes ?', answer: 'Oui, vous pouvez vous inscrire à la fois en MJ et BR, mais vous devrez gérer les horaires.' }
  ];

  const handleWhatsAppClick = (number) => {
    window.open(`https://wa.me/${number.replace(/\s/g, '')}`, '_blank');
  };

  return (
    <>
      <Helmet>
        <title>Contact & FAQ - CODM Legends Cup</title>
        <meta name="description" content="Contactez l'équipe CODM Legends Cup et consultez la FAQ pour toutes vos questions sur le tournoi." />
      </Helmet>
      <div className="min-h-screen pt-20 py-12">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-orbitron font-bold mb-4 glow-text">CONTACT & FAQ</h1>
              <p className="text-lg text-gray-300">Besoin d'aide ? Nous sommes là pour vous !</p>
            </div>

            {/* Section Contact */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="cyber-card p-6 mb-12">
              <div className="flex items-center mb-6">
                <MessageCircle className="text-cyan-400 mr-3" size={24} />
                <h2 className="text-2xl font-orbitron font-bold text-cyan-300">NOUS CONTACTER</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-black/30 border border-cyan-500/20 rounded-lg">
                    <Phone className="text-cyan-400 mr-3" size={20} />
                    <div>
                      <p className="text-white font-bold">WhatsApp Support</p>
                      <p className="text-gray-300 text-sm">+22969195902</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-black/30 border border-cyan-500/20 rounded-lg">
                    <Mail className="text-cyan-400 mr-3" size={20} />
                    <div>
                      <p className="text-white font-bold">Email</p>
                      <p className="text-gray-300 text-sm">codmlegendscup@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-black/30 border border-cyan-500/20 rounded-lg">
                    <Clock className="text-cyan-400 mr-3" size={20} />
                    <div>
                      <p className="text-white font-bold">Horaires</p>
                      <p className="text-gray-300 text-sm">Lun-Dim: 9h-22h</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button onClick={() => handleWhatsAppClick('+22969195902')} className="cyber-button w-full py-3">
                    <MessageCircle className="mr-2" size={16} />Contacter via WhatsApp
                  </Button>

                  <a
                    href="mailto:codmlegendscup@gmail.com"
                    className="cyber-button w-full py-3 flex items-center justify-center border border-cyan-500 rounded text-white hover:bg-cyan-500/20"
                  >
                    <Mail className="mr-2" size={16} />Envoyer un Email
                  </a>

                  <div className="cyber-card p-4 bg-cyan-500/10">
                    <div className="flex items-center mb-2">
                      <Users className="text-cyan-400 mr-2" size={16} />
                      <span className="text-cyan-300 font-bold">Groupes WhatsApp</span>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">Rejoignez automatiquement après inscription</p>
                    <p className="text-xs text-gray-400">MJ & BR: Liens fournis après inscription</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Section FAQ */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <div className="flex items-center mb-8">
                <HelpCircle className="text-cyan-400 mr-3" size={24} />
                <h2 className="text-2xl font-orbitron font-bold text-cyan-300">QUESTIONS FRÉQUENTES</h2>
              </div>
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + (index * 0.1) }} className="cyber-card p-6">
                    <h3 className="text-lg font-bold text-cyan-300 mb-3">{item.question}</h3>
                    <p className="text-gray-300 leading-relaxed">{item.answer}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Contact d'urgence */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="cyber-card p-6 mt-12 border-yellow-500/30">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <MessageCircle className="text-yellow-400 mr-2" size={20} />
                  <span className="text-yellow-400 font-bold">CONTACT D'URGENCE</span>
                </div>
                <p className="text-gray-300 mb-4">Pour les problèmes techniques pendant les matchs ou les urgences</p>
                <Button
                  onClick={() => handleWhatsAppClick('+22943348833')}
                  className="cyber-button bg-yellow-500/20 border-yellow-500 text-yellow-300 hover:bg-yellow-500/30"
                >
                  <Phone className="mr-2" size={16} />WhatsApp Urgence: +22943348833
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Contact;
