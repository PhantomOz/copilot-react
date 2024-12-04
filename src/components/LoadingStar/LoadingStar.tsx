import { Star } from 'lucide-react';

interface LoadingStarProps {
    isLoading: boolean;
}

export default function LoadingStar({ isLoading }: LoadingStarProps) {
    if (!isLoading) return null;

    return (
        <div className="flex items-center justify-center">
            <div className="animate-spin-slow relative">
                <Star className="w-6 h-6 text-[#8ab4f8] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                <div className="w-10 h-10 rounded-full border-2 border-t-[#8ab4f8] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
            </div>
        </div>
    );
} 