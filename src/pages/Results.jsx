import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Results() {
  const { mode } = useParams(); // 'mj' ou 'br'
  const [resultsMJ, setResultsMJ] = useState([]);
  const [resultsBR, setResultsBR] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (mode === "mj") fetchMJ();
    else if (mode === "br") fetchBR();
  }, [mode]);

  const fetchMJ = async () => {
    const { data, error } = await supabase
      .from("results_mj")
      .select("points, team_id, teams(name)")
      .order("points", { ascending: false });

    if (error) {
      console.error("Erreur chargement MJ :", error);
    } else {
      const sorted = data
        .map((team) => ({
          team_name: team.teams?.name || "Inconnue",
          points: team.points,
        }))
        .sort((a, b) => b.points - a.points)
        .map((team, i) => ({ ...team, rank: i + 1 }));

      setResultsMJ(sorted);
    }
    setLoading(false);
  };

  const fetchBR = async () => {
    const { data, error } = await supabase
      .from("results_br")
      .select("team_id, position_points, kill_points, teams(name)")
      .order("position_points", { ascending: false });

    if (error) {
      console.error("Erreur chargement BR :", error);
    } else {
      const sorted = data
        .map((team) => ({
          team_name: team.teams?.name || "Inconnue",
          position_points: team.position_points,
          kill_points: team.kill_points,
          total: team.position_points + team.kill_points,
        }))
        .sort((a, b) => b.total - a.total)
        .map((team, i) => ({ ...team, rank: i + 1 }));

      setResultsBR(sorted);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6">
        📊 Résultats {mode?.toUpperCase()} - CODM Legends Cup
      </h1>

      {loading && <p>Chargement des résultats...</p>}

      {/* Résultats MJ */}
      {mode === "mj" && resultsMJ.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl mb-4">Classement Multijoueur (MJ)</h2>
          <table className="w-full border text-center">
            <thead className="bg-blue-800 text-white">
              <tr>
                <th>Rang</th>
                <th>Équipe</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {resultsMJ.map((team, i) => (
                <tr key={i} className="bg-gray-900">
                  <td>{team.rank}</td>
                  <td>{team.team_name}</td>
                  <td>{team.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Résultats BR */}
      {mode === "br" && resultsBR.length > 0 && (
        <section>
          <h2 className="text-2xl mb-4">Classement Battle Royale (BR)</h2>
          <table className="w-full border text-center">
            <thead className="bg-purple-800 text-white">
              <tr>
                <th>Rang</th>
                <th>Équipe</th>
                <th>Points Position</th>
                <th>Points Kills</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {resultsBR.map((team, i) => (
                <tr key={i} className="bg-gray-900">
                  <td>{team.rank}</td>
                  <td>{team.team_name}</td>
                  <td>{team.position_points}</td>
                  <td>{team.kill_points}</td>
                  <td>{team.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
