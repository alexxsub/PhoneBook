// https://v4.apollo.vuejs.org/guide-option/subscriptions.html#the-new-library-graphql-ws

import { createHttpLink, InMemoryCache,split } from '@apollo/client/core'
import { GraphQLWsLink } from "@apollo/client/link/subscriptions"
import { getMainDefinition } from "@apollo/client/utilities"
import { createClient } from "graphql-ws";


//линк на вебсокет
const wsLink = new GraphQLWsLink(
  createClient({

    url: process.env.WS_URI ||
        'ws://localhost:9002/graphql',
  })
);
// линк на http
const httpLink = new createHttpLink({
  uri:  process.env.GRAPHQL_URI ||
        'http://localhost:9002/graphql',
});
// общий линк
// первая ссылка используется, когда условие true, иначе вторая
const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

// экспортируем паратметры для подключения
export /* async */ function getClientOptions(/* {app, router, ...} */ options) {
  return Object.assign(
    // General options.
    {
      link,
      cache: new InMemoryCache(),
      connectToDevTools: true,
    },

  )
}
