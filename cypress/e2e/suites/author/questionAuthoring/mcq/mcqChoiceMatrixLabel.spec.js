import FileHelper from "../../../../framework/util/fileHelper";
import runMatrixPageTests from "../../../../framework/author/itemList/questionType/mcq/runMatrixPageTests";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Author "Choice matrix - labels" type question`, () => {
  runMatrixPageTests({
    group: "Multiple Choice",
    queType: "Match Table - Labels",
    qShortKey: "CHOICE_LABEL",
    queText: "Choose the correct number of days in following month",
    ansChoice: ["right-1", "wrong-1", "wrong-2", "right-2"],
    forScoringCorrectAns: [1, 2, 2, 1],
    forScoringAltAns: [2, 2, 1, 1],
    CorrectPartialAns: [1, 2],
    inCorrectAns: [2, 1, 1],
    forPenaltyScoring: [1, 2, 1],
    attemptData: {
      steams: ["true", "false"],
      right: {
        "right-1": "true",
        "wrong-1": "false",
        "wrong-2": "false",
        "right-2": "true"
      },
      wrong: {
        "right-1": "false",
        "wrong-1": "true",
        "wrong-2": "true"
      },
      partial: {
        "right-1": "true",
        "wrong-1": "false"
      },
      alternate: {
        "right-1": "false",
        "wrong-1": "false",
        "wrong-2": "true",
        "right-2": "true"
      }
    },
    steams: ["30", "31"],
    extlink: "www.testdomain.com",
    formattext: "formattedtext",
    formula: "s=ar^2"
  });
});
