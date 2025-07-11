import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { colors, typography, spacing, borderRadius, shadows, transitions } from "./design-system"

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx and tailwind-merge for optimal class handling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format date to Colombian locale
 */
export function formatDate(date: string | Date): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date

    if (isNaN(dateObj.getTime())) {
      return "Fecha inválida"
    }

    return dateObj.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch {
    return "Fecha inválida"
  }
}

/**
 * Validate Colombian ID number (Cédula)
 */
export function validateColombianId(id: string): boolean {
  if (typeof id !== "string" || !/^\d{6,10}$/.test(id)) {
    return false
  }

  const digits = id.split("").map(Number)
  let sum = 0

  for (let i = 0; i < digits.length - 1; i++) {
    let product = digits[i] * (digits.length - i)
    if (product >= 10) {
      product = Math.floor(product / 10) + (product % 10)
    }
    sum += product
  }

  const checkDigit = (10 - (sum % 10)) % 10
  return checkDigit === digits[digits.length - 1]
}

/**
 * Format phone number for Colombian format
 */
export function formatPhoneNumber(phone: string): string {
  if (typeof phone !== "string") {
    return ""
  }

  const cleaned = phone.replace(/\D/g, "")

  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
  }

  return phone
}

// Utility function to create CSS custom properties for design tokens
export function createCSSVariables() {
  const cssVars: Record<string, string> = {}
  
  // Color variables
  Object.entries(colors.primary).forEach(([key, value]) => {
    cssVars[`--color-primary-${key}`] = value
  })
  
  Object.entries(colors.complementary).forEach(([key, value]) => {
    cssVars[`--color-complementary-${key}`] = value
  })
  
  Object.entries(colors.state).forEach(([key, value]) => {
    cssVars[`--color-state-${key}`] = value
  })
  
  Object.entries(colors.neutral).forEach(([key, value]) => {
    cssVars[`--color-neutral-${key}`] = value
  })
  
  // Typography variables
  Object.entries(typography.fonts).forEach(([key, value]) => {
    cssVars[`--font-${key}`] = value
  })
  
  Object.entries(typography.sizes).forEach(([key, value]) => {
    cssVars[`--text-${key}`] = value
  })
  
  Object.entries(typography.weights).forEach(([key, value]) => {
    cssVars[`--font-weight-${key}`] = value.toString()
  })
  
  // Spacing variables
  Object.entries(spacing).forEach(([key, value]) => {
    cssVars[`--spacing-${key}`] = value
  })
  
  // Border radius variables
  Object.entries(borderRadius).forEach(([key, value]) => {
    cssVars[`--radius-${key}`] = value
  })
  
  // Shadow variables
  Object.entries(shadows).forEach(([key, value]) => {
    cssVars[`--shadow-${key}`] = value
  })
  
  // Transition variables
  Object.entries(transitions).forEach(([key, value]) => {
    cssVars[`--transition-${key}`] = value
  })
  
  return cssVars
}

// Utility function to apply design system styles
export function applyDesignSystem(component: string, variant?: string, size?: string) {
  const baseStyles = {
    // Button styles
    button: {
      base: "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
      variants: {
        primary: "bg-primary-500 text-white hover:bg-primary-600 focus:bg-primary-600",
        secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus:bg-neutral-200",
        outline: "border border-neutral-300 bg-transparent hover:bg-neutral-50 focus:bg-neutral-50",
        ghost: "hover:bg-neutral-100 focus:bg-neutral-100",
        destructive: "bg-state-error text-white hover:bg-red-600 focus:bg-red-600",
      },
      sizes: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 py-2",
        lg: "h-11 px-8",
        xl: "h-12 px-10 text-lg",
      }
    },
    // Input styles
    input: {
      base: "flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    },
    // Select styles
    select: {
      base: "flex h-10 w-full items-center justify-between rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      trigger: "flex h-10 w-full items-center justify-between rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      content: "relative z-50 min-w-[8rem] overflow-hidden rounded-md border border-neutral-200 bg-white text-neutral-950 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      item: "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-neutral-100 focus:text-neutral-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    },
    // Dialog styles
    dialog: {
      overlay: "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      content: "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-neutral-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
    },
    // Card styles
    card: {
      base: "rounded-lg border border-neutral-200 bg-white text-neutral-950 shadow-sm",
      header: "flex flex-col space-y-1.5 p-6",
      title: "text-2xl font-semibold leading-none tracking-tight",
      content: "p-6 pt-0",
      footer: "flex items-center p-6 pt-0",
    },
    // Tabs styles
    tabs: {
      list: "inline-flex h-10 items-center justify-center rounded-md bg-neutral-100 p-1 text-neutral-500",
      trigger: "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-neutral-950 data-[state=active]:shadow-sm",
      content: "mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2",
    },
    // Checkbox styles
    checkbox: {
      base: "peer h-4 w-4 shrink-0 rounded-sm border border-neutral-300 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary-500 data-[state=checked]:text-white data-[state=checked]:border-primary-500",
    },
    // Label styles
    label: {
      base: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
    },
    // Alert styles
    alert: {
      base: "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-neutral-950",
      variants: {
        default: "bg-white text-neutral-950",
        destructive: "border-red-200 bg-red-50 text-red-900 [&>svg]:text-red-900",
        success: "border-green-200 bg-green-50 text-green-900 [&>svg]:text-green-900",
        warning: "border-yellow-200 bg-yellow-50 text-yellow-900 [&>svg]:text-yellow-900",
        info: "border-blue-200 bg-blue-50 text-blue-900 [&>svg]:text-blue-900",
      }
    },
    // Badge styles
    badge: {
      base: "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      variants: {
        default: "border-transparent bg-primary-500 text-white hover:bg-primary-600",
        secondary: "border-transparent bg-neutral-100 text-neutral-900 hover:bg-neutral-200",
        destructive: "border-transparent bg-state-error text-white hover:bg-red-600",
        outline: "text-neutral-950",
      }
    },
    // Avatar styles
    avatar: {
      base: "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      image: "aspect-square h-full w-full",
      fallback: "flex h-full w-full items-center justify-center rounded-full bg-neutral-100 text-neutral-600",
    },
    // Dropdown styles
    dropdown: {
      content: "z-50 min-w-[8rem] overflow-hidden rounded-md border border-neutral-200 bg-white p-1 text-neutral-950 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      item: "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-neutral-100 focus:text-neutral-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    }
  }
  
  const componentStyles = baseStyles[component as keyof typeof baseStyles]
  if (!componentStyles) return ""
  
  let styles = componentStyles.base || ""
  
  if (variant && componentStyles.variants) {
    styles += " " + (componentStyles.variants[variant as keyof typeof componentStyles.variants] || "")
  }
  
  if (size && componentStyles.sizes) {
    styles += " " + (componentStyles.sizes[size as keyof typeof componentStyles.sizes] || "")
  }
  
  return styles
}

// Export design system for use in components
export { colors, typography, spacing, borderRadius, shadows, transitions }
