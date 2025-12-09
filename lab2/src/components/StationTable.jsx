import { t } from "./i18n";

export default function StationTable({
  stations,
  onEdit,
  onDelete,
  onAirIndex,
  ua,
  lang,
}) {
  return (
    <div className="card section">
      <table className="table">
        <thead>
          <tr>
            <th>{t(lang, "city")}</th>
            <th>{t(lang, "indicator")}</th>
            <th>lat</th>
            <th>lng</th>
            <th>{t(lang, "activeCol")}</th>
            <th>{t(lang, "actionsCol")}</th>
          </tr>
        </thead>
        <tbody>
          {stations.map((s) => (
            <tr key={s._id}>
              <td>
                {s.city}
                {ua && <span className="city-flag"> 🇺🇦</span>}
              </td>
              <td>{s.name}</td>
              <td>{s.latitude}</td>
              <td>{s.longitude}</td>
              <td>
                <span className="badge">active</span>
              </td>
              <td>
                <div className="actions">
                  <button
                    className="btn"
                    type="button"
                    onClick={() => onEdit(s)}
                  >
                    {t(lang, "editBtn")}
                  </button>

                  <button
                    className="btn danger"
                    type="button"
                    onClick={() => onDelete(s._id)}
                  >
                    {t(lang, "deleteBtn")}
                  </button>

                  <button
                    className="btn"
                    type="button"
                    onClick={() => onAirIndex(s)}
                  >
                    {t(lang, "airBtn")}
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {stations.length === 0 && (
            <tr>
              <td colSpan={6}>{t(lang, "loading")}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}