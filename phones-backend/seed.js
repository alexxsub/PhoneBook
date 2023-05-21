import mongoose from 'mongoose';
import Phone from './models/Phone.js'

//Получаем конфигурацию из .env
import dotenv from 'dotenv';
dotenv.config();

export const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/PhoneBook',
      HOST = process.env.HOST || 'localhost',
      PORT = process.env.PORT || 9000;

//подключаем базу
 mongoose
  .connect(MONGO_URI)
  .then(() => console.log(`🚀  Database started ${MONGO_URI}`))
  .catch(err => console.error(err))


const array = [
    {number: "1111", name: "Дарт Вейдер"},
    {number: "2222", name: "Люк Скайуокер"},
    {number: "3333", name: "Падме Амидала"},
];

Phone.insertMany(array)
    .then( (docs)=> {
        console.log(docs);
        mongoose.connection.close() ;
    })
    .catch( (err)=> {
       console.log(err.message);
    });