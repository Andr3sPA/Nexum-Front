// import { VanillaUIExample } from "@/components/examples/vanilla-ui-example"
import { ScrollableListExample } from "@/components/examples/scrollable-list-example"
import { ModalScrollTest } from "@/components/examples/modal-scroll-test"

export default function VanillaUITestPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Pruebas de UI Vanilla
        </h1>
        <p className="text-gray-600">
          Componentes personalizados sin dependencias de Radix UI
        </p>
      </div>

      <div className="grid gap-8">
        {/* <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            Componentes Básicos
          </h2>
          <VanillaUIExample />
        </section> */}

        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            Scrollbars Personalizadas
          </h2>
          <ScrollableListExample />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            Modal con Scroll
          </h2>
          <ModalScrollTest />
        </section>
      </div>
    </div>
  )
} 