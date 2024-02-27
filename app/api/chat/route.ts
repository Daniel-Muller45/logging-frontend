import { StreamingTextResponse } from 'ai'
import { RemoteRunnable } from 'langchain/runnables/remote'
import { BASE_URL } from '@/app/utils/url'

// Set the runtime to edge for best performance
// export const runtime = 'edge';

/**
 * Basic memory formatter that stringifies and passes
 * message history directly into the model.
 */
function formatMessagePairs(messages: string | any[]) {
  const pairs = []
  for (let i = 0; i < messages.length; i += 2) {
    const humanMessage = messages[i] ? messages[i].content : ''
    const aiMessage = messages[i + 1] ? messages[i + 1].content : ''
    pairs.push({ human: humanMessage, ai: aiMessage })
  }
  return pairs
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const messages = body.messages ?? []
    const formattedPreviousMessages = formatMessagePairs(messages.slice(0, -1))
    const currentMessageContent = messages[messages.length - 1].content

    const chain = new RemoteRunnable({
      url: `${BASE_URL}/api/v1/chat/`
      // options: { timeout: 10000000 },
    })

    let first_entry_skipped = false
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        if (!first_entry_skipped) {
          first_entry_skipped = true
        } else {
          controller.enqueue(chunk.toString())
        }
      }
    })

    const stream = await chain.stream({
      question: currentMessageContent,
      chat_history: formattedPreviousMessages
    })

    // Respond with the stream
    return new StreamingTextResponse(stream.pipeThrough(transformStream))
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
