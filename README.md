# Apollo Server Servie

[![NPM version](https://img.shields.io/npm/v/apollo-server-servie.svg?style=flat)](https://npmjs.org/package/apollo-server-servie)
[![NPM downloads](https://img.shields.io/npm/dm/apollo-server-servie.svg?style=flat)](https://npmjs.org/package/apollo-server-servie)
[![Build status](https://img.shields.io/travis/serviejs/apollo-server-servie.svg?style=flat)](https://travis-ci.org/serviejs/apollo-server-servie)
[![Test coverage](https://img.shields.io/coveralls/serviejs/apollo-server-servie.svg?style=flat)](https://coveralls.io/r/serviejs/apollo-server-servie?branch=master)

> Production-ready Node.js GraphQL server for Servie.

## Installation

```
npm install apollo-server-servie --save
```

## Usage

Related: https://www.apollographql.com/docs/apollo-server/

```ts
import { compose } from "throwback";
import { get, all } from "servie-route";
import { graphqlServie, graphiqlServie } from "apollo-server-servie";

const app = compose([
  all("/graphql", graphqlServie({ schema })),
  get("/graphiql", graphiqlServie({ endpointURL: `./graphql` }))
]);
```

## TypeScript

This project is written using [TypeScript](https://github.com/Microsoft/TypeScript) and publishes the definitions directly to NPM.

## License

Apache 2.0
