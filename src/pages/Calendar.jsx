import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

export default function Calendar() {
  const { mode } = useParams(); // 'mj' ou 'br'

  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [matches, setMatches] = useState([]);
  const [teamsMap, setTeamsMap] = useState({});
  const [brEvents, setBrEvents] = useState([]);
  const [brTeamsVisible, setBrTeamsVisible] = useState(true);

  useEffect(() => {
    if (mode === "mj") {
      fetchMjDates();
      fetchAllTeams();
    } else if (mode === "br") {
      fetchBrEvents();
      fetchBrVisibility();
    }
  }, [mode]);

  const fetchMjDates = async () => {
    const { data } = await supabase
      .from("matches_mj")
      .select("match_date")
      .order("match_date", { ascending: true });
    if (data) {
      const unique = [...new Set(data.map((d) => d.match_date))];
      setDates(unique);
    }
  };

  const fetchMjMatchesByDate = async (date) => {
    setSelectedDate(date);
    const { data } = await supabase
      .from("matches_mj")
      .select("*")
      .eq("match_date", date)
      .order("time", { ascending: true });
    if (data) setMatches(data);
  };

  const fetchAllTeams = async () => {
    const { data } = await supabase.from("teams").select("id, name");
    if (data) {
      const map = {};
      data.forEach((t) => (map[t.id] = t.name));
      setTeamsMap(map);
    }
  };

  const fetchBrEvents = async () => {
    const { data } = await supabase
      .from("calendar_br")
      .select("*")
      .order("date", { ascending: true });
    if (data) setBrEvents(data);
  };

  const fetchBrVisibility = async () => {
    const { data } = await supabase
      .from("settings")
      .select("value")
      .eq("key_name", "br_teams_visible")
      .single();
    if (data) setBrTeamsVisible(data.value === "true");
  };

  return (
    <div className="p-4 max-w-6xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6 text-cyan-300">
        📅 Calendrier {mode === "mj" ? "Multijoueur (MJ)" : "Battle Royale (BR)"}
      </h1>

      <p className="mb-8 text-gray-300">
        {mode === "mj"
          ? "Consultez ici le programme des matchs Multijoueur (MJ)."
          : "Consultez les événements Battle Royale (BR) programmés."}
      </p>

      {mode === "mj" && (
        <>
          {/* Dates MJ */}
          <div className="flex flex-wrap gap-3 mb-4">
            {dates.map((date, i) => (
              <button
                key={i}
                className={`px-4 py-2 rounded ${
                  selectedDate === date ? "bg-blue-700" : "bg-blue-500"
                }`}
                onClick={() => fetchMjMatchesByDate(date)}
              >
                {new Date(date).toLocaleDateString("fr-FR")}
              </button>
            ))}
          </div>

          {/* Matchs MJ */}
          {selectedDate && (
            <div>
              <h3 className="text-xl mb-2">
                Matchs du {new Date(selectedDate).toLocaleDateString("fr-FR")}
              </h3>

              {matches.length === 0 ? (
                <p>Aucun match pour cette date.</p>
              ) : (
                <table className="w-full text-center border">
                  <thead className="bg-blue-800 text-white">
                    <tr>
                      <th>Heure</th>
                      <th>Équipe 1</th>
                      <th>Équipe 2</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matches.map((m) => (
                      <tr key={m.id} className="bg-gray-900">
                        <td>{m.time}</td>
                        <td>{teamsMap[m.team_a_id]}</td>
                        <td>{teamsMap[m.team_b_id]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </>
      )}

      {mode === "br" && (
        <>
          {brEvents.length === 0 && <p>Aucun événement BR pour le moment.</p>}

          {brEvents.map((event) => (
            <div key={event.id} className="bg-gray-900 p-4 rounded mb-4">
              <p className="text-lg font-bold">
                {new Date(event.date).toLocaleDateString("fr-FR")}
              </p>
              <p>{event.description}</p>

              {brTeamsVisible && event.show_teams && event.teams?.length > 0 && (
                <div className="mt-2">
                  <p className="font-semibold">Équipes :</p>
                  <ul className="list-disc ml-5">
                    {event.teams.map((team, i) => (
                      <li key={i}>{team}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
