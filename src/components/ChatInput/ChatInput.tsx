import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

interface ChatInputProps {
    onSend: (message: string) => void
}

export default function ChatInput({ onSend }: ChatInputProps) {
    const [input, setInput] = useState('')

    const handleSubmit = () => {
        if (!input.trim()) return
        onSend(input)
        setInput('')
    }

    return (
        <div className="flex items-center gap-2">
            <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="Message Gemini..."
                className="flex-1 bg-[#f8f9fa] dark:bg-[#2d2d2d] border-0 focus-visible:ring-1 focus-visible:ring-gray-300 dark:focus-visible:ring-gray-600"
            />
            <Button
                size="icon"
                onClick={handleSubmit}
                className="rounded-full bg-[#e3e3fd] hover:bg-[#d1d1fb] dark:bg-[#3c4043] dark:hover:bg-[#4a4d51]"
            >
                <Send className="h-4 w-4" />
            </Button>
        </div>
    )
} 