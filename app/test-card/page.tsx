export default function TestCardPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02]">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop"
          alt="美しい山と湖の風景"
          className="w-full h-48 object-cover"
        />
        <div className="p-6">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-full mb-3">
            Nature
          </span>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            美しい自然の風景
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-5">
            山々と湖が織りなす絶景。自然の中でリフレッシュしませんか？心を癒す壮大な景色が広がっています。
          </p>
          <button className="w-full py-2.5 px-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors">
            詳しく見る
          </button>
        </div>
      </div>
    </div>
  );
}
