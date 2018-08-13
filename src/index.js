const HttpUtil = require('./Utils/HttpUtil');
const FileUtil = require('./Utils/FileUtil');
const NumericUtil = require('./Utils/NumericUtil');
const path = require('path');
var iconv = require('iconv-lite');

let baseUrl = 'http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2017/';

let start = async () => {
    let addressMap = {},
        totalDistrict = [];
    // await loadDistrictByProvince();
    let provinces = [
        { id: '11', name: '北京市', pid: 1 },
        { id: '12', name: '天津市', pid: 1 },
        { id: '13', name: '河北省', pid: 1 },
        { id: '14', name: '山西省', pid: 1 },
        { id: '15', name: '内蒙古自治区', pid: 1 },
        { id: '21', name: '辽宁省', pid: 1 },
        { id: '22', name: '吉林省', pid: 1 },
        { id: '23', name: '黑龙江省', pid: 1 },
        { id: '31', name: '上海市', pid: 1 },
        { id: '32', name: '江苏省', pid: 1 },
        { id: '33', name: '浙江省', pid: 1 },
        { id: '34', name: '安徽省', pid: 1 },
        { id: '35', name: '福建省', pid: 1 },
        { id: '36', name: '江西省', pid: 1 },
        { id: '37', name: '山东省', pid: 1 },
        { id: '41', name: '河南省', pid: 1 },
        { id: '42', name: '湖北省', pid: 1 },
        { id: '43', name: '湖南省', pid: 1 },
        { id: '44', name: '广东省', pid: 1 },
        { id: '45', name: '广西壮族自治区', pid: 1 },
        { id: '46', name: '海南省', pid: 1 },
        { id: '50', name: '重庆市', pid: 1 },
        { id: '51', name: '四川省', pid: 1 },
        { id: '52', name: '贵州省', pid: 1 },
        { id: '53', name: '云南省', pid: 1 },
        { id: '54', name: '西藏自治区', pid: 1 },
        { id: '61', name: '陕西省', pid: 1 },
        { id: '62', name: '甘肃省', pid: 1 },
        { id: '63', name: '青海省', pid: 1 },
        { id: '64', name: '宁夏回族自治区', pid: 1 },
        { id: '65', name: '新疆维吾尔自治区', pid: 1 }
    ];
    for (let i = 0, len = provinces.length; i < len; i++) {
        let province = provinces[i];
        let curDistricts = await FileUtil.readFile(path.resolve(__dirname, './Data/Provinces/' + province.id + '.json'));
        totalDistrict = totalDistrict.concat(JSON.parse(curDistricts));
    }
    totalDistrict.forEach(item => {
        let id = NumericUtil.zeroFill(item.id, 6);
        addressMap[id] = [item.name, NumericUtil.zeroFill(item.pid, 6)]
    });
    await FileUtil.writeFile(path.resolve(__dirname, './Data/addressList.json'), JSON.stringify(addressMap));
};

async function loadDistrictByProvince() {
    return new Promise(async resolve => {
        // let provinces = await loadProvinces();
        let provinces = [
            { id: '11', name: '北京市', pid: 1 },
            { id: '12', name: '天津市', pid: 1 },
            { id: '13', name: '河北省', pid: 1 },
            { id: '14', name: '山西省', pid: 1 },
            { id: '15', name: '内蒙古自治区', pid: 1 },
            { id: '21', name: '辽宁省', pid: 1 },
            { id: '22', name: '吉林省', pid: 1 },
            { id: '23', name: '黑龙江省', pid: 1 },
            { id: '31', name: '上海市', pid: 1 },
            { id: '32', name: '江苏省', pid: 1 },
            { id: '33', name: '浙江省', pid: 1 },
            { id: '34', name: '安徽省', pid: 1 },
            { id: '35', name: '福建省', pid: 1 },
            { id: '36', name: '江西省', pid: 1 },
            { id: '37', name: '山东省', pid: 1 },
            { id: '41', name: '河南省', pid: 1 },
            { id: '42', name: '湖北省', pid: 1 },
            { id: '43', name: '湖南省', pid: 1 },
            { id: '44', name: '广东省', pid: 1 },
            { id: '45', name: '广西壮族自治区', pid: 1 },
            { id: '46', name: '海南省', pid: 1 },
            { id: '50', name: '重庆市', pid: 1 },
            { id: '51', name: '四川省', pid: 1 },
            { id: '52', name: '贵州省', pid: 1 },
            { id: '53', name: '云南省', pid: 1 },
            { id: '54', name: '西藏自治区', pid: 1 },
            { id: '61', name: '陕西省', pid: 1 },
            { id: '62', name: '甘肃省', pid: 1 },
            { id: '63', name: '青海省', pid: 1 },
            { id: '64', name: '宁夏回族自治区', pid: 1 },
            { id: '65', name: '新疆维吾尔自治区', pid: 1 }
        ];
        for (let i = 0, len = provinces.length; i < len; i++) {
            let data = [];
            await sleep(1);
            let province = provinces[i];
            data.push(province);
            console.info('Loading:' + province.name);
            let districts = await loadDistrictByCity(province);
            data = data.concat(districts);
            await FileUtil.writeFile(path.resolve(__dirname, './Data/Provinces/' + province.id + '.json'), JSON.stringify(data));
        }
        console.info('Finished');
        resolve();
    });

}

// 加载某个省下面的所有区
async function loadDistrictByCity(province) {
    return new Promise(async resolve => {
        let data = [];
        let cities = await loadCities(province);
        for (let i = 0, len = cities.length; i < len; i++) {
            await sleep(1);
            let city = cities[i];
            data.push(city);
            let districts = await loadDistrict(city);
            data = data.concat(districts);
        }
        resolve(data);
    });
}

// 加载省份数据
async function loadProvinces() {
    let data = [],
        provinceReg = /<td><a href='(\d+).html'>(.*?)<br\/><\/a><\/td>/i;
    let addressTemp = await HttpUtil.get(baseUrl + 'index.html');
    let matchRes = addressTemp.match(new RegExp(provinceReg, 'g'));
    if (!matchRes.length) {
        console.info('未匹配到省份数据');
    }
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
    let addressTemp = await HttpUtil.get(baseUrl + '' + province.id + '.html');
    let matchRes = addressTemp.match(new RegExp(cityReg, 'g'));
    if (!matchRes.length) {
        console.info('未匹配到[' + province.name + ']数据');
    }
    console.info('loading cities for: ' + province.name);
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
async function loadDistrict(city) {
    let data = [],
        districtReg = /<td><a href='(\d+)\/(\d+).html'>(.*?)<\/a><\/td>/i;
    let addressTemp = await HttpUtil.get(baseUrl + '' + city.pid + '/' + city.id + '.html');
    let matchRes = addressTemp.match(new RegExp(districtReg, 'g'));
    if (!matchRes.length) {
        console.info('未匹配到[' + city.name + ']数据');
    }
    console.info('loading districts for: ' + city.name);
    matchRes.forEach(item => {
        let execRes = districtReg.exec(item);
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

async function sleep(second) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, 1000 * second);
    });
}

// start();

async function convert() {
    let address_unicode = await FileUtil.readFile(path.resolve(__dirname, './Data/address_unicode.js'));
    await FileUtil.writeFile(path.resolve(__dirname, './Data/address_cn.js'), reconvert(address_unicode))
}

function reconvert(str) {
    str = str.replace(/(\\u)(\w{1,4})/gi, function($0) {
        return (String.fromCharCode(parseInt((escape($0).replace(/(%5Cu)(\w{1,4})/g, "$2")), 16)));
    });
    str = str.replace(/(&#x)(\w{1,4});/gi, function($0) {
        return String.fromCharCode(parseInt(escape($0).replace(/(%26%23x)(\w{1,4})(%3B)/g, "$2"), 16));
    });
    str = str.replace(/(&#)(\d{1,6});/gi, function($0) {
        return String.fromCharCode(parseInt(escape($0).replace(/(%26%23)(\d{1,6})(%3B)/g, "$2")));
    });

    return str;
}
convert();