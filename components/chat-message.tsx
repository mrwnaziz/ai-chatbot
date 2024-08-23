import React, { useEffect, useState, useRef } from 'react'
import { Message } from 'ai'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import { cn } from '@/lib/utils'
import { CodeBlock } from '@/components/ui/codeblock'
import { IconOpenAI, IconUser } from '@/components/ui/icons'
import { ChatMessageActions } from '@/components/chat-message-actions'

export interface ChatMessageProps {
  message: Message
}

function isRTL(text: string) {
  const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/
  return rtlChars.test(text)
}

export function ChatMessage({ message, ...props }: ChatMessageProps) {
  const [isRTLText, setIsRTLText] = useState(false)
  const messageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsRTLText(isRTL(message.content))
  }, [message.content])

  useEffect(() => {
    if (messageRef.current) {
      const links = messageRef.current.getElementsByTagName('a')
      for (let i = 0; i < links.length; i++) {
        links[i].setAttribute('target', '_blank')
        links[i].setAttribute('rel', 'noopener noreferrer')
      }
    }
  }, [message.content])

  return (
    <div
      className={cn('group relative mb-4 flex items-start md:-ml-12')}
      {...props}
    >
      <div
        className={cn(
          'flex size-8 shrink-0 select-none items-center justify-center rounded-md border shadow',
          message.role === 'user'
            ? 'bg-background'
            : 'bg-primary text-primary-foreground'
        )}
      >
        {message.role === 'user' ? <IconUser /> : <IconOpenAI />}
      </div>
      <div 
        className={cn(
          'flex-1 px-1 ml-4 space-y-2 overflow-hidden',
          isRTLText ? 'text-right' : 'text-left'
        )}
        ref={messageRef}
      >
        <ReactMarkdown
          className={cn(
            "prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0",
            isRTLText ? 'direction-rtl' : 'direction-ltr'
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
                    <span className="mt-1 cursor-default animate-pulse">▍</span>
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
          {message.content}
        </ReactMarkdown>
        <ChatMessageActions message={message} />
      </div>
    </div>
  )
}