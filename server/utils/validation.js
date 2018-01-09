const isRealString = (str) => {
    if (str === null) return null;
    else return typeof str === 'string' && str.trim().length > 0;
};

module.exports = { isRealString };