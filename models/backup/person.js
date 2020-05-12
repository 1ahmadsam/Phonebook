const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@phonebook-uvjxg.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Phone = mongoose.model('Phone', phoneSchema);

if (process.argv.length === 5) {
  const phoneName = process.argv[3];
  const phoneNumber = process.argv[4];

  const phone = new Phone({
    name: phoneName,
    number: phoneNumber,
  });

  phone.save().then((response) => {
    console.log(`added ${phoneName} number ${phoneNumber} to phonebook`);
    mongoose.connection.close();
  });
}

Phone.find({}).then((result) => {
  console.log('phonebook:');
  result.forEach((phone) => {
    console.log(phone.name, phone.number);
  });
  mongoose.connection.close();
});
