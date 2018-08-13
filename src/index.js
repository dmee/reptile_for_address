const HttpUtil = require('./Utils/HttpUtil');
const FileUtil = require('./Utils/FileUtil');
const NumericUtil = require('./Utils/NumericUtil');
const path = require('path');

let baseUrl = 'http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2017/';

let start = async () => {
    let provinces = await loadProvinces();
    /* provinces.forEach(async province => {
        console.info(province);
    }); */

    let firstProvince = provinces[5];
    let cities = await loadCities(firstProvince);
    /* cities.forEach(async city => {
        console.info(city);
    }); */

    let firstCity = cities[0];
    let distincts = await loadDistinct(firstCity);
    distincts.forEach(async distinct => {
        console.info(distinct);
    });
};

// 加载省份数据
async function loadProvinces() {
    let data = [],
        provinceReg = /<td><a href='(\d+).html'>(.*?)<br\/><\/a><\/td>/i;
    // let addressTemp = await HttpUtil.get(baseUrl + 'index.html');
    let addressTemp = await FileUtil.readFile(path.resolve(__dirname, './Data/Province.html'));
    let matchRes = addressTemp.match(new RegExp(provinceReg, 'g'));
    matchRes.forEach(item => {
        let execRes = provinceReg.exec(item);
        if (execRes && execRes.length > 2) {
            data.push({
                id: execRes[1],
                name: execRes[2],
                pid: 1
            });
        }
    });
    return data;
}

// 加载城市数据
async function loadCities(province) {
    let data = [],
        cityReg = /<td><a href='(\d+)\/(\d+).html'>(.*?)<\/a><\/td>/i;
    // let addressTemp = await HttpUtil.get(baseUrl + '' + province.id + '.html');
    let addressTemp = await FileUtil.readFile(path.resolve(__dirname, './Data/City.html'));
    let matchRes = addressTemp.match(new RegExp(cityReg, 'g'));
    matchRes.forEach(item => {
        let execRes = cityReg.exec(item);
        if (execRes && execRes.length > 3 && !/\d+/i.test(execRes[3])) {
            data.push({
                id: execRes[2],
                name: execRes[3],
                pid: province.id
            });
        }
    });
    return data;
}

// 加载区
async function loadDistinct(city) {
    let data = [],
        distinctReg = /<td><a href='(\d+)\/(\d+).html'>(.*?)<\/a><\/td>/i;
    let addressTemp = await HttpUtil.get(baseUrl + '' + city.pid + '/' + city.id + '.html');
    // let addressTemp = await FileUtil.readFile(path.resolve(__dirname, './Data/City.html'));
    let matchRes = addressTemp.match(new RegExp(distinctReg, 'g'));
    matchRes.forEach(item => {
        let execRes = distinctReg.exec(item);
        if (execRes && execRes.length > 3 && !/\d+/i.test(execRes[3])) {
            data.push({
                id: execRes[2],
                name: execRes[3],
                pid: city.id
            });
        }
    });
    return data;
}

start();