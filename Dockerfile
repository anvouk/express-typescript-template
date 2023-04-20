ARG NODE_VERSION=18
ARG ALPINE_VERSION=3.17

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS builder

WORKDIR /build
COPY package.json yarn.lock tsconfig.json ./

# first set aside prod dependencies so we can copy in to the prod image
RUN yarn install --frozen-lockfile --non-interactive --ignore-scripts

COPY . .

RUN yarn build

# release includes bare minimum required to run the app, copied from builder
FROM alpine:${ALPINE_VERSION}

RUN apk add --no-cache nodejs

WORKDIR /app

COPY --from=builder /build/dist .

ENTRYPOINT ["node", "/app/index.js"]
