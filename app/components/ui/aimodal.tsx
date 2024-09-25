// components/AIModal.tsx
import * as React from 'react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@radix-ui/react-label'

const ChatHistory: React.FC<{ messages: { user: string; chatbot: string}[] }> = ({ messages }) => {
  return (
    <div className="overflow-auto h-96">
      <div className="space-y-2">
        <Card className="rounded space-y-2">
          {messages.map((msg, index) => (
            <div key={index} className="mb-2">
              <div className="=p-2 text-black bg-gray-300 rounded">
                {msg.user}
              </div>
              <div className="p-2 mt-1 text-white bg-blue-500 rounded">
                {msg.chatbot}
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

const ChatInput: React.FC<{
  input: string
  onInputChange: (value: string) => void
  onSubmit: () => void
  onClear: () => void
}> = ({ input, onInputChange, onSubmit, onClear }) => {
  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        onSubmit()
      }}
      className="space-y-4"
    >
      <div>
        <Textarea
          placeholder="How can I assist you?"
          id="chatbot-textarea"
          className="form-textarea resize-none rounded w-full"
          value={input}
          onChange={e => onInputChange(e.target.value)}
        />
      </div>
      <div className="flex flex-row justify-between">
        <Button
          type="button"
          onClick={onClear}
          size="sm"
          className="relative left-2 bottom-2 rounded text-white"
        >
          Clear
        </Button>
        <Button
          type="submit"
          variant="default"
          size="sm"
          className="relative right-2 bottom-2 rounded text-white"
        >
          Submit
        </Button>
      </div>
    </form>
  )
}


interface Message {
  user: string
  chatbot: string
}

const AIModal: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])

  const handleToggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  const handleSubmit = () => {
    console.log(input)
    const simulatedResponse = `Chatbot response: ${input}`
    const newMessage: Message = {
      user: input, 
      chatbot: simulatedResponse,
    }
    setMessages((prevMessages) => [...prevMessages, newMessage])
    setInput('')
  }

  const handleClear = () => {
    setMessages([])
  }

  return (
    <div className="fixed bottom-24 right-6 z-50" onClick={handleToggleModal}>
      <Button
        onClick={handleToggleModal}
        variant="default"
        size="lg"
        className="mt-5 rounded w-40 text-white fixed bottom-10 right-10"
      >
        {/* Icon or text for the button */}
        Chat with us!
      </Button>

      {isModalOpen && (
        <div
          className="fixed bottom-24 right-6 z-50"
          onClick={handleToggleModal}
        >
          <div className="self-stretch text-left">
            <Label className="text-lg" htmlFor="message-2">
              ChatBot
            </Label>
          </div>
          <Card
            className="p-4 rounded w-full max-w-md mx-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="mb-4">
              <ChatHistory messages={messages} />
            </div>
            <ChatInput
              input={input}
              onInputChange={setInput}
              onSubmit={handleSubmit}
              onClear={handleClear}
            />
          </Card>
        </div>
      )}
    </div>
  )
}

export default AIModal
