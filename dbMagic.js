// подключение к базе
const mongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/";

  (async function() {
    let client;
  
    try {
      client = await mongoClient.connect(url);
  
      const db = client.db('usersdb');
  
      let usersOutstatus = await db.collection('usersOutstatus')
        .find().project({id:1, _id:0}).toArray();

      usersOutstatus = usersOutstatus.map(val => val.id);

      let usersStatus = await db.collection('users')
        .find({
           id: { $not: {$in : usersOutstatus} }
        }).toArray();

      await db.collection('usersOutstatus')
      .collectioninsertMany(usersStatus);
  
    } catch (err) {
      console.log(err.stack);
    }  
    client.close();
  })();
