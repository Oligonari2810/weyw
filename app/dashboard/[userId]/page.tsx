type PageProps = {
  params: {
    userId: string;
  };
};

export default function DashboardUserPage({ params }: PageProps) {
  return (
    <main style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <p>
        Usuario: <code>{params.userId}</code>
      </p>
    </main>
  );
}

