# Vanilla UI Components

## Overview

This directory contains UI components that are implemented using pure React and standard HTML elements, without relying on Radix UI or other libraries that require `unsafe-inline` or `unsafe-eval` in your Content Security Policy (CSP).

## Why Vanilla UI Components?

These components were created to address issues with UI components not working in production mode when strict CSP rules are applied. By using standard React patterns and DOM APIs, these components can function properly without compromising security.

Benefits include:

- **Enhanced Security**: No need for `unsafe-inline` or `unsafe-eval` in your CSP
- **Simplified Implementation**: Uses standard React hooks and patterns
- **Reduced Dependencies**: Fewer external libraries to manage
- **Better Performance**: Potentially smaller bundle size

## Available Components

### Select

A dropdown select component that provides similar functionality to Radix UI's Select but without requiring unsafe CSP directives.

```tsx
import { Select } from "@/components/ui-vanilla/select"

<Select
  options={[
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
  ]}
  value={selectedValue}
  onChange={setSelectedValue}
  placeholder="Select an option"
/>
```

### Dialog

A modal dialog component that provides similar functionality to Radix UI's Dialog but without requiring unsafe CSP directives.

```tsx
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui-vanilla/dialog"

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    Dialog content here
  </DialogContent>
</Dialog>
```

### Tabs

A tabbed interface component that provides similar functionality to Radix UI's Tabs but without requiring unsafe CSP directives.

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui-vanilla/tabs"

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content for Tab 1</TabsContent>
  <TabsContent value="tab2">Content for Tab 2</TabsContent>
</Tabs>
```

## Usage Example

See the example component at `components/examples/vanilla-ui-example.tsx` for a complete demonstration of all vanilla UI components.

## Migration

For detailed instructions on migrating from Radix UI components to these vanilla components, see the [Migration Guide](../../docs/MIGRATION-GUIDE.md).

## Implementation Details

These components use:

- React's built-in hooks (`useState`, `useEffect`, `useRef`, `useContext`)
- Standard DOM APIs (no custom renderers or portals that might require eval)
- CSS classes for styling (via the `cn` utility from `@/lib/utils`)
- Proper accessibility attributes and keyboard navigation

## Contributing

When adding new vanilla components or enhancing existing ones, please follow these guidelines:

1. Avoid dependencies that require `unsafe-inline` or `unsafe-eval`
2. Maintain API compatibility with the original UI components when possible
3. Ensure proper accessibility (ARIA attributes, keyboard navigation)
4. Include TypeScript types for all props and exported components
5. Add appropriate comments explaining any complex logic