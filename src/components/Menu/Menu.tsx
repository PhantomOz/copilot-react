import React from 'react'
import {
    FileText,
    MessageSquare,
    Languages
} from 'lucide-react'
import { Card } from "@/components/ui/card"

interface MenuItemProps {
    icon: React.ReactNode
    label: string
    onClick: () => void
}

const MenuItem = ({ icon, label, onClick }: MenuItemProps) => (
    <Card
        onClick={onClick}
        className="flex flex-col items-center justify-center p-4 hover:bg-[#f8f9fa] dark:hover:bg-[#2d2d2d] transition-colors cursor-pointer"
    >
        <div className="mb-2 p-2 rounded-full bg-blue-50 dark:bg-gray-800">
            {icon}
        </div>
        <span className="text-sm text-center">{label}</span>
    </Card>
)

export default function Menu({ onTaskSelect }: { onTaskSelect: (task: string) => void }) {
    const tasks = [
        { icon: <FileText size={20} />, label: "Summarize Page", task: "summarize" },
        { icon: <MessageSquare size={20} />, label: "Chat About Page", task: "chat" },
        { icon: <Languages size={20} />, label: "Translate Page", task: "translate" }
    ]

    return (
        <div className="p-4">
            <h3 className="text-lg font-medium mb-4">What would you like to do?</h3>
            <div className="grid grid-cols-3 gap-3">
                {tasks.map((task) => (
                    <MenuItem
                        key={task.task}
                        icon={task.icon}
                        label={task.label}
                        onClick={() => onTaskSelect(task.task)}
                    />
                ))}
            </div>
        </div>
    )
} 