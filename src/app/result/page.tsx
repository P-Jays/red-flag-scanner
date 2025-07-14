// src/app/result/page.tsx

import fs from 'fs'
import path from 'path'

interface Flag {
  title: string
  status: string
  retail: string
  analyst: string
  source: string
}

interface ResultData {
  token: string
  score: string
  flags: Flag[]
}

async function getData(): Promise<ResultData> {
  const filePath = path.join(process.cwd(), 'src/data/xrp.json')
  const data = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(data)
}

export default async function ResultPage() {
  const data = await getData()

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-2">🧪 Scan Result: {data.token}</h1>
      <p className="text-gray-600 mb-4">{data.score}</p>

      <div className="space-y-4">
        {data.flags.map((flag, index) => (
          <div
            key={index}
            className={`border rounded p-4 ${
              flag.status === 'red'
                ? 'border-red-500 bg-red-100'
                : flag.status === 'yellow'
                ? 'border-yellow-500 bg-yellow-100'
                : 'border-green-500 bg-green-100'
            }`}
          >
            <h2 className="font-semibold">{flag.title}</h2>
            <p>{flag.retail}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
