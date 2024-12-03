import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Plus } from "lucide-react"
import TabSelector from '../TabSelector/TabSelector'

interface ChatInputProps {
    onSend: (message: string) => void
}

export default function ChatInput({ onSend }: ChatInputProps) {
    const [input, setInput] = useState('')
    const [isTabSelectorOpen, setIsTabSelectorOpen] = useState(false)
    const [selectedTabs, setSelectedTabs] = useState<Array<{ id: number; title: string }>>([])

    const handleTabSelect = (tab: { id: number; title: string }) => {
        setSelectedTabs(prev => [...prev, tab])
    }

    const handleSubmit = () => {
        if (!input.trim()) return
        onSend(input)
        setInput('')
    }

    return (
        <div className="flex flex-col gap-2 relative">
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-[#2d2d2d]"
                    onClick={() => setIsTabSelectorOpen(true)}
                >
                    <Plus className="h-4 w-4 dark:text-gray-300" />
                </Button>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedTabs.length > 0
                        ? `${selectedTabs.length} tab${selectedTabs.length > 1 ? 's' : ''} added as context`
                        : 'Add current tab as context'
                    }
                </div>
            </div>

            <TabSelector
                isOpen={isTabSelectorOpen}
                onClose={() => setIsTabSelectorOpen(false)}
                onSelect={handleTabSelect}
            />

            <div className="flex items-center gap-2" style={{ fontFamily: "'Google Sans', sans-serif" }}>
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="Message Copilot..."
                    className="flex-1 bg-[#f8f9fa] dark:bg-[#1f1f1f] dark:text-gray-200 border-0 focus-visible:ring-1 focus-visible:ring-[#1a73e8] dark:placeholder-gray-400"
                />
                <Button
                    size="icon"
                    onClick={handleSubmit}
                    className="rounded-full bg-[#1a73e8] hover:bg-[#1557b0] dark:bg-[#8ab4f8] dark:hover:bg-[#6fa1f7] text-white"
                >
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
} 