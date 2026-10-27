#!/usr/bin/env bash
set -e

# Install dependencies
npm install

# Approve native addon scripts
npm approve-scripts better-sqlite3 @prisma/engines prisma 2>/dev/null || true
npm rebuild better-sqlite3 --quiet 2>/dev/null || true

# Generate Prisma client
npx prisma db push
npx prisma generate

# Seed database
node prisma/seed.js
