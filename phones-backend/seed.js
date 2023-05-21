import mongoose from 'mongoose';
import Phone from './models/Phone.js'

const MONGO_URI = 'mongodb://localhost:27017/PhoneBook'
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