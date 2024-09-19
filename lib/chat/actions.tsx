import 'server-only'

import {
  createAI,
  createStreamableUI,
  getMutableAIState,
  getAIState,
  streamUI,
  createStreamableValue
} from 'ai/rsc'
import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { filterAndFormatData } from '@/lib/dataUtils'

import {
  BotMessage,
  SystemMessage,
} from '@/components/stocks'

import { z } from 'zod'
import {
  sleep,
  nanoid
} from '@/lib/utils'
import { saveChat } from '@/app/actions'
import { SpinnerMessage, UserMessage } from '@/components/stocks/message'
import { Chat, Message } from '@/lib/types'
import { auth } from '@/auth'

async function fetchMiskData(dataType: 'programs' | 'events' | 'insights'): Promise<any[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const url = `${baseUrl}/api/misk${dataType.charAt(0).toUpperCase() + dataType.slice(1)}`;
  
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

async function searchMiskData(dataType: 'programs' | 'events' | 'insights', query: string): Promise<any[]> {
  const allData = await fetchMiskData(dataType);
  return filterAndFormatData(allData, query, dataType);
}

async function submitUserMessage(content: string) {
  'use server'
  
  const aiState = getMutableAIState<typeof AI>()

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'user',
        content
      }
    ]
  })

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>
  let textNode: undefined | React.ReactNode

  const result = await streamUI({
    model: openai('gpt-4o'),
    initial: <div className="flex item-center gap-2"><SpinnerMessage /> Thinking...</div>,
    system: `
    You are MiskGPT, an AI assistant exclusively for Misk Foundation. Your role is to provide accurate, engaging information about Misk's programs, events, and initiatives for Saudi youth development.
    
    Strict Guardrails:
    1. Only discuss Misk Foundation-related topics.
    2. Use only the provided Misk-related context. Never use external knowledge.
    3. Verify the query is Misk-related. If not, use the redirect protocol: "I apologize, but I can only provide information about Misk Foundation's programs and services. How can I assist you with Misk-related inquiries?"
    4. Verify your answer contains only Misk-related information from the provided context.
    5. Do not provide general advice, personal opinions, or information outside of Misk Foundation's scope.
    6. Use only URLs provided in the context.
    7. Do not rely on memory or fabricate information.
    8. Follow the response protocol for Misk-related queries.

    Use the provided tools to analyze queries, research information, generate follow-up questions, and format responses.
    Always prioritize Misk-related topics and redirect unrelated queries back to Misk topics.
    
    When discussing programs or events, follow this guidance:
    1. Start with a brief overview of Misk's program categories: Skills, Entrepreneurship, Leadership, and Community.
    2. Ask which area interests the user most.
    3. Provide more information about the chosen category.
    4. Ask if they want to hear about a specific program or an overview of available programs.
    5. Based on their response, describe programs in detail or provide a brief overview.
    6. Always follow up with an engaging question about program alignment or exploring other categories.
    7. If interest is shown in a specific program, offer more details and guide towards the application.
    8. If the user seems unsure, offer to help narrow down options based on their goals or desired skills.

    Current date: ${new Date().toISOString().split('T')[0]}
    `,
    messages: [
      ...aiState.get().messages.map((message: any) => ({
        role: message.role,
        content: message.content,
        name: message.name
      }))
    ],
    text: ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue('')
        textNode = <BotMessage content={textStream.value} />
      }

      if (done) {
        textStream.done()
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: 'assistant',
              content
            }
          ]
        })
      } else {
        textStream.update(delta)
      }

      return textNode
    },
    tools: {
      researcher: {
        description: 'Analyzes MISK information to answer user queries',
        parameters: z.object({
          query: z.string().describe("The user's query"),
          language: z.enum(["ar", "en"]).describe("The language to respond in"),
        }),
        generate: async function* ({ query, language }) {
          yield <div className="flex item-center gap-2"><SpinnerMessage /> Analyzing programs and events...</div>
      
          const programsData = await searchMiskData('programs', query);
          const eventsData = await searchMiskData('events', query);
          const insightsData = await searchMiskData('insights', query);
      
          const filteredData = {
            programs: programsData,
            events: eventsData,
            insights: insightsData,
          };
      
          const researcherPrompt = `
          You are a researcher for MISK Hub. Analyze the provided information about MISK programs, events, and insights.
          Use this information to answer the user's query accurately and comprehensively.
          If specific information is not available, clearly state this.
          Always focus on MISK-related topics and provide relevant, helpful information.
          Format your response using markdown for better readability.

          IMPORTANT: 
          - Always use the exact titles and descriptions provided in the data. DO NOT translate or modify them.
          - For Arabic responses, use '_ar' fields. For English responses, use '_en' fields.
          - Always include the item_Url when mentioning specific programs, events, or insights.
          - Ensure you distinguish between programs and events. Do not mix them up.
          - When listing or describing programs, only use data from the 'programs' array.
          - When listing or describing events, only use data from the 'events' array.
          - Always use the exact item_Url provided for each program or event. Do not modify or generate URLs.

          For Programs:
          - Provide detailed information about program dates, including start date, end date, and application dates when relevant.
          - Include information about the program format, languages, categories, and skills when available.
          - When discussing prerequisites, use the 'prerequisites_en' or 'prerequisites_ar' fields as appropriate.
          - Include relevant information from 'about_program', 'program_modules', and 'program_highlights' fields.

          For Events:
          - Provide detailed information about event dates and times, including start date/time and end date/time.
          - Include information about the event type, format (online/offline), and location (cities, venues) when available.
          - Mention registration start and end dates/times if provided.
          - Include event description, agenda items, and FAQs if available.
          - Mention notable speakers if the information is provided.

          Language: ${language}
          User query: ${query}
          Available information: ${JSON.stringify(filteredData)}

          Provide a comprehensive answer:
          `
      
          const { text: researcherResponse } = await generateText({
            model: openai('gpt-4o'),
            prompt: researcherPrompt,
            temperature: 0.2,
            maxTokens: 4000,
          })
      
          const toolCallId = nanoid()
      
          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'assistant',
                content: [
                  {
                    type: 'tool-call',
                    toolName: 'researcher',
                    toolCallId,
                    args: { query, language }
                  }
                ]
              },
              {
                id: nanoid(),
                role: 'tool',
                content: [
                  {
                    type: 'tool-result',
                    toolName: 'researcher',
                    toolCallId,
                    result: filteredData
                  }
                ]
              }
            ]
          })
      
          let formattedResponse = researcherResponse
      
          if (language === 'ar') {
            formattedResponse = modifyUrlsForArabic(formattedResponse)
          }
      
          return <BotMessage content={formattedResponse} />
        }
      },
      follow_up_generator: {
        description: 'Generates follow-up questions for user queries',
        parameters: z.object({
          context: z.string().describe("The current context of the conversation"),
        }),
        generate: async function* ({ context }) {
          const followUpPrompt = `
          You are an AI assistant for MISK Hub. Generate a follow-up question to gather more information from the user.
          The question should be relevant to MISK programs, events, or insights.
          Provide options for the user to choose from, and allow for free-form input if necessary.

          Current context: ${context}

          Generate a follow-up question:
          `

          const { text: followUpResponse } = await generateText({
            model: openai('gpt-4o-mini'),
            prompt: followUpPrompt,
            temperature: 0.2,
            maxTokens: 4000,
          })

          return <BotMessage content={followUpResponse} />
        }
      },
      writer: {
        description: 'Rewrites content in the MISK brand voice',
        parameters: z.object({
          content: z.string().describe("The content to rewrite"),
          language: z.enum(["ar", "en"]).describe("The language to write in"),
        }),
        generate: async function* ({ content, language }) {
          const writerPrompt = `
          You are a writer for MISK Hub. Your task is to take the provided content and rewrite it in the MISK brand voice.
          The content should be engaging, informative, and tailored to the MISK audience.
          Use a friendly, professional tone that encourages youth development and aligns with MISK's mission.
          Write in the ${language === 'ar' ? 'Arabic' : 'English'} language.
          Format your response using markdown for better readability.
      
          Content to rewrite: ${content}
      
          Rewritten content:
          `
      
          const { text: writerResponse } = await generateText({
            model: openai('gpt-4o'),
            prompt: writerPrompt,
            temperature: 0.2,
            maxTokens: 4000,
          })
      
          let rewrittenContent = writerResponse
      
          if (language === 'ar') {
            rewrittenContent = modifyUrlsForArabic(rewrittenContent)
          }
      
          return <BotMessage content={rewrittenContent} />
        }
      }      
    }
  })

  return {
    id: nanoid(),
    display: result.value
  }
}

function modifyUrlsForArabic(content: string): string {
  const urlRegex = /(https?:\/\/hub\.misk\.org\.sa\/)(programs|events)\/([^\s"]+)/g;
  return content.replace(urlRegex, (match, protocol, type, path) => {
    return `${protocol}${type}/ar/${path}`;
  });
}

export type AIState = {
  chatId: string
  messages: Message[]
}

export type UIState = {
  id: string
  display: React.ReactNode
}[]

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },
  onGetUIState: async () => {
    'use server'

    const session = await auth()

    if (session && session.user) {
      const aiState = getAIState() as Chat

      if (aiState) {
        const uiState = getUIStateFromAIState(aiState)
        return uiState
      }
    } else {
      return
    }
  },
  onSetAIState: async ({ state }) => {
    'use server'

    const session = await auth()

    if (session && session.user) {
      const { chatId, messages } = state

      const createdAt = new Date()
      const userId = session.user.id as string
      const path = `/chat/${chatId}`

      const firstMessageContent = messages[0].content as string
      const title = firstMessageContent.substring(0, 100)

      const chat: Chat = {
        id: chatId,
        title,
        userId,
        createdAt,
        messages,
        path
      }

      await saveChat(chat)
    } else {
      return
    }
  }
})

export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState.messages
    .filter(message => message.role !== 'system')
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display: message.role === 'user' 
        ? <UserMessage>{message.content as string}</UserMessage>
        : <BotMessage content={message.content as string} />
    }))
}