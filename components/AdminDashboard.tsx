"use client";

type Props = {
  title?: string;
};

export default function AdminDashboard({ title = "Panel de administración" }: Props) {
  return (
    <section style={{ padding: 24 }}>
      <h2>{title}</h2>
      <p>Componente placeholder para métricas/acciones de admin.</p>
    </section>
  );
}

