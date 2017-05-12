import { Request, Response } from 'servie'
import { parse as parseQuery } from 'querystring'
import { send } from 'servie-send'
import { parse } from 'get-body'
import { GraphQLOptions, runHttpQuery } from 'graphql-server-core'
import { renderGraphiQL, GraphiQLData } from 'graphql-server-module-graphiql'

export type GraphQLOptionsFunction = (req: Request) => GraphQLOptions | Promise<GraphQLOptions>
export type ServieHandler = (req: Request) => Promise<Response>

/**
 * Create a GraphQL server endpoint.
 */
export function graphqlServie (options: GraphQLOptions | GraphQLOptionsFunction): ServieHandler {
  return async function (req: Request): Promise<Response> {
    const { method } = req
    const query = method === 'POST' ? await parse(req.stream(), req.headers.object()) : parseQuery(req.Url.query)

    try {
      const gqlResponse = await runHttpQuery([req], { method, options, query })

      return new Response({
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(gqlResponse).toString()
        },
        body: gqlResponse
      })
    } catch (err) {
      if (err.name !== 'HttpQueryError') {
        throw err
      }

      return new Response({
        headers: err.headers,
        status: err.statusCode,
        body: err.message
      })
    }
  }
}

/**
 * Create a route for serving GraphiQL.
 */
export function graphiqlServie (options: GraphiQLData) {
  return async function (req: Request) {
    const { query, variables, operationName } = parseQuery(req.Url.query)

    const graphiQLString = renderGraphiQL({
      endpointURL: options.endpointURL,
      subscriptionsEndpoint: options.subscriptionsEndpoint,
      query: query || options.query,
      variables: variables && JSON.parse(variables) || options.variables,
      operationName: operationName || options.operationName,
      passHeader: options.passHeader
    })

    return send(req, graphiQLString, { type: 'text/html' })
  }
}
