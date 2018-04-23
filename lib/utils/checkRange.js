const checkRange = (value, from, to) => {
    if (typeof value === "string") {
        value = Number(value);

        if (!Number.isInteger(value)) {
            return false;
        }
    }

    if (typeof value === "number") {
        if (!Number.isInteger(value)) {
            return false;
        }

        return value >= from && value <= to;
    }

    return false;
};

module.exports = checkRange;