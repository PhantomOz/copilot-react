import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Plus } from "lucide-react"

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
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => {/* Handle context addition */ }}
                >
                    <Plus className="h-4 w-4" />
                </Button>
                <div className="text-sm text-gray-500">Add current tab as context</div>
            </div>

            <div className="flex items-center gap-2" style={{ fontFamily: "'Google Sans', sans-serif" }}>
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="Message Copilot..."
                    className="flex-1 bg-[#f8f9fa] dark:bg-[#2d2d2d] border-0 focus-visible:ring-1 focus-visible:ring-[#1a73e8]"
                />
                <Button
                    size="icon"
                    onClick={handleSubmit}
                    className="rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white"
                >
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
} 