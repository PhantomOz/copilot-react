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
                "max-w-[80%] rounded-2xl px-4 py-2",
                type === 'user'
                    ? "bg-[#e3e3fd] dark:bg-[#3c4043] text-black dark:text-white"
                    : "bg-[#f8f9fa] dark:bg-[#2d2d2d] text-black dark:text-white"
            )}>
                {content}
            </div>
        </div>
    )
}
