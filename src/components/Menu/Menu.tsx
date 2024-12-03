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
    color: string
}

const MenuItem = ({ icon, label, onClick, color }: MenuItemProps) => (
    <Card
        onClick={onClick}
        className="flex flex-col items-center justify-center p-6 hover:scale-105 transition-all cursor-pointer border-0 shadow-lg"
        style={{
            background: `linear-gradient(135deg, ${color}, ${color}dd)`,
        }}
    >
        <div className="mb-3 p-3 rounded-xl bg-white/90 dark:bg-black/20">
            {React.cloneElement(icon as React.ReactElement, {
                size: 24,
                className: "text-black dark:text-white"
            })}
        </div>
        <span className="text-sm font-medium text-white text-center">{label}</span>
    </Card>
)

export default function Menu({ onTaskSelect }: { onTaskSelect: (task: string) => void }) {
    const tasks = [
        {
            icon: <FileText />,
            label: "Summarize Page",
            task: "summarize",
            color: "#1a73e8" // Google Blue
        },
        {
            icon: <MessageSquare />,
            label: "Chat About Page",
            task: "chat",
            color: "#188038" // Google Green
        },
        {
            icon: <Languages />,
            label: "Translate Page",
            task: "translate",
            color: "#c5221f" // Google Red
        }
    ]

    return (
        <div className="p-6" style={{ fontFamily: "'Google Sans', sans-serif" }}>
            <h3 className="text-xl font-medium mb-6 text-gray-800 dark:text-gray-200">
                What would you like to do?
            </h3>
            <div className="grid grid-cols-3 gap-4">
                {tasks.map((task) => (
                    <MenuItem
                        key={task.task}
                        icon={task.icon}
                        label={task.label}
                        onClick={() => onTaskSelect(task.task)}
                        color={task.color}
                    />
                ))}
            </div>
        </div>
    )
} 