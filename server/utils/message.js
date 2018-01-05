const moment = require('moment');

const generateMessage = (from, text) => {
    return {
        from,
        text,
        createAt: moment().format('kk:mm:ss')
    };
};

const generateLocationMessage = (from, lat, lng) => {
    return {
        from,
        url: `https://www.google.com/maps?q=${lat},${lng}`,
        createAt: moment().format('kk:mm:ss')
    };
};

module.exports = { generateMessage, generateLocationMessage }