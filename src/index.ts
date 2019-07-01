import { Request, Response } from "servie/dist/node";
import { parse } from "url";
import { sendHtml } from "servie-send";
import { GraphQLOptions, runHttpQuery } from "apollo-server-core";
import { renderGraphiQL, GraphiQLData } from "apollo-server-module-graphiql";

export type GraphQLOptionsFunction<T extends Request> = (
  req: T
) => GraphQLOptions | Promise<GraphQLOptions>;

export type ServieHandler<T extends Request> = (req: T) => Promise<Response>;

/**
 * Create a GraphQL server endpoint.
 */
export function graphqlServie<T extends Request>(
  options: GraphQLOptions | GraphQLOptionsFunction<T>
): ServieHandler<T> {
  return async function(req: T): Promise<Response> {
    const { method } = req;
    const query =
      method === "POST" ? await req.json() : parse(req.url, true).query;

    const request = { method, url: req.url, headers: req.headers as any };

    try {
      const gqlResponse = await runHttpQuery([req], {
        method,
        options,
        query,
        request
      });

      return new Response(gqlResponse.graphqlResponse, {
        headers: gqlResponse.responseInit.headers
      });
    } catch (err) {
      if (err.name !== "HttpQueryError") throw err;

      return new Response(err.message, {
        status: err.statusCode,
        headers: err.headers
      });
    }
  };
}

/**
 * Create a route for serving GraphiQL.
 */
export function graphiqlServie(options: GraphiQLData) {
  return async function(req: Request) {
    const { query, variables, operationName } = parse(req.url, true).query;

    const graphiQLString = renderGraphiQL({
      endpointURL: options.endpointURL,
      subscriptionsEndpoint: options.subscriptionsEndpoint,
      query: String(query) || options.query,
      variables: variables ? JSON.parse(String(variables)) : options.variables,
      operationName: String(operationName) || options.operationName,
      passHeader: options.passHeader
    });

    return sendHtml(req, graphiQLString);
  };
}
