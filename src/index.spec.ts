import { graphqlServie, graphiqlServie } from './index'
import { Request } from 'servie'
import { createBody } from 'servie/dist/body/universal'
import { GraphQLSchema, GraphQLString, GraphQLObjectType } from 'graphql'

describe('graphql server servie', () => {
  describe('graphql', () => {
    const queryType = new GraphQLObjectType({
      name: 'QueryType',
      fields: {
        testString: {
          type: GraphQLString,
          resolve: () => 'it works'
        }
      }
    })

    const schema = new GraphQLSchema({
      query: queryType
    })

    const handler = graphqlServie({ schema })

    it('should respond to graphql queries', async () => {
      const req = new Request({
        url: '/',
        method: 'POST',
        body: createBody({
          query: '{testString}'
        })
      })

      const res = await handler(req)
      const body = await res.body.text()

      expect(res.headers.get('Content-Type')).toEqual('application/json')
      expect(body).toEqual('{"data":{"testString":"it works"}}')
    })
  })

  describe('graphiql', () => {
    const handler = graphiqlServie({ endpointURL: './graphql' })

    it('should serve graphiql', async () => {
      const req = new Request({ url: '/' })
      const res = await handler(req)

      expect(res.headers.get('Content-Type')).toBe('text/html')
    })
  })
})
