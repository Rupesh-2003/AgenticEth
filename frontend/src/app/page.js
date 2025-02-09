"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Message from "../components/Message"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Home() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (input.trim()) {
      // Add user message to the chat
      setMessages((prev) => [...prev, { content: input, isAI: false }])
      setInput("") // Clear input field
      setIsLoading(true) // Show loading state

      try {
        // Call Flask API
        const response = await fetch("http://127.0.0.1:5001/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: input }),
        })

        if (!response.ok) {
          throw new Error("Failed to fetch response from the AI")
        }

        const data = await response.json()
        // Add AI response to the chat
        setMessages((prev) => [...prev, { content: data.response, isAI: true }])
      } catch (error) {
        console.error("Error:", error)
        // Show error message in the chat
        setMessages((prev) => [
          ...prev,
          { content: "Sorry, something went wrong. Please try again.", isAI: true },
        ])
      } finally {
        setIsLoading(false) // Hide loading state
      }
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-100">
      <header className="bg-white shadow-sm py-4">
        <h1 className="text-2xl font-bold text-center text-gray-800">Tell any tasks to perform with your wallet.</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto">
          {messages.map((message, index) => (
            <Message key={index} content={message.content} isAI={message.isAI} />
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="flex flex-row items-start max-w-3/4">
                <Avatar className="w-8 h-8 mr-2">
                  <AvatarImage src="/ai-avatar.png" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="rounded-lg p-3 bg-blue-100 text-blue-900">Thinking...</div>
              </div>
            </div>
          )}
        </div>
      </main>
      <footer className="bg-white p-4">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex gap-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </form>
      </footer>
    </div>
  )
}