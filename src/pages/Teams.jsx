import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Teams() {
  const [mode, setMode] = useState("MJ");
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, [mode]);

  const fetchTeams = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("teams")
      .select(`
        id,
        name,
        players (
          id,
          pseudo
        )
      `)
      .eq("mode", mode);

    if (error) {
      setError("Erreur lors de la récupération des équipes : " + error.message);
      setTeams([]);
    } else {
      setTeams(data);
    }

    setLoading(false);
  };

  return (
    <div className="p-4 max-w-5xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6">🎮 Équipes & Joueurs</h1>

      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${mode === "MJ" ? "bg-blue-700" : "bg-gray-700"}`}
          onClick={() => setMode("MJ")}
        >
          Mode MJ
        </button>
        <button
          className={`px-4 py-2 rounded ${mode === "BR" ? "bg-blue-700" : "bg-gray-700"}`}
          onClick={() => setMode("BR")}
        >
          Mode BR
        </button>
      </div>

      {loading && <p>Chargement des équipes...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && teams.length === 0 && (
        <p className="text-gray-300">Aucune équipe enregistrée pour ce mode.</p>
      )}

      {!loading && !error && teams.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map((team) => (
            <div key={team.id} className="bg-gray-900 p-4 rounded shadow-lg">
              <h2 className="text-xl font-bold text-blue-400">{team.name}</h2>
              <ul className="mt-2 list-disc list-inside text-sm">
                {team.players && team.players.length > 0 ? (
                  team.players.map((player) => (
                    <li key={player.id}>{player.pseudo}</li>
                  ))
                ) : (
                  <li>Aucun joueur inscrit</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
