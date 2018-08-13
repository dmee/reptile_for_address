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

exports.writeFile = async (filePath, data) => {
    return new Promise(resolve => {
        fs.writeFile(filePath, data, (err) => {
            console.info('文件写出成功...');
            resolve();
        });
    });
};