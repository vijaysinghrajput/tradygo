# @tradygo/ui

A comprehensive React UI component library built with TypeScript, Tailwind CSS, and Radix UI primitives.

## Features

- 🎨 **Modern Design System** - Built with Tailwind CSS and CSS custom properties
- 🧩 **Modular Components** - Tree-shakeable exports for optimal bundle size
- ♿ **Accessible** - Built on Radix UI primitives with ARIA compliance
- 🎯 **TypeScript First** - Full type safety and IntelliSense support
- 🌙 **Dark Mode Ready** - CSS custom properties for easy theming
- 📱 **Responsive** - Mobile-first design approach

## Installation

```bash
pnpm add @tradygo/ui
```

## Usage

### Basic Example

```tsx
import { Button, Card, CardHeader, CardTitle, CardContent } from '@tradygo/ui';

function App() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to TradyGo</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Get Started</Button>
      </CardContent>
    </Card>
  );
}
```

### Styling

Import the global styles in your app:

```tsx
import '@tradygo/ui/dist/styles/globals.css';
```

## Components

### Layout Components

- **Container** - Responsive container with max-width constraints
- **Section** - Semantic section wrapper with spacing options
- **PageHeader** - Page header with title, description, and actions
- **PageTitle** - Styled page titles with gradient variants
- **Breadcrumbs** - Navigation breadcrumb component

### Navigation Components

- **TopNav** - Top navigation bar with logo, nav, and actions
- **SideNav** - Sidebar navigation with items and groups
- **MobileNav** - Mobile-responsive navigation drawer
- **UserMenu** - User profile dropdown menu

### Form Components

- **Button** - Versatile button with multiple variants and sizes
- **Input** - Styled text input with focus states
- **Checkbox** - Accessible checkbox component
- **Switch** - Toggle switch component

### Data Display

- **Card** - Flexible card container with header, content, and footer
- **Badge** - Status and category badges
- **Alert** - Alert messages with different severity levels
- **Avatar** - User avatar with image and fallback
- **Table** - Data table components
- **Tabs** - Tabbed interface components
- **Stat** - Statistics display component
- **Progress** - Progress bar with customizable appearance
- **Spinner** - Loading spinner component

### Overlay Components

- **DropdownMenu** - Dropdown menu with items and separators

## Component Variants

Most components support multiple variants and sizes:

```tsx
// Button variants
<Button variant="default">Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Button sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>

// Badge variants
<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="info">Info</Badge>
```

## Theming

The library uses CSS custom properties for theming. You can customize the design system by overriding these variables:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  /* ... more variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark mode variables */
}
```

## Development

```bash
# Install dependencies
pnpm install

# Build the package
pnpm build

# Watch for changes
pnpm dev

# Lint code
pnpm lint
```

## License

MIT# Force Vercel to use latest commit - Wed Aug 13 17:56:38 IST 2025
