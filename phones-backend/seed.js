import mongoose from 'mongoose';
import { faker } from '@faker-js/faker'
import Phone from './models/Phone.js'

import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/PhoneBook'

mongoose
  .connect(MONGO_URI)
  .then(() => console.log(`🚀  Database started ${MONGO_URI}`))
  .catch(err => console.error(err))

function createRandomPhone() {
  return {
    name: faker.person.fullName(),
    number:faker.phone.number('###-###-###'),
    address:faker.location.streetAddress({ useFullAddress: true })
  };
}

const Phones = faker.helpers.multiple(createRandomPhone, {
  count: 100,
});
Phone.insertMany(Phones)
    .then( (docs)=> {
        console.log('Done!');
        mongoose.connection.close() ;
    })
    .catch( (err)=> {
       console.log(err.message);
    });
