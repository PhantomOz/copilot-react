import React from 'react';
import { Check } from 'lucide-react';

interface Tab {
    id: number;
    title: string;
    url: string;
    favIconUrl?: string;
}

interface TabSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (tab: Tab) => void;
}

export default function TabSelector({ isOpen, onClose, onSelect }: TabSelectorProps) {
    const [tabs, setTabs] = React.useState<Tab[]>([]);

    React.useEffect(() => {
        if (isOpen) {
            chrome.tabs.query({ currentWindow: true }, (chromeTabs) => {
                const tabs = chromeTabs
                    .filter((tab): tab is chrome.tabs.Tab & { id: number } => tab.id !== undefined)
                    .map(tab => ({
                        id: tab.id,
                        title: tab.title || '',
                        url: tab.url || '',
                        favIconUrl: tab.favIconUrl
                    }));
                setTabs(tabs);
            });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="absolute bottom-full left-0 mb-2 w-full max-h-[300px] overflow-y-auto bg-white dark:bg-[#1f1f1f] rounded-lg shadow-lg border dark:border-[#2d2d2d] p-2">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => {
                        onSelect(tab);
                        onClose();
                    }}
                    className="flex items-center gap-3 w-full p-2 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-md text-left"
                >
                    <img
                        src={tab.favIconUrl || 'default-icon.png'}
                        alt=""
                        className="w-4 h-4"
                    />
                    <span className="text-sm truncate dark:text-gray-200">{tab.title}</span>
                </button>
            ))}
        </div>
    );
} 