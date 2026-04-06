import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function BookDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "3rem 2rem", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>本の詳細</h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
        Book ID: <strong>{id}</strong>
      </p>
      <Link href="/books" style={{ color: "#0070f3" }}>← 本リストに戻る</Link>
    </div>
  );
}
