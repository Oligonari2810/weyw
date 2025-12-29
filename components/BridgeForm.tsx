"use client";

import { useState } from "react";

type Props = {
  onSubmit?: (data: { reference: string }) => void;
};

export default function BridgeForm({ onSubmit }: Props) {
  const [reference, setReference] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.({ reference });
      }}
      style={{ display: "grid", gap: 12, maxWidth: 420 }}
    >
      <h2>Bridge</h2>
      <label style={{ display: "grid", gap: 6 }}>
        <span>Referencia</span>
        <input value={reference} onChange={(e) => setReference(e.target.value)} />
      </label>
      <button type="submit">Enviar</button>
    </form>
  );
}

