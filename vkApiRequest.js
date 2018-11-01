const access_token = '6d36f1140b43af65e689d3894dca9cf04c28cf436a02ef40acbe49b9bc21296f9406c4230908f0bccda09';
const request = require('request-promise');
const mySmallApi = require('./mySmallApi');

const parseUsers = (res) => {
    const data = JSON.parse(res);
    return data.response;
}

const searchObj = (age, status) => {
    return {
        method: 'users.search',
        query: 'Маша',
        fields: ['photo_200_orig', 'home_town', 'city', 'country', 'has_photo'],
        status: status,
        count: 1000,
        city: 2,
        age_from: age,
        age_to: age,
        access_token: access_token
    }
};

const vkApiRequest = async (age, status) => {
    const reqStr = mySmallApi.queryConstructor(searchObj(age, status));
    try {
        const res = await request(reqStr);
        return parseUsers(res);
    } 
    catch(error) {
        console.log('error :', error);
    }
}
module.exports = vkApiRequest;