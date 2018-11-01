
const vkApiRequest = require('./vkApiRequest');

function* generateSequence(range) {
    let [start, end] = range;
    for (let i = start; i <= end; i++) yield i;
}

// (async () => {
//     for (let age = 21; age <= 25; age++) {
//         for (let status = 1; status <= 8; status++) {
//             try {
//                 console.log(`${age} - ${status}`);
//                 const users = await vkApiRequest(age, status);
//                 console.log('users count', users.count);
//             } 
//             catch(error) {
//                 console.log('error :', error);
//             }
//         }    
//     }
// })();

const ageRange = generateSequence([21,25]);
const statusRange = generateSequence([1,8]);

const getUsersTrottle = async (ageRange, statusRange, age) => {
    if (!age) {
        age = ageRange.next(); 
    }
    let status = statusRange.next();
    
    if (status.done) {
        statusRange = generateSequence([1,8]);
        status = statusRange.next();
        age = ageRange.next(); 
    } 
    if (age.done) {
        return
    }
    try {
        const users = await vkApiRequest(age.value, status.value);
        
        if (users && users.count) {
        console.log('users:', users.count);

        }
    } catch(error) {
        console.log('error :', error);
    }    
    setTimeout(() => getUsersTrottle(ageRange, statusRange, age), 2000)
    
}

getUsersTrottle(ageRange, statusRange);