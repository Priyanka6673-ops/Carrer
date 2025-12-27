# 1. Installer Stage: Install dependencies
FROM node:20-alpine AS installer
WORKDIR /app

COPY package*.json ./
RUN npm install

# 2. Builder Stage: Build the Next.js application
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=installer /app/node_modules ./node_modules
COPY . .

# Environment variables must be available at build time
# If you have build-time env vars, you would add them here.
# Ex: ARG NEXT_PUBLIC_SOME_VAR
# ENV NEXT_PUBLIC_SOME_VAR=$NEXT_PUBLIC_SOME_VAR
RUN npm run build

# 3. Runner Stage: Prepare the final, minimal production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Disable server-side telemetry for Next.js
ENV NEXT_TELEMETRY_DISABLED 1

# Copy the standalone output from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# The standalone output mode creates a server.js file to run the app
CMD ["node", "server.js"]
