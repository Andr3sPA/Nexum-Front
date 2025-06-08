import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ProfileTemplateProps {
  title: string
  subtitle?: string
  tabs: {
    id: string
    label: string
    content: ReactNode
  }[]
}

export default function ProfileTemplate({ title, subtitle, tabs }: ProfileTemplateProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold udea-primary-text">{title}</CardTitle>
              {subtitle && <p className="text-gray-600">{subtitle}</p>}
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={tabs[0].id} className="w-full">
                <TabsList className={`grid w-full grid-cols-${tabs.length}`}>
                  {tabs.map((tab) => (
                    <TabsTrigger key={tab.id} value={tab.id}>
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {tabs.map((tab) => (
                  <TabsContent key={tab.id} value={tab.id} className="mt-6">
                    {tab.content}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
