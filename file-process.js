const fs = require('fs');

class FileProcess {
    getJsonFile(path) {
        return JSON.parse(fs.readFileSync(path, 'utf-8'));
    }

    getAuthData() {
        return this.getJsonFile('./database/auth/auth-data.json');
    }

    writeJsonFile(path, data) {
        fs.writeFileSync(path, JSON.stringify(data), 'utf-8');
    }
}

module.exports = new FileProcess();