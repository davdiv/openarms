var objects = {};
var counter = 0;

var createRef = function () {
    counter++;
    return counter + "-" + Math.round(Math.random() * 10000);
}

exports.shareObject = function (type, object) {
    var ref = createRef();
    objects[type + "-" + ref] = object;
    return ref;
};

exports.retrieveObject = function (type, ref) {
    var key = type + "-" + ref;
    var result = objects[key];
    if (result) {
        delete objects[key];
    }
    return result;
};
