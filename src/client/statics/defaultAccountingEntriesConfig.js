module.exports = function() {
    return {
        changeableCategories:  ["Alimentaire", "Vêtements", "Meubles"],
        groupableCategories:  ["Alimentaire", "Vêtements", "Meubles"],
        depositTagRegExp: /^([0-9]{4}-[0-9]{2}-[0-9]{2}.*|[0-9]+)$/,
        relevantTags:  [ "Grasse", "Vallauris", "Vallauris Ameublement", "Vallauris café/librairie" ],
        groupLabel: "${category} ${tags} ${mm}/${yyyy}",
        cashboxAccount: "53000000",
        bankAccount: "51210000",
        generalDepositLabel: "Dépôt",
        coinsDepositLabel: "Dépôt de pièces",
        banknotesDepositLabel: "Dépôt de billets",
        checksDepositLabel: "Dépôt de chèques",
        categoriesAccounts: {
            "Alimentaire": "75880100",
            "Vêtements": "75880200",
            "Meubles": "75880300",
            "Achats": "60000000",
            "Don": "75400000"
        },
        tagsAnalyticAccounts: {
            "Vallauris": "1",
            "Grasse": "2",
            "Vallauris Ameublement": "3",
            "Vallauris café/librairie": "4"
        },
        accountingYear: (new Date().getFullYear() - 1),
        journal: "OD"
    };
};
