import React from 'react'

type State = {
    hasError: boolean
    error?: Error | null
}

class ErrorBoundary extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, info: any) {
        // You can log the error to an error reporting service here
        console.error('[ErrorBoundary] caught error:', error, info)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-red-600">Something went wrong</h2>
                    <pre className="mt-2 text-sm text-gray-700">{String(this.state.error)}</pre>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
