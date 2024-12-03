import { useState, useRef, useEffect } from 'react'
import ChatInput from '../ChatInput/ChatInput.tsx'
import ChatMessage from '../ChatMessage/ChatMessage.tsx'
import Menu from '../Menu/Menu.tsx'
import { CardHeader, CardContent } from "@/components/ui/card"
import { Bot } from 'lucide-react'
import { Button } from "@/components/ui/button"


export default function Sidebar() {
    const [messages, setMessages] = useState<Array<{ type: 'user' | 'assistant', content: string }>>([])
    const [showMenu, setShowMenu] = useState(true)
    const [temperature, setTemperature] = useState(3)
    const [topK, setTopK] = useState(3)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const root = window.document.documentElement;
        const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const applyTheme = (isDark: boolean) => {
            if (isDark) {
                root.classList.add('dark');
                root.classList.remove('light');
            } else {
                root.classList.add('light');
                root.classList.remove('dark');
            }
        };

        applyTheme(darkQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => applyTheme(e.matches);
        darkQuery.addEventListener('change', handleChange);

        return () => darkQuery.removeEventListener('change', handleChange);
    }, []);

    useEffect(() => {
        async function initDefaults() {
            if ('ai' in self && 'summarizer' in (self as any).ai) {
                // The Summarizer API is supported.
                console.log('Summarizer API is supported.');
                setMessages([{ type: 'assistant', content: 'Summarizer API is supported.' }])
                const options = {
                    sharedContext: 'This is a scientific article',
                    type: 'key-points',
                    format: 'markdown',
                    length: 'medium',
                };

                const available = (await (self as any).ai.summarizer.capabilities()).available;
                let summarizer;
                if (available === 'no') {
                    // The Summarizer API isn't usable.
                    setMessages([{ type: 'assistant', content: 'Summarizer API isn\'t usable.' }])
                    summarizer = await (self as any).ai.summarizer.create(options);
                    return;
                }
                if (available === 'readily') {
                    // The Summarizer API can be used immediately .
                    summarizer = await (self as any).ai.summarizer.create(options);
                    setMessages([{ type: 'assistant', content: 'Summarizer API can be used immediately.' }])
                } else {
                    // The Summarizer API can be used after the model is downloaded.
                    summarizer = await (self as any).ai.summarizer.create(options);
                    summarizer.addEventListener('downloadprogress', (e: any) => {
                        console.log(e.loaded, e.total);
                    });
                    await summarizer.ready;
                    setMessages([{ type: 'assistant', content: 'Summarizer API can be used after the model is downloaded.' }]);
                }
            }
        }

        initDefaults();
    }, []);

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


    async function runPrompt(prompt: string, params: any) {
        try {
            let session = await chrome.aiOriginTrial.languageModel.create(params);
            return session.prompt(prompt);
        } catch (e) {
            console.log('Prompt failed');
            console.error(e);
            console.log('Prompt:', prompt);
            // Reset session
            throw e;
        }
    }

    const handleSend = async (message: string) => {
        setMessages(prev => [...prev, { type: 'user', content: message }]);

        try {
            const params = {
                systemPrompt: 'You are a helpful and friendly assistant.',
                temperature: temperature,
                topK: topK
            };
            const response = await runPrompt(message, params);
            setMessages(prev => [...prev, { type: 'assistant', content: response }]);
        } catch (e) {
            setMessages(prev => [...prev, { type: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
        }
    };

    const handleClose = () => {
        window.close();
    };

    return (
        <div className="flex flex-col h-screen bg-white dark:bg-[#0f1117]">
            <CardHeader
                className="flex flex-row items-center justify-between space-y-0 p-4 border-b bg-gradient-to-r from-[#1a73e8] to-[#8ab4f8] dark:from-[#1f1f1f] dark:to-[#1f1f1f] dark:border-[#2d2d2d]"
                style={{ fontFamily: "'Google Sans', sans-serif" }}
            >
                <div className="flex items-center gap-2">
                    <Bot className="h-6 w-6 text-white" />
                    <h2 className="text-lg font-medium text-white">Chrome Copilot</h2>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClose}
                    className="h-8 w-8 rounded-full hover:bg-white/20 text-white"
                >
                    ×
                </Button>
            </CardHeader>

            <CardContent className="flex-1 overflow-auto p-0 dark:border-[#2d2d2d]">
                <div className="h-full">
                    {showMenu && messages.length === 0 && (
                        <Menu onTaskSelect={handleTaskSelect} />
                    )}
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

                </div>
            </CardContent>
        </div>
    )
}