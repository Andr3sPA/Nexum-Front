import React, { ChangeEvent, ReactNode } from "react"
import {
  TextInputMode,
  TextInputSize,
  TextInputVariant,
} from "@typing/atoms"
import "./Input.css"

const DEFAULT_TYPE: TextInputVariant = "text"
const DEFAULT_MODE: TextInputMode = "text"
const DEFAULT_SIZE: TextInputSize = "m"
const DEFAULT_PLACEHOLDER = ""
const DEFAULT_AUTO_COMPLETE = "off"
const DEFAULT_CLASSNAME = ""
const DEFAULT_REQUIRED = false
const DEFAULT_DISABLED = false
const DEFAULT_READONLY = false

interface InputProps {
  id: string
  name: string
  label?: string
  placeholder?: string
  icon?: ReactNode
  value?: string
  type?: TextInputVariant
  mode?: TextInputMode
  size?: TextInputSize
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  autoComplete?: string
  className?: string
  onChange?: (key: string, value: string) => void
}

const Input = React.memo(function Input({
  id,
  name,
  label,
  placeholder = DEFAULT_PLACEHOLDER,
  icon,
  value,
  type = DEFAULT_TYPE,
  mode = DEFAULT_MODE,
  size = DEFAULT_SIZE,
  required = DEFAULT_REQUIRED,
  disabled = DEFAULT_DISABLED,
  readOnly = DEFAULT_READONLY,
  autoComplete = DEFAULT_AUTO_COMPLETE,
  className = DEFAULT_CLASSNAME,
  onChange,
}: Readonly<InputProps>) {
  return (
    <div className="input-container">
      {label && (
        <label
          htmlFor={id}
          className={`input-label ${size}`}
        >
          {label}
        </label>
      )}

      <div className="input-wrapper">
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          autoComplete={autoComplete}
          inputMode={mode}
          aria-label={label}
          data-testid={`input-${id}`}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange?.(e.target.name, e.target.value)
          }
          className={`input-field ${size} ${icon ? "with-icon" : ""} ${disabled ? "disabled" : ""} ${className}`}
        />
        {icon && (
          <div className={`input-icon ${size}`}>
            {icon}
          </div>
        )}

      </div>
    </div>
  )
})

export default Input
