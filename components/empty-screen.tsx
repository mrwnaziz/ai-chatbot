import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
        <h1 className="text-lg font-semibold">
        Welcome to MiskGPT AI Chatbot!
        </h1>
        <p className="leading-normal text-muted-foreground">
        Welcome to MiskGPT, your digital guide within the Misk Hub universe! We are here to help you navigate the wealth of opportunities Misk Foundation offers for personal and professional development.
        </p>
        <p className="leading-normal text-muted-foreground">
        Whether you are looking to enhance your leadership skills, explore a career in an emerging sector, or take your entrepreneurial venture to the next level, We are here to provide you with the insights and guidance you need.
        </p>
      </div>
    </div>
  )
}
