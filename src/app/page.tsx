
export default function HomePage() {
  return (
    <div className="max-w-2xl mx-auto py-20 px-6 text-center">
      <h1 className="text-4xl font-bold mb-4">🚩 Red Flag Scanner</h1>
      <p className="text-gray-600 mb-6">
        Instantly detect red flags in any crypto project — before you invest.
      </p>

      <a
        href="/scanner"
        className="inline-block bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
      >
        🔍 Scan a Token
      </a>

      <p className="text-xs text-gray-400 mt-8">
        MVP — Fake data. Real logic. Feedback welcome.
      </p>
    </div>
  )
}