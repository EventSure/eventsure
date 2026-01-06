# EventSure Client

A Web3-based client application for event insurance services.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Preview Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

## Project Structure

```
src/
├── components/       # UI Components
│   ├── common/       # Common components (Button, Card)
│   ├── dashboard/    # Dashboard components
│   ├── layout/       # Layout (Header, Footer)
│   ├── sections/     # Page section components
│   └── WorldMap/     # World map components
├── config/           # Configuration (wagmi, queryClient)
├── i18n/             # i18n settings and translation files
├── pages/            # Page components
├── providers/        # Context Providers
├── router/           # Router configuration
├── services/         # API services
├── styles/           # Global styles and theme
└── types/            # TypeScript type definitions
```

## Tech Stack

### Core

- **React 19** - UI Library
- **TypeScript** - Type Safety
- **Vite 7** - Build Tool & Dev Server

### Web3

- **wagmi** - React Hooks for Ethereum
- **viem** - TypeScript Ethereum Library
- **RainbowKit** - Wallet Connection UI

### Styling & Animation

- **Emotion** - CSS-in-JS Styling
- **Framer Motion** - Animation

### State & Data

- **TanStack Query** - Server State Management
- **Axios** - HTTP Client

### Routing & i18n

- **React Router DOM** - Routing
- **i18next / react-i18next** - Internationalization (Korean, English)
