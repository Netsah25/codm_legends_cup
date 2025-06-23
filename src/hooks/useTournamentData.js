import { useState, useEffect, useCallback } from 'react';

const getInitialData = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key “${key}”:`, error);
    return defaultValue;
  }
};

const useTournamentData = () => {
  const [registrations, setRegistrations] = useState(() => getInitialData('codm_registrations', []));
  const [settings, setSettings] = useState(() => getInitialData('codm_settings', {
    whatsappMj: 'https://chat.whatsapp.com/LwLIeOZXFFAL8dv2HVHfAl',
    whatsappBr: 'https://chat.whatsapp.com/HZitIx1XawmGWmdq2bVNyx',
    faqWhatsapp: '+33 6 12 34 56 78',
  }));
  const [news, setNews] = useState(() => getInitialData('codm_news', 'Tournoi édition 2025 - Les inscriptions sont désormais ouvertes !'));
  const [rules, setRules] = useState(() => getInitialData('codm_rules', {
    general: [
      'Aucune triche ou utilisation de logiciels tiers autorisée',
      'Respect obligatoire envers tous les participants',
      'Ponctualité requise - aucun retard toléré',
      'Communication uniquement via les canaux officiels',
      'Signalement immédiat de tout problème technique',
      'Respect des décisions des arbitres'
    ],
    mj: [
      'Format: 5v5 en mode Multijoueur',
      'Cartes autorisées: Nuketown, Crash, Crossfire, Raid',
      'Modes de jeu: Domination, Recherche et Destruction',
      'Durée des matchs: 10 minutes maximum',
      'Armes interdites: Lanceurs, Explosifs',
      'Killstreaks autorisés: UAV, Counter-UAV, Predator Missile uniquement'
    ],
    br: [
      'Format: Squad de 4 joueurs maximum',
      'Mode: Battle Royale Classique',
      'Carte: Blackout uniquement',
      'Durée: Jusqu\'à élimination complète',
      'Véhicules: Tous autorisés',
      'Classes: Toutes les classes disponibles autorisées'
    ]
  }));
  const [calendar, setCalendar] = useState(() => getInitialData('codm_calendar', {
    mj: { dates: ['5 Août 2025', '7 Août 2025', '10 Août 2025', '12 Août 2025'] },
    br: {
      schedule: [
        { date: '2 Août 2025', manche: 'Manche 1', parties: [{ time: '14:00', description: 'Partie 1' }, { time: '15:30', description: 'Partie 2' }, { time: '17:00', description: 'Partie 3' }, { time: '18:30', description: 'Partie 4' }] },
        { date: '3 Août 2025', manche: 'Manche 2', parties: [{ time: '14:00', description: 'Partie 1' }, { time: '15:30', description: 'Partie 2' }, { time: '17:00', description: 'Partie 3' }, { time: '18:30', description: 'Partie 4' }] }
      ],
      showTeams: true
    }
  }));
  const [results, setResults] = useState(() => getInitialData('codm_results', {
    mj: {
      groups: [
        { name: 'Groupe A', teams: [{ name: 'Team Alpha', points: 15, rank: 1 }, { name: 'Team Beta', points: 12, rank: 2 }, { name: 'Team Gamma', points: 8, rank: 3 }, { name: 'Team Delta', points: 5, rank: 4 }] },
        { name: 'Groupe B', teams: [{ name: 'Team Epsilon', points: 14, rank: 1 }, { name: 'Team Zeta', points: 11, rank: 2 }, { name: 'Team Eta', points: 9, rank: 3 }, { name: 'Team Theta', points: 6, rank: 4 }] }
      ]
    },
    br: {
      teams: [
        { team: 'Squad Phoenix', pointsPosition: 85, pointsKills: 42, total: 127, rank: 1 },
        { team: 'Squad Thunder', pointsPosition: 78, pointsKills: 38, total: 116, rank: 2 },
        { team: 'Squad Storm', pointsPosition: 72, pointsKills: 35, total: 107, rank: 3 }
      ]
    }
  }));

  useEffect(() => { localStorage.setItem('codm_registrations', JSON.stringify(registrations)); }, [registrations]);
  useEffect(() => { localStorage.setItem('codm_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('codm_news', JSON.stringify(news)); }, [news]);
  useEffect(() => { localStorage.setItem('codm_rules', JSON.stringify(rules)); }, [rules]);
  useEffect(() => { localStorage.setItem('codm_calendar', JSON.stringify(calendar)); }, [calendar]);
  useEffect(() => { localStorage.setItem('codm_results', JSON.stringify(results)); }, [results]);

  const addRegistration = useCallback((data) => {
    setRegistrations(prev => [...prev, data]);
  }, []);

  return {
    registrations, addRegistration,
    settings, setSettings,
    news, setNews,
    rules, setRules,
    calendar, setCalendar,
    results, setResults,
  };
};

export default useTournamentData;