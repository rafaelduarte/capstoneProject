const mongoose = require('mongoose');
const dbURI =
  'mongodb+srv://apiQandA:klQTmPmc6ucUMBfE@cluster0.pnfvj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'qadb',
});

mongoose.connection.on('connected', () => {
  console.log('\x1b[32m%s\x1b[0m', `Mongoose connected to qadb`);
});
mongoose.connection.on('error', (err) => {
  console.log('\x1b[31m%s\x1b[0m', 'Mongoose connection error:', err);
});
mongoose.connection.on('disconnected', () => {
  console.log('\x1b[33m%s\x1b[0m', 'Mongoose disconnected');
});

require('./user');
require('./question');
