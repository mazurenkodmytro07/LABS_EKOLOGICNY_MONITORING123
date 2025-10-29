import { useEffect, useState } from "react";

export default function StationForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    city: "",
    name: "",
    latitude: "",
    longitude: "",
    active: true,
    measurement_types: "pm25, pm10, no2"
  });

  const [err, setErr] = useState("");

  useEffect(() => {
    if (initial) {
      setForm({
        city: initial.city ?? "",
        name: initial.name ?? "",
        latitude: String(initial.latitude ?? ""),
        longitude: String(initial.longitude ?? ""),
        active: !!initial.active,
        measurement_types: (initial.measurement_types || []).join(", ")
      });
    } else {
      setForm({
        city: "",
        name: "",
        latitude: "",
        longitude: "",
        active: true,
        measurement_types: "pm25, pm10, no2"
      });
    }
    setErr("");
  }, [initial]);

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const lat = Number(form.latitude);
    const lng = Number(form.longitude);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      setErr("Широта/довгота мають бути числами");
      return;
    }

    const payload = {
      city: form.city.trim(),
      name: form.name.trim(),
      latitude: lat,
      longitude: lng,
      active: !!form.active,
      measurement_types: form.measurement_types
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    };

    await onSave(payload);
  };

  return (
    <div className="card section mtop">
      <h3>{initial ? "Редагування станції" : "Нова станція"}</h3>

      <form className="form" onSubmit={submit}>
        <div className="row">
          <label>Місто</label>
          <input
            name="city"
            value={form.city}
            onChange={handle}
            required
          />
        </div>

        <div className="row">
          <label>Назва</label>
          <input
            name="name"
            value={form.name}
            onChange={handle}
            required
          />
        </div>

        <div className="row">
          <label>Широта</label>
          <input
            name="latitude"
            value={form.latitude}
            onChange={handle}
            required
          />
        </div>

        <div className="row">
          <label>Довгота</label>
          <input
            name="longitude"
            value={form.longitude}
            onChange={handle}
            required
          />
        </div>

        <div className="row">
          <label>Показники</label>
          <input
            name="measurement_types"
            value={form.measurement_types}
            onChange={handle}
          />
        </div>

        <div className="row">
          <label>Активна</label>
          <input
            type="checkbox"
            name="active"
            checked={form.active}
            onChange={handle}
          />
        </div>

        {err && <div className="full error">{err}</div>}

        <div className="full controls">
          <button className="btn primary" type="submit">
            {initial ? "Зберегти" : "Додати"}
          </button>
          <button className="btn" type="button" onClick={onCancel}>
            Скасувати
          </button>
        </div>
      </form>
    </div>
  );
}