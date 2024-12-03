import React from 'react'
import { cn } from "@/lib/utils"

interface ChatMessageProps {
    type: 'user' | 'assistant'
    content: string
}

export default function ChatMessage({ type, content }: ChatMessageProps) {
    return (
        <div className={cn(
            "mb-4 last:mb-0",
            type === 'user' ? "flex justify-end" : "flex justify-start"
        )}>
            <div className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2 shadow-sm",
                type === 'user'
                    ? "bg-[#1a73e8] text-white"
                    : "bg-[#f8f9fa] dark:bg-[#2d2d2d] text-gray-800 dark:text-gray-200"
            )}
                style={{ fontFamily: "'Google Sans', sans-serif" }}
            >
                {content}
            </div>
        </div>
    )
}
