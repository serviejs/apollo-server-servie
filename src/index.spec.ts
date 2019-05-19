import { graphqlServie, graphiqlServie } from "./index";
import { Request } from "servie/dist/node";
import { GraphQLSchema, GraphQLString, GraphQLObjectType } from "graphql";

describe("graphql server servie", () => {
  describe("graphql", () => {
    const queryType = new GraphQLObjectType({
      name: "QueryType",
      fields: {
        testString: {
          type: GraphQLString,
          resolve: () => "it works"
        }
      }
    });

    const schema = new GraphQLSchema({
      query: queryType
    });

    const handler = graphqlServie({ schema });

    it("should respond to graphql queries", async () => {
      const req = new Request("/", {
        method: "POST",
        body: JSON.stringify({
          query: "{testString}"
        })
      });

      const res = await handler(req);
      const body = await res.text();

      expect(res.headers.get("Content-Type")).toEqual("application/json");
      expect(body).toEqual('{"data":{"testString":"it works"}}\n');
    });
  });

  describe("graphiql", () => {
    const handler = graphiqlServie({ endpointURL: "/graphql" });

    it("should serve graphiql", async () => {
      const req = new Request("/");
      const res = await handler(req);

      expect(res.headers.get("Content-Type")).toBe("text/html");
    });
  });
});
