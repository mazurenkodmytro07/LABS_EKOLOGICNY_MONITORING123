import { useEffect, useMemo, useState } from "react";
import {
  getStations,
  addStation,
  updateStation,
  deleteStation,
} from "./components/api";
import StationTable from "./components/StationTable";
import StationForm from "./components/StationForm";
import AirIndexModal from "./components/AirIndexModal";
import LimitsModal from "./components/LimitsModal";
import { t, getInitialLang } from "./components/i18n";

export default function App() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [uaMode, setUaMode] = useState(
    () => localStorage.getItem("uaMode") === "1"
  );

  const [lang, setLang] = useState(getInitialLang);


  const [airStation, setAirStation] = useState(null);
  const [showLimits, setShowLimits] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("ua", uaMode);
    localStorage.setItem("uaMode", uaMode ? "1" : "0");
  }, [uaMode]);

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const loadStations = () => {
    setLoading(true);
    setErr("");
    return getStations()
      .then((r) => setStations(r.data.data))
      .catch(() => setErr(t(lang, "apiError")))
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
    if (editing) {
      await updateStation(editing._id, payload);
    } else {
      await addStation(payload);
    }
    setShowForm(false);
    setEditing(null);
    await loadStations();
  };

  const onDelete = async (id) => {
    if (!confirm(t(lang, "confirmDelete"))) return;
    await deleteStation(id);
    await loadStations();
  };

  const openAirIndex = (station) => setAirStation(station);
  const closeAirIndex = () => setAirStation(null);

  const toggleLang = () => setLang((cur) => (cur === "ua" ? "en" : "ua"));

  return (
    <div className="container">
      <div className="toolbar card section">
        <h1 className="toolbar-title">{t(lang, "title")}</h1>

        <div className="toolbar-row">
          <button className="btn toolbar-btn" onClick={loadStations}>
            {t(lang, "refreshBtn")}
          </button>

          <button className="btn primary toolbar-btn" onClick={startCreate}>
            {t(lang, "addStationBtn")}
          </button>

          <input
            className="input toolbar-search"
            placeholder={t(lang, "searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="btn toolbar-btn"
            onClick={() => setUaMode((v) => !v)}
            aria-pressed={uaMode}
            >
            ⚡ {uaMode ? t(lang, "powerOn") : t(lang, "powerOff")}
          </button>
          <button className="btn toolbar-btn" onClick={toggleLang}>
            {t(lang, "langLabel")}
          </button>

          <button
            className="btn toolbar-btn"
            onClick={() => setShowLimits(true)}
          >
            ⚙️ {t(lang, "limitsBtn")}
          </button>
        </div>
      </div>

      {loading && <div className="card section">{t(lang, "loading")}</div>}
      {err && <div className="card section error">{err}</div>}

      {!loading && !err && (
        <>
          <StationTable
            stations={filtered}
            onEdit={startEdit}
            onDelete={onDelete}
            onAirIndex={openAirIndex}
            ua={uaMode}
            lang={lang}
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

      {airStation && (
        <AirIndexModal
          station={airStation}
          onClose={closeAirIndex}
          lang={lang}
        />
      )}

      {showLimits && (
        <LimitsModal
          lang={lang}
          onClose={() => setShowLimits(false)}
        />
      )}
    </div>
  );
}