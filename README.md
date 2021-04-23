# velofolio

> [velofolio](https://www.velofolio.net) is yet another U.S. Stock backtest simulator tool. You can easily share your backtest or explore other's backtest within service. This service is currently in beta stage.

This project is a monorepo of the velofolio service. It contains client & server projects.

## Project Stack

### Web

Web project is built with React. Following awesome libraries & technologies are used in this project:

- Recoil
- React Query
- React Router
- TypeScript
- Emotion
- EChart

This web project is deployed via Vercel.

### Server

Server project is built with Fastify and TypeORM. Fuse.js is used for the stock search engine. Chart.js is used for the server-generated chart image.

MariaDB is used for the database. Server is currently running on AWS.

## Datasets

Historical prices / Stock information is provided from https://financialmodelingprep.com/

## Contributions

Any kinds of contributions are welecomed.
