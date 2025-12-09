import { useEffect, useState } from "react";
import { getLimits, updateLimits } from "./api";
import { t } from "./i18n";

export default function LimitsModal({ onClose, lang }) {
  const [limits, setLimits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await getLimits();
        setLimits(res.data.data || {});
      } catch (e) {
        console.error(e);
        setErr(t(lang, "networkError"));
      } finally {
        setLoading(false);
      }
    })();
  }, [lang]);

  const handleChange = (key, val) => {
    const n = Number(val);
    setLimits((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        limit: Number.isFinite(n) ? n : prev[key].limit,
      },
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setErr("");
    setMsg("");
    try {
      await updateLimits(limits);
      setMsg(t(lang, "limitsSaved"));
    } catch (e) {
      console.error(e);
      setErr(t(lang, "calcError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal card">
        <div className="modal-header">
          <h2 style={{ margin: 0 }}>{t(lang, "limitsTitle")}</h2>
        </div>
        <div className="modal-body">
          <p>{t(lang, "limitsInfo")}</p>

          {loading && (
            <div className="card section">{t(lang, "loading")}</div>
          )}

          {err && (
            <div className="card section error" style={{ marginTop: 8 }}>
              {err}
            </div>
          )}

          {limits && !loading && (
            <table className="table small">
              <thead>
                <tr>
                  <th>{t(lang, "name")}</th>
                  <th>{t(lang, "value")}</th>
                  <th>{t(lang, "unit")}</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(limits).map(([key, cfg]) => (
                  <tr key={key}>
                    <td>{cfg.label}</td>
                    <td>
                      <input
                        className="input"
                        type="number"
                        value={cfg.limit}
                        onChange={(e) => handleChange(key, e.target.value)}
                      />
                    </td>
                    <td>{cfg.unit || "µg/m³"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {msg && (
            <div className="card section" style={{ marginTop: 8 }}>
              {msg}
            </div>
          )}

          <div className="air-actions" style={{ marginTop: 12 }}>
            <button
              className="btn primary"
              onClick={handleSave}
              disabled={loading}
            >
              {t(lang, "save")}
            </button>
            <button className="btn" onClick={onClose}>
              {t(lang, "close")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}