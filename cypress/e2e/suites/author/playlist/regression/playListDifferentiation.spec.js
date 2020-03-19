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
  });
});
