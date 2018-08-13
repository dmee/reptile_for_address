const fs = require('fs');

exports.readFile = async (filePath) => {
    return new Promise(resolve => {
        fs.readFile(filePath, {
            encoding: 'utf-8'
        }, (err, data) => {
            resolve(data);
        });
    });
}