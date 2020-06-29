import FileHelper from "../../../../framework/util/fileHelper";
import runMatrixPageTests from "../../../../framework/author/itemList/questionType/mcq/runMatrixPageTests";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Author "Choice matrix - standard" type question`, () => {
  runMatrixPageTests({
    group: "Multiple Choice",
    queType: "Choice Matrix - Standard",
    qShortKey: "CHOICE_STD",
    queText: "Choose the correct number of days in following month",
    ansChoice: ["right-1", "wrong-1", "wrong-2", "right-2"],
    forScoringCorrectAns: [0, 1, 1, 0],
    forScoringAltAns: [1, 1, 0, 0],
    CorrectPartialAns: [0, 1],
    inCorrectAns: [1, 0, 0],
    forPenaltyScoring: [0, 1, 0],
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
