const mongoose = require('mongoose');

const dbName = 'RedMagic';

const con = mongoose.connect(`mongodb://localhost:27017/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("Connection successfully established to database:", dbName);
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

module.exports = con;
