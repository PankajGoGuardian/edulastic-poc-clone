import FileHelper from "../../../../framework/util/fileHelper";
import runMatrixPageTests from "../../../../framework/author/itemList/questionType/mcq/runMatrixPageTests";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Author "Choice matrix - labels" type question`, () => {
  runMatrixPageTests({
    group: "Multiple Choice",
    queType: "Choice matrix - labels",
    queText: "Choose the correct number of days in following month",
    ansChoice: ["JAN", "APR", "MAY", "JUN"],
    forScoringCorrectAns: [1, 1, 1, 1],
    forScoringAltAns: [1, 1, 0, 0],
    steams: ["30", "31"],
    extlink: "www.testdomain.com",
    formattext: "formattedtext",
    formula: "s=ar^2"
  });
});
