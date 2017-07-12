var computeCashboxDetails = require("../cashboxDetails/recompute");

module.exports = function (data) {
    var adjustment = 0;
    if (data.bankAdjustment) {
        adjustment = data.bankAdjustment.amount;
    }
    var declaredAmountDetails = data.declaredAmountDetails;
    if (declaredAmountDetails) {
        computeCashboxDetails(declaredAmountDetails);
        data.declaredAmount = declaredAmountDetails.total.general.total;
    }
    data.finalAmount = data.declaredAmount + adjustment;
};
