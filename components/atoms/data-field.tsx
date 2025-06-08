interface DataFieldProps {
  label: string
  value: string | null | undefined
  className?: string
}

export function DataField({ label, value, className = "" }: DataFieldProps) {
  return (
    <div className={className}>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <p className="text-gray-900">{value || "No hay datos"}</p>
    </div>
  )
}
