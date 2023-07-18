import mongoose  from 'mongoose';

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
    },
    address: {
      type: String
    }
  });

//формируем  модель
 const Phone = mongoose.model('Phone', PhoneSchema);
 export default Phone;