"use client"

import * as React from "react"
import { Select, SelectOption, Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Tabs, TabsList, TabsTrigger, TabsContent, Button } from "@/components/ui-vanilla"

// Helper function to get the nonce from the DOM
function getNonce(): string {
  if (typeof document !== 'undefined') {
    const rootElement = document.getElementById('root');
    return rootElement?.getAttribute('data-nonce') || '';
  }
  return '';
}

export function VanillaUIExample() {
  const [selectValue, setSelectValue] = React.useState("")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const nonce = getNonce()
  
  const options: SelectOption[] = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ]

  return (
    <div className="space-y-8 p-10" nonce={nonce}>
      <h1 className="text-2xl font-bold" nonce={nonce}>Vanilla UI Components</h1>
      
      {/* Select Example */}
      <div className="space-y-2" nonce={nonce}>
        <h2 className="text-xl font-semibold" nonce={nonce}>Select Component</h2>
        <p nonce={nonce}>Current value: {selectValue || "None selected"}</p>
        <Select
          options={options}
          value={selectValue}
          onChange={setSelectValue}
          placeholder="Select an option"
          className="max-w-xs"
        />
      </div>

      {/* Dialog Example */}
      <div className="space-y-2" nonce={nonce}>
        <h2 className="text-xl font-semibold" nonce={nonce}>Dialog Component</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Example Dialog</DialogTitle>
              <DialogDescription>
                This is an example of the Dialog component implemented without Radix UI.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4" nonce={nonce}>
              <p nonce={nonce}>Dialog content goes here. This is a simple example of a dialog without using Radix UI.</p>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs Example */}
      <div className="space-y-2" nonce={nonce}>
        <h2 className="text-xl font-semibold" nonce={nonce}>Tabs Component</h2>
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <div className="p-4 border rounded mt-2" nonce={nonce}>
              <h3 className="font-medium" nonce={nonce}>Tab 1 Content</h3>
              <p nonce={nonce}>This is the content for Tab 1.</p>
            </div>
          </TabsContent>
          <TabsContent value="tab2">
            <div className="p-4 border rounded mt-2" nonce={nonce}>
              <h3 className="font-medium" nonce={nonce}>Tab 2 Content</h3>
              <p nonce={nonce}>This is the content for Tab 2.</p>
            </div>
          </TabsContent>
          <TabsContent value="tab3">
            <div className="p-4 border rounded mt-2" nonce={nonce}>
              <h3 className="font-medium" nonce={nonce}>Tab 3 Content</h3>
              <p nonce={nonce}>This is the content for Tab 3.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Button Example */}
      <div className="space-y-2" nonce={nonce}>
        <h2 className="text-xl font-semibold" nonce={nonce}>Button Component</h2>
        <div className="flex flex-wrap gap-4" nonce={nonce}>
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>
    </div>
  )
}