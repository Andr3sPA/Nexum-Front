"use client"

import type React from "react"
import { Component, type ErrorInfo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  errorId: string
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, errorId: "" }
  }

  static getDerivedStateFromError(error: Error): State {
    // Generate a unique error ID for tracking (don't expose error details)
    const errorId = "ERR-" + Date.now().toString(36).toUpperCase()

    return {
      hasError: true,
      errorId,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error securely (remove in production or send to secure logging service)
    if (process.env.NODE_ENV === "development") {
      console.error("Error caught by boundary:", error, errorInfo)
    }

    // In production, send error to secure logging service
    // this.logErrorSecurely(error, errorInfo, this.state.errorId)
  }

  private handleRetry = () => {
    this.setState({ hasError: false, errorId: "" })
  }

  private handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default secure error UI (no sensitive information exposed)
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">Algo salió mal</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">Se produjo un error inesperado. Por favor, inténtelo de nuevo.</p>

              <p className="text-xs text-gray-400">ID de error: {this.state.errorId}</p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={this.handleRetry} variant="outline" className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Reintentar
                </Button>

                <Button onClick={this.handleReload} className="udea-primary flex items-center gap-2">
                  Recargar página
                </Button>
              </div>

              <p className="text-xs text-gray-500 mt-4">Si el problema persiste, contacte al soporte técnico.</p>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(Component: React.ComponentType<P>, fallback?: ReactNode) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}
