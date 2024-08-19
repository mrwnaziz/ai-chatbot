'use client'

import React from 'react'
import { useActions, useUIState } from 'ai/rsc'
import type { AI } from '@/lib/chat/actions'

interface Program {
  id: string
  title: string
  category: string
  duration: string
  applicationDeadline: string
}

export function ProgramButton({ program }: { program: Program }) {
  const [, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions()

  const handleClick = async () => {
    const response = await submitUserMessage(`Tell me more about ${program.title}`)
    setMessages(currentMessages => [...currentMessages, response])
  }

  return (
    <button
      className="flex cursor-pointer flex-col gap-2 rounded-lg bg-zinc-800 p-4 text-left hover:bg-zinc-700"
      onClick={handleClick}
    >
      <div className="text-base font-bold text-zinc-200">{program.title}</div>
      <div className="flex justify-between text-sm">
        <span className="text-zinc-400">{program.category}</span>
        <span className="text-zinc-400">{program.duration}</span>
      </div>
      <div className="text-sm text-zinc-500">
        Application Deadline: {program.applicationDeadline}
      </div>
    </button>
  )
}