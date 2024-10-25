ARG NODE_VERSION=20
ARG ALPINE_VERSION=3.20

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS builder

WORKDIR /build
COPY package.json package-lock.json tsconfig.json ./

# first set aside prod dependencies so we can copy in to the prod image
RUN npm ci --ignore-scripts

COPY . .

RUN npm run build

# release includes bare minimum required to run the app, copied from builder
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION}

WORKDIR /app

COPY --from=builder /build/dist .

ENTRYPOINT ["node", "--enable-source-maps", "/app/index.js"]
