// © 2023 Alexx Sub, https://github.com/alexxsub/PhoneBook
import { GraphQLError } from 'graphql';
import { PubSub } from 'graphql-subscriptions';

// публикатор сообщений
const pubsub = new PubSub();

// Описываем методы бэкенда
export default {
    Query: {
      readPhones: async (_,__,{Phone}) => {
        const phones = await Phone.find()
        // .limit(50)
  
        return phones
      }
    },
    Mutation: {
      createPhone:async (_, { input },{Phone}) => {
        delete input.id
        const res = await new Phone( 
          input
        ).save()
        .catch((e)=> {
          if (e.code==11000)
            throw new GraphQLError(`Номер ${input.number} уже есть в базе`)
          else 
            throw new GraphQLError(e.message)
        })
     
        if (res) {
          pubsub.publish('createdPhone', { createdPhone: res });
          return res;
        }
 
      },
      deletePhone: async (_, { id },{Phone}) => {
        const res= await Phone.findByIdAndRemove({
          _id: id
        })
        .catch((e)=> {
          throw new GraphQLError(e.message)
        })
        if (res)
          {
           pubsub.publish('deletedPhone', { deletedPhone: res });
           return res
          }
          else 
             throw new GraphQLError(`Записи с id ${id} нет в базе!`)
         
       
      },
      updatePhone:async (_, { input },{Phone}) => {
        const _id =input.id
        delete input.__typename
        delete input.id
        const res = await Phone.findOneAndUpdate({
          _id
        }, {
          $set: input
        }, {
          new: true
        })
        .catch((e)=> {
          throw new GraphQLError(e.message)
        })
        if (res)
        {
          pubsub.publish('updatedPhone', { updatedPhone: res });
          return res
        }
        else 
            throw new GraphQLError(`Записи с номером ${input.number} нет в базе!`)
      
    },
  },
  // Подписки на изменения
    Subscription: {
      createdPhone: {
        subscribe: ()=> {
          return pubsub.asyncIterator(['createdPhone'])
        }
      },
      updatedPhone: {
        subscribe: ()=> {
          return pubsub.asyncIterator(['updatedPhone'])
        }
      },
      deletedPhone: {
        subscribe: ()=>{
          return pubsub.asyncIterator(['deletedPhone'])
        }
      }
    }

  };