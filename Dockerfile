ARG NODE_VERSION=node:18-alpine

FROM ${NODE_VERSION} AS builder

WORKDIR /build
COPY package.json yarn.lock tsconfig.json ./

# first set aside prod dependencies so we can copy in to the prod image
RUN yarn install --frozen-lockfile --non-interactive --production  --ignore-scripts
RUN cp -R node_modules /tmp/node_modules

# install all dependencies and add source code
RUN yarn install --frozen-lockfile --non-interactive --ignore-scripts
COPY . .

RUN yarn build

# release includes bare minimum required to run the app, copied from builder
FROM ${NODE_VERSION}
WORKDIR /app
COPY --from=builder /tmp/node_modules ./node_modules
COPY --from=builder /build/dist ./dist
COPY --from=builder /build/package.json ./

ENV NODE_ENV=production

ENTRYPOINT ["node", "."]
