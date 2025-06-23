import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Registration() {
  const [mode, setMode] = useState("MJ");
  const [pseudo, setPseudo] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [teamOption, setTeamOption] = useState("existing");
  const [teamName, setTeamName] = useState("");
  const [existingTeamId, setExistingTeamId] = useState("");
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .eq("mode", mode);

      if (!error) setTeams(data);
    };
    fetchTeams();
  }, [mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let teamId = existingTeamId;

    if (teamOption === "new") {
      const { data: newTeam, error: teamError } = await supabase
        .from("teams")
        .insert([{ name: teamName, mode }])
        .select()
        .single();

      if (teamError) {
        alert("Erreur lors de la création de l'équipe");
        setLoading(false);
        return;
      }

      teamId = newTeam.id;
    }

    const { error: playerError } = await supabase.from("players").insert([
      {
        pseudo,
        mode,
        whatsapp_number: whatsapp,
        team_id: teamId,
      },
    ]);

    if (playerError) {
      alert("Erreur lors de l'inscription");
      setLoading(false);
      return;
    }

    if (mode === "MJ") {
      window.location.href = "https://chat.whatsapp.com/LwLIeOZXFFAL8dv2HVHfAl";
    } else {
      window.location.href = "https://chat.whatsapp.com/HZitIx1XawmGWmdq2bVNyx";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      <div className="w-full max-w-xl cyber-card p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-center glow-text glitch" data-text="Inscription">
           <br/>Inscription - {mode}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mode de jeu */}
          <div>
            <label className="block mb-2 font-semibold text-white">Mode :</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full cyber-input rounded"
            >
              <option value="MJ">Multijoueur</option>
              <option value="BR">Battle Royale</option>
            </select>
          </div>

          {/* Pseudo */}
          <div>
            <label className="block mb-2 font-semibold text-white">Pseudo :</label>
            <input
              type="text"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              required
              className="w-full cyber-input rounded"
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block mb-2 font-semibold text-white">Numéro WhatsApp :</label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              required
              className="w-full cyber-input rounded"
            />
          </div>

          {/* Choix équipe */}
          <div>
            <label className="block mb-2 font-semibold text-white">Déjà dans une équipe ?</label>
            <select
              value={teamOption}
              onChange={(e) => setTeamOption(e.target.value)}
              className="w-full cyber-input rounded"
            >
              <option value="existing">Oui</option>
              <option value="new">Non, en créer une</option>
            </select>
          </div>

          {/* Sélection d'équipe existante */}
          {teamOption === "existing" && (
            <div>
              <label className="block mb-2 font-semibold text-white">Choisis ton équipe :</label>
              <select
                value={existingTeamId}
                onChange={(e) => setExistingTeamId(e.target.value)}
                required
                className="w-full cyber-input rounded"
              >
                <option value="">-- Sélectionner --</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Création nouvelle équipe */}
          {teamOption === "new" && (
            <div>
              <label className="block mb-2 font-semibold text-white">Nom de la nouvelle équipe :</label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
                className="w-full cyber-input rounded"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 cyber-button text-lg rounded"
          >
            {loading ? "Inscription en cours..." : "S'inscrire"}
          </button>
        </form>
      </div>
    </div>
  );
}
