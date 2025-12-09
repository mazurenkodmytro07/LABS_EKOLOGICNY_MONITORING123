import { useState } from "react";
import { calcAirIndexApi, historyAirIndexApi } from "./api";
import { t } from "./i18n";
import AirIndexChart from "./AirIndexChart";

const RANGES = {
  pm25: [5, 150],
  pm10: [10, 300],
  no2: [10, 400],
  so2: [5, 200],
  o3: [10, 250],
};

function classBadgeClass(code) {
  switch (code) {
    case "good":
      return "badge good";
    case "moderate":
      return "badge moderate";
    case "unhealthy":
      return "badge warn";
    case "very-unhealthy":
      return "badge danger";
    default:
      return "badge";
  }
}

function generateSyntheticValue(key) {
  const [min, max] = RANGES[key];
  const hour = new Date().getHours(); 
  const phase = (hour / 24) * 2 * Math.PI;

  const daily = (Math.sin(phase - Math.PI / 2) + 1) / 2;

  const base = min + daily * (max - min) * 0.8;
  const noise = (Math.random() - 0.5) * (max - min) * 0.05;

  const value = Math.min(max, Math.max(min, base + noise));
  return Number(value.toFixed(1));
}

export default function AirIndexModal({ station, onClose, lang }) {
  const [values, setValues] = useState({
    pm25: "",
    pm10: "",
    no2: "",
    so2: "",
    o3: "",
  });

  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (key, val) => {
    setValues((v) => ({ ...v, [key]: val }));
  };

  const handleGenerate = () => {
    setResult(null);
    setErr("");

    const generated = {
      pm25: generateSyntheticValue("pm25"),
      pm10: generateSyntheticValue("pm10"),
      no2: generateSyntheticValue("no2"),
      so2: generateSyntheticValue("so2"),
      o3: generateSyntheticValue("o3"),
    };

    const missingRate = 0.1 + Math.random() * 0.2;
    for (const key of Object.keys(generated)) {
      if (Math.random() < missingRate) {
        generated[key] = "";
      }
    }

    setValues(generated);
  };

  const handleCalc = async () => {
    setLoading(true);
    setErr("");
    setResult(null);

    try {
      const payload = {
        stationId: station?._id || null,
        pm25: values.pm25,
        pm10: values.pm10,
        no2: values.no2,
        so2: values.so2,
        o3: values.o3,
      };
      const res = await calcAirIndexApi(payload);
      setResult(res.data.data);
    } catch (e) {
      console.error(e);
      if (e.response) {
        setErr(
          `${t(lang, "calcError")}: ${
            e.response.data?.message || e.message
          }`
        );
      } else {
        setErr(t(lang, "networkError"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleHistory = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await historyAirIndexApi(station?._id, 20);
      setHistory(res.data.data || []);
    } catch (e) {
      console.error(e);
      setErr(t(lang, "networkError"));
    } finally {
      setLoading(false);
    }
  };

  const classText =
    result && t(lang, `class_${result.classCode || "good"}`);

  return (
    <div className="modal-backdrop">
      <div className="modal card airindex-modal">
        <div className="modal-header">
          <h2 style={{ margin: 0 }}>
            {t(lang, "airTitle")} — {station.city} ({station.name})
          </h2>
        </div>

        <div className="modal-body airindex-modal-body">
          <div className="air-grid">
            <div className="air-col">
              <FieldRow
                label={t(lang, "pm25")}
                range={t(lang, "rangePm25")}
                value={values.pm25}
                onChange={(v) => onChange("pm25", v)}
              />
              <FieldRow
                label={t(lang, "no2")}
                range={t(lang, "rangeNo2")}
                value={values.no2}
                onChange={(v) => onChange("no2", v)}
              />
              <FieldRow
                label={t(lang, "o3")}
                range={t(lang, "rangeO3")}
                value={values.o3}
                onChange={(v) => onChange("o3", v)}
              />
            </div>

            <div className="air-col">
              <FieldRow
                label={t(lang, "pm10")}
                range={t(lang, "rangePm10")}
                value={values.pm10}
                onChange={(v) => onChange("pm10", v)}
              />
              <FieldRow
                label={t(lang, "so2")}
                range={t(lang, "rangeSo2")}
                value={values.so2}
                onChange={(v) => onChange("so2", v)}
              />
            </div>
          </div>

          <div className="air-actions">
            <button className="btn" onClick={handleGenerate}>
              🎲 {t(lang, "generate")}
            </button>
            <button
              className="btn primary"
              onClick={handleCalc}
              disabled={loading}
            >
              ⚡ {t(lang, "calc")}
            </button>
            <button className="btn" onClick={onClose}>
              {t(lang, "close")}
            </button>
            <button className="btn outline" onClick={handleHistory}>
              📘 {t(lang, "showHistory")}
            </button>
          </div>

          {loading && (
            <div className="card section">{t(lang, "loading")}</div>
          )}

          {err && (
            <div className="card section error" style={{ marginTop: 8 }}>
              {err}
            </div>
          )}

          {result && (
            <div className="card section" style={{ marginTop: 16 }}>
              <h3 style={{ marginTop: 0 }}>
                {t(lang, "indexI")}: {result.I}
              </h3>
              <p style={{ marginBottom: 8 }}>
                {t(lang, "classLabel")}:{" "}
                <span className={classBadgeClass(result.classCode)}>
                  {classText}
                </span>
              </p>

              <table className="table small">
                <thead>
                  <tr>
                    <th>{t(lang, "name")}</th>
                    <th>{t(lang, "value")}</th>
                    <th>{t(lang, "subIndex")}</th>
                    <th>{t(lang, "unit")}</th>
                  </tr>
                </thead>
                <tbody>
                  {["pm25", "pm10", "no2", "so2", "o3"].map((k) => (
                    <tr key={k}>
                      <td>{t(lang, k)}</td>
                      <td>{result.values?.[k] ?? "—"}</td>
                      <td>{result.subIndices?.[k] ?? "—"}</td>
                      <td>{result.limits?.[k]?.unit || "µg/m³"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {history.length > 0 && (
            <div className="card section airindex-history">
              <h3 style={{ marginTop: 0 }}>
                {t(lang, "historyTitle")}
              </h3>
              <AirIndexChart history={history} lang={lang} />
            </div>
          )}

          {!history.length && !loading && (
            <div className="card section" style={{ marginTop: 8 }}>
              {t(lang, "historyEmpty")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FieldRow({ label, range, value, onChange }) {
  return (
    <div className="field-row">
      <div className="field-label">
        <div>{label}</div>
        <div className="field-range">{range}</div>
      </div>
      <input
        className="input"
        type="number"
        step="0.1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}