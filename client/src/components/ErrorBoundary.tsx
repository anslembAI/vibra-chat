import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    private handleClearData = () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-4">
                    <div className="max-w-md text-center space-y-4">
                        <h2 className="text-2xl font-bold text-red-500">Something went wrong</h2>
                        <p className="text-gray-300">
                            {this.state.error?.message || "An unexpected error occurred."}
                        </p>
                        <div className="bg-gray-800 p-4 rounded text-left overflow-auto max-h-40 text-xs font-mono text-gray-400">
                            {this.state.error?.stack}
                        </div>
                        <p className="text-sm text-gray-400">
                            This can often stem from conflicting local data (like old auth tokens).
                        </p>
                        <button
                            onClick={this.handleClearData}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded font-semibold transition-colors"
                        >
                            Clear Data & Reload
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
