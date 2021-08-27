import ApolloClient from 'apollo-boost';

export default new ApolloClient({
  uri: process.env.HASURA_GRAPHQL,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'x-hasura-admin-secret': process.env.HASURA_TOKEN,
  }
});
