module.exports = (message) => {
    if (process.env.BUSTERVERBOSE === "verbose") {
        console.log(message);
    }
};