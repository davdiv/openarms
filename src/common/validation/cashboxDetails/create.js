var COINS = [ 2, 1, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01 ];
var BANKNOTES = [ 500, 200, 100, 50, 20, 10, 5 ];

var initObject = function (unitValue) {
    return {
        unitValue : unitValue,
        number : 0,
        total : 0
    };
};

module.exports = function () {
    return {
        coins : COINS.map(initObject),
        banknotes : BANKNOTES.map(initObject),
        checks : []
    };
};
