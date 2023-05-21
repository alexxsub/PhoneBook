import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import mongoose from 'mongoose';
//импортируем типы и резолвы
import typeDefs from './types/index.js';
import resolvers from './resolvers/index.js';

//Получаем конфигурацию из .env
import dotenv from 'dotenv';
dotenv.config();

export const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/PhoneBook',
      HOST = process.env.HOST || 'localhost',
      PORT = process.env.PORT || 9000;

//подключение к базе
async function ConnetMongoDB(){
  console.log(`Connecting... ${MONGO_URI}`);  
  await mongoose
    .connect(MONGO_URI)
    .then(() => console.log(`🚀 Have been connected ${MONGO_URI}`))
};



  //создаем экземляр сервера

async function StartApollo(){
//регистрируем схему и резолверы, сохдаем экземпляр сервера
  const server = new ApolloServer({
    typeDefs,
    resolvers
  });

  await startStandaloneServer(server, {
    listen: { host:HOST,port: PORT },
  })
  .then(({ url } ) =>console.log(`🚀  Apollo GraphQL server ready at: ${url}`));
};

ConnetMongoDB().catch(err => console.error(err.message))
StartApollo().catch(err => console.error(err.message))
