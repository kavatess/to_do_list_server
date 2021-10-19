const fileProcess = require('../file-process');

module.exports = function getUserByToken(requestToken = '') {
    const userData = fileProcess.getAuthData();
    // const userInfo = userData.find(user => user.token == requestToken);
    let userInfo = null;
    userData.forEach(user => {
        if (user.token === requestToken) {
            userInfo = user;
        }
    });
    return userInfo;
}
