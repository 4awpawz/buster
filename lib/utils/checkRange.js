module.exports = (value, from, to) =>
    parseInt(value) && parseInt(value) >= from && parseInt(value) <= to || false;