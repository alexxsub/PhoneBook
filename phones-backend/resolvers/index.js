// © 2023 Alexx Sub, https://github.com/alexxsub/PhoneBook
//импортируем модель
import  Phone from '../models/Phone.js';

// Описываем методы бэкенда
export default {
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