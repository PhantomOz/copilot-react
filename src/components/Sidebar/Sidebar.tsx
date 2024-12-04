import { useState, useRef, useEffect } from 'react'
import ChatInput from '../ChatInput/ChatInput.tsx'
import ChatMessage from '../ChatMessage/ChatMessage'
import Menu from '../Menu/Menu.tsx'
import { CardHeader, CardContent } from "@/components/ui/card"
import { Bot, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Tab } from '@/types/index.ts'
import LoadingStar from '../LoadingStar/LoadingStar.tsx'


export default function Sidebar() {
    const [messages, setMessages] = useState<Array<{ type: 'user' | 'assistant' | 'loading', content: string }>>([])
    const [showMenu, setShowMenu] = useState(true)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [summarizer, setSummarizer] = useState<any>(null)
    const [translator, setTranslator] = useState<any>(null)
    const [languageModel, setLanguageModel] = useState<any>(null)
    const [mode, setMode] = useState<'chat' | 'summarize' | 'translate'>('chat')

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
                // setMessages([{ type: 'assistant', content: 'Summarizer API is supported.' }])
                const options = {
                    sharedContext: 'This is a scientific article',
                    type: 'key-points',
                    format: 'markdown',
                    length: 'medium',
                };

                const available = (await (self as any).ai.summarizer.capabilities()).available;

                if (available === 'no') {
                    // The Summarizer API isn't usable.
                    setMessages([{ type: 'assistant', content: 'Summarizer API isn\'t usable.' }])
                    setSummarizer(await (self as any).ai.summarizer.create(options));
                    return;
                }
                if (available === 'readily') {
                    // The Summarizer API can be used immediately .
                    setSummarizer(await (self as any).ai.summarizer.create(options));
                    // setMessages([{ type: 'assistant', content: 'Summarizer API can be used immediately.' }])
                } else {
                    // The Summarizer API can be used after the model is downloaded.
                    setSummarizer(await (self as any).ai.summarizer.create(options));

                    await summarizer.ready;
                    setMessages([{ type: 'assistant', content: 'Summarizer API can be used after the model is downloaded.' }]);
                }
            }
            if ('translation' in self && 'createTranslator' in (self as any).translation) {
                // The Translator API is supported.
                console.log('Translator API is supported.');
            }

            if (!('languageModel' in (self as any).ai)) {
                console.log('Error: chrome.aiOriginTrial not supported in this browser');
                return;
            } else {

                const defaults = await (self as any).ai.languageModel.capabilities();
                console.log('Model default:', defaults);
                if (defaults.available !== 'readily') {
                    console.log(
                        `Model not yet available (current state: "${defaults.available}")`
                    );
                    return;
                }

                console.log('Model defaults set.');

                const params = {
                    systemPrompt: 'You are a helpful and friendly assistant.',
                    temperature: defaults.defaultTemperature,
                    topK: 3
                };
                setLanguageModel(await (self as any).ai.languageModel.create(params));
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
                setMode('summarize')
                break;
            case 'chat':
                prompt = "I'd like to discuss this page with you."
                setMode('chat')
                break;
            case 'translate':
                prompt = "Please help me translate this page."
                setMode('translate')
                break;
        }
        if (prompt) handleSend(prompt)
    }


    async function runPrompt(prompt: string) {
        try {
            let response;
            switch (mode) {
                case 'summarize':
                    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                    const content = await chrome.scripting.executeScript({
                        target: { tabId: tab.id! },
                        func: () => document.body.innerText
                    });
                    console.log('Content:', content[0].result);

                    response = await summarizer.summarize(content[0].result, {
                        context: 'This is a scientific article',
                    });
                    break;
                case 'translate':
                    response = await translator.translate(prompt);
                    break;
                case 'chat':
                    response = await languageModel.prompt(prompt);
                    break;
            }
            console.log('Prompt response:', response);
            return response;
        } catch (e) {
            console.log('Prompt failed');
            console.error(e);
            console.log('Prompt:', prompt);
            // Reset session
            throw e;
        }
    }

    const handleSend = async (message: string, context?: { tabs: Tab[] }) => {
        setMessages(prev => [...prev,
        { type: 'user', content: message },
        { type: 'loading', content: '' }
        ]);

        try {
            let fullPrompt = message;

            if (context?.tabs.length) {
                const tabsContext = context.tabs
                    .map(tab => `[Tab: ${tab.title}]\nURL: ${tab.url}\nContent: ${tab.content}\n`)
                    .join('\n');

                fullPrompt = `Context:\n${tabsContext}\n\nUser Message: ${message}`;
            }

            const response = await runPrompt(fullPrompt);
            setMessages(prev => prev.filter(msg => msg.type !== 'loading')
                .concat({ type: 'assistant', content: response }));
        } catch (e) {
            setMessages(prev => prev.filter(msg => msg.type !== 'loading')
                .concat({ type: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }));
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
                    {showMenu && messages.length === 0 ? (
                        <Menu onTaskSelect={handleTaskSelect} />
                    ) : (
                        <div className="flex flex-col h-full">
                            <div className="flex-1 overflow-auto p-4">
                                {messages.map((message, index) => (
                                    <div key={index} className="mb-4">
                                        {message.type === 'loading' ? (
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#8ab4f8] dark:bg-[#2d2d2d] flex items-center justify-center shrink-0">
                                                    <LoadingStar isLoading={true} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="h-6" />
                                                </div>
                                            </div>
                                        ) : (
                                            <ChatMessage
                                                type={message.type}
                                                content={message.content}
                                            />
                                        )}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <div className="p-4 border-t">
                                <ChatInput onSend={handleSend} />
                            </div>
                            <div className="p-4">
                                <LoadingStar isLoading={isLoading} />
                            </div>
                        </div>)}

                </div>
            </CardContent>
        </div>
    )
}