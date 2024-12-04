import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CodeProps } from 'react-markdown/lib/ast-to-react';

interface ChatMessageProps {
    type: 'user' | 'assistant';
    content: string;
}

export default function ChatMessage({ type, content }: ChatMessageProps) {
    return (
        <div className={`flex ${type === 'user' ? 'justify-end' : 'justify-start'} mb-6`}>
            <div
                className={`rounded-2xl px-4 max-w-[85%] ${type === 'user'
                    ? 'bg-[#1a73e8] dark:bg-[#8ab4f8] text-white markdown-user'
                    : 'bg-[#f8f9fa] py-3 dark:bg-[#2d2d2d] text-gray-800 dark:text-gray-200 markdown-assistant'
                    }`}
                style={{ fontFamily: "'Google Sans', sans-serif" }}
            >
                <ReactMarkdown
                    components={{
                        code({ node, inline, className, children, ...props }: CodeProps) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                                <SyntaxHighlighter
                                    style={oneDark as any}
                                    language={match[1]}
                                    PreTag="div"
                                    className="rounded-lg my-3 !bg-[#1f1f1f]"
                                    {...props}
                                >
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            ) : (
                                <code className={`${className} bg-[#1f1f1f] rounded-md px-1.5 py-0.5 text-sm font-mono`} {...props}>
                                    {children}
                                </code>
                            )
                        },
                        p({ children }) {
                            return <p className="mb-2 last:mb-0">{children}</p>
                        }
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </div>
    );
}
