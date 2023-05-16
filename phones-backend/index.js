import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import mongoose from 'mongoose';

import typeDefs from './types/index.js';
import resolvers from './resolvers/index.js';

//подключаемся к базе
const MONGO_URI = 'mongodb://localhost:27017/PhoneBook'
mongoose
  .connect(MONGO_URI)
  .then(() => console.log(`🚀  Database started ${MONGO_URI}`))
  .catch(err => console.error(err))


  //регистрируем схему и резолверы
const server = new ApolloServer({
    typeDefs,
    resolvers
  });

  //создаем экземляр сервера
const HOST = process.argv[2];
const PORT = process.argv[3];
const { url } = await startStandaloneServer(server, {
  listen: { host:HOST,port: PORT },
});

console.log(`🚀  Server ready at: ${url}`);


