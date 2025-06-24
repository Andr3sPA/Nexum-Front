# Migration Guide: From Radix UI to Vanilla UI Components

## Overview

This guide provides instructions for migrating from Radix UI components to our new vanilla UI components. The vanilla components have been designed to work without requiring `unsafe-inline` or `unsafe-eval` in your Content Security Policy (CSP), making your application more secure.

## Why Migrate?

- **Improved Security**: Removes the need for `unsafe-inline` and `unsafe-eval` in your CSP
- **Simplified Implementation**: Uses standard React patterns and hooks
- **Better Performance**: Reduces bundle size by removing dependencies
- **Full Control**: Easier to customize and extend

## Components Available for Migration

Currently, the following components have vanilla alternatives:

1. **Select** - Replacement for `@radix-ui/react-select`
2. **Dialog** - Replacement for `@radix-ui/react-dialog`
3. **Tabs** - Replacement for `@radix-ui/react-tabs`

## How to Migrate

### 1. Import from the new location

Change your imports from:

```tsx
import { ... } from "@/components/ui/[component-name]"
```

To:

```tsx
import { ... } from "@/components/ui-vanilla/[component-name]"
// or use the index file
import { ... } from "@/components/ui-vanilla"
```

### 2. Update Component Usage

#### Select Component

**Before (Radix UI):**

```tsx
<Select onValueChange={setValue} defaultValue={value}>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectItem value="option1">Option 1</SelectItem>
      <SelectItem value="option2">Option 2</SelectItem>
      <SelectItem value="option3">Option 3</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

**After (Vanilla UI):**

```tsx
<Select
  options={[
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ]}
  value={value}
  onChange={setValue}
  placeholder="Select an option"
/>
```

#### Dialog Component

**Before (Radix UI):**

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button variant="outline">Open Dialog</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description here.</DialogDescription>
    </DialogHeader>
    <div className="py-4">Dialog content here</div>
    <DialogFooter>
      <Button onClick={() => setOpen(false)}>Close</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**After (Vanilla UI):**

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button variant="outline">Open Dialog</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description here.</DialogDescription>
    </DialogHeader>
    <div className="py-4">Dialog content here</div>
    <DialogFooter>
      <Button onClick={() => setOpen(false)}>Close</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

> Note: The Dialog API remains very similar to maintain compatibility.

#### Tabs Component

**Before (Radix UI):**

```tsx
<Tabs defaultValue="tab1" onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content for Tab 1</TabsContent>
  <TabsContent value="tab2">Content for Tab 2</TabsContent>
</Tabs>
```

**After (Vanilla UI):**

```tsx
<Tabs defaultValue="tab1" onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content for Tab 1</TabsContent>
  <TabsContent value="tab2">Content for Tab 2</TabsContent>
</Tabs>
```

> Note: The Tabs API remains very similar to maintain compatibility.

## Example Usage

See the example component at `components/examples/vanilla-ui-example.tsx` for a complete demonstration of all vanilla UI components.

## Testing Your Migration

After migrating components, test your application in production mode to ensure everything works correctly:

```bash
npm run build
npm start
```

The updated middleware.ts file now removes `unsafe-inline` and `unsafe-eval` in production mode, so your application should work without these CSP directives.

## Troubleshooting

If you encounter issues after migration:

1. Check the browser console for any errors
2. Verify that you've updated all instances of the component
3. Make sure you're using the latest version of the vanilla components
4. Check that your CSS styles are properly applied

## Contributing

If you'd like to contribute additional vanilla components or improvements to existing ones, please follow the patterns established in the existing components.