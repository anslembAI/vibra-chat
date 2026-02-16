import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { User, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";

interface AuthFormProps {
    mode?: "signIn" | "signUp";
    onSuccess?: () => void;
}

export function AuthForm({ mode = "signIn", onSuccess }: AuthFormProps) {
    const navigate = useNavigate();
    const { signIn } = useAuthActions();
    const ensureMe = useMutation(api.users.ensureMe);
    const [isLogin, setIsLogin] = useState(mode === "signIn");
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError("");
        setFormData({ username: "", password: "", confirmPassword: "" });
    };

    const validateForm = () => {
        if (!formData.username.trim()) return "Username is required";
        if (formData.password.length < 6) return "Password must be at least 6 characters";
        if (!isLogin && formData.password !== formData.confirmPassword) {
            return "Passwords do not match";
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError("");
        setLoading(true);

        try {
            const flow = isLogin ? "signIn" : "signUp";
            await signIn("password", {
                email: formData.username,
                name: formData.username,
                password: formData.password,
                flow
            });

            // REQUIRED: Ensure the user doc exists before redirecting
            await ensureMe();

            if (onSuccess) onSuccess();
            navigate("/app");
        } catch (err: any) {
            console.error("Auth error:", err);

            const errorMessage = err.message || "Unknown error";

            if (errorMessage.includes("Account already exists")) {
                setError(isLogin ? "Account not found or password incorrect." : "Username already taken.");
            } else if (errorMessage.includes("InvalidSecret") || errorMessage.includes("Password")) {
                setError("Incorrect username or password.");
            } else {
                setError(`Authentication failed: ${errorMessage}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md bg-[#1a1a20] rounded-2xl border border-white/10 shadow-2xl overflow-hidden p-8 animate-fade-in-up">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                    {isLogin ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="text-gray-400">
                    {isLogin
                        ? "Sign in to continue to Vibrachat"
                        : "Join the community today"}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-300 ml-1">Username</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full bg-[#282830] text-white pl-10 pr-4 py-3 rounded-xl border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-gray-500"
                            placeholder="Enter your username"
                            disabled={loading}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                        <input
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full bg-[#282830] text-white pl-10 pr-12 py-3 rounded-xl border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-gray-500"
                            placeholder="Enter your password"
                            disabled={loading}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3.5 text-gray-500 hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {!isLogin && (
                    <div className="space-y-1 animate-fade-in">
                        <label className="text-sm font-medium text-gray-300 ml-1">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="w-full bg-[#282830] text-white pl-10 pr-4 py-3 rounded-xl border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-gray-500"
                                placeholder="Confirm your password"
                                disabled={loading}
                                required
                            />
                        </div>
                    </div>
                )}

                {error && (
                    <div className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20 animate-shake">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            {isLogin ? "Sign In" : "Sign Up"}
                            <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button
                        onClick={toggleMode}
                        className="text-purple-400 hover:text-purple-300 font-semibold transition-colors ml-1"
                        disabled={loading}
                    >
                        {isLogin ? "Sign Up" : "Sign In"}
                    </button>
                </p>
            </div>
        </div>
    );
}
