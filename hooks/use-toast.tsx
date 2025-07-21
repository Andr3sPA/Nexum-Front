"use client"

import React from "react"

export type ToastType = "success" | "error" | "info" | "warning"

export interface ToastProps {
  id: string
  title?: string
  description?: string
  type?: ToastType
  open: boolean
}

interface ToastState {
  toasts: ToastProps[]
}

type ToastAction = 
  | { type: "ADD_TOAST"; toast: Omit<ToastProps, "id" | "open"> }
  | { type: "REMOVE_TOAST"; id: string }
  | { type: "UPDATE_TOAST"; id: string; updates: Partial<ToastProps> }

const toastReducer = (state: ToastState, action: ToastAction): ToastState => {
  switch (action.type) {
    case "ADD_TOAST":
      const newToast: ToastProps = {
        ...action.toast,
        id: Math.random().toString(36).substr(2, 9),
        open: true,
      }
      return {
        toasts: [newToast, ...state.toasts].slice(0, 3)
      }
    
    case "REMOVE_TOAST":
      return {
        toasts: state.toasts.filter(toast => toast.id !== action.id)
      }
    
    case "UPDATE_TOAST":
      return {
        toasts: state.toasts.map(toast => 
          toast.id === action.id 
            ? { ...toast, ...action.updates }
            : toast
        )
      }
    
    default:
      return state
  }
}

const ToastContext = React.createContext<{
  toasts: ToastProps[]
  addToast: (toast: Omit<ToastProps, "id" | "open">) => void
  removeToast: (id: string) => void
  updateToast: (id: string, updates: Partial<ToastProps>) => void
} | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [state, dispatch] = React.useReducer(toastReducer, { toasts: [] })

  const addToast = React.useCallback((toast: Omit<ToastProps, "id" | "open">) => {
    dispatch({ type: "ADD_TOAST", toast })
  }, [])

  const removeToast = React.useCallback((id: string) => {
    dispatch({ type: "REMOVE_TOAST", id })
  }, [])

  const updateToast = React.useCallback((id: string, updates: Partial<ToastProps>) => {
    dispatch({ type: "UPDATE_TOAST", id, updates })
  }, [])

  return (
    <ToastContext.Provider value={{ toasts: state.toasts, addToast, removeToast, updateToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

// Global toast function
let addToastGlobal: ((toast: Omit<ToastProps, "id" | "open">) => void) | null = null

export function setGlobalToastFunction(fn: (toast: Omit<ToastProps, "id" | "open">) => void) {
  addToastGlobal = fn
}

export function toast(toastData: Omit<ToastProps, "id" | "open">) {
  if (addToastGlobal) {
    addToastGlobal(toastData)
  }
}
