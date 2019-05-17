/// <reference Types="Cypress"/>

import loginPage from "../../framework/student/loginPage";
import AuthorAssignmentPage from "../../framework/author/assignments/AuthorAssignmentPage";
import LiveClassboardPage from "../../framework/author/assignments/LiveClassboardPage";
import FileHelper from "../../framework/util/fileHelper";

const login = new loginPage();
const assignmentpage = new AuthorAssignmentPage();
const liveclassboard = new LiveClassboardPage();

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Teacher Assignment page UI`, () => {
  before(() => {
    cy.visit("/login");
    login.fillLoginForm("ashishsnap@snawpiz.com", "snapwiz");
    login.onClickSignin();
    cy.wait(5000); // TODO: remove wait time
  });

  it(" > Goto the Required Assignment ", () => {
    cy.visit("/author/assignments");
    cy.wait(5000); //TODO:Remove wait
    assignmentpage.clickOnEllipsis(0);
    assignmentpage.clickOnEllipsis(1);
    assignmentpage.clickOnPageIndex(10);
    assignmentpage.clickOnButtonToShowAllClassByIndex(1);
    assignmentpage.clcikOnPresenatationIconByIndex(0);
  });

  it(" > Verify class Name ", () => {
    liveclassboard.checkClassName("class3");
  });

  it(" > Verify all tabs in Header ", () => {
    liveclassboard.checkSummaryTabIsPresent();
    liveclassboard.checkLiveClassBoardTabIsPresent();
    liveclassboard.checkExpressGraderTabIsPresent();
    liveclassboard.checkStandardBasedReportTabIsPresent();
  });

  it(" > Verify Student and Question tab ", () => {
    liveclassboard.clickOnCardViewTab();
    liveclassboard.clickOnStudentsTab();
    liveclassboard.clickonQuestionsTab();
    liveclassboard.checkStudentResponseIsDisplayed();
    liveclassboard.clickOnStudentsTab();
    liveclassboard.clickOnCardViewTab();
  });
});
