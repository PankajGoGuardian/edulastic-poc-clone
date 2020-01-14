import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import PreviewItemPage from "../../../../framework/author/itemList/itemDetail/previewPage";
import EditToolBar from "../../../../framework/author/itemList/questionType/common/editToolBar";
import MathTextDropDown from "../../../../framework/author/itemList/questionType/multipart/mathTextDropDown";
import { methodName, optionsAttribute } from "../../../../framework/constants/math";

const testCase = require("../../../../../fixtures/mathEngineTestCase");

const { _ } = Cypress;
const editItem = new EditItemPage();
const question = new MathTextDropDown();
const queGroup = "Multipart";
const queType = "Math, Text & Dropdown";
const editToolBar = new EditToolBar();
const preview = new PreviewItemPage();

let resetInput = true;
let resetOptions = true;

describe("math engine testcase ", () => {
  before("visit items page and select question type", () => {
    cy.login("teacher", "ashishsnap@snawpiz.com");
    editItem.createNewItem();
  });

  Object.keys(testCase).forEach(method => {
    context(`method-${method}`, () => {
      before("setting method type", () => {
        cy.contains("select the type of widget").click();
        editItem.chooseQuestion(queGroup, queType);
        question
          .getComposeQuestionQuillComponent()
          .clear()
          .type("this is math test question");

        editToolBar.clickOnMathInput();
        preview.header.edit();
        cy.get(".ant-collapse").click();
        question.clickOnAdditionalToggle();
        question.selectEvaluationMethod(methodName[method]);
        question.uncheckAllOptions();
      });

      testCase[method].forEach((testcase, i) => {
        const { name, options, input, attempt, evaluation } = testcase;

        it(` > testcase-${i + 1}:${name || "no_name"}`, () => {
          preview.header.edit();
          cy.get(".ant-collapse").click();

          if (resetInput && input && input !== "") {
            question.setValue(input);
          }

          if (resetOptions) {
            question.uncheckAllOptions();
            if (options)
              _.keys(options).forEach(option => {
                // check option
                if (!(option === "rule" || option === "field")) question.checkOption(optionsAttribute[option]);
                const optionValue = options[option];

                switch (option) {
                  case "allowedVariables":
                    question.setAllowedVariable(optionValue);
                    break;

                  case "setDecimalSeparator":
                    question.setDecimalSeperator(optionValue);
                    break;

                  case "setThousandsSeparator":
                    question.setThousandSeperator(optionValue);
                    break;

                  case "tolerance":
                    question.setTolerance(optionValue);
                    break;

                  case "significantDecimalPlaces":
                    question.setSignificantDecimalPlace(optionValue);
                    break;

                  case "rule":
                    // eslint-disable-next-line no-case-declarations

                    if (_.isObject(optionValue)) {
                      const ruleToSet = _.keys(optionValue)[0];

                      question.setRule(ruleToSet);
                      cy.wait(500);

                      if (ruleToSet === "isDecimal")
                        question
                          .getAnswerRuleArgumentInput()
                          .clear({ force: true })
                          .type(`{selectall}${optionValue.isDecimal}`, { force: true });

                      if (ruleToSet === "isStandardForm")
                        question.setAnswerArgumentDropdownValue(optionValue.isStandardForm);
                    } else question.setRule(optionValue);

                    break;

                  case "field":
                    question.setIsFactorisedMethodField(optionValue);
                    break;

                  default:
                    break;
                }
              });
          }

          // flags to avoid repeating the same input and options for next test case
          resetInput = testCase[method][i + 1] ? testCase[method][i + 1].input !== testCase[method][i].input : true;
          resetOptions = testCase[method][i + 1]
            ? testCase[method][i + 1].options !== testCase[method][i].options
            : true;

          // preview
          preview.header.preview();

          // clear
          preview.clickOnClear();

          // attempt
          question.getAnswerInputMathTextarea().typeWithDelay(attempt, { force: true });

          // checkAns
          cy.server();
          cy.route("POST", "**/math/evaluate").as("evaluate");
          preview.checkOnCheckAnswer().then(() => {
            cy.wait("@evaluate").then(xhr => {
              xhr.responseBody.testCase = testCase;
              // verify evaluation request
              expect(
                xhr.status,
                `verify evaluation status - ${xhr.status} - ${xhr.status === 200 || JSON.stringify(xhr.responseBody)}`
              ).to.eq(200);

              expect(xhr.response.body.correct, `${xhr.responseBody}`).eq(evaluation);

              // verify score
              preview.getAntMsg().then($ele => {
                const message = $ele.text();
                expect(
                  message,
                  `verify score message - ${message} - ${message === `score: ${evaluation ? 1 : 0}` ||
                    JSON.stringify(testcase)}`
                ).to.include(`score: ${evaluation ? 1 : 0}/1`);
                Cypress.$(".ant-message-custom-content").detach();
              });
            });
          });
        });
      });
    });
  });
});
