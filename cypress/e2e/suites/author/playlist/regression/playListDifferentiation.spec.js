import TeacherSideBar from "../../../../framework/author/SideBarPage";
import FileHelper from "../../../../framework/util/fileHelper";
import DifferentiationPage from "../../../../framework/author/playlist/differentiationPage";

describe(`${FileHelper.getSpecName(Cypress.spec.name)}>> Playlist Recommendations`, () => {
  const differentiationPage = new DifferentiationPage();
  const sidebar = new TeacherSideBar();
  const assignment1 = "Test One for Automation - Playlist Recommendation (5.G.A.1)";
  const assignment2 = "Test Two for Automation - Playlist Recommendation (5.MD.A.1)";
  const assignment3 = "Test Three for Automation - Playlist Recommendation (5.G.A.1 and 5.G.A.2)";
  const assignment4 = "Test Four - Automation"; // Assignment - not marked as done
  const class1 = "Class One - Playlist";
  const class2 = "Class Two Playlist";
  const standard1 = "5.G.A.1";
  const standard2 = "5.G.A.2";
  const standard3 = "5.MD.A.1";
  const customizedTests = [
    { id: "5e78e3974b09d80007cbcc51", name: "Test_for_Differentiation_tab_Review_Work", target: "REVIEW" },
    { id: "5e78e48aa609890008de851e", name: "Test for Differentiation Tab - Practice Work", target: "PRACTICE" },
    { id: "5e78e54a1e75ab000741efd6", name: "Test for Differentiation tab - for Challenge work", target: "CHALLENGE" }
  ];
  const reviewMasteryRange = [
    { mastery: 55, studCount: 0 },
    { mastery: 60, studCount: 1 },
    { mastery: 80, studCount: 2 },
    { mastery: 100, studCount: 3 }
  ];
  const practiceMasteryRange = [
    { masteryMin: 50, MasteryMax: 59, studCount: 0 },
    { masteryMin: 50, MasteryMax: 79, studCount: 1 },
    { masteryMin: 60, MasteryMax: 80, studCount: 2 },
    { masteryMin: 60, MasteryMax: 100, studCount: 3 }
  ];
  const challengeMasteryRange = [
    { mastery: 90, studCount: 1 },
    { mastery: 80, studCount: 2 },
    { mastery: 60, studCount: 3 }
  ];
  const teacher = {
    email: "teacher.playlist.recommendation@automation.com",
    password: "automation"
  };
  const assignmentMapping = [
    { name: assignment1, class: class1, standards: [standard1] },
    { name: assignment2, class: class2, standards: [standard3] },
    { name: assignment3, class: class1, standards: [standard1, standard2] }
  ];
  const standardMapping = [
    { standard: standard1, reviewStandards: ["4.G.A.1"], challengeStandards: ["6.G.A.1"] },
    {
      standard: standard2,
      reviewStandards: ["4.MD.A.1", "4.MD.A.2", "4.MD.A.3", "4.MD.B.4"],
      challengeStandards: ["6.NS.A.1", "6.NS.B.2", "6.NS.B.3"]
    },
    {
      standard: standard3,
      reviewStandards: ["4.G.A.1", "4.G.A.2"],
      challengeStandards: ["6.G.A.1", "6.G.A.2"]
    }
  ];

  context(">Verify Differentiation Tab", () => {
    before("Use Playlist and navigate to Differentiation Tab", () => {
      cy.login("teacher", teacher.email, teacher.password);
      sidebar.clickOnRecentUsedPlayList("PlayList for Automation - Recommendation feature");
      differentiationPage.clickOnDifferentiationTab();
    });

    it("[TC01] > Verify Assignment and Class Dropdowns", () => {
      for (let value of assignmentMapping) {
        differentiationPage.selectAssignment(value.name);
        differentiationPage.selectClass(value.class);
        differentiationPage.getAssignmentSelect().should("contain", value.name);
        differentiationPage.getClassSelect().should("contain", value.class);
      }
      differentiationPage.verifyAssignmentNotPresentInDropDown(assignment4); //verify assignment - not marked as done
    });

    it("[TC02] > Verify Review Work and Challenge work Standards for each assignment", () => {
      assignmentMapping.forEach((element, index) => {
        differentiationPage.selectAssignment(element.name);
        differentiationPage.selectClass(element.class);
        standardMapping[index].reviewStandards.forEach((ele, ind) => {
          differentiationPage.getReviewTestByIndex(ind).should("contain", ele);
        });
        differentiationPage
          .getReviewStandardsRows()
          .should("have.length", standardMapping[index].reviewStandards.length);
        standardMapping[index].challengeStandards.forEach((ele, ind) => {
          differentiationPage.getChallengeTestByIndex(ind).should("contain", ele);
        });
        differentiationPage
          .getChallengeStandardsRows()
          .should("have.length", standardMapping[index].challengeStandards.length);
      });
    });

    it("[TC03] > Verify Mastery Range Slider", () => {
      differentiationPage.selectAssignment(assignment1);
      differentiationPage.selectClass(class1);
      for (let value of reviewMasteryRange) {
        differentiationPage.setAndVerifyReviewMasteryRange(value.mastery);
        differentiationPage.verifyReviewStudentCount(value.studCount);
      }
      for (let value of practiceMasteryRange) {
        differentiationPage.setAndVerifyPracticeMasteryRange(value.masteryMin, value.MasteryMax);
        differentiationPage.verifyPracticeStudentCount(value.studCount);
      }
      for (let value of challengeMasteryRange) {
        differentiationPage.setAndVerifyChallengeMasteryRange(value.mastery);
        differentiationPage.verifyChallengeStudentCount(value.studCount);
      }
    });

    it("[TC04] > Verify Checkboxes and buttons", () => {
      differentiationPage.selectAssignment(assignment2);
      differentiationPage.selectClass(class2);
      differentiationPage.verifySelectAllReviewWork();
      differentiationPage.verifyUnselectAllReviewWork();
      differentiationPage.verifyAddButtonVisibility("REVIEW");
      differentiationPage.verifySelectAllPracticeWork();
      differentiationPage.verifyUnselectAllPracticeWork();
      differentiationPage.verifyAddButtonVisibility("PRACTICE");
      differentiationPage.verifySelectAllChallengeWork();
      differentiationPage.verifyUnselectAllChallengeWork();
      differentiationPage.verifyAddButtonVisibility("CHALLENGE");
    });

    it("[TC05] > Verify Manage Content tab -Drag test and verify", () => {
      differentiationPage.selectAssignment(assignment1);
      differentiationPage.selectClass(class1);
      differentiationPage.clickOnManageContent();
      for (let value of customizedTests) {
        differentiationPage.dragTestFromSearchToSectionAndVerify(value.target, value.id, value.name);
      }
    });
  });
});
