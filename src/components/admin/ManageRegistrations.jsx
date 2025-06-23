import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

export default function ManageRegistrations() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({ MJ: 0, BR: 0 });

  const [showAddPlayerForm, setShowAddPlayerForm] = useState(false);
  const [newPlayer, setNewPlayer] = useState({ pseudo: '', mode: 'MJ', whatsapp_number: '', team_id: '' });

  const [showTeamForm, setShowTeamForm] = useState(false);
  const [teamFormData, setTeamFormData] = useState({ id: null, name: '', mode: 'MJ' });

  const fetchPlayers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('players')
      // Note le `teams(name)` au pluriel ici
      .select('id, pseudo, mode, whatsapp_number, created_at, team_id, teams(name)')
      .order('created_at', { ascending: false });

    if (error) console.error('Erreur:', error.message);
    else {
      setPlayers(data || []);
      const counts = { MJ: 0, BR: 0 };
      data.forEach(p => counts[p.mode]++);
      setStats(counts);
    }
    setLoading(false);
  };

  const fetchTeams = async () => {
    const { data, error } = await supabase.from('teams').select('id, name, mode');
    if (error) console.error('Erreur équipes:', error.message);
    else setTeams(data || []);
  };

  useEffect(() => {
    fetchPlayers();
    fetchTeams();
  }, []);

  const handleDeletePlayer = async (id) => {
    if (!confirm('Supprimer ce joueur ?')) return;
    const { error } = await supabase.from('players').delete().eq('id', id);
    if (error) alert(error.message);
    else fetchPlayers();
  };

  const handleEditPlayer = async (player) => {
    const newPseudo = prompt('Nouveau pseudo :', player.pseudo);
    if (!newPseudo) return;
    const { error } = await supabase.from('players').update({ pseudo: newPseudo }).eq('id', player.id);
    if (error) alert(error.message);
    else fetchPlayers();
  };

  const submitAddPlayer = async (e) => {
    e.preventDefault();
    const { pseudo, mode, whatsapp_number, team_id } = newPlayer;

    if (!pseudo || !['MJ', 'BR'].includes(mode) || !whatsapp_number) {
      alert('Veuillez remplir correctement tous les champs.');
      return;
    }

    const { error } = await supabase
      .from('players')
      .insert([{
        pseudo,
        mode,
        whatsapp_number,
        team_id: team_id !== '' ? parseInt(team_id) : null,
      }]);

    if (error) alert(error.message);
    else {
      fetchPlayers();
      setShowAddPlayerForm(false);
      setNewPlayer({ pseudo: '', mode: 'MJ', whatsapp_number: '', team_id: '' });
      setSearch('');
    }
  };

  const openEditTeamForm = (team) => {
    setTeamFormData({ id: team.id, name: team.name, mode: team.mode });
    setShowTeamForm(true);
  };

  const openAddTeamForm = () => {
    setTeamFormData({ id: null, name: '', mode: 'MJ' });
    setShowTeamForm(true);
  };

  const submitTeamForm = async (e) => {
    e.preventDefault();
    const { id, name, mode } = teamFormData;

    if (!name.trim()) return alert('Nom requis.');
    if (!['MJ', 'BR'].includes(mode)) return alert('Mode invalide.');

    const payload = { name: name.trim(), mode };

    if (id) {
      const { error } = await supabase.from('teams').update(payload).eq('id', id);
      if (error) alert(error.message);
      else {
        alert('Équipe modifiée !');
        fetchTeams();
        setShowTeamForm(false);
      }
    } else {
      const { error } = await supabase.from('teams').insert([payload]);
      if (error) alert(error.message);
      else {
        alert('Équipe ajoutée !');
        fetchTeams();
        setShowTeamForm(false);
      }
    }
  };

  const handleDeleteTeam = async (id) => {
    if (!confirm('Supprimer cette équipe ?')) return;
    const { error } = await supabase.from('teams').delete().eq('id', id);
    if (error) alert(error.message);
    else {
      alert('Équipe supprimée avec succès !');
      fetchTeams();
      fetchPlayers();
    }
  };

  const filtered = players.filter(p =>
    p.pseudo.toLowerCase().includes(search.toLowerCase()) ||
    (p.teams?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    p.mode.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="text-gray-400">Chargement...</p>;

  return (
    <div className="font-orbitron text-white p-4 max-w-screen-lg mx-auto">
      <h2 className="text-3xl font-bold mb-6 glow-text text-center">GESTION INSCRIPTIONS</h2>

      <div className="flex flex-wrap gap-4 mb-6 justify-center sm:justify-start">
        <span className="cyber-button px-4 py-1 cursor-default select-none">MJ: {stats.MJ}</span>
        <span className="cyber-button px-4 py-1 cursor-default select-none">BR: {stats.BR}</span>
        <span className="cyber-button px-4 py-1 cursor-default select-none">Total: {stats.MJ + stats.BR}</span>
      </div>

      <div className="flex flex-wrap gap-3 mb-6 items-center justify-center sm:justify-between">
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setShowAddPlayerForm(true)} className="cyber-button px-5 py-2">+ Ajouter Joueur</button>
          <button onClick={openAddTeamForm} className="cyber-button px-5 py-2">+ Ajouter Équipe</button>
        </div>
        <input
          placeholder="Rechercher..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="cyber-input p-2 rounded text-white font-orbitron min-w-[200px] sm:min-w-[280px]"
        />
      </div>

      {/* Formulaire joueur */}
      {showAddPlayerForm && (
        <form onSubmit={submitAddPlayer} className="cyber-card p-6 rounded max-w-md mx-auto mb-8 bg-[#0a0a1a]">
          <h3 className="text-xl mb-4">Ajouter un joueur</h3>
          <label className="block mb-2">
            Pseudo:
            <input type="text" className="cyber-input w-full p-2 mt-1 rounded"
              value={newPlayer.pseudo}
              onChange={e => setNewPlayer({ ...newPlayer, pseudo: e.target.value })}
              required />
          </label>
          <label className="block mb-2">
            Mode:
            <select className="cyber-input w-full p-2 mt-1 rounded"
              value={newPlayer.mode}
              onChange={e => setNewPlayer({ ...newPlayer, mode: e.target.value })}>
              <option value="MJ">MJ</option>
              <option value="BR">BR</option>
            </select>
          </label>
          <label className="block mb-2">
            WhatsApp:
            <input type="text" className="cyber-input w-full p-2 mt-1 rounded"
              value={newPlayer.whatsapp_number}
              onChange={e => setNewPlayer({ ...newPlayer, whatsapp_number: e.target.value })}
              required />
          </label>
          <label className="block mb-4">
            Équipe:
            <select className="cyber-input w-full p-2 mt-1 rounded"
              value={newPlayer.team_id}
              onChange={e =>
                setNewPlayer({
                  ...newPlayer,
                  team_id: e.target.value ? parseInt(e.target.value) : '',
                })
              }>
              <option value="">Aucune</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name} ({team.mode})</option>
              ))}
            </select>
          </label>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowAddPlayerForm(false)} className="cyber-button px-4 py-2 bg-gray-600 hover:bg-gray-700">Annuler</button>
            <button type="submit" className="cyber-button px-4 py-2">Ajouter</button>
          </div>
        </form>
      )}

      {/* Formulaire équipe */}
      {showTeamForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-20" onClick={() => setShowTeamForm(false)}>
          <form onSubmit={submitTeamForm}
            className="cyber-card p-6 rounded max-w-md mx-auto bg-[#0a0a1a]"
            onClick={e => e.stopPropagation()}>
            <h3 className="text-xl mb-4">{teamFormData.id ? 'Modifier une équipe' : 'Ajouter une équipe'}</h3>
            <label className="block mb-2">
              Nom:
              <input type="text" className="cyber-input w-full p-2 mt-1 rounded"
                value={teamFormData.name}
                onChange={e => setTeamFormData({ ...teamFormData, name: e.target.value })}
                required />
            </label>
            <label className="block mb-4">
              Mode:
              <select className="cyber-input w-full p-2 mt-1 rounded"
                value={teamFormData.mode}
                onChange={e => setTeamFormData({ ...teamFormData, mode: e.target.value })}
                required>
                <option value="MJ">MJ</option>
                <option value="BR">BR</option>
              </select>
            </label>
            <div className="flex justify-end gap-3">
              <button type="button" className="cyber-button px-4 py-2 bg-gray-600 hover:bg-gray-700" onClick={() => setShowTeamForm(false)}>Annuler</button>
              <button type="submit" className="cyber-button px-4 py-2">{teamFormData.id ? 'Modifier' : 'Ajouter'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Tableau joueurs */}
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr className="border-b border-neon-blue">
              {['Pseudo', 'Mode', 'Équipe', 'WhatsApp', 'Date', 'Actions'].map((title) => (
                <th key={title} className="text-neon-blue text-left py-3 px-4 select-none">{title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <motion.tr
                key={p.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="border-b border-neon-blue/30 hover:bg-neon-blue/10 transition-colors cursor-default">
                <td className="py-3 px-4">{p.pseudo}</td>
                <td className="py-3 px-4 uppercase text-cyan-300">{p.mode}</td>
                {/* Attention ici à `teams` au pluriel */}
                <td className="py-3 px-4">{p.teams?.name || '—'}</td>
                <td className="py-3 px-4">{p.whatsapp_number}</td>
                <td className="py-3 px-4 text-sm">{new Date(p.created_at).toLocaleDateString()}</td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button onClick={() => handleEditPlayer(p)} className="cyber-button px-3 py-1 inline-block" title="Modifier">✏️</button>
                  <button onClick={() => handleDeletePlayer(p.id)} className="cyber-button px-3 py-1 inline-block bg-red-700 border-red-600 hover:bg-transparent hover:text-red-600" title="Supprimer">🗑️</button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tableau équipes */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-4 glow-text">Gestion des Équipes</h3>
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full min-w-[400px] border-collapse">
            <thead>
              <tr className="border-b border-neon-blue">
                {['Nom', 'Mode', 'Actions'].map(title => (
                  <th key={title} className="text-neon-blue text-left py-3 px-4 select-none">{title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teams.map(team => (
                <tr key={team.id} className="border-b border-neon-blue/30 hover:bg-neon-blue/10 transition-colors cursor-default">
                  <td className="py-3 px-4">{team.name}</td>
                  <td className="py-3 px-4 uppercase text-cyan-300">{team.mode}</td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button onClick={() => openEditTeamForm(team)} className="cyber-button px-3 py-1 inline-block" title="Modifier">✏️</button>
                    <button onClick={() => handleDeleteTeam(team.id)} className="cyber-button px-3 py-1 inline-block bg-red-700 border-red-600 hover:bg-transparent hover:text-red-600" title="Supprimer">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
