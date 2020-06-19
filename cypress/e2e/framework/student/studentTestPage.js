import ReportsPage from "./reportsPage";
import MathEditor from "./mathEditor";
import { attemptTypes, questionTypeKey as questionType, queColor, CALCULATOR } from "../constants/questionTypes";
import AssignmentsPage from "./assignmentsPage";
import { studentSide } from "../constants/assignmentStatus";
import CypressHelper from "../util/cypressHelpers";

class StudentTestPage {
  constructor() {
    this.mathEditor = new MathEditor();
    this.assignmentPage = new AssignmentsPage();
    this.attemptType = { RIGHT: "right", WRONG: "wrong" };
    this.report = new ReportsPage();
  }

  // *** ELEMENTS START ***

  getQuestionText = () =>
    cy
      .get('[class^="QuestionNumberLabel"]')
      .parent()
      .next();

  getCheckAns = () => cy.get("[data-cy=checkAnswer]");

  getEvaluationMessage = () => cy.get(".ant-message-custom-content");

  getNext = () => cy.get("[data-cy=next]");

  getPrevious = () => cy.get("[data-cy=prev]");

  getQueDropDown = () => cy.get('[data-cy="options"]').should("be.visible");

  getHint = () => cy.contains("hint").should("be.visible");

  getBookmark = () => cy.contains("bookmark").should("be.visible");

  getAllChoices = () => cy.get('[class^="MultiChoiceContent"]');

  getLabels = qcard => qcard.find("label");

  clickOnAll = () => cy.get('[ data-cy="all"]').click();

  clickOnBookmarked = () => cy.get('[ data-cy="bookmarked"]').click();

  clickOnSkipped = () => cy.get('[ data-cy="skipped"]').click();

  // @questionNumber = "Q1" ; "Q2"
  clickOnReviewQuestion = questionNumber => {
    cy.get(`[data-cy="${questionNumber}"]`).click();
    cy.wait("@gettest");
  };

  getScientificCalc = () => cy.get('[data-cy="SCIENTIFIC"]');

  getBasicCalc = () => cy.get('[data-cy="BASIC"]');

  getGraphCalc = () => cy.get('[data-cy="GRAPHING"]');

  getAchievedScore = () => cy.get('[data-cy="score"]');

  getMaxScore = () => cy.get('[data-cy="maxscore"]');

  getAnswerBox = () => cy.get(".responses_box");

  getQuestionBox = () => cy.get(".template_box ");

  getQuestionBoxByIndex = index => cy.get(`#response-container-${index}`);

  getCalculatorButton = () => cy.get('[data-cy="calculator"]');

  getImageQuestionBox = () => cy.get(".imagedragdrop_template_box ");

  getLabelImageQuestionByIndex = index => cy.get(`#answerboard-dragdropbox-${index}`);

  getHighlightToken = answer => cy.get('[data-cy="previewWrapper"]').contains("span", answer);

  getRenderedDropDownLabels = () => cy.get("body").find(".ant-select-selection__rendered");

  getInputsLabelText = () => cy.get(".template_box").find("input");

  getCountDown = () => cy.get('[class^="TimedTestTimer"]').find("label");

  getOkOnTimeoutPopUp = () => cy.get('[class^="AssignmentTimeEndedAlert"]').find("button");

  getExitButton = () => cy.get("[data-cy=finishTest]");

  getAllClozeTextInput = () => cy.get('[class^="ClozeTextInput"]');

  getClozeTextInputByIndex = index => this.getAllClozeTextInput().eq(index);

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  clickOnSkipOnPopUp = () => cy.get('[data-cy="proceed-skip"]').click({ force: true });

  clickOnCheckAns = (isExhausted = false) => {
    cy.server();
    cy.route("POST", "**/evaluation").as("evaluation");

    this.getCheckAns().click();

    if (isExhausted) CypressHelper.verifyAntMesssage("Check answer limit exceeded for the item");
    else
      cy.wait("@evaluation").then(xhr =>
        expect(
          xhr.status,
          `verify evaluation request - ${xhr.status === 200 || JSON.stringify(xhr.responseBody)}`
        ).to.eq(200)
      );
  };

  clickOnNext = (onlyPreview = false, isSkipped = false) => {
    cy.server();
    cy.route("POST", "**/test-activity/**").as("saved");
    cy.wait(300);
    this.getNext()
      .should("be.visible")
      .click();
    if (isSkipped) {
      this.clickOnSkipOnPopUp();
    }
    if (!onlyPreview) cy.wait("@saved");
  };

  clickOnPrevious() {
    this.getPrevious()
      .should("be.visible")
      .click();
  }

  //  click on finish test
  clickOnExitTest = (onlyPreview = false) => {
    cy.url().then(() => {
      if (Cypress.$('[data-cy="finishTest"]').length === 1) {
        this.getExitButton()
          .should("be.visible")
          .click();
        if (!onlyPreview) {
          cy.server();
          cy.route("POST", "**/test-activity/*/test-item/*").as("exit-test");
          this.clickOnProceed();
          cy.wait("@exit-test");
        }
      }
    });
  };

  clickOnCancel = () =>
    cy
      .get("[data-cy=cancel]")
      .should("be.visible")
      .click();

  clickOnProceed = () => cy.get("[data-cy=proceed]").click({ force: true });

  clickSubmitButton = () => {
    cy.server();
    // cy.route("GET", "**/test-activity/*").as("saved");
    cy.route("PUT", "**/test-activity/**").as("testactivity");
    cy.contains("SUBMIT")
      .as("submit")
      .should("be.visible")
      .click();
    /* this.clickOnCancel();

    cy.get("@submit").click(); */
    cy.get("[data-cy=submit]")
      .should("be.visible")
      .click();
    // cy.wait("@saved");
    cy.wait("@testactivity");
  };

  submitTest = () => {
    this.clickSubmitButton();
    return cy.url().should("include", "/home/grades");
  };

  clickOnMenuCheckAns = () => {
    cy.get("[data-cy=setting]")
      .should("be.visible")
      .click();
    cy.contains("Check Answer")
      .should("be.visible")
      .click();
    return this;
  };

  clickOnChoice = ch =>
    cy
      .contains("label", ch)
      .should("be.visible")
      .click();

  clickOnCalcuator = () => this.getCalculatorButton().click();

  clickOkOnTimeOutPopUp = () => {
    cy.server();
    cy.route("GET", "**/test-activity/*").as("load-reports");
    this.getOkOnTimeoutPopUp().click();
    cy.wait("@load-reports");
    return cy.url().should("include", "/home/grades");
  };
  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  checkAnsValidateAsWrong = (maxPoints = 1) => {
    this.clickOnCheckAns();
    CypressHelper.verifyAntMesssage(`score: 0/${maxPoints}`);
  };

  checkAnsValidateAsRight = (maxPoints = 1) => {
    this.clickOnCheckAns();
    CypressHelper.verifyAntMesssage(`score: ${maxPoints}/${maxPoints}`);
  };

  checkAnsValidateAsNoPoint = (maxPoints = 1) => {
    this.clickOnCheckAns();
    CypressHelper.verifyAntMesssage(`score: 0/${maxPoints}`);
    return this;
  };

  // MCQ
  checkHighLightByAnswer = answer => {
    cy.contains(answer)
      .should("be.visible")
      .click()
      .then($el => {
        cy.wrap($el)
          .closest("label")
          .find("input")
          .should("be.checked");
      });
    return this;
  };

  checkHighLightUncheckedByAnswer = answer => {
    cy.contains(answer)
      .should("be.visible")
      .click()
      .then($el => {
        cy.wrap($el)
          .closest("label")
          .find("input")
          .should("not.checked");
      });
    return this;
  };

  verifyLabelChecked = (quecard, choice) =>
    this.getLabels(quecard)
      .contains(choice)
      .closest("label")
      .find("input")
      .should("be.checked");

  // CHOICE MATRIX
  checkAnsMatrix = (answer, steams) => {
    cy.get('[data-cy="matrixTable"]')
      .children()
      .find("tr.ant-table-row")
      .then($rows => {
        Object.keys(answer).forEach(chKey => {
          cy.wrap($rows)
            .contains(chKey)
            .closest("tr")
            .then(ele => {
              cy.wrap(ele)
                .find("input")
                .eq(steams.indexOf(answer[chKey]))
                .click({ force: true });
            });
        });
      });
  };

  verifyAnseredMatrix = (card, attempt, steams) => {
    card
      .find('[data-cy="matrixTable"]')
      .eq(0)
      .children()
      .find("tr.ant-table-row")
      .then(ele => {
        Object.keys(attempt).forEach(chKey => {
          cy.wrap(ele)
            .contains(chKey)
            .closest("tr")
            .then(row => {
              cy.wrap(row)
                .find("input")
                .eq(steams.indexOf(attempt[chKey]))
                .should("be.checked");
            });
        });
      });
  };

  // TODO : remove below redundent methods if not is use
  clickFirstRadioByTitle = title =>
    cy
      .contains("p", title)
      .closest("td")
      .next()
      .find(">div")
      .find("input")
      .click()
      .parent()
      .should("have.class", "ant-radio-checked");

  clickSecondRadioByTitle = title =>
    cy
      .contains("p", title)
      .closest("td")
      .next()
      .next()
      .find(">div")
      .find("input")
      .click()
      .parent()
      .should("have.class", "ant-radio-checked");

  shouldCheckedFirstRadio = title =>
    cy
      .contains("p", title)
      .closest("td")
      .next()
      .find(">div")
      .find("input")
      .click()
      .parent()
      .should("have.class", "ant-radio-checked");

  shouldCheckedSecondRadio = title =>
    cy
      .contains("p", title)
      .closest("td")
      .next()
      .next()
      .find(">div")
      .find("input")
      .click()
      .parent()
      .should("have.class", "ant-radio-checked");

  // CLOZE DROP DOWN
  verifyAnswerClozeDropDown = (card, attempt, attemptType) => {
    card
      .find(".jsx-parser")
      .find('[data-cy="drop_down_select"]')
      .each((box, i) => {
        cy.wrap(box).as("responseBox");
        if (attemptType !== attemptTypes.SKIP) {
          cy.get("@responseBox").should("contain.text", attempt[i]);
        }
      });
  };

  verifyAnswerClozeText = (card, attempt, attemptType) => {
    card.find('[class^="ClozeTextInput"]').each((box, i) => {
      cy.wrap(box)
        .find("input")
        .as("responseBox");
      if (attemptType !== attemptTypes.SKIP) {
        cy.get("@responseBox").should("have.value", attempt[i]);
      }
    });
  };

  // CLOZE DRAGDROP TODO: refact and make it generic
  dragAndDropByIndex = (answer, questionIndex) => {
    this.getAnswerBox()
      .contains("div", answer)
      .customDragDrop(`#response-container-${questionIndex}`)
      .then(() => {
        this.getQuestionBox().contains("div", answer);
      });
    return this;
  };

  dragAndDropInsideQuestion = (answer, questionIndex) => {
    this.getQuestionBox()
      .contains("div", answer)
      .customDragDrop(`#response-container-${questionIndex}`)
      .then(() => {
        this.getQuestionBox().contains("div", answer);
      });
    return this;
  };

  imageDragAndDropByIndex = (answer, questionIndex) => {
    this.getAnswerBox()
      .contains("div", answer)
      .customDragDrop(`#answerboard-dragdropbox-${questionIndex}`)
      .then(() => {
        this.getImageQuestionBox().contains("div", answer);
      });
    return this;
  };

  imageDragAndDropInsideQuestion = (answer, questionIndex) => {
    this.getImageQuestionBox()
      .contains("div", answer)
      .customDragDrop(`#answerboard-dragdropbox-${questionIndex}`)
      .then(() => {
        this.getImageQuestionBox().contains("div", answer);
      });
    return this;
  };

  browserBack = () => {
    cy.wait(1000);
    cy.go("back");
    return this;
  };

  browserForward = () => {
    cy.wait(1000);
    cy.go("forward");
    return this;
  };

  clickQuestionDropdown = (question, index, total) => {
    const key = Object.keys(question)[0];
    this.getQueDropDown().click();

    cy.contains(key)
      .should("be.visible")
      .click();

    cy.contains(question[key]).should("be.visible");

    if (index === 0) {
      this.getPrevious().should("be.disabled");

      this.getNext().should("not.be.disabled");
    }
    if (index > 0 && index < total - 1) {
      this.getPrevious().should("not.be.disabled");

      this.getNext().should("not.be.disabled");
    }
    if (index === total - 1) {
      this.getPrevious().should("not.be.disabled");

      this.getNext().should("not.have.class", "ant-btn-icon-only");
    }
    return this;
  };

  firstPageRefreshWithNavButton = title => {
    this.clickOnNext();
    cy.wait(1000);
    cy.reload();
    this.clickOnPrevious();
    cy.contains(title).should("be.visible");
    return this;
  };

  pageRefreshWithNavButton = title => {
    this.clickOnPrevious();
    cy.wait(1000);
    cy.reload();
    this.clickOnNext();
    cy.contains(title).should("be.visible");
    return this;
  };

  clickDropDownByIndex = (answer, index) => {
    cy.get("div.template_box")
      .find(".ant-select")
      .eq(index)
      .click();
    cy.get(".ant-select-dropdown")
      .eq(index)
      .should("have.css", "display", "block")
      .contains("li", answer)
      .click()
      .then(() => {
        cy.get(".template_box").contains("div", answer);
      });
    return this;
  };

  // cloze with drop down
  checkAnsDropdown = attemptdata => {
    attemptdata.forEach((val, index) => {
      this.clickDropDownClozeByIndex(val, index);
    });
  };

  clickDropDownClozeByIndex = (answer, index) => {
    cy.get("[data-cy='drop_down_select']")
      .eq(index)
      .click({ force: true });
    cy.get("body")
      .contains(answer)
      .click({ force: true });
  };

  // cloze with text

  typeAnswersInClozeInput = attemptData =>
    attemptData.forEach((val, index) => {
      this.getClozeTextInputByIndex(index).type(`{selectall}${val}`);
    });

  clickImageDropDownByIndex = (answer, index) => {
    cy.get("div.imagelabeldragdrop-droppable")
      .eq(index)
      .click();
    cy.get(".ant-select-dropdown")
      .eq(index)
      .should("have.css", "display", "block")
      .contains("li", answer)
      .click()
      .then(() => {
        cy.get(".imagedropdown_template_box").contains("div", answer);
      });
    return this;
  };

  typeTextToAnswerBoard = (answer, index) => {
    this.getQuestionBox()
      .find("input")
      .eq(index)
      .should("be.visible")
      .click()
      .clear()
      .type(answer)
      .should("have.value", answer);
    return this;
  };

  // Essay Type

  typeEssayRichText = content => {
    cy.server();
    cy.route("POST", "**/test-activity/**").as("saved");
    cy.get(".fr-element")
      .type(content)
      .then(() => cy.get("body").click());
    cy.wait("@saved", { timeout: 45000 }); // it will trigger at interval of 30000ms
  };

  // Sort List

  getSourceBoard = () => cy.contains("p", "Source").closest("div");

  getTartgetBoard = () => cy.contains("p", "Target").closest("div");

  clickRightMoveButton = () => {
    cy.get(".anticon-caret-right").click();
    return this;
  };

  clickLeftMoveButton = () => {
    cy.get(".anticon-caret-left").click();
    return this;
  };

  clickUpMoveButton = () => {
    cy.get(".anticon-caret-up").click();
    return this;
  };

  clickDownMoveButton = () => {
    cy.get(".anticon-caret-down").click();
    return this;
  };

  getSourceAnswerByIndex = index =>
    this.getSourceBoard()
      .find(`#drag-drop-board-${index} > div`)
      .should("be.visible");

  getTargetAnswerByIndex = index =>
    this.getTartgetBoard()
      .find(`#drag-drop-board-${index}-target > div`)
      .should("be.visible");

  checkHighLightByIndex = (index, checkedColor, unCheckedColor) => {
    this.getSourceAnswerByIndex(index)
      .click()
      .then($el => {
        cy.wrap($el).should("have.css", "background-color", checkedColor);
      })
      .click()
      .then($el => {
        cy.wrap($el).should("have.css", "background-color", unCheckedColor);
      });
    return this;
  };

  dragAndDropSortListByOnTargetByIndex = (answer, sIndex, tIndex) => {
    this.getTargetAnswerByIndex(sIndex)
      .customDragDrop(`#drag-drop-board-${tIndex}-target`)
      .then(() => {
        this.getTartgetBoard().contains("p", answer);
      });
    return this;
  };

  // Classification

  getSourceBoardByIndex = index => cy.get(`[data-cy="drag-drop-item-${index}"]`);

  getTargetBoardByIndex = index => cy.get(`#drag-drop-board-${index}`);

  dragAndDropClassifcationFromSourceToTarget = (answer, sIndex, tIndex) => {
    this.getSourceBoardByIndex(sIndex)
      .customDragDrop(`div#drag-drop-board-${tIndex}`)
      .then(() => {
        this.getTargetBoardByIndex(tIndex).contains("p", answer);
      });
    return this;
  };

  dragAndDropClassifcationInsideTarget = (answer, sIndex, tIndex) => {
    this.getTargetBoardByIndex(sIndex)
      .customDragDrop(`div#drag-drop-board-${tIndex}`)
      .then(() => {
        this.getTargetBoardByIndex(tIndex).contains("p", answer);
      });

    return this;
  };

  dragAndDropMatchListFromSourceToTarget = (answer, tIndex) => {
    cy.contains("h3", "Drag & Drop the answer")
      .next()
      .contains("p", answer)
      .parent()
      .parent()
      .customDragDrop(`div#drag-drop-board-${tIndex}`)
      .then(() => {
        this.getTargetBoardByIndex(tIndex).contains("p", answer);
      });
    return this;
  };

  getMatchListTargetByIndex = index => cy.get(`#drag-drop-board-${index}> div`).should("be.visible");

  // Order List

  getSortListByIndex = index => cy.get(`#order-list-${index}`);

  dragAndDropSortList = (answer, sIndex, tIndex) => {
    this.getSortListByIndex(sIndex)
      .customDragDrop(`#order-list-${tIndex}`)
      .then(() => {
        this.getSortListByIndex(tIndex).contains("p", answer);
      });
    return this;
  };

  // Highlight

  getShadeItemByIndex = index =>
    cy
      .get('[data-cy="shadesViewItem"]')
      .should("be.visible")
      .eq(index);

  checkSelectedShadeItemByIndex = index => {
    this.getShadeItemByIndex(index)
      .click()
      .then($el => {
        cy.wrap($el).should("have.css", "background-color", "rgba(0, 176, 255, 0.8)");
      });
  };

  checkUnSelectedShadeItemByIndex = index => {
    this.getShadeItemByIndex(index)
      .click()
      .then($el => {
        cy.wrap($el).should("have.css", "background-color", "rgba(0, 176, 255, 0.19)");
      });
    return this;
  };

  getHotspotPolygonByIndex = index =>
    cy
      .get('[data-cy="answer-container"]')
      .find("polygon")
      .eq(index);

  checkSelectedPolygonByIndex = index => {
    this.getHotspotPolygonByIndex(index)
      .click()
      .then($el => {
        cy.wrap($el).should("have.css", "stroke", "rgb(0, 123, 179)");
      });
    return this;
  };

  checkUnselectedPolygonByIndex = index => {
    this.getHotspotPolygonByIndex(index)
      .click()
      .then($el => {
        cy.wrap($el).should("have.css", "stroke", "rgba(0, 176, 255, 1)");
      });
    return this;
  };

  checkSelectedToken = answer => {
    this.getHighlightToken(answer)
      .click()
      .then($el => {
        cy.wrap($el).should("have.class", "active-word");
      });
    return this;
  };

  checkUnselectedToken = answer => {
    this.getHighlightToken(answer)
      .click()
      .then($el => {
        cy.wrap($el).should("not.have.class", "active-word");
      });
    return this;
  };

  // MATH : TODO: revist and make these generic
  typeFormula = answer => this.mathEditor.typeFormula(answer);

  verifyTypedFormulaLength = len => this.mathEditor.checkTypedFormulaCount(len);

  typeFormulaWithKeyboard = answer => this.mathEditor.typeFormulaWithVirtualKeyboard(answer);

  checkSavedFormulaAnswer = answer => this.mathEditor.checkTypedFormulaCount(answer.length);

  typeFractionNumerator = answer => this.mathEditor.typeFractionNumerator(answer);

  typeFractionNumeratorWithKeyboard = answer => this.mathEditor.typeFractionNumeratorWithVirtualKeyboard(answer);

  checkSavedFractionNumerator = answer => this.mathEditor.checkTypedFractionNumeratorCount(answer.length);

  typeFractionDenominator = answer => this.mathEditor.typeFractionDenominator(answer);

  typeFractionDenominatorWithKeyboard = answer => this.mathEditor.typeFractionDenominatorWithVirtualKeyboard(answer);

  checkSavedFractionDenominator = answer => this.mathEditor.checkTypedFractionDenominatorCount(answer.length);

  getQuestionInPracticeByIndex = qIndex => cy.get(`[data-cy="queCircle-${qIndex + 1}"]`);

  selectQuestioninPracticePlayerByIndex = (index, isSkipped = false) => {
    cy.server();
    cy.route("POST", "**/test-activity/**").as("saved");
    this.getQuestionInPracticeByIndex(index).then($ele => {
      if ($ele.css("background-color") !== queColor.GREEN_2) {
        cy.wrap($ele).click({ force: true });
        if (isSkipped) this.clickOnSkipOnPopUp();
        cy.wait("@saved");
      }
    });
  };

  verifySideBar = qIndex => {
    this.getQuestionInPracticeByIndex(qIndex).should("have.css", "background-color", queColor.GREEN_2);
  };

  verifyTopProgress = (qIndex, total) => {
    cy.get('[data-cy="progressItem"]').should("contain.text", `${qIndex + 1} / ${total} Completed`);
  };

  verifyQuestionLeft = (qIndex, total) => {
    cy.get('[data-cy="questionLeftToAttempt"]').should("contain.text", `${total - qIndex} Left`);
  };

  attemptAssignment = (email, status, attempt, questionTypeMap, password, aType = "CLASS_ASSESSMENT") => {
    if (status !== studentSide.NOT_STARTED) {
      cy.login("student", email, password);
      this.assignmentPage.clickOnAssignmentButton();
      Object.keys(attempt).forEach((queNum, index, att) => {
        const [queType] = questionTypeMap[queNum].queKey.split(".");
        const { attemptData } = questionTypeMap[queNum];
        if (aType === "PRACTICE_ASSESSMENT") {
          this.verifySideBar(index);
          // this.verifyTopProgress(index, att.length);
          this.verifyQuestionLeft(index, att.length);
        }
        this.attemptQuestion(queType, attempt[queNum], attemptData);
        this.clickOnNext(false, attempt[queNum] === attemptTypes.SKIP);
      });

      if (status === studentSide.IN_PROGRESS) {
        cy.get("svg:nth-child(2)").click({ force: true }); // TODO: remove work around solution
        this.clickOnProceed();
      }
      if (status === studentSide.SUBMITTED || status === studentSide.GRADED) {
        this.submitTest();
        cy.contains("Grades").should("be.visible");
      }
    }
  };

  attemptQuestion = (attemptQueType, attemptType, attemptData) => {
    cy.wait(300); // double rendering issue causes choices to suffle and breaks test, hence waiting
    const { right, wrong, partialCorrect } = attemptData;
    const attempts =
      attemptType === attemptTypes.RIGHT
        ? right
        : attemptType === attemptTypes.WRONG
        ? wrong
        : attemptType === attemptTypes.PARTIAL_CORRECT
        ? partialCorrect
        : undefined;
    if (attempts) {
      switch (attemptQueType) {
        case questionType.MULTIPLE_CHOICE_STANDARD:
        case questionType.TRUE_FALSE:
        case questionType.MULTIPLE_CHOICE_MULTIPLE:
        case questionType.MULTIPLE_CHOICE_BLOCK:
          if (Cypress._.isArray(attempts)) attempts.forEach(choice => this.clickOnChoice(choice));
          else this.clickOnChoice(attempts);

          break;

        case questionType.CHOICE_MATRIX_STANDARD:
        case questionType.CHOICE_MATRIX_INLINE:
        case questionType.CHOICE_MATRIX_LABEL: {
          const { steams } = attemptData;
          this.checkAnsMatrix(attempts, steams);
          break;
        }
        case questionType.CLOZE_DROP_DOWN:
          this.checkAnsDropdown(attempts);
          break;
        case questionType.CLOZE_TEXT:
          this.typeAnswersInClozeInput(attempts);
          break;

        case questionType.ESSAY_RICH:
          this.typeEssayRichText(attempts);
          break;

        case questionType.MATH_NUMERIC:
          this.typeFormula(attempts);
          this.verifyTypedFormulaLength(attempts.length);
          break;

        default:
          assert.fail(1, 2, "question type did not match while in attempt question method");
          break;
      }
    }
  };

  verifyNoOfQuestions = NoOfQues => {
    this.getQueDropDown()
      .click({ force: true })
      .parent()
      .next()
      .find("li")
      .should("have.length", NoOfQues);
  };

  // getQuestionText = () => cy.get('[data-cy="styled-wrapped-component"]');

  verifyQuestionText = (index, text) => {
    this.getQuestionByIndex(index);
    this.getQuestionText().should("contain", text);
  };

  getQuestionByIndex = (index, isSkipped = false) => {
    cy.server();
    cy.route("POST", "**/test-activity/**").as("saved");
    this.getQueDropDown()
      .invoke("text")
      .then(txt => {
        if (!txt.includes(`Question ${index + 1}/`)) {
          this.getQueDropDown()
            .click({ force: true })
            .parent()
            .next()
            .find("li")
            .eq(index)
            .click({ force: true });
          if (isSkipped) this.clickOnSkipOnPopUp();
          cy.wait("@saved");
        }
      });

    return this.getQueDropDown().should("contain", `Question ${index + 1}/`);
  };

  attemptQuestionsByQueType = (queType, attempt) => {
    /* This function will attempt question with correct
    answers by defualt */
    queType.forEach((type, index) => {
      this.attemptQuestion(type, "right", attempt[index]);
      this.clickOnNext();
    });
  };

  // Feedback

  verifyFeedback = feedback => cy.get('[data-cy="feedBack"]').should("contain.text", feedback);

  verifyScore = (score, maxScore) => {
    this.getAchievedScore().should("have.text", `${score}`);
    this.getMaxScore().should("have.text", `${maxScore}`);
  };

  verifyResponseEvaluation = attemptType =>
    cy
      .get('[data-cy="answerType"]')
      .should(
        "contain.text",
        attemptType === attemptTypes.RIGHT
          ? "Thats Correct"
          : attemptType === attemptTypes.PARTIAL_CORRECT
          ? "Thats Partially Correct"
          : "Thats Incorrect"
      );

  assertCalcType = type => {
    switch (type) {
      case CALCULATOR.SCIENTIFIC:
        this.getScientificCalc().should("exist");
        this.getScientificCalc()
          .prev()
          .click({ force: true });
        break;
      case CALCULATOR.BASIC:
        this.getBasicCalc().should("exist");
        this.getBasicCalc()
          .prev()
          .click({ force: true });
        break;
      case CALCULATOR.GRAPH:
        this.getGraphCalc().should("exist");
        this.getGraphCalc()
          .prev()
          .click({ force: true });
        break;
      default:
        this.getCalculatorButton().should("not.exist");
    }
  };

  //
  verifyQuestionResponseRetained = (queTypeKey, attemptType, attemptData) => {
    cy.get('[data-cy="question-container"]').as("quecard");
    const { right, wrong, partialCorrect } = attemptData;
    const attempt =
      attemptType === attemptTypes.RIGHT
        ? right
        : attemptType === attemptTypes.WRONG
        ? wrong
        : attemptType === attemptTypes.PARTIAL_CORRECT
        ? partialCorrect
        : undefined;

    const currentQuestionType = queTypeKey;
    switch (currentQuestionType) {
      case questionType.MULTIPLE_CHOICE_STANDARD:
      case questionType.MULTIPLE_CHOICE_MULTIPLE:
      case questionType.TRUE_FALSE:
      case questionType.MULTIPLE_CHOICE_BLOCK:
        switch (attemptType) {
          case attemptTypes.RIGHT:
          case attemptTypes.WRONG:
          case attemptTypes.PARTIAL_CORRECT:
            if (Cypress._.isArray(attempt))
              attempt.forEach(choice => this.verifyLabelChecked(cy.get("@quecard"), choice));
            else {
              this.verifyLabelChecked(cy.get("@quecard"), attempt);
            }
            break;

          default:
            break;
        }
        break;

      case questionType.CHOICE_MATRIX_STANDARD:
      case questionType.CHOICE_MATRIX_INLINE:
      case questionType.CHOICE_MATRIX_LABEL: {
        const { steams } = attemptData;
        switch (attemptType) {
          case attemptTypes.RIGHT:
          case attemptTypes.WRONG:
          case attemptTypes.PARTIAL_CORRECT:
            this.verifyAnseredMatrix(cy.get("@quecard"), right, steams, attemptType);
            break;

          default:
            break;
        }
        break;
      }

      case questionType.CLOZE_DROP_DOWN:
        this.verifyAnswerClozeDropDown(cy.get("@quecard"), attempt, attemptType);
        break;

      case questionType.CLOZE_TEXT:
        this.verifyAnswerClozeText(cy.get("@quecard"), attempt, attemptType);
        break;
      default:
        break;
    }
  };

  getCountdownText = () => this.getCountDown().invoke("text");

  verifyAndGetRemainingTime = (expectedTimeInHours, timeAdujst = 3) =>
    /* expectedTimeInHours: `HH:MM:SS`, timeAdujst: integer(seconds) */
    this.getCountdownText().then(time => {
      const expectedTimeInSeconds = CypressHelper.hoursToSeconds(expectedTimeInHours);
      const currentInTimeInSeconds = CypressHelper.hoursToSeconds(time);

      expect(
        currentInTimeInSeconds > expectedTimeInSeconds - timeAdujst &&
          currentInTimeInSeconds < expectedTimeInSeconds + timeAdujst,
        `expected time in UI is ${timeAdujst} seconds around "${expectedTimeInHours}" and 
        and got "${time}"`
      ).to.be.true;

      return this.getCountDown()
        .should("have.css", "color", expectedTimeInSeconds > 120 ? queColor.WHITE : queColor.RED)
        .then(() => currentInTimeInSeconds);
    });

  waitWhileAttempt = hours => cy.wait(CypressHelper.hoursToSeconds(hours) * 1000);

  // *** APPHELPERS END ***
}
export default StudentTestPage;
