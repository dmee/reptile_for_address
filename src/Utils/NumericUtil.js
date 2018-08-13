exports.zeroFill = (value, digit) => {
    let newVal = value + '';
    let leftDigit = digit - newVal.length;
    if (leftDigit) {
        for (var i = 0, len = leftDigit; i < len; i++) {
            newVal += '0';
        }
    } else {
        newVal = newVal.substr(0, 6);
    }
    console.info(newVal);
    return newVal;
};