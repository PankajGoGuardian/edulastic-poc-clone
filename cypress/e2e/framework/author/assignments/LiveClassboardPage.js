/* eslint-disable class-methods-use-this */
import LCBHeader from "./lcbHeader";
import { studentSide as asgnStatus, studentSide, teacherSide } from "../../constants/assignmentStatus";
import QuestionResponsePage from "./QuestionResponsePage";
import { attemptTypes, queColor } from "../../constants/questionTypes";
import RediectPopup from "./redirectPopupPage";
import TeacherSideBar from "../SideBarPage";
import LCBtestSettings from "./lcbTestSettings";

class LiveClassboardPage {
  constructor() {
    this.header = new LCBHeader();
    this.questionResponsePage = new QuestionResponsePage();
    this.redirectPopup = new RediectPopup();
    this.settings = new LCBtestSettings();
  }

  // *** ELEMENTS START ***

  getQuestionsTab = () => cy.get("[data-cy=studentnQuestionTab]").contains("a", "QUESTIONS");

  getSubmitSummary = () => cy.get('[data-cy="submittedSummary"]');

  getCardIndex = studentName =>
    cy
      .get('[data-cy="studentName"]')
      .contains(studentName)
      .then(ele => Cypress.$('[data-cy="studentName"]').index(ele));

  getStudentCardByStudentName = studentName => {
    const selector = `[data-cy="student-card-${studentName}"]`;
    return cy.get(selector);
  };

  getAllStudentStatus = () => cy.get('[data-cy="studentName"]').next();

  getStudentStatusByIndex = index => this.getAllStudentStatus().eq(index);

  getStudentScoreByIndex = index => cy.get('[data-cy="studentScore"]').eq(index);

  getViewResponseByIndex = index => cy.get('[data-cy="viewResponse"]').eq(index);

  getQuestionsByIndex = index => cy.get('[data-cy="questions"]').eq(index);

  getViewResponseByStudentName = stuName => this.getStudentCardByStudentName(stuName).find('[data-cy="viewResponse"]');

  getStudentNameByName = stuName => this.getStudentCardByStudentName(stuName).find('[data-cy="studentName"]');

  getAllStudentName = () =>
    cy.get('[data-cy="studentName"]').then($ele => {
      const studentNames = [];
      $ele.each((i, s) => {
        console.log("$student ", s);
        studentNames.push(Cypress.$(s).text());
      });
      return studentNames;
    });

  getAvatarNameByStudentName = stuName =>
    this.getStudentCardByStudentName(stuName).find('[data-cy="studentAvatarName"]');

  getStudentPerformanceByIndex = index => cy.get('[data-cy="studentPerformance"]').eq(index);

  getQuestionsTab = () => cy.get("[data-cy=studentnQuestionTab]").contains("a", "QUESTIONS");

  getAvgScore = () => cy.get(".ant-progress-text");

  getRedirecPopUp = () => cy.get(".ant-modal-content");

  getConfirmationInput = () => cy.get('[data-cy="confirmationInput"]');

  getTimewhileRedirect = () => cy.get('[data-cy="allowedTime"]');

  getCardViewTab = () => cy.get("[data-cy=studentnQuestionTab]").contains("a", "CARD VIEW");

  getStudentsTab = () => cy.get("[data-cy=studentnQuestionTab]").contains("a", "STUDENTS");

  getPresentToggleSwitch = () => cy.get("[data-cy=studentnQuestionTab]").find('[class^="PresentationToggleSwitch"]');

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  clickOnCardViewTab = () => {
    this.getCardViewTab()
      .click({ force: true })
      .should("have.css", "background-color", queColor.BLUE_2);
  };

  clickOnStudentsTab = () => {
    this.getStudentsTab()
      .click({ force: true })
      .should("have.css", "background-color", queColor.BLUE_2);
    cy.contains("Student Feedback!"); // waiting for UI to render
  };

  clickonQuestionsTab = () => {
    cy.server();
    cy.route("GET", /\bitem\b.*\bgroup\b/).as("getFirstQuestion");
    cy.route("GET", "**/test/**").as("get-test-data");
    this.getQuestionsTab()
      .click({ force: true })
      .should("have.css", "background-color", queColor.BLUE_2);
    cy.wait("@get-test-data");
    return cy
      .wait("@getFirstQuestion")
      .then(xhr => xhr.response.body.result[0] && xhr.response.body.result[0].testItemId);
  };

  clickOnPresent = () => {
    this.getPresentToggleSwitch().then($ele => {
      if (
        Cypress.$($ele)
          .text()
          .includes("PRESENT")
      )
        cy.wrap($ele)
          .click({ force: true })
          .should("contain.text", "RESET");
    });
  };

  clickOnReset = () => {
    this.getPresentToggleSwitch().then($ele => {
      if (
        Cypress.$($ele)
          .text()
          .includes("RESET")
      )
        cy.wrap($ele)
          .click({ force: true })
          .should("contain.text", "PRESENT");
    });
  };

  selectCheckBoxByStudentName = student => {
    this.getStudentCardByStudentName(student)
      .find('input[type="checkbox"]')
      .click({ force: true });
  };

  clickOnRedirect = () => cy.get('[data-cy="rediectButton"]').click();

  clickOnRedirectSubmit = () => {
    cy.server();
    cy.route("POST", "**/redirect").as("redirect");
    cy.route("GET", "**/test-activity").as("testactivity");
    this.getRedirecPopUp()
      .get('[data-cy="confirmRedirect"]')
      .click({ force: true });
    cy.wait("@redirect").then(xhr => {
      expect(xhr.status).to.equal(200);
      expect(xhr.response.body.result).to.eq("Assignment Redirect is successful");
    });

    // FIXME: page doesn't update unless refresh on Cypress only,
    // need to revisit h. for now reloading the page to verify redirected stats
    // cy.reload();
    // cy.wait("@testactivity");
  };

  // lcb > MORE actions

  clickOnMore = () => cy.get('[data-cy="moreAction"]').click({ force: true });

  // SUBMIT
  clickOnMarkAsSubmit = () => {
    cy.server();
    cy.route("POST", "**/mark-as-submitted").as("markSubmit");
    this.clickOnMore().then(() => cy.get('[data-cy="markSubmitted"]').click());
    this.getConfirmationInput().type("SUBMIT");
    this.submitConfirmationInput();
    cy.wait("@markSubmit").then(xhr => assert(xhr.status === 200, `verify submit request ${xhr.status}`));
  };

  submitConfirmationInput = () => cy.get('[data-cy="submitConfirm"]').click();

  // ABSENT
  clickOnMarkAsAbsent = (isAllow = true) => {
    cy.server();
    cy.route("POST", "**/mark-as-absent").as("markAbsent");
    this.clickOnMore().then(() => cy.get('[data-cy="markAbsent"]').click());
    if (isAllow) {
      this.getConfirmationInput().type("ABSENT");
      this.submitConfirmationInput();
      cy.wait("@markAbsent").then(xhr => assert(xhr.status === 200, `verify absent request ${xhr.status}`));
    } else {
      cy.contains("selected have already started the assessment, you will not be allowed to mark as absent").should(
        "be.visible"
      );
    }
  };

  // REMOVE
  clickOnRemove = (isAllow = true) => {
    cy.server();
    cy.route("PUT", "**/remove-students").as("removeStudents");
    this.clickOnMore().then(() => cy.get('[data-cy="removeStudents"]').click());
    if (isAllow) {
      this.getConfirmationInput().type("REMOVE");
      this.submitConfirmationInput();
      cy.wait("@removeStudents").then(xhr => assert(xhr.status === 200, `verify remove request ${xhr.status}`));
    } else {
      cy.contains("You will not be able to remove selected student(s) as the status is graded").should("be.visible");
    }
  };

  // ADD STUDENT
  clickOnAddStudent = () => {
    cy.server();
    cy.route("GET", "**/enrollment/**").as("enrollment");
    cy.route("PUT", "**/add-students").as("addStudents");
    this.clickOnMore().then(() => cy.get('[data-cy="addStudents"]').click());
    cy.wait("@enrollment");
  };

  addOneStudent = (stuEmail, isEnabled = true) => {
    this.clickOnAddStudent();
    cy.get('[data-cy="selectStudents"]').click();
    cy.get(".ant-select-dropdown-menu-item")
      .contains(stuEmail)
      .then(ele => {
        if (isEnabled) {
          cy.wrap(ele).click({ force: true });
          cy.focused().blur();
          cy.get('[data-cy="addButton"]').click({ force: true });
          cy.wait("@addStudents").then(xhr => assert(xhr.status === 200, `verify add student request ${xhr.status}`));
          cy.contains("Successfully added").should("be.visible", "verify Successfully added message");
        } else {
          cy.wrap(ele).should(
            "have.class",
            "ant-select-dropdown-menu-item-disabled",
            "verify existing studnet should be disabled in list"
          );
          cy.focused().blur();
        }
      });
  };

  copyPassword = () => cy.get('[data-cy="password"]').invoke("text");

  closePassWord = () =>
    cy
      .get("button")
      .find(".ant-modal-close-icon")
      .click();

  updateTimeWhileRedirect = time => this.getTimewhileRedirect().type(`{selectall}${time}`);

  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  verifyTimeWhileRedirectIs = time => this.getTimewhileRedirect().should("have.value", `${time}`);

  verifyClassAndAssignmntId = (classId, assignmnetId) =>
    cy.url().should("include", `/author/classboard/${assignmnetId}/${classId}`);

  checkClassName(className) {
    return cy.get("[data-cy=CurrentClassName]").contains(className);
  }

  checkSummaryTabIsPresent() {
    return cy
      .get("[data-cy=Summary]")
      .contains("Summary")
      .should("be.visible");
  }

  checkLiveClassBoardTabIsPresent() {
    return cy
      .get("[data-cy=LiveClassBoard]")
      .contains("LIVE CLASS BOARD")
      .should("be.visible");
  }

  checkExpressGraderTabIsPresent() {
    return cy
      .get("[data-cy=Expressgrader]")
      .contains("EXPRESS GRADER")
      .should("be.visible");
  }

  checkStandardBasedReportTabIsPresent() {
    return cy
      .get("[data-cy=StandardsBasedReport]")
      .contains("STANDARDS BASED REPORT")
      .should("be.visible");
  }

  checkMoreTabIsPresent() {
    return cy.get("[data-cy=moreButton]").click();
  }

  checkMarkAsDoneIsPresentUnderMoreTab() {
    return cy
      .get("[data-cy=moreButton]")
      .next()
      .find("li")
      .eq(0)
      .contains("Mark as Done")
      .should("be.visible");
  }

  checkReleaseScoreIsPresentUnderMoreTab() {
    return cy
      .get("[data-cy=moreButton]")
      .next()
      .find("li")
      .eq(1)
      .contains("Release Score")
      .should("be.visible");
  }

  checkSelectAllCheckboxOfStudent = () => cy.get("[data-cy=selectAllCheckbox]").check({ force: true });

  uncheckSelectAllCheckboxOfStudent = () => cy.get("[data-cy=selectAllCheckbox]").uncheck({ force: true });

  checkStudentResponseIsDisplayed = () =>
    cy
      .get(".ant-card-body")
      .eq(1)
      .should("contain", "Student Response")
      .should("be.visible");

  verifySubmittedCount = (submitted, total) =>
    this.getSubmitSummary().should("contain.text", `${submitted} out of ${total} Submitted`);

  verifyAbsentCount = absent => this.getSubmitSummary().should("contain.text", `${absent} absent`);

  verifyStudentCard(studentName, status, score, performance, queAttempt, email) {
    const queCards = Object.keys(queAttempt).map(queNum => queAttempt[queNum]);
    this.getCardIndex(studentName).then(index => {
      let [totalScore, maxScore] = score.split("/").map(ele => ele.trim());
      if ([studentSide.ABSENT, studentSide.NOT_STARTED].indexOf(status) !== -1) totalScore = `-`;
      /*  // TODO : remove log once flow is commplted
      console.log(
        "stduent stats :: ",
        `${studentName}, ${status}, ${score}, ${performance}, ${JSON.stringify(queAttempt)} , ${queCards}`
      ); */

      this.getStudentNameByName(studentName).should("have.attr", "title", email);
      this.getAvatarNameByStudentName(studentName).should("have.attr", "title", email);
      this.verifyStudentStatusIsByIndex(index, status);
      this.verifyScoreByStudentIndex(index, totalScore, maxScore);
      this.getStudentPerformanceByIndex(index).should("have.text", performance);
      this.verifyQuestionCards(index, queCards);
      if ([studentSide.NOT_STARTED, studentSide.ABSENT].indexOf(status) === -1) {
        cy.server();
        cy.route("GET", "**/test-activity/**").as("test-activity");
        // this.getViewResponseByIndex(index)
        this.getViewResponseByStudentName(studentName)
          .should("be.exist")
          .click({ force: true })
          .then(() => {
            cy.wait("@test-activity");
            cy.get(".ant-select-selection-selected-value")
              .eq(0)
              .should("have.text", studentName);
          });
        this.clickOnCardViewTab();
        // } else this.getViewResponseByIndex(index).should("not.be.exist");
      } else this.getViewResponseByStudentName(studentName).should("not.be.exist");
    });
  }

  // for performance on redirected student card on hover
  verifyStudentCardRedirectedPerformance({ studentName, attempt1, attempt2, attempt3 }) {}

  verifyStudentStatusIsByIndex = (index, status, isManualGraded = false) => {
    if (!isManualGraded)
      this.getStudentStatusByIndex(index).should($ele => {
        const studentStatus = Cypress.$($ele)
          .text()
          .toLowerCase()
          .trim();
        expect(studentStatus).to.eq((status === asgnStatus.SUBMITTED ? asgnStatus.GRADED : status).toLowerCase());
      });
    else
      this.getStudentStatusByIndex(index).should($ele => {
        const studentStatus = Cypress.$($ele)
          .text()
          .toLowerCase()
          .trim();
        expect(studentStatus).to.eq(status.toLowerCase());
      });
  };

  verifyRedirectIcon = student => {
    this.getStudentCardByStudentName(student)
      .find('[data-cy="redirected"]')
      .should("be.exist");
  };

  verifyStudentsOnRedirectPopUp = student =>
    this.getRedirecPopUp()
      .find(".ant-select-selection__choice__content")
      .should("contain.text", student);

  verifyQuestion = queCount =>
    cy.get('[data-cy="questions"]').each((ele, index, $all) => {
      cy.wrap(ele)
        .find("div")
        .should("have.length", queCount);
    });

  verifyQuestionCards = (index, queCards) => {
    this.getQuestionsByIndex(index).then(ele => {
      queCards.forEach((que, qindex) => {
        switch (que) {
          case attemptTypes.RIGHT:
            expect(
              ele
                .find("div")
                .eq(qindex)
                .css("background-color")
            ).to.eq(queColor.RIGHT);
            break;

          case attemptTypes.WRONG:
            expect(
              ele
                .find("div")
                .eq(qindex)
                .css("background-color")
            ).to.eq(queColor.WRONG);
            break;

          case attemptTypes.PARTIAL_CORRECT:
            expect(
              ele
                .find("div")
                .eq(qindex)
                .css("background-color")
            ).to.eq(queColor.YELLOW);
            break;

          case attemptTypes.SKIP:
            expect(
              ele
                .find("div")
                .eq(qindex)
                .css("background-color")
            ).to.eq(queColor.SKIP);
            break;

          case attemptTypes.MANUAL_GRADE:
            expect(
              ele
                .find("div")
                .eq(qindex)
                .css("background-color")
            ).to.eq(queColor.MANUAL_GRADE);
            break;

          default:
            expect(
              ele
                .find("div")
                .eq(qindex)
                .css("background-color")
            ).to.eq(queColor.NO_ATTEMPT);
            break;
        }
      });
    });
  };

  getScoreAndPerformance = (attempt, queTypeMap, queNum, queCentric = false) => {
    let totalScore = 0;
    let maxScore = 0;
    let score;
    let perf;
    let perfValue;
    let stats;
    const quePerformanceAllStudent = [];
    let quePerformanceScore;
    let sumAvgQuePerformance = 0;

    Object.keys(attempt).forEach(item => {
      const attempType = attempt[item];
      const { points, attemptData, queKey } = queCentric ? queTypeMap[queNum] : queTypeMap[item];
      // if (attempType === attemptTypes.RIGHT) totalScore += points;
      const score = this.questionResponsePage.getScoreByAttempt(attemptData, points, queKey.split(".")[0], attempType);
      totalScore += score;
      maxScore += points;
      quePerformanceAllStudent.push(score / points);
    });

    quePerformanceAllStudent.forEach(item => {
      sumAvgQuePerformance += item;
    });

    score = `${totalScore} / ${maxScore}`;
    perfValue = Cypress._.round((parseFloat(totalScore) / parseFloat(maxScore)) * 100, 2);
    perf = `${perfValue}%`;
    quePerformanceScore = `${Cypress._.round(sumAvgQuePerformance, 2)} / ${quePerformanceAllStudent.length}`;
    return { score, perf, perfValue, quePerformanceScore, totalScore, maxScore };
    // return stats;
  };

  getFeedBackScore = (feedbackMap, queTypeMap) => {
    const score = {};
    Object.keys(feedbackMap).forEach(queNum => {
      const attempType = feedbackMap[queNum];
      const { points, attemptData, queKey } = queTypeMap[queNum];
      // score[queNum] = attempType === attemptTypes.RIGHT ? points : "0";
      score[queNum] = this.questionResponsePage.getScoreByAttempt(
        attemptData,
        points,
        queKey.split(".")[0],
        attempType
      );
    });

    return score;
  };

  verifyAvgScore(statsMap) {
    let scoreObtain = 0;
    let totalMaxScore = 0;
    Object.keys(statsMap).forEach(studentName => {
      const { score, status } = statsMap[studentName];
      const [scored, max] = score.split("/");
      // if (status === asgnStatus.SUBMITTED || status === asgnStatus.GRADED) {
      if (status !== asgnStatus.NOT_STARTED) {
        // submittedCount += 1;
        scoreObtain += parseFloat(scored);
        totalMaxScore += parseFloat(max);
      }
    });

    const avgPerformance = `${Cypress._.round((scoreObtain / totalMaxScore) * 100)}%`;
    this.getAvgScore().should("have.text", avgPerformance);
  }

  verifyStudentCentricCard(studentName, studentAttempts, questionTypeMap, cardEntry = true) {
    if (cardEntry) {
      this.questionResponsePage.selectStudent(studentName);
      Object.keys(studentAttempts).forEach((queNum, qIndex) => {
        const attemptType = studentAttempts[queNum];
        const { queKey, attemptData, points } = questionTypeMap[queNum];
        this.questionResponsePage.verifyQuestionResponseCard(points, queKey, attemptType, attemptData, true, qIndex);
      });
    } else {
      this.questionResponsePage.verifyOptionDisabled(studentName);
    }
  }

  verifyQuestionCentricCard = (queNum, studentAttempts, questionTypeMap) => {
    this.questionResponsePage.selectQuestion(queNum);
    Object.keys(studentAttempts).forEach(studentName => {
      const attemptType = studentAttempts[studentName];
      if (attemptType !== null) {
        const { queKey, attemptData, points } = questionTypeMap[queNum];
        this.questionResponsePage.verifyQuestionResponseCard(
          points,
          queKey,
          attemptType,
          attemptData,
          false,
          studentName
        );
      } else {
        this.questionResponsePage.verifyNoQuestionResponseCard(studentName);
      }
    });
  };

  updateScore = (studentName, score, feedback) => {
    Object.keys(score).forEach(queNum => {
      this.questionResponsePage.selectQuestion(queNum);
      this.questionResponsePage.updateScoreAndFeedbackForStudent(studentName, score[queNum], feedback);
    });
  };

  getRedirectedQuestionCentricData = (redirectedData, queCentric, attempted = true) => {
    const reDirectedQueCentric = Object.assign({}, queCentric);
    const reDirectedQueCentricBeforeAttempt = Object.assign({}, queCentric);
    redirectedData.forEach(({ attempt, stuName }) => {
      Object.keys(attempt).forEach(queNum => {
        if (attempted) {
          reDirectedQueCentric[queNum][stuName] = attempt[queNum];
        } else {
          reDirectedQueCentricBeforeAttempt[queNum][stuName] = null;
        }
      });
    });
    return attempted ? reDirectedQueCentric : reDirectedQueCentricBeforeAttempt;
  };

  getQuestionCentricData = (attemptsData, queCentric, onlySubmitted = false) => {
    attemptsData
      .filter(({ status }) => (onlySubmitted ? status === studentSide.SUBMITTED : status !== studentSide.NOT_STARTED))
      .forEach(({ attempt, stuName }) => {
        Object.keys(attempt).forEach(queNum => {
          if (!queCentric[queNum]) queCentric[queNum] = {};
          queCentric[queNum][stuName] = attempt[queNum];
        });
      });
    return queCentric;
  };

  getNullifiedAttempts = attempts => {
    const noAttempts = {};
    for (const key in attempts) {
      if (attempts.hasOwnProperty(key)) {
        noAttempts[key] = attemptTypes.NO_ATTEMPT;
      }
    }
    return noAttempts;
  };

  getQuestionTypeMap = (itemKeys, questionData, questionTypeMap) => {
    itemKeys.forEach((queKey, index) => {
      const [queType, questionKey] = queKey.split(".");
      const { attemptData, standards, choices } = questionData[queType][questionKey];
      const { points, correct } = questionData[queType][questionKey].setAns;
      const queMap = { queKey, points, attemptData, standards, choices, correct };
      questionTypeMap[`Q${index + 1}`] = queMap;
    });
    return questionTypeMap;
  };

  getAllStudentName = () =>
    cy.get('[data-cy="studentName"]').then($ele => {
      const studentNames = [];
      $ele.each((i, s) => {
        studentNames.push(Cypress.$(s).text());
      });
      return studentNames;
    });

  verifyScoreByStudentIndex = (index, totalScore, maxScore) =>
    this.getStudentScoreByIndex(index).then($ele =>
      expect($ele.text().replace(/\u00a0/g, " "), `verify student card score for student index ${index + 1}`).to.eq(
        `${totalScore} / ${maxScore}`
      )
    );

  // *** APPHELPERS END ***
}

export default LiveClassboardPage;
