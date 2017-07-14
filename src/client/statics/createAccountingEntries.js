var createCashboxDetails = require("./validation/cashboxDetails/create");
var recomputeCashboxDetails = require("./validation/cashboxDetails/recompute");
var addCashboxDetails = require("./validation/cashboxDetails/add");
var formatCurrency = require("./utils/formatCurrency");

function formatNumber(value) {
    return formatCurrency(value).replace(/\./,",").replace(/ €$/,"");
}

function f2 (value) {
    if (value < 10) {
        return "0" + value;
    } else {
        return "" + value;
    }
};

function sortByDate(l1, l2) {
    return l1.date < l2.date ? -1 : 1;
}

function formatDate(jsDate) {
    return [ f2(jsDate.getDate()), f2(1 + jsDate.getMonth()), f2(jsDate.getFullYear() % 100) ].join("/");
}

function canChangeLine(config, line) {
    return (config.changeableCategories.indexOf(line.category) > -1);
}

function extractRelevantTags(line, config) {
    return config.relevantTags.filter(function (curTag) {
        return line.tags.indexOf(curTag) > -1;
    }).join(" ");
}

var placeholderRegExp = /\$\{([a-z]+)\}/g;
function getLineGroup(line, tags, config) {
    if (config.groupableCategories.indexOf(line.category) > -1) {

        var params = {
            "tags": tags,
            "dd": f2(line.date.getDate()),
            "mm": f2(line.date.getMonth() + 1),
            "yy": f2(line.date.getFullYear() % 100),
            "yyyy": line.date.getFullYear(),
            "category": line.category
        };

        var groupLabel = config.groupLabel.replace(placeholderRegExp, function (matchedText, param) {
            return params[param] || matchedText;
        });

        return groupLabel;
    }
}

function processDifference(sheetLines, difference, config) {
    if (sheetLines.length === 1) {
        sheetLines[0].amount += difference;
        sheetLines[0].adjusted = true;
        return;
    }
    var changeableLines = sheetLines.filter(canChangeLine.bind(null, config));
    var remainingLines = changeableLines.length;
    if (remainingLines === 0) {
        throw new Error("Could not adjust any line for the difference!");
    }
    var remainingDiff = difference;
    var diffPerLine = Math.floor(100 * remainingDiff / remainingLines) / 100;
    changeableLines.forEach(function (curLine) {
        var curDiff = remainingLines <= 1 ? remainingDiff : diffPerLine;
        curLine.amount += curDiff;
        remainingDiff -= curDiff;
        remainingLines--;
        curLine.adjusted = true;
    });
}

module.exports = function (sheets, getCategory, config) {
    var allLines = [];
    var filterAccountingYear = function (obj) {
        return (obj.date.getFullYear() == config.accountingYear);
    };
    sheets.forEach(function (sheet) {
        var sheetLines = [];
        var endDate = null;
        sheet.days.forEach(function (day) {
            if (!endDate || day.date > endDate) {
                endDate = day.date;
            }
            day.lines.forEach(function (line) {
                sheetLines.push({
                    date: day.date,
                    amount: line.amount,
                    item: line.item,
                    category: getCategory(line.item),
                    tags: sheet.tags,
                    id: sheet.id,
                    adjusted: false
                });
            });
        });
        var difference = sheet.realAmount - sheet.sumAmount;
        if (Math.abs(difference) >= 0.01) {
            processDifference(sheetLines, difference, config);
        }
        sheetLines = sheetLines.filter(filterAccountingYear);
        if (sheetLines.length == 0) {
            return;
        }
        allLines.push.apply(allLines, sheetLines);
    });

    var lineGroups = {};
    var summaryLines = [];
    allLines.forEach(function (line) {
        var tags = extractRelevantTags(line, config);
        var groupKey = getLineGroup(line, tags, config);
        if (groupKey) {
            var group = lineGroups[groupKey];
            if (!group) {
                group = lineGroups[groupKey] = {
                    item: groupKey,
                    date: line.date,
                    category: line.category,
                    tags: tags,
                    amount: 0,
                    number: 0
                }
                summaryLines.push(group);
            }
            group.amount += line.amount;
            group.number++;
            if (group.date < line.date) {
                group.date = line.date;
            }
        } else {
            summaryLines.push({
                item: line.item,
                date: line.date,
                category: line.category,
                tags: tags,
                amount: line.amount,
                number: 1
            });
        }
    });
    summaryLines.sort(sortByDate);

    var operations = [];
    summaryLines.forEach(function (line) {
        var amount = line.amount;
        var src = config.categoriesAccounts[line.category] || "?";
        var srcAnalytic = config.tagsAnalyticAccounts[line.tags] || "";
        var dst = config.cashboxAccount;
        var dstAnalytic = "";
        if (amount < 0) {
            var tmp = src;
            var tmpAnalytic = srcAnalytic;
            src = dst;
            srcAnalytic = dstAnalytic;
            dst = tmp;
            dstAnalytic = tmpAnalytic;
            amount = -amount;
        }
        operations.push({
            date: line.date,
            src: src,
            srcAnalytic: srcAnalytic,
            dst: dst,
            dstAnalytic: dstAnalytic,
            item: line.item,
            amount: amount
        });
    });

    var outputLines = [];
    operations.forEach(function (operation, index) {
        var operationNumber = index + 1;
        var date = formatDate(operation.date);
        var amount = formatNumber(operation.amount);
        outputLines.push([operationNumber, date, config.journal, "", operation.src, operation.item, "", "0,00", amount, "", operation.srcAnalytic || "", "PR"].join("\t"));
        outputLines.push([operationNumber, date, config.journal, "", operation.dst, operation.item, "", amount, "0,00", "", operation.dstAnalytic || "", "PR"].join("\t"));
    });
    return outputLines.join("\r\n");
};
