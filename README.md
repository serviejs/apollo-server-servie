# GraphQL Server Servie

[![NPM version](https://img.shields.io/npm/v/graphql-server-servie.svg?style=flat)](https://npmjs.org/package/graphql-server-servie)
[![NPM downloads](https://img.shields.io/npm/dm/graphql-server-servie.svg?style=flat)](https://npmjs.org/package/graphql-server-servie)
[![Build status](https://img.shields.io/travis/serviejs/graphql-server-servie.svg?style=flat)](https://travis-ci.org/serviejs/graphql-server-servie)
[![Test coverage](https://img.shields.io/coveralls/serviejs/graphql-server-servie.svg?style=flat)](https://coveralls.io/r/serviejs/graphql-server-servie?branch=master)

> Production-ready Node.js GraphQL server for Servie.

## Installation

```
npm install graphql-server-servie --save
```

## Usage

Related: http://dev.apollodata.com/tools/graphql-server/index.html

```ts
import { compose } from 'throwback'
import { get, all } from 'servie-route'
import { graphqlServie, graphiqlServie } from 'graphql-server-servie'

const app = compose([
  all('/graphql', graphqlServie({ schema })),
  get('/graphiql', graphiqlServie({ endpointURL: `./graphql` }))
])
```

## TypeScript

This project is written using [TypeScript](https://github.com/Microsoft/TypeScript) and publishes the definitions directly to NPM.

## License

Apache 2.0
