const mergeObjects = conf1 => conf2 => ({ ...conf1, ...conf2 });

module.exports = mergeObjects;
