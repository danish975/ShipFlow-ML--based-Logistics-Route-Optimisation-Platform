FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
COPY packages/types ./packages/types
COPY apps/web ./apps/web

RUN npm ci
RUN npm run build:types
RUN npm run build -w apps/web

FROM node:20-alpine AS production

WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public

ENV NODE_ENV=production
EXPOSE 3001

CMD ["npm", "start", "-w", "apps/web"]
