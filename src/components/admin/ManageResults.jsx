import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

const ManageResults = () => {
  const [teams, setTeams] = useState([]);
  const [resultsBR, setResultsBR] = useState([]);
  const [resultsMJ, setResultsMJ] = useState([]);
  const [message, setMessage] = useState(null); // pour afficher un message simple d'erreur ou succès

  useEffect(() => {
    fetchTeams();
    fetchResultsBR();
    fetchResultsMJ();
  }, []);

  const fetchTeams = async () => {
    const { data, error } = await supabase.from("teams").select("id, name");
    if (error) {
      setMessage(`Erreur chargement équipes : ${error.message}`);
      return;
    }
    setTeams(data || []);
  };

  const fetchResultsBR = async () => {
    const { data, error } = await supabase.from("results_br").select("*");
    if (error) {
      setMessage(`Erreur chargement résultats BR : ${error.message}`);
      return;
    }
    setResultsBR(data || []);
  };

  const fetchResultsMJ = async () => {
    const { data, error } = await supabase.from("results_mj").select("*");
    if (error) {
      setMessage(`Erreur chargement résultats MJ : ${error.message}`);
      return;
    }
    setResultsMJ(data || []);
  };

  const updateBR = async (r) => {
    if (r.match_number == null) {
      setMessage("Le champ match_number est obligatoire pour un résultat BR.");
      return;
    }
    const { error } = await supabase.from("results_br").upsert([r]);
    if (!error) {
      setMessage("✅ Résultat BR mis à jour");
      fetchResultsBR();
    } else {
      setMessage(`❌ Erreur BR : ${error.message}`);
    }
  };

  const updateMJ = async (r) => {
    const { error } = await supabase.from("results_mj").upsert([r]);
    if (!error) {
      setMessage("✅ Résultat MJ mis à jour");
      fetchResultsMJ();
    } else {
      setMessage(`❌ Erreur MJ : ${error.message}`);
    }
  };

  const addNewBRResult = () => {
    if (teams.length === 0) {
      setMessage("⚠️ Pas d’équipes disponibles. Ajoutez d’abord des équipes.");
      return;
    }
    setResultsBR((prev) => [
      ...prev,
      {
        team_id: teams[0].id,
        position_points: 0,
        kill_points: 0,
        match_number: 1, // valeur par défaut, modifie selon ton besoin
      },
    ]);
  };

  const addNewMJResult = () => {
    if (teams.length === 0) {
      setMessage("⚠️ Pas d’équipes disponibles. Ajoutez d’abord des équipes.");
      return;
    }
    setResultsMJ((prev) => [
      ...prev,
      {
        team_id: teams[0].id,
        points: 0,
      },
    ]);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto text-white">
      <h2 className="text-3xl font-bold mb-6 text-cyan-300">🎮 GESTION DES RÉSULTATS</h2>

      {message && (
        <div className="mb-6 p-3 rounded bg-red-700 text-white font-semibold">
          {message}
        </div>
      )}

      {/* Résultats BR */}
      <section className="mb-12">
        <h3 className="text-xl font-semibold mb-2">Battle Royale (BR)</h3>
        <Button
          onClick={addNewBRResult}
          className="mb-4 bg-green-600 hover:bg-green-700"
        >
          + Ajouter un résultat BR
        </Button>
        {resultsBR.map((r, i) => (
          <div key={i} className="bg-gray-900 p-4 rounded mb-4">
            <label className="block mb-1">Équipe :</label>
            <select
              value={r.team_id}
              onChange={(e) =>
                setResultsBR((prev) =>
                  prev.map((x, j) =>
                    j === i ? { ...x, team_id: parseInt(e.target.value) } : x
                  )
                )
              }
              className="bg-gray-800 text-white p-2 rounded w-full mb-2"
            >
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Points Position"
              className="bg-gray-800 text-white p-2 rounded w-full mb-2"
              value={r.position_points}
              onChange={(e) =>
                setResultsBR((prev) =>
                  prev.map((x, j) =>
                    j === i
                      ? { ...x, position_points: parseInt(e.target.value) || 0 }
                      : x
                  )
                )
              }
            />

            <input
              type="number"
              placeholder="Points Kills"
              className="bg-gray-800 text-white p-2 rounded w-full mb-2"
              value={r.kill_points}
              onChange={(e) =>
                setResultsBR((prev) =>
                  prev.map((x, j) =>
                    j === i ? { ...x, kill_points: parseInt(e.target.value) || 0 } : x
                  )
                )
              }
            />

            <input
              type="number"
              placeholder="Match Number"
              className="bg-gray-800 text-white p-2 rounded w-full mb-2"
              value={r.match_number}
              onChange={(e) =>
                setResultsBR((prev) =>
                  prev.map((x, j) =>
                    j === i ? { ...x, match_number: parseInt(e.target.value) || 1 } : x
                  )
                )
              }
            />

            <Button
              onClick={() => updateBR(r)}
              className="w-full bg-purple-700 hover:bg-purple-800"
            >
              💾 Enregistrer
            </Button>
          </div>
        ))}
      </section>

      {/* Résultats MJ */}
      <section>
        <h3 className="text-xl font-semibold mb-2">Multijoueur (MJ)</h3>
        <Button
          onClick={addNewMJResult}
          className="mb-4 bg-green-600 hover:bg-green-700"
        >
          + Ajouter un résultat MJ
        </Button>
        {resultsMJ.map((r, i) => (
          <div key={i} className="bg-gray-900 p-4 rounded mb-4">
            <label className="block mb-1">Équipe :</label>
            <select
              value={r.team_id}
              onChange={(e) =>
                setResultsMJ((prev) =>
                  prev.map((x, j) =>
                    j === i ? { ...x, team_id: parseInt(e.target.value) } : x
                  )
                )
              }
              className="bg-gray-800 text-white p-2 rounded w-full mb-2"
            >
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Points"
              className="bg-gray-800 text-white p-2 rounded w-full mb-2"
              value={r.points}
              onChange={(e) =>
                setResultsMJ((prev) =>
                  prev.map((x, j) =>
                    j === i ? { ...x, points: parseInt(e.target.value) || 0 } : x
                  )
                )
              }
            />

            <Button
              onClick={() => updateMJ(r)}
              className="w-full bg-blue-700 hover:bg-blue-800"
            >
              💾 Enregistrer
            </Button>
          </div>
        ))}
      </section>
    </div>
  );
};

export default ManageResults;
