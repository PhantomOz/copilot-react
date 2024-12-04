import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Plus, X } from "lucide-react"
import TabSelector from '../TabSelector/TabSelector.tsx';

interface Tab {
    id: number;
    title: string;
    url: string;
    favIconUrl?: string;
}

interface ChatInputProps {
    onSend: (message: string, context?: { tabs: Tab[] }) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
    const [input, setInput] = useState('')
    const [isTabSelectorOpen, setIsTabSelectorOpen] = useState(false)
    const [selectedTabs, setSelectedTabs] = useState<Tab[]>([])

    const handleTabSelect = async (tab: Tab) => {
        try {
            // Activate the tab first
            await chrome.tabs.update(tab.id, { active: true });

            // Small delay to ensure tab is fully loaded
            await new Promise(resolve => setTimeout(resolve, 100));

            const [result] = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => document.body.innerText
            });

            console.log(`Content from tab "${tab.title}":`);
            console.log(result.result);

            setSelectedTabs(prev => [...prev, tab]);
        } catch (error) {
            console.error(`Failed to get content from tab ${tab.id}:`, error);
        }
    };

    const removeTab = (tabId: number) => {
        setSelectedTabs(prev => prev.filter(tab => tab.id !== tabId))
    }

    const handleSubmit = () => {
        if (!input.trim()) return;

        const context = selectedTabs.length > 0
            ? {
                tabs: selectedTabs.map(tab => ({
                    id: tab.id,
                    title: tab.title,
                    url: tab.url,
                }))
            }
            : undefined;

        onSend(input, context);
        setInput('');
    };

    return (
        <div className="flex flex-col gap-2 relative">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 flex-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 rounded-full hover:bg-gray-100 dark:hover:bg-[#2d2d2d]"
                            onClick={() => setIsTabSelectorOpen(true)}
                        >
                            <Plus className="h-4 w-4 dark:text-gray-300" />
                        </Button>
                        {selectedTabs.length === 0 ? (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Add current tab as context
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 flex-wrap">
                                {selectedTabs.map(tab => (
                                    <div
                                        key={tab.id}
                                        className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-[#2d2d2d] rounded-full text-sm shrink-0"
                                    >
                                        <img
                                            src={tab.favIconUrl || 'default-icon.png'}
                                            alt=""
                                            className="w-4 h-4"
                                        />
                                        <span className="max-w-[150px] truncate dark:text-gray-200">
                                            {tab.title}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-4 w-4 p-0 hover:bg-gray-200 dark:hover:bg-[#3d3d3d] rounded-full"
                                            onClick={() => removeTab(tab.id)}
                                        >
                                            <X className="h-3 w-3 dark:text-gray-400" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
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