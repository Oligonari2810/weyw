"use client";

import { useState } from "react";

type Props = {
  onSubmit?: (data: { name: string; email: string; date: string }) => void;
};

export default function ReservationForm({ onSubmit }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.({ name, email, date });
      }}
      style={{ display: "grid", gap: 12, maxWidth: 420 }}
    >
      <h2>Reserva</h2>

      <label style={{ display: "grid", gap: 6 }}>
        <span>Nombre</span>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span>Email</span>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span>Fecha</span>
        <input value={date} onChange={(e) => setDate(e.target.value)} placeholder="YYYY-MM-DD" />
      </label>

      <button type="submit">Reservar</button>
    </form>
  );
}

