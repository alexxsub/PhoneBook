//Express framework ###########################
import express from 'express';
import bodyParser from 'body-parser';//body парсер
import cors from 'cors';//кросс доменный доступ
import morgan from 'morgan';// логгер
import { createServer } from 'node:http';//http сервер

// WebSocket сервер ############################
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';// WebSocket GraphQL сервер

//Apollo QraphQL сервер  #######################
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';//Apollo как мидл сервис express
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';//плагин для завершения сервера
import { makeExecutableSchema } from '@graphql-tools/schema';//создание схем

//База данных ##################################
import  Phone from './models/Phone.js';//импортируем модель
import mongoose from 'mongoose';// ODM для MongoDB

//импортируем типы и резолвы ###################
import typeDefs from './types/index.js';
import resolvers from './resolvers/index.js';

//Получаем конфигурацию из .env
import dotenv from 'dotenv';
dotenv.config();

const API_URI = process.env.API_URI ||'/graphql'

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/PhoneBook',
      HOST = process.env.HOST || 'localhost',
      PORT = process.env.PORT || 9000;

//подключение к базе
async function ConnetMongoDB(){
  console.log(`Connecting... ${MONGO_URI}`);  
  await mongoose
    .connect(MONGO_URI)
    .then(() => console.log(`\u{1F47D} Have been connected ${MONGO_URI}`))
};


async function StartApollo(){

// создаем http сервер на основе express  
const app = express();
const httpServer = createServer(app);


// Создаем WebSocket сервер
const wsServer = new WebSocketServer({
// на основе http сервера
  server: httpServer,
  path: API_URI,
});
// активация вебсокет сервера
wsServer .on('listening', ()=> {
  console.log('\u{1F680} WebSocketServer is now listening!');
});
// подключение клиентов
wsServer.on('connection', (ws,req) => {
  const ip = req.socket.remoteAddress;
  console.log(`\u{1F60A} connected to ws from:${ip}`);
  
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    //  console.log(`received: ${data}`);
  });



});
// подключение клиентов
wsServer.on('connection', function connection(ws,req) {
  const ip = req.socket.remoteAddress;
  console.log(`\u{1F60A} connected to ws from:${ip}`);
  


});

//создаем схему  на основе типов и резолверов
const schema = makeExecutableSchema({ typeDefs, resolvers });
// идентификатор WebSocketServer .
const serverCleanup = useServer({ schema }, wsServer);

//создаем новый экземпляр Apollo сервера
const apolloServer = new ApolloServer({
  schema,
  plugins: [
    // Правильно завершаем HTTP сервер.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Правильно завершаем WebSocket сервер.
    {
      async serverWillStart() {
        // 🚀  - unicode U+1F680 https://symbl.cc/ru/1F680/
        console.log('\u{1F680} ApolloServer is now running!');
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
    {
      //логирование GraphQL запросов
      async requestDidStart(requestContext) {
        // console.log('Request started! Query:\n' + requestContext.request.query);

      },
    },
  
  ],
});

//экземпляр Apollo сервера запускаем
await apolloServer.start();

//К Express подключаем Apollo как мидлсервис
app.use(API_URI, 
        cors(),
        bodyParser.json(), 
        expressMiddleware(apolloServer,{
          context:()=> ({Phone}),
}));

// custom logger
// app.use(morgan('dev'))
/*app.use(
morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
})) */

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

//подключаем статическую сборку фронтенда
app.use('/', express.static('../phones-frontend-quasar/dist/spa'));


// стартуем сервер
  httpServer.listen(PORT,HOST, () => {
    console.log(`\u{1F6F8} HTTPServer is now running on http://${HOST}:${PORT}${API_URI}`);
  });
};

ConnetMongoDB().catch(err => console.log(err.message))
StartApollo().catch(err => console.log(err.message))

// sudo netstat -ntlp | grep 9000|awk '{print $7}'|cut -d "/" -f 1