import PlayListLibrary from "../../../../framework/author/playlist/playListLibrary";
import FileHelper from "../../../../framework/util/fileHelper";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import AssignmentsPage from "../../../../framework/student/assignmentsPage";
import StudentTestPage from "../../../../framework/student/studentTestPage";

describe(`${FileHelper.getSpecName(Cypress.spec.name)}>> spark playlist customization`, () => {
  const playlistlibraryPage = new PlayListLibrary();
  const testlibraryPage = new TestLibrary();
  const assignmentsPage = new AssignmentsPage();
  const studentTestPage = new StudentTestPage();

  const qType = ["MCQ_TF", "MCQ_TF"];
  const attemptdata = [{ right: "right" }, { right: "right" }];
  const testToCreate = "PLAYLIST_TEST_1";
  const collection = "Spark Math";
  const testIds = [];

  let playlisid;
  let customplaylist;

  let newtest;

  const plalistdata = {
    metadata: {
      name: "Play List",
      grade: "Grade 10",
      subject: "Math",
      collection: "Spark Math - Spark Math Bucket"
    },
    moduledata: {}
  };

  const students = {
    name: "Student1 ",
    email: "student.custom@snapwiz.com",
    pass: "snapwiz"
  };
  const contentEditor = {
    email: "ce.sparkmath@automation.com",
    pass: "edulastic"
  };
  const teacher = {
    email: "teacher.custom.assign@snapwiz.com",
    pass: "snapwiz"
  };

  before("create test", () => {
    cy.login("publisher", contentEditor.email, contentEditor.pass);
    for (let k = 0; k <= 3; k++) {
      testlibraryPage.createTest(testToCreate, false).then(id => {
        testIds.push(id);
        testlibraryPage.header.clickOnDescription();
        testlibraryPage.testSummary.setName(`test- ${k + 1}`);
        testlibraryPage.header.clickOnPublishButton();
      });
    }
    cy.wait(1).then(() => {
      plalistdata.moduledata.module1 = testIds.slice(0, 2);
      plalistdata.moduledata.module2 = testIds.slice(2, 4);
    });
  });
  before(">create playlist", () => {
    playlistlibraryPage.createPlayListWithTests(plalistdata).then(id => {
      playlisid = id;
      playlistlibraryPage.header.clickOnEdit();
      playlistlibraryPage.header.clickOnSettings();
      playlistlibraryPage.setCustomization();
      playlistlibraryPage.header.clickOnPublish();
    });
  });
  context(">customization - assign", () => {
    context(">add new test to module-'from search bar'", () => {
      before(">login", () => {
        cy.deleteAllAssignments("", teacher.email);
        cy.login("teacher", teacher.email, teacher.pass);
        testlibraryPage.createTest("default").then(id => {
          newtest = id;
        });
      });
      it(">search and use playlist", () => {
        playlistlibraryPage.searchByCollection(collection);
        playlistlibraryPage.clickOnPlayListCardById(playlisid);
        playlistlibraryPage.header.clickOnUseThis(true).then(id => {
          customplaylist = id;
        });
      });
      it(">assign whole module", () => {
        playlistlibraryPage.playlistCustom.clickOnAssignButtonByModule(1);
        playlistlibraryPage.playListAssign.selectClass("Class");
        playlistlibraryPage.playListAssign.clickOnAssign();
      });
      it(">customize-'add new test'", () => {
        playlistlibraryPage.sidebar.clickOnRecentUsedPlayList();
        playlistlibraryPage.playlistCustom.clickOnManageContent();
        playlistlibraryPage.playlistCustom.searchContainer.setFilters({ collection: "Private Library" });
        playlistlibraryPage.playlistCustom.searchContainer.typeInSearchBar(newtest);
        playlistlibraryPage.playlistCustom.dragTestFromSearchToModule(1, newtest);
        playlistlibraryPage.header.clickOnSave();
        playlistlibraryPage.reviewTab.getTestsInModuleByModule(1).should("have.length", 3);
      });
      it(">assign the whole module-'re-assign'", () => {
        playlistlibraryPage.reviewTab.clickOnAssignButtonByModule(1);
        playlistlibraryPage.playListAssign.selectClass("Class");
        playlistlibraryPage.playListAssign.clickOnAssign({ duplicate: false });
      });
      it(">verify student side-'attempt'", () => {
        cy.login("student", students.email, students.pass);
        [...testIds.slice(0, 2), newtest].forEach(id => {
          assignmentsPage.getAssignmentByTestId(id).should("have.length", 1);
        });
        assignmentsPage.clickOnAssigmentByTestId(newtest);
        studentTestPage.attemptQuestionsByQueType(qType.slice(1), attemptdata);
        studentTestPage.submitTest();
      });
    });
    context(">move test from other module", () => {
      before(">login", () => {
        cy.login("teacher", teacher.email, teacher.pass);
      });
      it(">search and use playlist", () => {
        playlistlibraryPage.searchByCollection(collection);
        playlistlibraryPage.clickOnPlayListCardById(playlisid);
        playlistlibraryPage.header.clickOnUseThis();
        cy.url().should("contain", customplaylist);
      });
      it(">add a test and verify", () => {
        playlistlibraryPage.playlistCustom.clickOnManageContent();
        playlistlibraryPage.reviewTab.moveTestBetweenModule(2, 1, 1);
        playlistlibraryPage.reviewTab.getTestsInModuleByModule(1).should("have.length", 4);
        playlistlibraryPage.reviewTab.getTestsInModuleByModule(2).should("have.length", 1);
      });

      it(">assign the test", () => {
        playlistlibraryPage.reviewTab.clickOnAssignByTestByModule(1, 4);
        playlistlibraryPage.playListAssign.selectClass("Class");
        playlistlibraryPage.playListAssign.clickOnAssign();
      });
      it(">verify student side-'after assigning'", () => {
        cy.login("student", students.email, students.pass);
        assignmentsPage.getAssignmentByTestId(testIds[2]).should("have.length", 1);
      });
    });
    context(">remove assigned test", () => {
      before(">login", () => {
        cy.login("teacher", teacher.email, teacher.pass);
      });
      it(">search and use playlist", () => {
        playlistlibraryPage.searchByCollection(collection);
        playlistlibraryPage.clickOnPlayListCardById(playlisid);
        playlistlibraryPage.header.clickOnUseThis();
        cy.url().should("contain", customplaylist);
      });
      it(">remove a assigned test and verify", () => {
        playlistlibraryPage.playlistCustom.clickOnManageContent();
        playlistlibraryPage.reviewTab.clickExpandByModule(1);
        playlistlibraryPage.reviewTab.clickOnDeleteByTestByModule(1, 4);
        playlistlibraryPage.header.clickOnSave();
        playlistlibraryPage.reviewTab.getTestsInModuleByModule(1).should("have.length", 3);
        playlistlibraryPage.reviewTab.getTestsInModuleByModule(2).should("have.length", 1);
      });
      it(">verify student side-'presence of deleted test and attempt'", () => {
        cy.login("student", students.email, students.pass);
        assignmentsPage.getAssignmentByTestId(testIds[0]).should("have.length", 1);
        assignmentsPage.clickOnAssigmentByTestId(testIds[0]);
        studentTestPage.attemptQuestionsByQueType(qType, attemptdata);
        studentTestPage.submitTest();
      });
    });

    /* context(">move assigned test", () => {
    before(">login", () => {
      cy.deleteAllAssignments("", teacher.email);
      cy.login("teacher", teacher.email, teacher.pass);
    });
    before(">create playlist and assign", () => {
      playListLibrary.createPlayListWithTests(playListData).then(id => {
        playlistId = id;
      });
      playListLibrary.searchFilter.clearAll();
      playListLibrary.searchFilter.getAuthoredByMe();
      playListLibrary.addTestTab.bulkAddByModule(testIds.slice(0, 2), 1);
      playListLibrary.addTestTab.bulkAddByModule(testIds.slice(2, 4), 2);
      playListLibrary.header.clickOnSettings();
      playListLibrary.setCustomization();
      playListLibrary.header.clickOnPublish();
      playListLibrary.header.clickOnUseThis();
    });
    before(">assign", () => {
      playListLibrary.reviewTab.clickOnAssignButtonByModule(1);
      playListAssign.selectClass("Class");
      playListAssign.clickOnAssign();
    });
    it(">move assigned test and verify", () => {
      playListLibrary.sidebar.clickOnRecentUsedPlayList();
      playListLibrary.playlistCustom.clickOnManageContent();
      playListLibrary.reviewTab.clickExpandByModule(1);
      playListLibrary.reviewTab.clickExpandByModule(2);
      playListLibrary.reviewTab.shuffleTestBetweenModule(1, 2, 2);
      playListLibrary.header.clickOnSave();
      playListLibrary.reviewTab.getTestsInModuleByModule(1).should("have.length", 1);
      playListLibrary.reviewTab.getTestsInModuleByModule(2).should("have.length", 3);
    });
    it(">verify student side", () => {
      cy.login("student", students[0].email, students[0].pass);
      assignmentsPage.getAssignmentButton().should("have.length", 2);
      assignmentsPage.getAssignmentByTestId(testIds[1]).should("have.length", 1);
    });
  }); */
  });
});
