import React, { useState, useRef } from 'react'
import ChatInput from '../ChatInput/ChatInput.tsx'
import ChatMessage from '../ChatMessage/ChatMessage.tsx'
import Menu from '../Menu/Menu.tsx'
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Bot } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function Sidebar() {
    const [messages, setMessages] = useState<Array<{ type: 'user' | 'assistant', content: string }>>([])
    const [showMenu, setShowMenu] = useState(true)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const handleTaskSelect = (task: string) => {
        setShowMenu(false)
        let prompt = ''
        switch (task) {
            case 'summarize':
                prompt = "Please summarize this page for me."
                break;
            case 'chat':
                prompt = "I'd like to discuss this page with you."
                break;
            case 'translate':
                prompt = "Please help me translate this page."
                break;
        }
        if (prompt) handleSend(prompt)
    }

    const handleSend = (message: string) => {
        setMessages(prev => [...prev, { type: 'user', content: message }])
        // Add your AI response logic here
    }

    const handleClose = () => {
        chrome.sidePanel.close();
    };

    return (
        <div className="flex flex-col h-screen bg-white dark:bg-[#1f1f1f]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b bg-[#f8f9fa] dark:bg-[#2d2d2d]">
                <div className="flex items-center gap-2">
                    <Bot className="h-6 w-6" />
                    <h2 className="text-lg font-medium">Chrome Copilot</h2>
                </div>
                <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8">
                    ×
                </Button>
            </CardHeader>

            <CardContent className="flex-1 overflow-auto p-0">
                <div className="h-full">
                    {showMenu && messages.length === 0 ? (
                        <Menu onTaskSelect={handleTaskSelect} />
                    ) : (
                        <div className="flex flex-col h-full">
                            <div className="flex-1 overflow-auto p-4">
                                {messages.map((msg, index) => (
                                    <ChatMessage
                                        key={index}
                                        type={msg.type}
                                        content={msg.content}
                                    />
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <div className="p-4 border-t">
                                <ChatInput onSend={handleSend} />
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </div>
    )
}