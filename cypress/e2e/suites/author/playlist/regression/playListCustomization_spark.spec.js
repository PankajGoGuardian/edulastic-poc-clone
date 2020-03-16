import PlayListLibrary from "../../../../framework/author/playlist/playListLibrary";
import FileHelper from "../../../../framework/util/fileHelper";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import AssignmentsPage from "../../../../framework/student/assignmentsPage";
import PlayListAssign from "../../../../framework/author/playlist/playListAssignPage";

describe(`${FileHelper.getSpecName(Cypress.spec.name)}>> play list basics`, () => {
  const playListLibrary = new PlayListLibrary();
  const testLibrary = new TestLibrary();
  const assignmentsPage = new AssignmentsPage();
  const playListAssign = new PlayListAssign();

  let playlistId;
  const testToCreate = "PLAYLIST_TEST";
  const testIds = [];

  const playListData = {
    metadata: {
      name: "Play List",
      grade: "Grade 10",
      subject: "Social Studies"
    },
    moduledata: {}
  };
  // TODO: Change the users for spark playlist
  const students = [
    {
      name: "Student1 ",
      email: "student1.drop@snapwiz.com",
      pass: "snapwiz"
    },
    {
      name: "Student2 ",
      email: "student2.drop@snapwiz.com",
      pass: "snapwiz"
    }
  ];
  const teacher = {
    email: "teacher.playlistdrop@snapwiz.com",
    pass: "snapwiz"
  };

  before("create test", () => {
    cy.login("teacher", teacher.email, teacher.pass);
    testLibrary.createTest(testToCreate).then(id => {
      testIds.push(id);
      cy.contains("Share With Others");
      for (let k = 0; k < 4; k++) {
        testLibrary.sidebar.clickOnTestLibrary();
        testLibrary.searchFilters.clearAll();
        testLibrary.clickOnTestCardById(testIds[0]);
        testLibrary.clickOnDuplicate();
        testLibrary.header.clickOnPublishButton().then(newId => {
          testIds.push(newId);
          cy.contains("Share With Others");
        });
      }
    });
    cy.wait(1).then(() => {
      playListData.moduledata.module1 = testIds.slice(0, 2);
      playListData.moduledata.module2 = testIds.slice(2, 4);
    });
  });

  context(">add new test to module-'from search bar'", () => {
    before(">login", () => {
      cy.deleteAllAssignments("", teacher.email);
    });
    before(">create playlist and assign", () => {
      playListLibrary.createPlayListWithTests(playListData).then(id => {
        playlistId = id;
      });
      playListLibrary.header.clickOnEdit();
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
    it(">add a test and verify", () => {
      playListLibrary.sidebar.clickOnRecentUsedPlayList();
      playListLibrary.playlistCustom.clickOnManageContent();
      playListLibrary.playlistCustom.searchContainer.typeInSearchBar(testIds[4]);
      playListLibrary.playlistCustom.dragTestFromSearchToModule(1, testIds[4]);
      playListLibrary.header.clickOnSave();
      playListLibrary.reviewTab.getTestsInModuleByModule(1).should("have.length", 3);
    });
    it(">verify student side-'before assigning'", () => {
      cy.login("student", students[0].email, students[0].pass);
      assignmentsPage.getAssignmentButton().should("have.length", 2);
      assignmentsPage.getAssignmentByTestId(testIds[4]).should("have.length", 0);
    });
    it(">assign the test", () => {
      cy.login("teacher", teacher.email, teacher.pass);
      playListLibrary.sidebar.clickOnRecentUsedPlayList();
      playListLibrary.playlistCustom.clickOnManageContent();
      playListLibrary.reviewTab.clickExpandByModule(1);
      playListLibrary.reviewTab.clickOnAssignByTestByModule(1, 3);
      playListAssign.selectClass("Class");
      playListAssign.clickOnAssign();
    });
    it(">verify student side-'after assigning'", () => {
      cy.login("student", students[0].email, students[0].pass);
      assignmentsPage.getAssignmentButton().should("have.length", 3);
      assignmentsPage.getAssignmentByTestId(testIds[4]).should("have.length", 1);
    });
  });
  context(">add a test to module-'from other module'", () => {
    before(">login", () => {
      cy.deleteAllAssignments("", teacher.email);
    });
    before(">create playlist and assign", () => {
      playListLibrary.createPlayListWithTests(playListData).then(id => {
        playlistId = id;
      });
      playListLibrary.header.clickOnEdit();
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
    it("add a test and verify", () => {
      playListLibrary.sidebar.clickOnRecentUsedPlayList();
      playListLibrary.playlistCustom.clickOnManageContent();
      playListLibrary.reviewTab.clickExpandByModule(1);
      playListLibrary.reviewTab.clickExpandByModule(2);
      playListLibrary.reviewTab.shuffleTestBetweenModule(2, 1, 1);
      playListLibrary.header.clickOnSave();
      playListLibrary.reviewTab.getTestsInModuleByModule(1).should("have.length", 3);
      playListLibrary.reviewTab.getTestsInModuleByModule(2).should("have.length", 1);
    });
    it(">verify student side-", () => {
      cy.login("student", students[0].email, students[0].pass);
      assignmentsPage.getAssignmentButton().should("have.length", 2);
      assignmentsPage.getAssignmentByTestId(testIds[2]).should("have.length", 0);
    });
    it(">assign the test", () => {
      cy.login("teacher", teacher.email, teacher.pass);
      playListLibrary.sidebar.clickOnRecentUsedPlayList();
      playListLibrary.playlistCustom.clickOnManageContent();
      playListLibrary.reviewTab.clickExpandByModule(1);
      playListLibrary.reviewTab.clickOnAssignByTestByModule(1, 4);
      playListAssign.selectClass("Class");
      playListAssign.clickOnAssign();
    });
    it(">verify student side-'after assigning'", () => {
      cy.login("student", students[0].email, students[0].pass);
      assignmentsPage.getAssignmentButton().should("have.length", 3);
      assignmentsPage.getAssignmentByTestId(testIds[2]).should("have.length", 1);
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
  context(">remove assigned test", () => {
    before(">login", () => {
      cy.deleteAllAssignments("", teacher.email);
    });
    before(">create playlist and assign", () => {
      playListLibrary.createPlayListWithTests(playListData).then(id => {
        playlistId = id;
      });
      playListLibrary.header.clickOnEdit();
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
    it("remove a assigned test and verify", () => {
      playListLibrary.sidebar.clickOnRecentUsedPlayList();
      playListLibrary.playlistCustom.searchContainer.clickOnManageContent();
      playListLibrary.reviewTab.clickExpandByModule(1);
      playListLibrary.reviewTab.clickOnDeleteByTestByModule(1, 2);
      playListLibrary.header.clickOnSave();
      playListLibrary.reviewTab.getTestsInModuleByModule(1).should("have.length", 1);
      playListLibrary.reviewTab.getTestsInModuleByModule(2).should("have.length", 2);
    });
    it(">verify student side", () => {
      cy.login("student", students[0].email, students[0].pass);
      assignmentsPage.getAssignmentButton().should("have.length", 2);
      assignmentsPage.getAssignmentByTestId(testIds[1]).should("have.length", 0);
    });
  });
});
