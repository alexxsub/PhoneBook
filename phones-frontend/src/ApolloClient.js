//https://v4.apollo.vuejs.org/guide/installation.html#manual-installation

import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'

// HTTP соединение к API
const httpLink = createHttpLink({
  // Адрес API приложения
  uri: 'http://localhost:9000/graphql',
})

// Активируем кеш в памяти
const cache = new InMemoryCache()

// создаем экземпляр клиента
export const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
})