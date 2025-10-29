export default function StationTable({ stations, onEdit, onDelete, ua }) {
  return (
    <div className="card section">
      <table className="table">
        <thead>
          <tr>
            <th>Місто</th>
            <th>Назва</th>
            <th>Lat</th>
            <th>Lng</th>
            <th>Активна</th>
            <th>Дії</th>
          </tr>
        </thead>

        <tbody>
          {stations.map((s) => (
            <tr key={s._id}>
              <td>
                {s.city}
                {ua && <span className="city-flag">🇺🇦</span>}
              </td>
              <td>{s.name}</td>
              <td>{s.latitude}</td>
              <td>{s.longitude}</td>
              <td>
                <span className={`badge ${s.active ? "" : "off"}`}>
                  {s.active ? "✔ Активна" : "✖ Неактивна"}
                </span>
              </td>
              <td>
                <div className="actions">
                  <button
                    className="btn"
                    onClick={() => onEdit(s)}
                  >
                    ✏️ Редагувати
                  </button>
                  <button
                    className="btn danger"
                    onClick={() => onDelete(s._id)}
                  >
                    🗑️ Видалити
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}