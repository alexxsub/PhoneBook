import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import mongoose from 'mongoose';
//описываем схему базы данных
const PhoneSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true
  }
})
//подключаемся к базе данных
const Phone = mongoose.model('Phone', PhoneSchema)

const MONGO_URI = 'mongodb://localhost:27017/PhoneBook'
mongoose
  .connect(MONGO_URI)
  .then(() => console.log(`🚀  Database started ${MONGO_URI}`))
  .catch(err => console.error(err))


// Описываем схему, используя sdl язык
const typeDefs = `#graphql
  type Phone {
    """
    id записи
    """
    id: ID
    """
    Номмер телефона
    """
    number: String
    """
    Имя владельца телефона
    """
    name: String
  }
  """
  Получить список всех телефонов
  """
  type Query {
    readPhones: [Phone]
  } 
  """
  Специальный тип данных для ввода
  """
  input inputPhone {
    id:ID
    number: String!
    name: String
  }

  type Mutation {
  """
  Добавить запись телефона 
  """
    createPhone(input: inputPhone): Phone 
  """
  Удалить запись о телефоне
  """
    deletePhone(id: ID): Phone
  """
  Обновить запись о телефоне
  """
    updatePhone(input: inputPhone): Phone 
  }
`;



// Описываем резолвер для метода просмотра


const resolvers = {
    Query: {
      readPhones: async () => {
        const phones = await Phone.find()
        // .limit(50)
  
        return phones
      }
    },
    Mutation: {
      createPhone:async (_, { input }) => {
        const res = await new Phone( {
          number:input.number,
          name:input.name
        }).save()
     
        return res
      },
      deletePhone: async (_, { id }) => {
        const res = await Phone.findByIdAndRemove({
          _id: id
        })
  
        return res
      },
      updatePhone:async (_, { input }) => {
        const res = await Phone.findOneAndUpdate({
          _id: input.id
        }, {
          $set: {
            number: input.number,
            name: input.name
          }
        }, {
          new: true
        }
        )
        return res
    }
  }
  };

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


