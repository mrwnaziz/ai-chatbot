'use client'

import { useActions, useUIState } from 'ai/rsc'
import type { AI } from '@/lib/chat/actions'

interface Insight {
  id: string
  title: string
  author: string
  date: string
  category: string
  summary: string
}

export function Insights({ props: insights }: { props: Insight[] }) {
  const [, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions()

  return (
    <div className="-mt-2 flex w-full flex-col gap-2 py-4">
      {insights.map(insight => (
        <button
          key={insight.id}
          className="flex shrink-0 cursor-pointer flex-col gap-1 rounded-lg bg-zinc-800 p-4 text-left hover:bg-zinc-700"
          onClick={async () => {
            const response = await submitUserMessage(`Tell me about the insight: ${insight.title}`)
            setMessages(currentMessages => [...currentMessages, response])
          }}
        >
          <div className="text-base font-bold text-zinc-200">{insight.title}</div>
          <div className="flex justify-between text-sm text-zinc-400">
            <span>{insight.author}</span>
            <span>{insight.date}</span>
          </div>
          <div className="text-sm text-zinc-500">{insight.category}</div>
          <div className="text-zinc-500">{insight.summary.slice(0, 100)}...</div>
        </button>
      ))}
    </div>
  )
}