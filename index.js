const access_token = '6d36f1140b43af65e689d3894dca9cf04c28cf436a02ef40acbe49b9bc21296f9406c4230908f0bccda09';
const request = require('request');
const queryConstructor = require('./queryConstructor');

let firstSearch = {
  method:'users.search', 
  query:'res',
  fields:'photo_200_orig', 
  city: 2, 
  access_token: access_token
};

firstReq = queryConstructor(firstSearch);

let parseUsers = (res) => {
  let data = JSON.parse(res);
  for (let val in data) {
    console.dir(data[val]);
  }
}
let makeCall = (str) => {
  request(str, (error, response, body) => {
    (error) => error !== null ? console.log('error:', error) : '' ;
    console.log('statusCode:', response && response.statusCode);
    parseUsers(body);
  });
}

makeCall(firstReq);