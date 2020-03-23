import TeacherSideBar from "../../../../framework/author/SideBarPage";
import FileHelper from "../../../../framework/util/fileHelper";
import DifferentiationPage from "../../../../framework/author/playlist/differentiationPage";
import { recommendationType } from "../../../../framework/constants/assignmentStatus";
import SidebarPage from "../../../../framework/student/sidebarPage";
import { PlayListRecommendation } from "../../../../framework/student/playlistRecommnedationPage";
import StudentTestPage from "../../../../framework/student/studentTestPage";

const { _ } = Cypress;

describe(`${FileHelper.getSpecName(Cypress.spec.name)}>> Playlist Recommendations`, () => {
  const differentiationPage = new DifferentiationPage();
  const sidebar = new TeacherSideBar();
  const studentSidebar = new SidebarPage();
  const studentRecommendationTab = new PlayListRecommendation();
  const studentTestPage = new StudentTestPage();

  const assignment1 = "Test One for Automation - Playlist Recommendation (5.G.A.1)";
  const assignment2 = "Test Two for Automation - Playlist Recommendation (5.MD.A.1)";
  const assignment3 = "Test Three for Automation - Playlist Recommendation (5.G.A.1 and 5.G.A.2)";
  const class1 = "Playlist Recommendation Class-1";

  const standards = {
    1: "5.G.A.1",
    2: "5.G.A.2",
    3: "5.MD.A.1"
  };

  const teacher = {
    email: "teacher2.playlist.recommendation@automation.com",
    password: "automation"
  };

  const students = {
    1: {
      email: "student1.addrecommendation@snapwiz.com"
    },
    2: {
      email: "student2.addrecommendation@snapwiz.com"
    },
    3: {
      email: "student3.addrecommendation@snapwiz.com"
    }
  };

  const password = "automation";

  const standardMapping = [
    { standard: [standards[1]], reviewStandards: ["4.G.A.1"], challengeStandards: ["6.G.A.1"] },
    {
      standard: [standards[2]],
      reviewStandards: ["4.MD.A.1", "4.MD.A.2", "4.MD.A.3", "4.MD.B.4"],
      challengeStandards: ["6.NS.A.1", "6.NS.B.2", "6.NS.B.3"]
    },
    {
      standard: [standards[3]],
      reviewStandards: ["4.G.A.1", "4.G.A.2"],
      challengeStandards: ["6.G.A.1", "6.G.A.2"]
    }
  ];

  context(">add review recommendation and verify", () => {
    const standardId = standardMapping[0].reviewStandards[0];

    before("reset recommendation for all student", () => {
      _.keys(students).forEach(s => {
        cy.deletePlayListRecommendation(students[s].email, password);
      });
    });

    before("use playlist and navigate to differentiation tab", () => {
      cy.login("teacher", teacher.email, teacher.password);
      sidebar.clickOnRecentUsedPlayList();
      differentiationPage.clickOnDifferentiationTab();
    });

    it("add review recommendation and verify teachers side", () => {
      differentiationPage.checkStandardForReview(standardId);
      differentiationPage.clickOnAddByRecommendationType(recommendationType.REVIEW);
      differentiationPage.verifyStandardRowByStandard({
        type: recommendationType.REVIEW,
        standardId,
        notStartedCount: 1,
        added: true
      });
    });

    it("verify recommendation at student", () => {
      cy.login("student", students[3].email, password);
      studentSidebar.clickOnPlaylistLibrary();

      // verify before attempt
      studentRecommendationTab.clickOnRecommendation();
      studentRecommendationTab.veryRecommendationRow({
        assignmentName: assignment1,
        type: recommendationType.REVIEW,
        recommendationNumber: 1,
        standardIds: [standardId]
      });

      // attempt TODO: assertion on items of dynamic test
      studentRecommendationTab.clickOnPracticeByAssignmentName(assignment1);

      for (let q = 1; q <= 2; q++) {
        // TODO: attempt with actual response once items are identified
        studentTestPage.clickOnNext();
      }
      studentTestPage.clickSubmitButton();
    });

    it("verify student side after attempt ", () => {
      studentRecommendationTab.veryRecommendationRow({
        assignmentName: assignment1,
        type: recommendationType.REVIEW,
        recommendationNumber: 1,
        standardIds: [standardId],
        attempted: true,
        score: "0/2",
        mastery: "0"
      });
    });

    it("verify teacher side after attempt ", () => {
      cy.login("teacher", teacher.email, teacher.password);
      sidebar.clickOnRecentUsedPlayList();
      differentiationPage.clickOnDifferentiationTab();
      differentiationPage.verifyStandardRowByStandard({
        type: recommendationType.REVIEW,
        standardId,
        notStartedCount: 0,
        added: true,
        avgMastery: 0
      });
    });

    it("verify other students should not get recommendation", () => {
      _.keys(students).forEach(s => {
        if (s != 3) {
          cy.login("student", students[s].email, password);
          studentSidebar.clickOnPlaylistLibrary();
          studentRecommendationTab.clickOnRecommendation();
          cy.contains("No Recommendations").should("be.visible");
        }
      });
    });
  });

  context(">add challenge recommendation and verify", () => {
    const standardId = standardMapping[0].challengeStandards[0];

    before("reset recommendation for all student", () => {
      _.keys(students).forEach(s => {
        cy.deletePlayListRecommendation(students[s].email, password);
      });
    });

    before("use playlist and navigate to differentiation tab", () => {
      cy.login("teacher", teacher.email, teacher.password);
      sidebar.clickOnRecentUsedPlayList();
      differentiationPage.clickOnDifferentiationTab();
    });

    it("add challenge recommendation and verify teachers side", () => {
      differentiationPage.checkStandardForChallenge(standardId);
      differentiationPage.clickOnAddByRecommendationType(recommendationType.CHALLENGE);
      differentiationPage.verifyStandardRowByStandard({
        type: recommendationType.CHALLENGE,
        standardId,
        notStartedCount: 1,
        added: true
      });
    });

    it("verify recommendation at student", () => {
      cy.login("student", students[1].email, password);
      studentSidebar.clickOnPlaylistLibrary();

      // verify before attempt
      studentRecommendationTab.clickOnRecommendation();
      studentRecommendationTab.veryRecommendationRow({
        assignmentName: assignment1,
        type: recommendationType.CHALLENGE,
        recommendationNumber: 1,
        standardIds: [standardId]
      });

      // attempt TODO: assertion on items of dynamic test
      studentRecommendationTab.clickOnPracticeByAssignmentName(assignment1);

      for (let q = 1; q <= 2; q++) {
        // TODO: attempt with actual response once items are identified
        studentTestPage.clickOnNext();
      }
      studentTestPage.clickSubmitButton();
    });

    it("verify student side after attempt ", () => {
      studentRecommendationTab.veryRecommendationRow({
        assignmentName: assignment1,
        type: recommendationType.CHALLENGE,
        recommendationNumber: 1,
        standardIds: [standardId],
        attempted: true,
        score: "0/2",
        mastery: "0"
      });
    });

    it("verify teacher side after attempt ", () => {
      cy.login("teacher", teacher.email, teacher.password);
      sidebar.clickOnRecentUsedPlayList();
      differentiationPage.clickOnDifferentiationTab();
      differentiationPage.verifyStandardRowByStandard({
        type: recommendationType.CHALLENGE,
        standardId,
        notStartedCount: 0,
        added: true,
        avgMastery: 0
      });
    });

    it("verify other students should not get recommendation", () => {
      _.keys(students).forEach(s => {
        if (s != 1) {
          cy.login("student", students[s].email, password);
          studentSidebar.clickOnPlaylistLibrary();
          studentRecommendationTab.clickOnRecommendation();
          cy.contains("No Recommendations").should("be.visible");
        }
      });
    });
  });

  context(">add practice recommendation and verify", () => {
    const standardId = standards[1];

    before("reset recommendation for all student", () => {
      _.keys(students).forEach(s => {
        cy.deletePlayListRecommendation(students[s].email, password);
      });
    });

    before("use playlist and navigate to differentiation tab", () => {
      cy.login("teacher", teacher.email, teacher.password);
      sidebar.clickOnRecentUsedPlayList();
      differentiationPage.clickOnDifferentiationTab();
    });

    it("add practice recommendation and verify teachers side", () => {
      differentiationPage.checkStandardForPractice(standardId);
      differentiationPage.clickOnAddByRecommendationType(recommendationType.PRACTICE);
      differentiationPage.verifyStandardRowByStandard({
        type: recommendationType.PRACTICE,
        standardId,
        notStartedCount: 1,
        added: true
      });
    });

    it("verify recommendation at student", () => {
      cy.login("student", students[2].email, password);
      studentSidebar.clickOnPlaylistLibrary();

      // verify before attempt
      studentRecommendationTab.clickOnRecommendation();
      studentRecommendationTab.veryRecommendationRow({
        assignmentName: assignment1,
        type: recommendationType.PRACTICE,
        recommendationNumber: 1,
        standardIds: [standardId]
      });

      // attempt TODO: assertion on items of dynamic test
      studentRecommendationTab.clickOnPracticeByAssignmentName(assignment1);
      for (let q = 1; q <= 2; q++) {
        // TODO: attempt with actual response once items are identified
        studentTestPage.clickOnNext();
      }
      studentTestPage.clickSubmitButton();
    });

    it("verify student side after attempt ", () => {
      studentRecommendationTab.veryRecommendationRow({
        assignmentName: assignment1,
        type: recommendationType.PRACTICE,
        recommendationNumber: 1,
        standardIds: [standardId],
        attempted: true,
        score: "0/2",
        mastery: "0"
      });
    });

    it("verify teacher side after attempt ", () => {
      cy.login("teacher", teacher.email, teacher.password);
      sidebar.clickOnRecentUsedPlayList();
      differentiationPage.clickOnDifferentiationTab();
      differentiationPage.verifyStandardRowByStandard({
        type: recommendationType.PRACTICE,
        standardId,
        notStartedCount: 0,
        added: true,
        avgMastery: 0
      });
    });

    it("verify other students should not get recommendation", () => {
      _.keys(students).forEach(s => {
        if (s != 2) {
          cy.login("student", students[s].email, password);
          studentSidebar.clickOnPlaylistLibrary();
          studentRecommendationTab.clickOnRecommendation();
          cy.contains("No Recommendations").should("be.visible");
        }
      });
    });
  });
});
