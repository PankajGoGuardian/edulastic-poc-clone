import ReportsPage from "./reportsPage";
import MathEditor from "./mathEditor";
import { attemptTypes, questionTypeKey as questionType, queColor } from "../constants/questionTypes";
import AssignmentsPage from "./assignmentsPage";
import { studentSide } from "../constants/assignmentStatus";

class StudentTestPage {
  constructor() {
    this.mathEditor = new MathEditor();
    this.assignmentPage = new AssignmentsPage();
    this.attemptType = { RIGHT: "right", WRONG: "wrong" };
    this.report = new ReportsPage();
  }

  checkAnsValidateAsWrong = () => {
    cy.get("[data-cy=checkAnswer]")
      .should("be.visible")
      .click();
    cy.get("body")
      .contains("score: 0 / 1")
      .should("be.visible");
    return this;
  };

  checkAnsValidateAsRight = () => {
    cy.get("[data-cy=checkAnswer]")
      .should("be.visible")
      .click();
    cy.get("body")
      .contains("score: 1 / 1")
      .should("be.visible");
  };

  checkAnsValidateAsNoPoint = () => {
    cy.get("[data-cy=checkAnswer]")
      .should("be.visible")
      .click();
    cy.get("body")
      .contains("score: 0 / 0")
      .should("be.visible");
    return this;
  };

  getNext = () => cy.get("[data-cy=next]");

  clickOnNext = () => {
    cy.server();
    cy.route("POST", "**/test-activity/**").as("saved");
    cy.wait(300);
    this.getNext()
      .should("be.visible")
      .click();
    cy.wait("@saved");
  };

  getPrevious = () => cy.get("[data-cy=prev]");

  clickOnPrevious() {
    this.getPrevious()
      .should("be.visible")
      .click();
  }

  //  click on finish test
  clickOnExitTest = () => {
    cy.url().then(url => {
      if (Cypress.$('[data-cy="finishTest"]').length === 1) {
        cy.get("[data-cy=finishTest]")
          .should("be.visible")
          .click();
        this.clickOnProceed();
      }
    });
  };

  clickOnCancel = () =>
    cy
      .get("[data-cy=cancel]")
      .should("be.visible")
      .click();

  clickOnProceed = () =>
    cy
      .get("[data-cy=proceed]")
      .should("be.visible")
      .click();

  submitTest = () => {
    cy.server();
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

    cy.wait("@testactivity");
    cy.url().should("include", "/home/grades");
    return new ReportsPage();
  };

  getQueDropDown = () => cy.get("[data-cy=options]").should("be.visible");

  clickOnMenuCheckAns = () => {
    cy.get("[data-cy=setting]")
      .should("be.visible")
      .click();
    cy.contains("Check Answer")
      .should("be.visible")
      .click();
    return this;
  };

  getHint = () => cy.contains("hint").should("be.visible");

  getBookmark = () => cy.contains("bookmark").should("be.visible");

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

  clickOnChoice = ch =>
    cy
      .contains(ch)
      .should("be.visible")
      .click({ force: true });

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

  // CHOICE MATRIX

  checkAnsMatrix = (answer, steams) => {
    Object.keys(answer).forEach(chKey => {
      cy.get('[data-cy="matrixTable"]')
        .children()
        .find("tr.ant-table-row")
        .contains(chKey)
        .closest("tr")
        .then(ele => {
          cy.wrap(ele)
            .find("input")
            .eq(steams.indexOf(answer[chKey]))
            .click({ force: true });
        });
    });
  };

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

  getAnswerBox = () => cy.get(".responses_box");

  getQuestionBox = () => cy.get(".template_box ");

  getQuestionBoxByIndex = index => cy.get(`#response-container-${index}`);

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

  getImageQuestionBox = () => cy.get(".imagedragdrop_template_box ");

  getLabelImageQuestionByIndex = index => cy.get(`#answerboard-dragdropbox-${index}`);

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

  getRenderedDropDownLabels = () => cy.get("body").find(".ant-select-selection__rendered");

  getInputsLabelText = () => cy.get(".template_box").find("input");

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
      .click();
  };

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

  getHighlightToken = answer => cy.get('[data-cy="previewWrapper"]').contains("span", answer);

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

  // Math test

  typeFormula = answer => this.mathEditor.typeFormula(answer);

  typeFormulaWithKeyboard = answer => this.mathEditor.typeFormulaWithVirtualKeyboard(answer);

  checkSavedFormulaAnswer = answer => this.mathEditor.checkTypedFormulaCount(answer.length);

  typeFractionNumerator = answer => this.mathEditor.typeFractionNumerator(answer);

  typeFractionNumeratorWithKeyboard = answer => this.mathEditor.typeFractionNumeratorWithVirtualKeyboard(answer);

  checkSavedFractionNumerator = answer => this.mathEditor.checkTypedFractionNumeratorCount(answer.length);

  typeFractionDenominator = answer => this.mathEditor.typeFractionDenominator(answer);

  typeFractionDenominatorWithKeyboard = answer => this.mathEditor.typeFractionDenominatorWithVirtualKeyboard(answer);

  checkSavedFractionDenominator = answer => this.mathEditor.checkTypedFractionDenominatorCount(answer.length);

  verifySideBar = qIndex => {
    cy.get(`[data-cy="queCircle-${qIndex + 1}"]`).should("have.css", "background-color", queColor.GREEN_1);
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
        this.clickOnNext();
      });

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
    switch (attemptQueType) {
      case questionType.MULTIPLE_CHOICE_STANDARD:
      case questionType.TRUE_FALSE:
      case questionType.MULTIPLE_CHOICE_MULTIPLE:
      case questionType.MULTIPLE_CHOICE_BLOCK:
        if (attemptType !== attemptTypes.SKIP) {
          if (Cypress._.isArray(attempts)) attempts.forEach(choice => this.clickOnChoice(choice));
          else this.clickOnChoice(attempts);
        }
        break;

      case questionType.CHOICE_MATRIX_STANDARD:
      case questionType.CHOICE_MATRIX_INLINE:
      case questionType.CHOICE_MATRIX_LABEL: {
        const { steams } = attemptData;
        if (attemptType !== attemptTypes.SKIP) {
          this.checkAnsMatrix(attempts, steams);
        }
        break;
      }
      case questionType.CLOZE_DROP_DOWN:
        if (attemptType !== attemptTypes.SKIP) {
          this.checkAnsDropdown(attempts);
        }
        break;
      default:
        break;
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
  getQuestionText = () => cy.get('[data-cy="styled-wrapped-component"]');

  verifyQuestionText = (index, text) => {
    this.getQuestionByIndex(index);
    this.getQuestionText().should("contain", text);
  };

  getQuestionByIndex = index => {
    this.getQueDropDown()
      .click({ force: true })
      .parent()
      .next()
      .find("li")
      .eq(index)
      .click();
  };

  verifyMaxScoreOfQueByIndex = (index, maxscore) => {
    cy.get('[data-cy="questionNumber"]').click({ force: true });
    cy.get(".ant-select-dropdown-menu-item")
      .eq(index)
      .click({ force: true });
    cy.get('[data-cy="maxscore"]').should("contain", maxscore);
  };

  attemptQuestionsByQueType = (queType, attempt) => {
    queType.forEach((type, index) => {
      this.attemptQuestion(type, "right", attempt[index]);
      this.clickOnNext();
    });
  };

  verifyNoOfQuesInReview = len => {
    cy.get('[data-cy="questionNumber"]').click({ force: true });
    cy.get(".ant-select-dropdown-menu-item").should("have.length", len);
  };
  // Feedback

  verifyFeedback = feedback => cy.get('[data-cy="feedBack"]').should("contain.text", feedback);

  verifyScore = (score, maxScore) => {
    cy.get('[data-cy="score"]').should("have.text", `${score}`);
    cy.get('[data-cy="maxscore"]').should("have.text", `${maxScore}`);
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
}
export default StudentTestPage;
