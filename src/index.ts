import { Request, Response, createHeaders, HeadersObject } from 'servie'
import { createBody } from 'servie/dist/body/universal'
import { parse as parseQuery } from 'querystring'
import { sendHtml } from 'servie-send'
import { GraphQLOptions, runHttpQuery } from 'apollo-server-core'
import { renderGraphiQL, GraphiQLData } from 'apollo-server-module-graphiql'

export type GraphQLOptionsFunction = (req: Request) => GraphQLOptions | Promise<GraphQLOptions>
export type ServieHandler = (req: Request) => Promise<Response>

/**
 * Create a GraphQL server endpoint.
 */
export function graphqlServie (options: GraphQLOptions | GraphQLOptionsFunction): ServieHandler {
  return async function (req: Request): Promise<Response> {
    const { method } = req
    const query = method === 'POST' ? await req.body.json() : parseQuery(req.Url.query as string)

    try {
      const request = { method, url: req.url, headers: req.headers as any }
      const gqlResponse = await runHttpQuery([req], { method, options, query, request })

      return new Response({
        headers: createHeaders(gqlResponse.responseInit.headers),
        body: createBody(gqlResponse.graphqlResponse)
      })
    } catch (err) {
      if (err.name !== 'HttpQueryError') throw err

      return new Response({
        statusCode: err.statusCode,
        headers: createHeaders(err.headers as HeadersObject),
        body: createBody(err.message as string)
      })
    }
  }
}

/**
 * Create a route for serving GraphiQL.
 */
export function graphiqlServie (options: GraphiQLData) {
  return async function (req: Request) {
    const { query, variables, operationName } = parseQuery(req.Url.query as string)

    const graphiQLString = renderGraphiQL({
      endpointURL: options.endpointURL,
      subscriptionsEndpoint: options.subscriptionsEndpoint,
      query: String(query) || options.query,
      variables: variables ? JSON.parse(String(variables)) : options.variables,
      operationName: String(operationName) || options.operationName,
      passHeader: options.passHeader
    })

    return sendHtml(req, graphiQLString)
  }
}
