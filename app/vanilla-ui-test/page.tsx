import { VanillaUIExample } from "@/components/examples/vanilla-ui-example"

export default function VanillaUITestPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Vanilla UI Components Test Page</h1>
      <p className="mb-6 text-gray-600">
        This page demonstrates UI components that work without requiring unsafe-inline or unsafe-eval in your Content Security Policy.
      </p>
      <div className="border rounded-lg shadow-sm">
        <VanillaUIExample />
      </div>
    </div>
  )
}