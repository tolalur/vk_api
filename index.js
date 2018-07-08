const access_token = '6d36f1140b43af65e689d3894dca9cf04c28cf436a02ef40acbe49b9bc21296f9406c4230908f0bccda09';
const requestAPI = require('request');
const mySmallApi = require('./mySmallApi');
// подключение к базе
const mongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/";
// сервер
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const firstSearch = {
  method: 'users.search',
  query: 'Маша',
  fields: ['photo_200_orig', 'home_town', 'city', 'country', 'has_photo'],
  status:8,
  count: 1000,
  city: 2,
  age_from: 20,
  age_to: 20,
  access_token: access_token
};

firstReq = mySmallApi.queryConstructor(firstSearch);


const insertUser = (users) => {
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
}

const parseUsers = (res) => {
  let data = JSON.parse(res);

  console.log('api response', 'count: ', 
    data.response.count, 
    ' in arr: ', data.response.items.length);
  
  return data.response.items;
}

const makeApiCall = (str, request) => {
  console.log(str);
  request(str, (error, response, body) => {
    if (error) console.log('error:', error);

    if (response && response.statusCode == 200) {
      insertUser(parseUsers(body));
    } else {
      console.log('statusCode:', response && response.statusCode);
    }
  });
}

// запрос к API, сохраненние в базу
app.get("/api/get/users", () => makeApiCall(firstReq, requestAPI));
app.get("/api/get/userFoto", () => makeApiCall(firstReq, requestAPI));

app.get("/api/search/:searchStr", function (request, response) {
  response.send("search string: " + request.params["searchStr"])
});



app.get("/api/users/", function (request, response) {
  mongoClient.connect(url, function (err, client) {

    if (err) {
      return response.status(501).json({
        errorMsg: 'Ошибка подключения к базе',
        ...err
      });
    }

    const db = client.db("usersdb");
    const collection = db.collection("users");

    collection.find({ review: 0 }).toArray(function (err, results) {
      if (err) response.json(err);
      response.json(results);
      client.close();
    });
  });
});

app.post("/api/save/users/", jsonParser, function (request, response) {
  console.log('request.body', request.body);

  mongoClient.connect(url, function (err, client) {

    if (err) {
      return response.status(501).json({
        errorMsg: 'Ошибка подключения к базе',
        ...err
      });
    }

    const db = client.db("usersdb");
    const collection = db.collection("users");

    collection.updateMany(
      { id: { $in: request.body } },
      { $set: { review: 1 } },
      { upsert: false },
      function (err, result) {
        if (err) {
          client.close();
          console.log('err', err);
          return response.status(501).json({
            errorMsg: 'Ошибка подключения к базе',
            ...err
          });

        } else {
          response.json({ result: result });
          client.close();
        }
      });
  });
});

app.listen(3000);