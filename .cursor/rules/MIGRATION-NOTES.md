# Prisma 7 + Next.js 15 Migration Notes

This document summarizes the compatibility requirements and fixes applied to prevent webpack and runtime errors when using Prisma 7 with Next.js 15.

## Issues Fixed

### 1. Webpack Error: `Reading from "node:crypto" is not handled by plugins`

**Root Cause**: 
- Prisma 7 uses Node.js built-in modules with the `node:` protocol (`node:crypto`, `node:buffer`)
- Next.js middleware runs in Edge Runtime by default, which doesn't support these built-ins
- When middleware imports `lib/auth.ts` → `lib/db.ts` → Prisma, it fails

**Solution**:
- Add `runtime: "nodejs"` to `middleware.ts` config
- Properly externalize Prisma in `next.config.mjs`

### 2. Next.js 15 Async SearchParams

**Root Cause**:
- Next.js 15 changed `searchParams` from synchronous to async (returns a Promise)
- Pages using the old synchronous pattern fail type checking

**Solution**:
- Type `searchParams` as `Promise<{...}>`
- Use `await` to destructure values

## Configuration Requirements

### `next.config.mjs`

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        '@prisma/client': 'commonjs @prisma/client',
        'pg-native': 'commonjs pg-native',
        'pg-pool': 'commonjs pg-pool',
        'bcryptjs': 'commonjs bcryptjs',
      })
    }
    return config
  },
  serverExternalPackages: [
    '@prisma/client',
    '@prisma/adapter-pg',
    'pg',
    'pg-pool',
    'bcryptjs',
  ],
}

export default nextConfig
```

### `middleware.ts`

```ts
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  // middleware logic
})

export const config = {
  matcher: ["/dashboard/:path*"],
  runtime: "nodejs", // REQUIRED when using Prisma
}
```

### Page Components (Next.js 15)

```ts
// ❌ Old pattern (Next.js 14)
interface PageProps {
  searchParams: { id?: string }
}

export default async function Page({ searchParams }: PageProps) {
  const id = searchParams.id
}

// ✅ New pattern (Next.js 15)
interface PageProps {
  searchParams: Promise<{ id?: string }>
}

export default async function Page({ searchParams }: PageProps) {
  const { id } = await searchParams
}
```

## Rules & Skills Updated

### Rules Created/Updated
1. **`nextjs-patterns.mdc`** - Added Next.js 15 searchParams requirement and middleware runtime notes
2. **`data-layer.mdc`** - Added Prisma 7 + Next.js 15 compatibility section
3. **`nextjs-config.mdc`** - New rule documenting webpack configuration and common errors

### Skills Updated
1. **`new-page`** - Updated for Next.js 15 async searchParams
2. **`new-auth-page`** - Added middleware runtime requirements
3. **`new-middleware`** - New skill for creating middleware with Prisma compatibility

## Checklist for New Features

When creating new pages or middleware, verify:

- [ ] `searchParams` typed as `Promise<{...}>` and awaited (pages only)
- [ ] Middleware has `runtime: "nodejs"` if using Prisma/database
- [ ] `next.config.mjs` properly externalizes Prisma and pg packages
- [ ] No client-side imports of Prisma or database modules
- [ ] Build completes without webpack errors
- [ ] Dev server compiles without `node:` protocol errors

## Testing the Fix

```bash
# Clear build cache
rm -rf .next

# Test build
npm run build

# Should complete successfully with no webpack errors
# Look for: ✓ Compiled successfully
```

## Additional Resources

- Next.js 15 Migration Guide: https://nextjs.org/docs/app/building-your-application/upgrading/version-15
- Prisma 7 Release Notes: https://www.prisma.io/docs/about/prisma/releases
- NextAuth.js v5 (Auth.js): https://authjs.dev/getting-started/installation
