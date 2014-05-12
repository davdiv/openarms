var partialAdd = function (sumArray, toBeAdded) {
    if (sumArray.length != toBeAdded.length) {
        throw new Exception("Different array sizes when adding cashbox details.");
    }
    for (var i = 0, l = sumArray.length; i < l; i++) {
        var curSumItem = sumArray[i];
        var curToBeAddedItem = toBeAdded[i];
        if (curSumItem.unitValue !== curToBeAddedItem.unitValue) {
            throw new Exception("Different unit values when adding cashbox details.")
        }
        curSumItem.number += curToBeAddedItem.number;
    }
};

module.exports = function (res, toBeAdded) {
    partialAdd(res.coins, toBeAdded.coins);
    partialAdd(res.banknotes, toBeAdded.banknotes);
    if (toBeAdded.checks && toBeAdded.checks.length > 0) {
        res.checks.push.apply(res.checks, toBeAdded.checks);
    }
    return res;
};
