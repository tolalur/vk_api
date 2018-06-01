const queryConstructor = ({method, q=null, fields, city=null, access_token}) => {
    const address = 'https://api.vk.com/method/';
    return `${address}${method}?${q !== null ? 'q=' + q + '&' : ''}
    fields=${fields}&${city !==null ?'city=' + city:''}&access_token=${access_token}&v=5.78`;
}
module.exports = queryConstructor;