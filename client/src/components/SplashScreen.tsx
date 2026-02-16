import { MessageCircle } from 'lucide-react';

export function SplashScreen() {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0f0f13] animate-fade-out">
            <div className="relative flex items-center justify-center">
                {/* Background Glow */}
                <div className="absolute w-32 h-32 bg-purple-600/30 rounded-full blur-2xl animate-pulse"></div>

                {/* Logo */}
                <div className="relative z-10 bg-gradient-to-tr from-purple-600 to-pink-600 p-4 rounded-2xl shadow-2xl shadow-purple-500/20 mb-6 animate-bounce-slight">
                    <MessageCircle className="w-12 h-12 text-white" />
                </div>
            </div>

            <div className="text-center z-10">
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2 animate-slide-up">
                    Vibrachat
                </h1>
                <p className="text-purple-400 text-lg font-medium tracking-widest uppercase animate-slide-up-delay">
                    by vts
                </p>
            </div>

            <div className="absolute bottom-10 w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600 w-1/2 animate-progress-loading rounded-full"></div>
            </div>
        </div>
    );
}
