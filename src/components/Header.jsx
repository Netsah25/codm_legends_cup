import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Calendar, Trophy, FileText, Users, Target, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: 'Inscription', path: '/inscription', icon: Target },
    { 
      name: 'Calendrier', 
      icon: Calendar,
      submenu: [
        { name: 'MJ', path: '/calendrier/mj' },
        { name: 'BR', path: '/calendrier/br' }
      ]
    },
    { 
      name: 'Résultats', 
      icon: Trophy,
      submenu: [
        { name: 'MJ', path: '/resultats/mj' },
        { name: 'BR', path: '/resultats/br' }
      ]
    },
    { 
      name: 'Règlement', 
      icon: FileText,
      submenu: [
        { name: 'MJ', path: '/reglement/mj' },
        { name: 'BR', path: '/reglement/br' }
      ]
    },
    { name: 'Contact / FAQ', path: '/contact', icon: Users },
    { name: 'Équipes & Joueurs', path: '/equipes', icon: Users },
    { name: 'Scores MJ', path: '/scores', icon: Trophy },
    /*{ name: 'Admin', path: '/admin', icon: Settings }*/
  ];

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-cyan-500/30"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-orbitron font-bold glow-text"
            >
              CODM Legends Cup
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {menuItems.map((item, index) => (
              <div key={index} className="relative group">
                {item.submenu ? (
                  <div className="relative">
                    <button className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                      <item.icon size={16} />
                      <span>{item.name}</span>
                    </button>
                    <div className="absolute top-full left-0 mt-2 w-48 bg-black/95 border border-cyan-500/30 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                      {item.submenu.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          to={subItem.path}
                          className="block px-4 py-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors first:rounded-t-lg last:rounded-b-lg"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-1 transition-colors font-medium ${
                      location.pathname === item.path
                        ? 'text-cyan-300 glow-text'
                        : 'text-cyan-400 hover:text-cyan-300'
                    }`}
                  >
                    <item.icon size={16} />
                    <span>{item.name}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-cyan-400 hover:text-cyan-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-4 border-t border-cyan-500/30 pt-4"
          >
            {menuItems.map((item, index) => (
              <div key={index} className="mb-2">
                {item.submenu ? (
                  <div>
                    <div className="flex items-center space-x-2 text-cyan-400 font-medium mb-2">
                      <item.icon size={16} />
                      <span>{item.name}</span>
                    </div>
                    <div className="ml-6 space-y-1">
                      {item.submenu.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          to={subItem.path}
                          className="block py-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className="flex items-center space-x-2 py-2 text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon size={16} />
                    <span>{item.name}</span>
                  </Link>
                )}
              </div>
            ))}
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
};

export default Header;