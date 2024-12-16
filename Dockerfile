FROM node:22-alpine AS base

FROM base AS builder

WORKDIR /build
COPY package.json package-lock.json tsconfig.json ./

RUN npm ci --ignore-scripts

COPY . .

RUN npm run build

# release includes bare minimum required to run the app, copied from builder
FROM base

WORKDIR /app

COPY --from=builder /build/dist .

ENTRYPOINT ["node", "--enable-source-maps", "/app/index.js"]
