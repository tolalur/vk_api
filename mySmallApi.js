const mySmallApi = {
    queryConstructor(method, query=null, fields, city=null, age_from, age_to, access_token) {
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
    },
    dbError(client, err, errorMsg, response) {
        client.close();
        console.log('err', err);

        return response.status(501).json({
        errorMsg: errorMsg, 
        ...err
        });
    },
    makeApiCall(str, request, insertUser) {
        console.log(str);
        request(str, (error, response, body) => {
            if (error) console.log('error:', error);

            if (response && response.statusCode == 200) {
                insertUser(parseUsers(body));
            } else {
                console.log('statusCode:', response && response.statusCode);
            }
        });
    },
    insertUser(users, mongoClient, dbUrl, dbError) {
        mongoClient.connect(dbUrl, function (err, client) {

            if (err) { return dbError(client, insertErr, response); }

            const db = client.db("usersdb");
            const collection = db.collection("users");

            collection.insertMany(users, function (insertErr, results) {
                if (err) {
                    return dbError(client, insertErr,
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
                function (err) {
                    if (updateErr) {
                        return dbError(client, updateErr,
                            'Ошибка подключения к базе. добавление поля "review"',
                            response);
                    } else {
                        console.log('updateMany - true');
                        client.close();
                    }
                });
        });
    }

}
module.exports = mySmallApi;