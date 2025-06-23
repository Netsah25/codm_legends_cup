import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Scores() {
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [matches, setMatches] = useState([]);
  const [loadingDates, setLoadingDates] = useState(false);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDates();
  }, []);

  const fetchDates = async () => {
    setLoadingDates(true);
    setError(null);

    const { data, error } = await supabase
      .from("matches_mj")
      .select("match_date")
      .order("match_date", { ascending: true });

    if (error) {
      setError("Erreur lors de la récupération des dates : " + error.message);
      setDates([]);
    } else if (data) {
      const uniqueDates = [...new Set(data.map((d) => d.match_date))];
      setDates(uniqueDates);
    }

    setLoadingDates(false);
  };

  const fetchMatches = async (date) => {
    setSelectedDate(date);
    if (!date) {
      setMatches([]);
      return;
    }

    setLoadingMatches(true);
    setError(null);

    // Récupère les matchs du jour avec leurs équipes
    const { data, error } = await supabase
      .from("matches_mj")
      .select("id, match_date, time, team_a_id, team_b_id")
      .eq("match_date", date)
      .order("time", { ascending: true });

    if (error) {
      setError("Erreur lors de la récupération des matchs : " + error.message);
      setMatches([]);
      setLoadingMatches(false);
      return;
    }

    // Optionnel : récupérer les noms des équipes via une requête supplémentaire
    // car matches_mj ne contient que les IDs des équipes
    // Ici, on va chercher les noms en parallèle

    if (data.length === 0) {
      setMatches([]);
      setLoadingMatches(false);
      return;
    }

    // Récupération des noms des équipes à partir de leur ID
    const teamIds = [...new Set(data.flatMap(m => [m.team_a_id, m.team_b_id]))];
    const { data: teamsData, error: teamsError } = await supabase
      .from("teams")
      .select("id, name")
      .in("id", teamIds);

    if (teamsError) {
      setError("Erreur lors de la récupération des équipes : " + teamsError.message);
      setMatches([]);
      setLoadingMatches(false);
      return;
    }

    // Création d’un dictionnaire id->nom équipe
    const teamsMap = {};
    teamsData.forEach(team => {
      teamsMap[team.id] = team.name;
    });

    // Associer les noms d’équipes aux matchs
    const matchesWithNames = data.map(m => ({
      ...m,
      team_a_name: teamsMap[m.team_a_id] || "Inconnu",
      team_b_name: teamsMap[m.team_b_id] || "Inconnu",
    }));

    setMatches(matchesWithNames);
    setLoadingMatches(false);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6">📅 Scores MJ par date</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <label className="block mb-4">
        <span className="text-lg">Choisissez une date :</span>
        <select
          value={selectedDate}
          onChange={(e) => fetchMatches(e.target.value)}
          className="mt-2 p-2 bg-gray-800 text-white rounded"
          disabled={loadingDates}
        >
          <option value="">-- Sélectionner une date --</option>
          {dates.map((date, i) => (
            <option key={i} value={date}>
              {new Date(date).toLocaleDateString("fr-FR")}
            </option>
          ))}
        </select>
      </label>

      {loadingMatches && <p>Chargement des matchs...</p>}

      {!loadingMatches && matches.length > 0 && (
        <table className="w-full text-center border mt-6">
          <thead className="bg-blue-800 text-white">
            <tr>
              <th>Heure</th>
              <th>Équipe 1</th>
              <th>Score 1</th> {/* Si tu as les scores dans une autre table, il faudra faire une jointure */}
              <th>Équipe 2</th>
              <th>Score 2</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((m) => (
              <tr key={m.id} className="bg-gray-900">
                <td>{m.time}</td>
                <td>{m.team_a_name}</td>
                <td>-</td> {/* À remplacer si tu as le score */}
                <td>{m.team_b_name}</td>
                <td>-</td> {/* À remplacer si tu as le score */}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loadingMatches && selectedDate && matches.length === 0 && (
        <p className="text-gray-300 mt-6">Aucun match trouvé pour cette date.</p>
      )}
    </div>
  );
}
