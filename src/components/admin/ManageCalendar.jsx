import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';

const ManageCalendar = () => {
  const { toast } = useToast();

  const [activeFeature, setActiveFeature] = useState(null);

  const [mjDate, setMjDate] = useState('');
  const [mjTime, setMjTime] = useState('');
  const [mjTeamA, setMjTeamA] = useState('');
  const [mjTeamB, setMjTeamB] = useState('');
  const [mjLoading, setMjLoading] = useState(false);
  const [teamsMJ, setTeamsMJ] = useState([]);

  const [brEvents, setBrEvents] = useState([]);
  const [brLoading, setBrLoading] = useState(false);
  const [brRound, setBrRound] = useState('');
  const [brDate, setBrDate] = useState('');
  const [brDescription, setBrDescription] = useState('');
  const [brTeamsVisible, setBrTeamsVisible] = useState(true);
  const [toggleLoading, setToggleLoading] = useState(false);

  useEffect(() => {
    fetchTeamsMJ();
    if (activeFeature === 'manageBR' || activeFeature === 'toggleBR') {
      fetchBrEvents();
      fetchBrVisibility();
    }
  }, [activeFeature]);

  const fetchTeamsMJ = async () => {
    const { data, error } = await supabase
      .from('teams')
      .select('id, name')
      .eq('mode', 'MJ');

    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      setTeamsMJ(data);
    }
  };

  const handleAddMj = async () => {
    if (!mjDate || !mjTime || !mjTeamA || !mjTeamB) {
      toast({ title: 'Erreur', description: 'Tous les champs sont obligatoires', variant: 'destructive' });
      return;
    }

    setMjLoading(true);
    const { error } = await supabase.from('matches_mj').insert([
      {
        match_date: mjDate,
        time: mjTime,
        team_a_id: parseInt(mjTeamA),
        team_b_id: parseInt(mjTeamB),
        visible: true,
      },
    ]);
    setMjLoading(false);

    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Succès', description: 'Match MJ ajouté.' });
      setMjDate('');
      setMjTime('');
      setMjTeamA('');
      setMjTeamB('');
    }
  };

  const fetchBrEvents = async () => {
    setBrLoading(true);
    const { data, error } = await supabase
      .from('calendar_br')
      .select('*')
      .order('date', { ascending: true });
    setBrLoading(false);

    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      setBrEvents(data);
    }
  };

  const handleAddBrEvent = async () => {
    if (!brRound || !brDate || !brDescription) {
      toast({ title: 'Erreur', description: 'Tous les champs sont obligatoires', variant: 'destructive' });
      return;
    }

    setBrLoading(true);
    const { error } = await supabase.from('calendar_br').insert([
      {
        round: parseInt(brRound),
        date: brDate,
        description: brDescription,
        show_teams: false,
      },
    ]);
    setBrLoading(false);

    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Succès', description: 'Événement BR ajouté.' });
      setBrRound('');
      setBrDate('');
      setBrDescription('');
      fetchBrEvents();
    }
  };

  const fetchBrVisibility = async () => {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key_name', 'br_teams_visible')
      .single();

    if (!error && data) {
      setBrTeamsVisible(data.value === 'true');
    } else {
      setBrTeamsVisible(true);
    }
  };

  const toggleBrVisibility = async () => {
    setToggleLoading(true);
    const newValue = !brTeamsVisible;

    const { error } = await supabase
      .from('settings')
      .upsert({ key_name: 'br_teams_visible', value: newValue.toString() }, { onConflict: 'key_name' });

    setToggleLoading(false);

    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      setBrTeamsVisible(newValue);
      toast({
        title: 'Succès',
        description: `Visibilité des équipes BR ${newValue ? 'activée' : 'désactivée'}.`,
      });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-orbitron font-bold text-cyan-300 mb-6">
        GESTION DU CALENDRIER
      </h2>

      <div className="flex flex-wrap gap-4 mb-6">
        <Button onClick={() => setActiveFeature('addMJ')} className={activeFeature === 'addMJ' ? 'bg-cyan-700' : ''}>
          Ajouter une date MJ
        </Button>
        <Button onClick={() => setActiveFeature('manageBR')} className={activeFeature === 'manageBR' ? 'bg-cyan-700' : ''}>
          Gérer le planning BR
        </Button>
        <Button onClick={() => setActiveFeature('toggleBR')} className={activeFeature === 'toggleBR' ? 'bg-cyan-700' : ''}>
          Basculer la visibilité des équipes BR
        </Button>
      </div>

      {/* Ajouter une date MJ */}
      {activeFeature === 'addMJ' && (
        <div className="space-y-4 max-w-md bg-gray-900 p-6 rounded">
          <label className="block text-white font-semibold">Date :</label>
          <input type="date" value={mjDate} onChange={(e) => setMjDate(e.target.value)} className="w-full rounded p-2 bg-black text-white" />
          <label className="block text-white font-semibold">Heure :</label>
          <input type="time" value={mjTime} onChange={(e) => setMjTime(e.target.value)} className="w-full rounded p-2 bg-black text-white" />
          
          <label className="block text-white font-semibold">Équipe A :</label>
          <select value={mjTeamA} onChange={(e) => setMjTeamA(e.target.value)} className="w-full p-2 bg-black text-white rounded">
            <option value="">-- Choisir une équipe --</option>
            {teamsMJ.map(team => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>

          <label className="block text-white font-semibold">Équipe B :</label>
          <select value={mjTeamB} onChange={(e) => setMjTeamB(e.target.value)} className="w-full p-2 bg-black text-white rounded">
            <option value="">-- Choisir une équipe --</option>
            {teamsMJ.map(team => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>

          <Button onClick={handleAddMj} disabled={mjLoading} className="mt-4 w-full">
            {mjLoading ? 'Ajout en cours...' : 'Ajouter la date MJ'}
          </Button>
        </div>
      )}

      {/* Gérer planning BR */}
      {activeFeature === 'manageBR' && (
        <div className="max-w-xl space-y-6">
          <h3 className="text-white font-semibold text-xl">Événements Battle Royale</h3>

          {brLoading && <p className="text-gray-400">Chargement...</p>}

          {brEvents.map((event) => (
            <div key={event.id} className="bg-gray-800 p-3 rounded mb-2 text-white">
              <p><strong>Round :</strong> {event.round}</p>
              <p><strong>Date :</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p><strong>Description :</strong> {event.description}</p>
              <p><strong>Équipes visibles :</strong> {event.show_teams ? 'Oui' : 'Non'}</p>
            </div>
          ))}

          <h4 className="text-white font-semibold mt-6">Ajouter un événement BR</h4>
          <label className="block text-white font-semibold">Round :</label>
          <input type="number" value={brRound} onChange={(e) => setBrRound(e.target.value)} className="w-full rounded p-2 bg-black text-white mb-2" />
          <label className="block text-white font-semibold">Date :</label>
          <input type="date" value={brDate} onChange={(e) => setBrDate(e.target.value)} className="w-full rounded p-2 bg-black text-white mb-2" />
          <label className="block text-white font-semibold">Description :</label>
          <input type="text" value={brDescription} onChange={(e) => setBrDescription(e.target.value)} className="w-full rounded p-2 bg-black text-white mb-4" />

          <Button onClick={handleAddBrEvent} disabled={brLoading} className="w-full">
            {brLoading ? 'Ajout en cours...' : 'Ajouter événement BR'}
          </Button>
        </div>
      )}

      {/* Basculer visibilité BR */}
      {activeFeature === 'toggleBR' && (
        <div className="max-w-sm bg-gray-900 p-6 rounded text-white">
          <p>Visibilité actuelle des équipes BR : <strong>{brTeamsVisible ? 'Activée' : 'Désactivée'}</strong></p>
          <Button onClick={toggleBrVisibility} disabled={toggleLoading} className="mt-4 w-full">
            {toggleLoading ? 'Modification...' : brTeamsVisible ? 'Désactiver' : 'Activer'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ManageCalendar;
