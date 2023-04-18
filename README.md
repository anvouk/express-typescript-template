# express-typescript-template

Personal NodeJS template for express webapis.

## Features

- Fully written in TypeScript
- Full typings everywhere
- Sensible `tsconfig.json`
- Error handling
- JSON Logging (pino) with pretty print during dev
- Docker support (both `Yarn` and `NPM`)
- Express routing
- Controllers/Services/Routes structure
- Development HotReload (ts-node-dev)
- Unit testing (jest with `*.spec.ts` files)
- [Volta](https://volta.sh/) support
- Automatic files formatting on-commit with sensible defaults (prettier/pretty-quick/husky)
- Express common middlewares included (morgan, etc)
- Basic auth guard system
- Postgres-ready (no ORMs)
- Redis-ready
- SIGTERM, SIGINT intercept for cleaner and faster shutdowns
- HTTP validation (express-validator)
- EditorConfig support
- Very fast and optimized build with [esbuild](https://esbuild.github.io/)
