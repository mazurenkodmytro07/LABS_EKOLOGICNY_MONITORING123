import { useEffect, useMemo, useState } from "react";
import {
  getStations,
  addStation,
  updateStation,
  deleteStation,
} from "./components/api";
import StationTable from "./components/StationTable";
import StationForm from "./components/StationForm";

export default function App() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [uaMode, setUaMode] = useState(() => localStorage.getItem("uaMode") === "1");

  useEffect(() => {
    document.body.classList.toggle("ua", uaMode);
    localStorage.setItem("uaMode", uaMode ? "1" : "0");
  }, [uaMode]);

  const loadStations = () => {
    setLoading(true);
    return getStations()
      .then((r) => setStations(r.data.data))
      .catch(() => setErr("API недоступне. Перевір бекенд."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStations();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return stations;
    return stations.filter(
      (s) =>
        s.city.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q)
    );
  }, [stations, search]);

  const startCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const startEdit = (s) => {
    setEditing(s);
    setShowForm(true);
  };

  const onSave = async (payload) => {
    if (editing) await updateStation(editing._id, payload);
    else await addStation(payload);
    setShowForm(false);
    setEditing(null);
    await loadStations();
  };

  const onDelete = async (id) => {
    if (!confirm("Видалити станцію?")) return;
    await deleteStation(id);
    await loadStations();
  };

  return (
    <div className="container">
      <div className="toolbar">
        <h1 style={{ margin: 0 }}>Станції</h1>

        <button className="btn" onClick={loadStations}>
          🔄 Оновити
        </button>

        <button className="btn primary" onClick={startCreate}>
          ➕ Додати станцію
        </button>

        <div className="spacer" />

        <input
          className="input"
          placeholder="Пошук по місту або назві…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="btn"
          onClick={() => setUaMode((v) => !v)}
          title="Потужний стиль"
          aria-pressed={uaMode}
          style={{ fontWeight: 700 }}
        >
          {uaMode ? "⚡ Потужний стиль: ВКЛ" : "⚡ Потужний стиль: ВИКЛ"}
        </button>
      </div>

      {loading && <div className="card section">Завантаження…</div>}
      {err && <div className="card section error">{err}</div>}

      {!loading && !err && (
        <>
          <StationTable
            stations={filtered}
            onEdit={startEdit}
            onDelete={onDelete}
            ua={uaMode}
          />

          {showForm && (
            <StationForm
              initial={editing}
              onSave={onSave}
              onCancel={() => {
                setShowForm(false);
                setEditing(null);
              }}
            />
          )}
        </>
      )}
    </div>
  );
}