import PlayListLibrary from "../../../../framework/author/playlist/playListLibrary";
import FileHelper from "../../../../framework/util/fileHelper";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import AssignmentsPage from "../../../../framework/student/assignmentsPage";
import AuthorAssignmentPage from "../../../../framework/author/assignments/AuthorAssignmentPage";
import LiveClassboardPage from "../../../../framework/author/assignments/LiveClassboardPage";
import ExpressGraderPage from "../../../../framework/author/assignments/expressGraderPage";
import StandardBasedReportPage from "../../../../framework/author/assignments/standardBasedReportPage";
import PlayListAssign from "../../../../framework/author/playlist/playListAssignPage";

describe(`${FileHelper.getSpecName(Cypress.spec.name)}>>playlist assigning`, () => {
  const playListLibrary = new PlayListLibrary();
  const testLibrary = new TestLibrary();
  const assignmentsPage = new AssignmentsPage();
  const authorAssignmentPage = new AuthorAssignmentPage();
  const playListAssign = new PlayListAssign();
  const lcb = new LiveClassboardPage();
  const egp = new ExpressGraderPage();
  const sbr = new StandardBasedReportPage();

  let playListId;
  let assignMentIdObj;
  let testCount;
  let length;
  const classId = "5e4d1b7a201714000788cab7";

  const testToCreate = ["search_1", "search_2"];
  const originalTestIds = [];
  const playListData = {
    name: "Play List",
    grade: "Grade 10",
    subject: "Social Studies"
  };
  const student = {
    email: "student.playlistassign@snapwiz.com",
    pass: "snapwiz"
  };

  const teacher1 = {
    email: "teacher1.school1.dis1@snapwiz.com",
    pass: "snapwiz"
  };
  const teacher2 = {
    email: "teacher2.school1.dis1@snapwiz.com",
    pass: "snapwiz"
  };
  before(">create test", () => {
    cy.login("teacher", teacher1.email, teacher1.pass);
    testToCreate.forEach((test, i) => {
      testLibrary.createTest(test).then(id => {
        originalTestIds[i] = id;
        cy.contains("Share With Others");
      });
    });
  });
  before(">create play list", () => {
    cy.deleteAllAssignments("", teacher1.email);
    playListLibrary.createPlayList(playListData).then(id => {
      playListId = id;
    });
  });
  before(">add tests to module", () => {
    playListLibrary.searchFilter.clearAll();
    playListLibrary.searchFilter.getAuthoredByMe();
    originalTestIds.forEach(id => {
      playListLibrary.addTestTab.addTestByIdByModule(id, 1);
    });
    playListLibrary.header.clickOnReview();
    playListLibrary.header.clickOnPublish();
  });
  context(">play list assign", () => {
    context(">whole module", () => {
      it(">assign whole module", () => {
        testCount = 2;
        playListLibrary.header.clickOnUseThis();
        playListLibrary.reviewTab.clickOnAssignButtonByModule(1);
        playListAssign.selectClass("Class");
        playListAssign.clickOnAssign().then(idObj => {
          assignMentIdObj = idObj;
        });
      });
      it(">teacher side verification", () => {
        playListLibrary.sidebar.clickOnAssignment();
        authorAssignmentPage.getStatus().should("have.length", testCount);
        originalTestIds.forEach(id => {
          authorAssignmentPage.getAssignmentRowsTestById(id).should("exist");
        });
        playListLibrary.sidebar.clickOnPlayListByName(playListData.name);
        // TODO: Fix this once it is fixed
        // playListLibrary.reviewTab.verifyAssignedByModule(1);
      });

      it(">verify lcb,express grader and reports button", () => {
        cy.server();
        cy.route("GET", "**/playlists/*").as("goToPlayList");
        for (let k = 0; k < 3; k++) {
          // playListLibrary.reviewTab.clickExpandByModule(1);
          playListLibrary.reviewTab.clickShowAssignmentByTestByModule(1, 1);
          playListLibrary.reviewTab.clickLcbIconByTestByIndex(1, 1, k);
          k === 0
            ? lcb.verifyClassAndAssignmntId(classId, assignMentIdObj[originalTestIds[0]])
            : k === 1
            ? egp.verifyClassAndAssignmntId(classId, assignMentIdObj[originalTestIds[0]])
            : k === 2
            ? sbr.verifyClassAndAssignmntId(classId, assignMentIdObj[originalTestIds[0]])
            : assert.fail();
          cy.go("back");
          cy.wait("@goToPlayList");
        }
      });
      it(">student side verification", () => {
        cy.login("student", student.email, student.pass);
        assignmentsPage.getAssignmentButton().should("have.length", testCount);
        originalTestIds.forEach(id => {
          assignmentsPage.getAssignmentByTestId(id).should("exist");
        });
      });
    });
    context(">one test in a module", () => {
      before("create play list", () => {
        cy.deleteAllAssignments("", teacher1.email);
        testCount = 1;
        cy.login("teacher", teacher1.email, teacher1.pass);
        playListLibrary.getPlayListAndClickOnUseThisById(playListId);
      });
      it(">assign 1 tests in a module", () => {
        // playListLibrary.reviewTab.clickExpandByModule(1);
        playListLibrary.reviewTab.clickOnAssignByTestByModule(1, 1);
        playListAssign.selectClass("Class");
        playListAssign.clickOnAssign();
      });
      it(">teacher side verification", () => {
        playListLibrary.sidebar.clickOnAssignment();
        authorAssignmentPage.getStatus().should("have.length", testCount);
        authorAssignmentPage.getAssignmentRowsTestById(originalTestIds[0]).should("exist");

        playListLibrary.sidebar.clickOnPlayListLibrary();
        playListLibrary.searchFilter.clearAll();
        playListLibrary.sidebar.clickOnPlayListByName(playListData.name);
        // playListLibrary.reviewTab.verifyAssignedByTestByModule(1, 1);
      });
      it(">student side verification", () => {
        cy.login("student", student.email, student.pass);
        assignmentsPage.getAssignmentButton().should("have.length", testCount);
        assignmentsPage.getAssignmentByTestId(originalTestIds[0]).should("exist");
      });
    });
  });
  context(">reassign", () => {
    context(">reassign playList", () => {
      before(">get play list", () => {
        testCount = [originalTestIds[0], ...originalTestIds].length;
        cy.login("teacher", teacher1.email, teacher1.pass);
        playListLibrary.getPlayListAndClickOnUseThisById(playListId);
      });

      it(">assign whole module", () => {
        playListLibrary.reviewTab.clickOnAssignButtonByModule(1);
        playListAssign.selectClass("Class");
        playListAssign.clickOnAssign({ duplicate: true });
      });
      it(">teacher side verification", () => {
        playListLibrary.sidebar.clickOnAssignment();
        authorAssignmentPage.getStatus().should("have.length", testCount);
        originalTestIds.forEach(id => {
          id === originalTestIds[0] ? (length = 2) : (length = 1);
          authorAssignmentPage.getAssignmentRowsTestById(id).should("have.length", length);
        });
        playListLibrary.sidebar.clickOnPlayListByName(playListData.name);
        //   playListLibrary.reviewTab.verifyAssignedByModule(1);
      });
      it(">student side verification", () => {
        cy.login("student", student.email, student.pass);
        assignmentsPage.getAssignmentButton().should("have.length", testCount);
        originalTestIds.forEach(id => {
          id === originalTestIds[0] ? (length = 2) : (length = 1);
          assignmentsPage.getAssignmentByTestId(id).should("have.length", length);
        });
      });
    });
    context(">reassign test-'assigned test is part of a playlist'", () => {
      before(">assign the test", () => {
        cy.deleteAllAssignments("", teacher1.email);
        testCount = [originalTestIds[1], ...originalTestIds].length;
        cy.login("teacher", teacher1.email, teacher1.pass);
        playListAssign.visitAssignPageById(originalTestIds[1]);
        playListAssign.selectClass("Class");
        playListAssign.clickOnAssign();
      });
      before(">get play list", () => {
        cy.login("teacher", teacher1.email, teacher1.pass);
        playListLibrary.getPlayListAndClickOnUseThisById(playListId);
      });

      it(">assign whole module", () => {
        playListLibrary.reviewTab.clickOnAssignButtonByModule(1);
        playListAssign.selectClass("Class");
        playListAssign.clickOnAssign({ duplicate: true });
      });
      it(">teacher side verification", () => {
        playListLibrary.sidebar.clickOnAssignment();
        authorAssignmentPage.getStatus().should("have.length", testCount);
        originalTestIds.forEach(id => {
          id === originalTestIds[1] ? (length = 2) : (length = 1);
          authorAssignmentPage.getAssignmentRowsTestById(id).should("have.length", length);
        });
        playListLibrary.sidebar.clickOnPlayListByName(playListData.name);
        // playListLibrary.reviewTab.verifyAssignedByModule(1);
      });
      it(">student side verification", () => {
        cy.login("student", student.email, student.pass);
        assignmentsPage.getAssignmentButton().should("have.length", testCount);
        originalTestIds.forEach(id => {
          id === originalTestIds[1] ? (length = 2) : (length = 1);
          assignmentsPage.getAssignmentByTestId(id).should("have.length", length);
        });
      });
    });
  });
  context(">two teacher part of a same class", () => {
    before(">share the playlist", () => {
      cy.deleteAllAssignments("", teacher1.email);
      cy.deleteAllAssignments("", teacher2.email);
      testCount = originalTestIds.length;
      cy.login("teacher", teacher1.email, teacher1.pass);
      playListLibrary.getPlayListAndClickOnUseThisById(playListId);
      playListLibrary.header.clickOnShare();
      testLibrary.selectPeopletoshare(teacher2.email, true);
    });
    it(">assign play list", () => {
      playListLibrary.getPlayListAndClickOnUseThisById(playListId);
      playListLibrary.reviewTab.clickOnAssignButtonByModule(1);
      playListAssign.selectClass("Class");
      playListAssign.clickOnAssign();
    });
    it(">verify assignments page-'teacher-1'", () => {
      playListLibrary.sidebar.clickOnAssignment();
      authorAssignmentPage.getStatus().should("have.length", testCount);
      originalTestIds.forEach(id => {
        authorAssignmentPage.getAssignmentRowsTestById(id).should("exist");
      });
    });
    it.skip(">verify progress-'teacher-1'", () => {
      playListLibrary.sidebar.clickOnPlayListByName(playListData.name);
      // TODO: unskip and fix this once progress starts appearing
      playListLibrary.reviewTab.verifyModuleProgress(0, 1);
    });
    it(">verify assignments page-'teacher-2'", () => {
      cy.login("teacher", teacher2.email, teacher2.pass);
      playListLibrary.sidebar.clickOnAssignment();
      authorAssignmentPage.getStatus().should("have.length", testCount);
      originalTestIds.forEach(id => {
        authorAssignmentPage.getAssignmentRowsTestById(id).should("exist");
      });
    });
    it.skip(">verify progress-'teacher-2'", () => {
      playListLibrary.sidebar.clickOnPlayListLibrary();
      playListLibrary.searchFilter.clearAll();
      playListLibrary.searchFilter.sharedWithMe();
      playListLibrary.clickOnPlayListCardById(playListId);
      playListLibrary.header.clickOnUseThis();
      // TODO: unskip and fix this once progress starts appearing
      playListLibrary.reviewTab.verifyModuleProgress(0, 1);
    });
  });
});
