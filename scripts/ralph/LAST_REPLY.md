

Fresh scaffold for US-001 — complete Next.js App Router + TS project files (previous iterations emitted nothing).

### FILE: package.json
```json
{
  "name": "china-v-america",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^14.2.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/node": "^20.14.0",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.5.3"
  }
}
```
### END FILE

### FILE: tsconfig.json
```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```
### END FILE

### FILE: next.config.mjs
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
```
### END FILE

### FILE: .gitignore
```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# typescript
*.tsbuildinfo
```
### END FILE

### FILE: src/app/globals.css
```css
:root {
  --bg: #050505;
  --fg: #f4efe6;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
}

body {
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-noto-serif-sc), "Noto Serif SC", serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

.homepage {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem;
  text-align: center;
}

.homepage h1 {
  margin: 0;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  letter-spacing: -0.01em;
}

.homepage p {
  margin: 0;
  font-size: clamp(1rem, 1.5vw, 1.25rem);
  opacity: 0.8;
}
```
### END FILE

### FILE: src/app/layout.tsx
```tsx
import type { Metadata } from "next";
import { Noto_Serif_SC } from "next/font/google";
import "./globals.css";

const notoSerifSc = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  style: ["normal"],
  display: "swap",
  variable: "--font-noto-serif-sc",
});

export const metadata: Metadata = {
  title: "China vs. America — The AI Race",
  description:
    "A cinematic, side-by-side comparison of the American and Chinese artificial intelligence stacks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={notoSerifSc.variable}>
      <body>{children}</body>
    </html>
  );
}
```
### END FILE

### FILE: src/app/page.tsx
```tsx
export default function HomePage() {
  return (
    <main className="homepage">
      <h1>China vs. America</h1>
      <p>The AI race, compared lab by lab.</p>
    </main>
  );
}
```
### END FILE

VERIFY: npm install && npm run build && (npx next start -p 3123 >/tmp/china-v-america-start.log 2>&1 & SERVER_PID=$!; CODE=000; for i in 1 2 3 4 5 6 7 8 9 10; do CODE=$(curl -sS -o /dev/null -w "%{http_code}" http://localhost:3123 || true); if [ "$CODE" = "200" ]; then break; fi; sleep 1; done; kill "$SERVER_PID" >/dev/null 2>&1 || true; [ "$CODE" = "200" ])