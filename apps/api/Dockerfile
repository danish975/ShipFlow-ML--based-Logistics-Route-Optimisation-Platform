FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
COPY packages/types ./packages/types
COPY apps/api ./apps/api
COPY prisma ./prisma

RUN npm ci
RUN npm run prisma:generate
RUN npm run build:types
RUN npm run build -w apps/api

FROM node:20-alpine AS production

WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/types/dist ./packages/types/dist
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "apps/api/dist/main"]
