var ObjectID = require("mongodb").ObjectID;

module.exports = function (dbCollection) {
    return async function (req, res, next) {
        try {
            const result = await dbCollection.findOne({
                _id: req.params.id
            });
            if (!result) {
                res.status(404).send();
            } else {
                res.status(200).send(result);
            }
        } catch (e) {
            next(e);
        }
    };
};
