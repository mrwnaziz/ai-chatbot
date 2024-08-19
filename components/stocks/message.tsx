'use client'
import React, { useState, useEffect } from 'react'
import { IconOpenAI, IconUser } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import { spinner } from './spinner'
import { CodeBlock } from '../ui/codeblock'
import { MemoizedReactMarkdown } from '../markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { StreamableValue } from 'ai/rsc'
import { useStreamableText } from '@/lib/hooks/use-streamable-text'

// Function to detect if text starts with RTL characters
const isRTL = (text: string) => {
  const rtlChars = /[\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC]/
  return rtlChars.test(text.charAt(0))
}

export function UserMessage({ children }: { children: React.ReactNode }) {
  const [isRTLText, setIsRTLText] = useState(false)

  useEffect(() => {
    if (typeof children === 'string') {
      setIsRTLText(isRTL(children))
    }
  }, [children])

  return (
    <div className={cn(
      "group relative flex items-start md:-ml-12",
      isRTLText && "flex-row-reverse md:-mr-12 md:ml-0"
    )}>
      <div className={cn(
        "flex size-[25px] shrink-0 select-none items-center justify-center rounded-md border bg-background shadow-sm",
        isRTLText ? "ml-4" : "mr-4"
      )}>
        <IconUser />
      </div>
      <div className={cn(
        "flex-1 space-y-2 overflow-hidden px-1",
        isRTLText && "text-right"
      )}>
        {children}
      </div>
    </div>
  )
}

export function BotMessage({
  content,
  className
}: {
  content: string | StreamableValue<string>
  className?: string
}) {
  const text = useStreamableText(content)
  const [isRTLText, setIsRTLText] = useState(false)

  useEffect(() => {
    setIsRTLText(isRTL(text))
  }, [text])

  return (
    <div className={cn(
      'group relative flex items-start md:-ml-12',
      isRTLText && "flex-row-reverse md:-mr-12 md:ml-0",
      className
    )}>
      <div className={cn(
        "flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm",
        isRTLText ? "ml-4" : "mr-4"
      )}>
        <IconOpenAI />
      </div>
      <div className={cn(
        "flex-1 space-y-2 overflow-hidden px-1",
        isRTLText && "text-right"
      )}>
        <MemoizedReactMarkdown
          className={cn(
            "prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0",
            isRTLText && "direction-rtl"
          )}
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>
            },
            code({ node, inline, className, children, ...props }) {
              if (children.length) {
                if (children[0] == '▍') {
                  return (
                    <span className="mt-1 animate-pulse cursor-default">▍</span>
                  )
                }

                children[0] = (children[0] as string).replace('`▍`', '▍')
              }

              const match = /language-(\w+)/.exec(className || '')

              if (inline) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }

              return (
                <CodeBlock
                  key={Math.random()}
                  language={(match && match[1]) || ''}
                  value={String(children).replace(/\n$/, '')}
                  {...props}
                />
              )
            }
          }}
        >
          {text}
        </MemoizedReactMarkdown>
      </div>
    </div>
  )
}

export function BotCard({
  children,
  showAvatar = true
}: {
  children: React.ReactNode
  showAvatar?: boolean
}) {
  const [isRTLText, setIsRTLText] = useState(false)

  useEffect(() => {
    if (typeof children === 'string') {
      setIsRTLText(isRTL(children))
    }
  }, [children])

  return (
    <div className={cn(
      "group relative flex items-start md:-ml-12",
      isRTLText && "flex-row-reverse md:-mr-12 md:ml-0"
    )}>
      <div
        className={cn(
          'flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm',
          !showAvatar && 'invisible',
          isRTLText ? "ml-4" : "mr-4"
        )}
      >
        <IconOpenAI />
      </div>
      <div className={cn(
        "flex-1 px-1",
        isRTLText && "text-right"
      )}>
        {children}
      </div>
    </div>
  )
}

export function SystemMessage({ children }: { children: React.ReactNode }) {
  const [isRTLText, setIsRTLText] = useState(false)

  useEffect(() => {
    if (typeof children === 'string') {
      setIsRTLText(isRTL(children))
    }
  }, [children])

  return (
    <div
      className={
        'mt-2 flex items-center justify-center gap-2 text-xs text-gray-500'
      }
    >
      <div className={cn(
        'max-w-[600px] flex-initial p-2',
        isRTLText && "text-right"
      )}>
        {children}
      </div>
    </div>
  )
}

export function SpinnerMessage() {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm mr-4">
        <IconOpenAI />
      </div>
      <div className="flex-1 h-[24px] flex flex-row items-center space-y-2 overflow-hidden px-1">
        {spinner}
      </div>
    </div>
  )
}