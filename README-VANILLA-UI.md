# Vanilla UI Components for Nexum-Front

## Overview

This project now includes vanilla UI components that work without requiring `unsafe-inline` or `unsafe-eval` in your Content Security Policy (CSP). These components are designed to replace the Radix UI components that were previously causing issues in production mode.

## Key Features

- **Enhanced Security**: Works with strict CSP rules (no unsafe-inline or unsafe-eval)
- **Drop-in Replacements**: Similar API to existing components for easier migration
- **Fully Functional**: All interactive features work in both development and production
- **Accessible**: Maintains proper accessibility features

## Available Components

The following components have been implemented as vanilla alternatives:

- **Select**: A dropdown select component (`components/ui-vanilla/select.tsx`)
- **Dialog**: A modal dialog component (`components/ui-vanilla/dialog.tsx`)
- **Tabs**: A tabbed interface component (`components/ui-vanilla/tabs.tsx`)

## How to Use

1. Import components from the new location:

```tsx
import { Select, Dialog, Tabs } from "@/components/ui-vanilla"
```

2. Use them in your components with a similar API to the original components.

3. See the example component at `components/examples/vanilla-ui-example.tsx` for usage examples.

4. Visit the test page at `/vanilla-ui-test` to see the components in action.

## Migration Guide

A detailed migration guide is available at `docs/MIGRATION-GUIDE.md` to help you transition from Radix UI components to the new vanilla components.

## Content Security Policy

The `middleware.ts` file has been updated to remove `unsafe-inline` and `unsafe-eval` in production mode. In development mode, these are still allowed for a better developer experience.

## Testing

To verify that the components work correctly in production mode:

```bash
npm run build
npm start
```

Then visit the test page at `/vanilla-ui-test` to see the components in action.

## Implementation Details

The vanilla UI components are implemented using:

- React's built-in hooks and APIs
- Standard DOM elements and events
- CSS classes for styling (via Tailwind CSS)
- No dependencies that require unsafe CSP directives

For more details, see the README in the `components/ui-vanilla` directory.