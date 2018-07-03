const queryConstructor = ({method, query=null, fields, city=null, age_from, age_to, access_token}) => {
    query = query !== null ? 'q=' + encodeURIComponent(query.trim()) : '';
    return `https://api.vk.com/method/${method}?
    ${query}
    &fields=${fields}
    &city=${city}
    &sex=1
    &age_from=${age_from}
    &age_to=${age_to}
    &access_token=${access_token}
    &v=5.78`.replace(/[\s]+/g, '');
}
module.exports = queryConstructor;