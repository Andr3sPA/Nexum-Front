# UdeA Graduates Application

A comprehensive web application for Universidad de Antioquia graduates to manage their personal, academic, and professional information.

## Features

- **User Authentication**: Secure login and registration system
- **Profile Management**: Comprehensive profile with multiple information sections
- **Always-Visible Navigation**: User profile icon always visible in navigation
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Modern UI**: Built with React, Next.js, and Tailwind CSS
- **Atomic Design**: Well-structured component architecture
- **Clean Development**: Minimal terminal output during development

## Getting Started

### Prerequisites

- Node.js 18.17.0 or higher
- npm or yarn package manager

### Installation

1. Clone or extract the project
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Key Features

### Navigation
- **Always-visible profile icon** with user initials
- **Responsive design** that works on all screen sizes
- **Clean, professional appearance** following UdeA branding
- **Smooth hover effects** and transitions

### Development Experience
- **Minimal terminal output** during development
- **Clean console** without project name/version spam
- **Fast hot reload** for efficient development
- **TypeScript support** with proper error handling

## Project Structure

\`\`\`
udea-graduates-app/
├── app/                    # Next.js app directory
├── components/             # React components
│   ├── atoms/             # Basic UI elements
│   ├── molecules/         # Simple component combinations
│   ├── organisms/         # Complex components
│   ├── templates/         # Page layouts
│   └── ui/               # Base UI components
├── lib/                   # Utility functions
└── public/               # Static assets
\`\`\`

## Available Scripts

- `npm run dev` - Start development server (quiet mode)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Technology Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Icons**: Lucide React

## Universidad de Antioquia Branding

The application follows UdeA's official design guidelines:
- **Primary Color**: #014926 (UdeA Green)
- **Typography**: Roboto, Cooper Hewitt, Arial Narrow
- **Professional appearance** suitable for university use
- **Accessible design** following WCAG guidelines

## Contributing

1. Follow the atomic design methodology
2. Maintain TypeScript strict mode
3. Use Tailwind CSS for styling
4. Follow the established naming conventions
5. Ensure responsive design across all components

## License

This project is developed for Universidad de Antioquia.
