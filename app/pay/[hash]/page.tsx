type PageProps = {
  params: {
    hash: string;
  };
};

export default function PayHashPage({ params }: PageProps) {
  return (
    <main style={{ padding: 24 }}>
      <h1>Pago</h1>
      <p>
        Hash: <code>{params.hash}</code>
      </p>
    </main>
  );
}

