// const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;
// let _db;

// const mongoConnect = (callback) => {
//   MongoClient.connect(
//     "mongodb+srv://admin-samippoudel:manisha5@cluster0.yukjp.mongodb.net/ecommerce?retryWrites=true&w=majority",
//     { useUnifiedTopology: true }
//   )
//     .then((client) => {
//       console.log("Connected to MongoDB");
//       _db = client.db();
//       callback();
//     })
//     .catch((err) => {
//       console.log(err);
//       throw err;
//     });
// };

// const getDb = () => {
//   if (_db) {
//     return _db;
//   }
//   throw "No database found";
// };

// module.exports = {
//   mongoConnect,
//   getDb,
// };
