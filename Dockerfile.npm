ARG NODE_VERSION=node:18-alpine

FROM ${NODE_VERSION} AS builder

WORKDIR /build
COPY package.json package-lock.json tsconfig.json ./

# first set aside prod dependencies so we can copy in to the prod image
RUN npm ci --only=prod --ignore-scripts
RUN cp -R node_modules /tmp/node_modules

# install all dependencies and add source code
RUN npm install --ignore-scripts
COPY . .

RUN npm run build

# release includes bare minimum required to run the app, copied from builder
FROM ${NODE_VERSION}
WORKDIR /app
COPY --from=builder /tmp/node_modules ./node_modules
COPY --from=builder /build/dist ./dist
COPY --from=builder /build/package.json ./

ENV NODE_ENV=production

ENTRYPOINT ["node", "."]
