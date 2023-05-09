import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import crypto  from 'crypto';

// Описываем схему, используя sdl язык
const typeDefs = `#graphql
  type Phone {
    """
    id записи
    """
    id: String
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
    id:String
    number: String!
    name: String
  }

  type Mutation {
  """
  Добавить запись телефона 
  """
    createPhone(input: inputPhone): [Phone] #example with input type
  """
  Удалить запись о телефоне
  """
    deletePhone(id: String): [Phone]
  """
  Обновить запись о телефоне
  """
    updatePhone(input: inputPhone): [Phone] #example with separated params
  }
`;

//пример данных, массив с телефонами
var _phones = [
    { number: "5555", name: "John" },
    { number: "6666", name: "Bill" },
    { number: "7777", name: "Smith" },
    { number: "1234", name: "Sara" }
  ];

//доббавляем в демо данные id
_phones.map(i=>i.id=crypto.randomBytes(16).toString("hex"));

// Описываем резолвер для метода просмотра


const resolvers = {
    Query: {
      readPhones: () => _phones
    },
    Mutation: {
      createPhone: (_, { input }) => {
        input.id=crypto.randomBytes(16).toString("hex")
        _phones.push(input);
        return _phones;
      },
      deletePhone: (_, { id }) => {
        _phones.splice(_phones.findIndex(x => x.id === id), 1);
        return _phones;
      },
      updatePhone: (_, { input }) => {
        const index = _phones.findIndex(x => x.id === input.id);     
       _phones.splice(index, 1,  input );
        return _phones;
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


