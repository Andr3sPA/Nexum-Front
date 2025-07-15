"use client"

import React from "react"
import { CustomScrollbar } from "@/components/atoms/custom-scrollbar"
import { Card } from "@/components/molecules/card"

interface ListItem {
  id: string
  title: string
  description: string
  status: "active" | "inactive" | "pending"
}

const mockData: ListItem[] = Array.from({ length: 50 }, (_, i) => ({
  id: `item-${i + 1}`,
  title: `Elemento ${i + 1}`,
  description: `Esta es la descripción del elemento número ${i + 1} en la lista.`,
  status: ["active", "inactive", "pending"][i % 3] as ListItem["status"]
}))

export function ScrollableListExample() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Lista con Scrollbar Personalizada</h3>
        <Card className="p-4">
          <CustomScrollbar maxHeight="h-64" className="space-y-2">
            {mockData.map((item) => (
              <div
                key={item.id}
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === "active"
                        ? "bg-green-100 text-green-800"
                        : item.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </CustomScrollbar>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Lista con Scrollbar Modal (más delgada)</h3>
        <Card className="p-4">
          <CustomScrollbar 
            maxHeight="h-48" 
            variant="modal" 
            className="space-y-2"
          >
            {mockData.slice(0, 30).map((item) => (
              <div
                key={item.id}
                className="p-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900">{item.title}</h4>
                    <p className="text-xs text-gray-600">{item.description}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === "active"
                        ? "bg-green-100 text-green-800"
                        : item.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </CustomScrollbar>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Tabla con Scrollbar</h3>
        <Card className="p-4">
          <CustomScrollbar maxHeight="h-80">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900">{item.id}</td>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900">{item.title}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{item.description}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === "active"
                            ? "bg-green-100 text-green-800"
                            : item.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CustomScrollbar>
        </Card>
      </div>
    </div>
  )
} 