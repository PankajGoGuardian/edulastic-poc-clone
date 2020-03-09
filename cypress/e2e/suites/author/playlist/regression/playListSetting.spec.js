import PlayListLibrary from "../../../../framework/author/playlist/playListLibrary";
import FileHelper from "../../../../framework/util/fileHelper";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import StudentTestPage from "../../../../framework/student/studentTestPage";
import AssignmentsPage from "../../../../framework/student/assignmentsPage";
import TestSettings from "../../../../framework/author/tests/testDetail/testSettingsPage";
import { CALCULATOR, attemptTypes, questionTypeKey } from "../../../../framework/constants/questionTypes";
import AuthorAssignmentPage from "../../../../framework/author/assignments/AuthorAssignmentPage";
import LiveClassboardPage from "../../../../framework/author/assignments/LiveClassboardPage";
import ReportsPage from "../../../../framework/student/reportsPage";
import {
  releaseGradeTypes,
  releaseGradeTypesDropDown as release
} from "../../../../framework/constants/assignmentStatus";
import SidebarPage from "../../../../framework/student/sidebarPage";
import PlayListAssign from "../../../../framework/author/playlist/playListAssignPage";

describe(`${FileHelper.getSpecName(Cypress.spec.name)}>>module authoring and assigning`, () => {
  const playListLibrary = new PlayListLibrary();
  const testLibrary = new TestLibrary();
  const studentTestPage = new StudentTestPage();
  const assignmentsPage = new AssignmentsPage();
  const playListAssign = new PlayListAssign();
  const testSettings = new TestSettings();
  const authorAssignmentPage = new AuthorAssignmentPage();
  const lcb = new LiveClassboardPage();
  const reportsPage = new ReportsPage();
  const sidebarPage = new SidebarPage();

  const maxattempts = 3;
  const staticPass = ["123456", "abcdefg"];
  const testToCreate = ["search_1", "search_2"];
  const testIds = [];
  const dynamicPassword = [];
  const playListData = {
    name: "Play List",
    grade: "Grade 10",
    subject: "Social Studies"
  };
  const student = {
    email: "student.playlistBasic@snapwiz.com",
    pass: "snapwiz"
  };
  const attemptData = {
    right: "right",
    wrong: "wrong"
  };
  const teacher = {
    email: "teacher.playlistBasic@snapwiz.com",
    pass: "snapwiz"
  };
  before("create test", () => {
    cy.login("teacher", teacher.email, teacher.pass);
    testToCreate.forEach((test, i) => {
      testLibrary.createTest(test, false).then(id => {
        testIds[i] = id;
        testLibrary.header.clickOnSettings();
        if (i === 0) testSettings.clickOnCalculatorByType(CALCULATOR.SCIENTIFIC);
        else testSettings.setCheckAnswer(2);
        testSettings.setRealeasePolicy(releaseGradeTypes.SCORE_ONLY);
        testSettings.clickOnPassword();
        testSettings.clickOnStaticPassword();
        if (i === 0) testSettings.enterStaticPassword(staticPass[0]);
        else testSettings.enterStaticPassword(staticPass[1]);
        testLibrary.header.clickOnPublishButton();
        cy.contains("Share With Others");
      });
    });
  });
  context("> authoring", () => {
    before("create play list", () => {
      cy.deleteAllAssignments("", teacher.email);
      cy.login("teacher", teacher.email, teacher.pass);
      playListLibrary.createPlayList(playListData);
    });
    it(">add test to modules", () => {
      playListLibrary.searchFilter.clearAll();
      testIds.forEach((id, index) => {
        playListLibrary.addTestTab.addTestByIdByModule(id, 1);
      });
      playListLibrary.header.clickOnPublish();
    });
    it(">assign whole module", () => {
      playListLibrary.header.clickOnUseThis();
      playListLibrary.reviewTab.clickOnAssignButtonByModule(1);
      playListAssign.selectClass("Class");
    });
    it(">over ride settings", () => {
      playListAssign.showOverRideSetting();
      playListAssign.clickOnCalculatorByType(CALCULATOR.GRAPH);
      playListAssign.setCheckAnsTries(maxattempts);
      playListAssign.clickDynamicPassword();
      playListAssign.setReleasePolicy(release.DONT_RELEASE);
      playListAssign.clickOnAssign();
    });

    it(">get dynamic password", () => {
      testLibrary.sidebar.clickOnAssignment();
      testToCreate.forEach((id, index) => {
        authorAssignmentPage.clcikOnPresenatationIconByIndex(0, index);
        lcb.header.clickOnOpen().then(() => {
          lcb.header.clickOnViewPassword();
          lcb.copyPassword().then(pass => {
            dynamicPassword.push(pass);
            lcb.closePassWord();
            cy.go("back");
          });
        });
      });
    });

    testToCreate.forEach((name, index) => {
      context(">student side verification-'overidden settings'", () => {
        before("login", () => {
          cy.login("student", student.email, student.pass);
        });
        it(`>password- Test ${index + 1}`, () => {
          assignmentsPage.clickOnAssigmentByTestId(testIds[index], dynamicPassword[index]);
        });
        it(`>calculator- Test ${index + 1}`, () => {
          studentTestPage.clickOnCalcuator();
          studentTestPage.assertCalcType(CALCULATOR.GRAPH);
          studentTestPage.clickOnCalcuator();
        });
        it(`>max attempts- Test ${index + 1}`, () => {
          for (let i = 0; i <= maxattempts; i++) {
            studentTestPage.attemptQuestion(questionTypeKey.TRUE_FALSE, attemptTypes.WRONG, attemptData);
            if (i !== maxattempts) studentTestPage.clickOnCheckAns();
            else studentTestPage.clickOnCheckAns(true);
          }
        });
        it(`>release policy- Test ${index + 1}`, () => {
          studentTestPage.clickOnNext();
          studentTestPage.submitTest();
          assignmentsPage.getReviewButtonById(testIds[index]).should("not.exist");
          reportsPage.getScore().should("not.exist");
          sidebarPage.clickOnAssignment();
        });
      });
    });
  });
});
