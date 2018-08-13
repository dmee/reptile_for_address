const http = require('http');
var iconv = require('iconv-lite');

exports.get = async (url) => {
    return new Promise(async (resolve, reject) => {
        http.get(url, res => {
            let htmlBuf = [],
                bufLength = 0;
            res.on('data', (chunk) => {
                htmlBuf.push(chunk);
                bufLength += chunk.length;
            });
            res.on('end', () => {
                resolve(iconv.decode(Buffer.concat(htmlBuf, bufLength), 'GBK'));
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
};