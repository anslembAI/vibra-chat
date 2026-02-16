
import { AuthForm } from "../components/AuthForm";
import { MessageCircle } from "lucide-react";

export function AuthPage() {
    return (
        <div className="flex min-h-screen w-full bg-[#0f0f13] overflow-hidden relative font-sans">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-900/20 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8">
                <div className="mb-8 text-center animate-fade-in-down">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="bg-gradient-to-tr from-purple-600 to-pink-600 p-3 rounded-2xl shadow-lg shadow-purple-500/20">
                            <MessageCircle className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Vibrachat</h1>
                    </div>
                    <p className="text-gray-400 text-sm max-w-sm mx-auto">
                        Experience the future of communication with real-time messaging, crystal clear voice, and verified security.
                    </p>
                </div>

                <AuthForm />
            </div>
        </div>
    );
}
