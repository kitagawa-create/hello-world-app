const books = [
  { id: 1, title: "React入門", price: 2800, inStock: true },
  { id: 2, title: "TypeScript実践ガイド", price: 3200, inStock: true },
  { id: 3, title: "Next.js徹底解説", price: 3500, inStock: false },
  { id: 4, title: "JavaScript基礎", price: 2400, inStock: false },
  { id: 5, title: "Web開発の教科書", price: 2900, inStock: true },
  { id: 6, title: "CSS設計完全ガイド", price: 3000, inStock: true },
];

export async function GET() {
  return Response.json(books);
}
