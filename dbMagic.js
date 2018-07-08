const mySmallApi = require('./mySmallApi');

// подключение к базе
const mongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/";

mongoClient.connect(url, function (err, client) {

    if (err) { return mySmallApi.dbError(client, insertErr, response); }

    const db = client.db("usersdb");
    const collection = db.collection("usersOutstatus");

    collection.insertMany(users, function (insertErr, results) {
      if (err) {
        return mySmallApi.dbError(client, insertErr,
          'Ошибка добавления пользователей в базу',
          response);
      } else {
        console.log('insertMany - true');
      }
    });

    collection.updateMany(
      {},
      { $set: { review: 0 } },
      { upsert: false },
      function (updateErr) {
        if (updateErr) {
          return mySmallApi.dbError(client, updateErr,
            'Ошибка подключения к базе. добавление поля "review"',
            response);
        } else {
          console.log('updateMany - true');
          client.close();
        }
      });
  });