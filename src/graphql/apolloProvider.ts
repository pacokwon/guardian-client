import { ApolloClient, DefaultOptions } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import VueApollo from 'vue-apollo';

const defaultOptions: DefaultOptions = {
  query: {
    fetchPolicy: 'network-only'
  }
};

const baseURL = process.env.VUE_APP_API_URL || '';

const apolloClient = new ApolloClient({
  link: createHttpLink({ uri: `${baseURL}/graphql` }),
  cache: new InMemoryCache(),
  defaultOptions
});

export const apolloProvider = new VueApollo({ defaultClient: apolloClient });
