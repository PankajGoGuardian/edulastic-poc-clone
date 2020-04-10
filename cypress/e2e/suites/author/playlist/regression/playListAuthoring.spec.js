import PlayListLibrary from "../../../../framework/author/playlist/playListLibrary";
import FileHelper from "../../../../framework/util/fileHelper";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import StudentTestPage from "../../../../framework/student/studentTestPage";
import AssignmentsPage from "../../../../framework/student/assignmentsPage";
import AuthorAssignmentPage from "../../../../framework/author/assignments/AuthorAssignmentPage";
import PlayListAssign from "../../../../framework/author/playlist/playListAssignPage";
import LiveClassboardPage from "../../../../framework/author/assignments/LiveClassboardPage";

describe(`${FileHelper.getSpecName(Cypress.spec.name)}>> play list basics`, () => {
  const playListLibrary = new PlayListLibrary();
  const testLibrary = new TestLibrary();
  const studentTestPage = new StudentTestPage();
  const assignmentsPage = new AssignmentsPage();
  const authorAssignmentPage = new AuthorAssignmentPage();
  const playListAssign = new PlayListAssign();
  const lcb = new LiveClassboardPage();

  let playlistId;
  let customizedPlaylist;
  let tests = [];

  const standard = "K.CC.A.1";
  const testToCreate = "search_1";
  const testIds = [];
  const playListData = {
    name: "Play List",
    grade: "Grade 10",
    subject: "Social Studies"
  };
  const student = {
    email: "student.playlistbasic@snapwiz.com",
    pass: "snapwiz"
  };
  const teacher = {
    email: "teacher.playlistbasic@snapwiz.com",
    pass: "snapwiz"
  };
  const msgs = [
    "Selected tests already exists in this module",
    "Some of the selected tests already exists in this module"
  ];

  before("create test", () => {
    cy.login("teacher", teacher.email, teacher.pass);
    testLibrary.createTest(testToCreate).then(id => {
      testIds.push(id);
      cy.contains("Share With Others");
      for (let k = 0; k < 3; k++) {
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
  });
  before("create play list", () => {
    tests = testIds.slice(0, 2);
  });

  context(">  authoring", () => {
    it(">author playlist-'summary'", () => {
      playListLibrary.sidebar.clickOnPlayListLibrary();
      playListLibrary.clickOnNewPlayList();
      playListLibrary.playListSummary.setName(playListData.name);
      playListLibrary.playListSummary.selectGrade(playListData.grade, true);
      playListLibrary.playListSummary.selectSubject(playListData.subject, true);
    });
    it(">author playlist-'create modules'", () => {
      playListLibrary.header.clickOnAddTests();
      playListLibrary.addTestTab.clickOnManageModule();
      for (let i = 0; i < tests.length; i++) {
        playListLibrary.addTestTab.clickOnAddModule();
        playListLibrary.addTestTab.setModuleName(i + 1, `module-${i + 1}`);
        playListLibrary.addTestTab.clickOnSaveByModule(i + 1);
      }
      playListLibrary.addTestTab.clickOnDone(true).then(id => {
        playlistId = id;
      });
    });
    it(">verify add test tab-'view test'", () => {
      playListLibrary.searchFilter.clearAll();
      playListLibrary.searchFilter.getAuthoredByMe();
      tests.forEach((id, index) => {
        playListLibrary.addTestTab.clickOnViewTestById(id).then(test => {
          expect(id).to.eq(test);
        });
        studentTestPage.getNext();
        studentTestPage.clickOnExitTest(true);
      });
    });
    it(">author playlist-'add tests'", () => {
      tests.forEach((id, index) => {
        playListLibrary.addTestTab.addTestByIdByModule(id, index + 1);
        playListLibrary.header.clickOnSave();
      });
    });
    it(">verify review- 'module name and test count'", () => {
      playListLibrary.header.clickOnReview();
      tests.forEach((id, index) => {
        playListLibrary.reviewTab.clickExpandByModule(index + 1);
        playListLibrary.reviewTab.getModuleNameByModule(index + 1).should("contain", `module-${index + 1}`);
        playListLibrary.reviewTab.verifyNoOfTestByModule(index + 1, 1);
        playListLibrary.reviewTab.clickCollapseByModule(index + 1);
      });
    });
    it(">verify grade and subject", () => {
      playListLibrary.reviewTab.verifyPlalistGrade(playListData.grade);
      playListLibrary.reviewTab.verifyPlalistSubject(playListData.subject);
    });
    it(">verify review- 'view test'", () => {
      tests.forEach((id, index) => {
        playListLibrary.reviewTab.clickExpandByModule(index + 1);
        playListLibrary.reviewTab.clickOnViewTestByTestByModule(index + 1, 1).then(test => {
          expect(id).to.eq(test);
        });
        studentTestPage.getNext();
        studentTestPage.clickOnExitTest(true);
        playListLibrary.reviewTab.clickExpandByModule(index + 1);
      });
    });
    it(">verify review- 'standards'", () => {
      tests.forEach((id, index) => {
        playListLibrary.reviewTab.verifyStandardsByTestByModule(index + 1, 1, standard);
      });
    });
    it(">manage modules-'delete a test'", () => {
      // delete test by module
      playListLibrary.header.clickOnReview();
      playListLibrary.reviewTab.clickExpandByModule(1);
      playListLibrary.reviewTab.clickOnDeleteByTestByModule(1, 1);
      tests.pop();
      // verify
      playListLibrary.reviewTab.verifyNoOfTestByModule(1, 0);
      playListLibrary.reviewTab.clickCollapseByModule(1);
    });
    it(">manage modules-'rename module'", () => {
      // edit module name
      playListLibrary.header.clickOnAddTests();
      playListLibrary.addTestTab.clickOnManageModule();
      playListLibrary.addTestTab.clickOnEditByModule(1);
      playListLibrary.addTestTab.setModuleName(1, `module name edited`);
      playListLibrary.addTestTab.clickOnSaveByModule(1);
      // verify
      playListLibrary.header.clickOnReview();
      playListLibrary.reviewTab.getModuleNameByModule(1).should("contain", "module name edited");
    });
    it(">manage modules-'delete module'", () => {
      // delete module
      playListLibrary.header.clickOnAddTests();
      playListLibrary.addTestTab.clickOnManageModule();
      playListLibrary.addTestTab.clickOnDeleteByModule(2);
      playListLibrary.addTestTab.clickOnDone();
      // verify
      playListLibrary.header.clickOnReview();
      playListLibrary.reviewTab.getModuleNameByModule(1).should("contain", "module name edited");
      playListLibrary.reviewTab.getModuleRowByModule(2).should("not.exist");
    });
    // TODO: Drag and drop(Shuffling tests and modules)
  });
  context(">bulk actions", () => {
    before("create playlist", () => {
      cy.login("teacher", teacher.email, teacher.pass);
      playListLibrary.createPlayList(playListData, testIds.length / 2).then(id => {
        playlistId = id;
      });
    });
    it(">bulk addition and verify review", () => {
      playListLibrary.searchFilter.clearAll();
      playListLibrary.addTestTab.bulkAddByModule(testIds.slice(0, testIds.length / 2), 1);
      playListLibrary.header.clickOnSave();
      playListLibrary.addTestTab.bulkAddByModule(testIds.slice(testIds.length / 2), 2);
      playListLibrary.header.clickOnSave();
      playListLibrary.header.clickOnPublish();

      playListLibrary.reviewTab.clickExpandByModule(1);
      playListLibrary.reviewTab.verifyNoOfTestByModule(1, testIds.length / 2);
      playListLibrary.reviewTab.clickExpandByModule(2);
      playListLibrary.reviewTab.verifyNoOfTestByModule(2, testIds.length / 2);
      playListLibrary.header.clickOnEdit();
    });
    it(">adding used test", () => {
      playListLibrary.header.clickOnReview();
      playListLibrary.header.clickOnAddTests();
      playListLibrary.addTestTab.bulkAddByModule([testIds[0]], 2);
      playListLibrary.addTestTab.verifyMessage(msgs[0]);
    });
    it(">bulk remove and verify review", () => {
      [[testIds[0], testIds[3]], [testIds[1], testIds[2]]].forEach((testsToremove, index) => {
        testsToremove.forEach(id => {
          playListLibrary.addTestTab.checkTestById(id);
        });
        playListLibrary.addTestTab.clickOnActions();
        playListLibrary.addTestTab.clickBulkRemove();
        playListLibrary.addTestTab.verifyCountWhileBulkRemove(1, 1);
        playListLibrary.addTestTab.verifyCountWhileBulkRemove(2, 1);
        playListLibrary.addTestTab.clickYesWhileBulkRemove();
        playListLibrary.header.clickOnPublish();
        playListLibrary.reviewTab.verifyNoOfTestByModule(1, (index + 1) % 2);
        playListLibrary.reviewTab.verifyNoOfTestByModule(2, (index + 1) % 2);
        playListLibrary.header.clickOnEdit();
        playListLibrary.header.clickOnAddTests();
      });
    });
    it(">adding used test along with new test", () => {
      playListLibrary.searchFilter.clearAll();
      playListLibrary.addTestTab.addTestByIdByModule(testIds[0], 1);
      playListLibrary.addTestTab.bulkAddByModule(testIds, 2);
      playListLibrary.addTestTab.verifyMessage(msgs[1]);
      playListLibrary.header.clickOnPublish();
      playListLibrary.reviewTab.clickExpandByModule(2);
      playListLibrary.reviewTab.verifyNoOfTestByModule(2, 3);
    });
  });
  context(">using existing playlist template", () => {
    context(">edit-'add a test' ", () => {
      before("create a playlist", () => {
        cy.deleteAllAssignments("", teacher.email);
        cy.login("teacher", teacher.email, teacher.pass);
        playListLibrary.createPlayList(playListData, 1).then(id => {
          playlistId = id;
          playListLibrary.searchFilter.clearAll();
          playListLibrary.addTestTab.bulkAddByModule([testIds[0]], 1);
          playListLibrary.header.clickOnPublish();
        });
      });
      before(">get playlist template", () => {
        playListLibrary.seachAndClickPlayListById(playlistId);
      });
      it(">add one more test to module-1", () => {
        playListLibrary.header.clickOnEdit();
        playListLibrary.header.clickOnAddTests();
        playListLibrary.searchFilter.clearAll();
        playListLibrary.addTestTab.addTestByIdByModule(testIds[2], 1);
      });
      it(">verify 'edit'", () => {
        playListLibrary.header.clickOnReview();
        playListLibrary.header.clickOnPublish();
        playListLibrary.header.clickOnUseThis();
        playListLibrary.reviewTab.clickExpandByModule(1);
        playListLibrary.reviewTab.verifyNoOfTestByModule(1, 2);
        playListLibrary.reviewTab.clickCollapseByModule(1);
      });
      it(">assign the playlist", () => {
        playListLibrary.reviewTab.clickOnAssignButtonByModule(1);
        playListAssign.selectClass("Class");
        playListAssign.clickOnAssign();
      });
      it(">playlist progress verification", () => {
        playListLibrary.getPlayListAndClickOnUseThisById(playlistId);
        playListLibrary.reviewTab.verifyModuleProgress(0, 1);
      });
      it(">author assignments verification and closing", () => {
        playListAssign.sidebar.clickOnAssignment();
        authorAssignmentPage.getStatus().should("have.length", 2);
        for (let i = 0; i < 2; i++) {
          authorAssignmentPage.clcikOnPresenatationIconByIndex(0, i);
          lcb.header.clickOnClose();
          playListLibrary.sidebar.clickOnAssignment();
        }
      });
      it(">playlist progress verification", () => {
        playListLibrary.getPlayListAndClickOnUseThisById(playlistId);
        playListLibrary.reviewTab.verifyModuleCompleteTextByModule(1);
        playListLibrary.reviewTab.verifyModuleProgress(1, 1);
      });
    });
    context(">edit-'remove a test' ", () => {
      before("create a playlist", () => {
        cy.deleteAllAssignments("", teacher.email);
        cy.login("teacher", teacher.email, teacher.pass);
        playListLibrary.createPlayList(playListData, 1).then(id => {
          playlistId = id;
          playListLibrary.searchFilter.clearAll();
          playListLibrary.addTestTab.bulkAddByModule([testIds[0], testIds[1]], 1);
          playListLibrary.header.clickOnPublish();
        });
      });

      before(">get playlist template", () => {
        playListLibrary.seachAndClickPlayListById(playlistId);
      });
      it(">remove one test from module", () => {
        playListLibrary.header.clickOnEdit();
        playListLibrary.header.clickOnReview();
        playListLibrary.reviewTab.clickExpandByModule(1);
        playListLibrary.reviewTab.clickOnDeleteByTestByModule(1, 2);
      });
      it(">verify 'edit'", () => {
        playListLibrary.reviewTab.clickCollapseByModule(1);
        playListLibrary.header.clickOnPublish();
        playListLibrary.header.clickOnUseThis();
        playListLibrary.reviewTab.verifyNoOfTestByModule(1, 1);
      });
      it(">assign the playlist", () => {
        playListLibrary.reviewTab.clickOnAssignButtonByModule(1);
        playListAssign.selectClass("Class");
        // TODO: remove below line once its default behaviour is fixed fixed
        playListAssign.selectOpenPolicy("Automatically on Start Date");
        playListAssign.clickOnAssign();
      });
      it(">playlist progress verification", () => {
        playListLibrary.getPlayListAndClickOnUseThisById(playlistId);
        playListLibrary.reviewTab.verifyModuleProgress(0, 1);
      });
      it(">author assignments verification and closing", () => {
        playListAssign.sidebar.clickOnAssignment();
        authorAssignmentPage.getStatus().should("have.length", 1);

        authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
        lcb.header.clickOnClose();
      });
      it(">playlist progress verification", () => {
        playListLibrary.getPlayListAndClickOnUseThisById(playlistId);
        playListLibrary.reviewTab.verifyModuleCompleteTextByModule(1);
        playListLibrary.reviewTab.verifyModuleProgress(1, 1);
      });
    });
  });
  context(">customization", () => {
    before("create a playlist", () => {
      cy.deleteAllAssignments("", teacher.email);
      cy.login("teacher", teacher.email, teacher.pass);
      playListLibrary.createPlayList(playListData, 1).then(id => {
        playlistId = id;
        playListLibrary.searchFilter.clearAll();
        playListLibrary.addTestTab.bulkAddByModule([testIds[0], testIds[1]], 1);
        playListLibrary.header.clickOnSettings();
        playListLibrary.setCustomization();
        playListLibrary.header.clickOnPublish();
      });
    });
    it(">get playlist and customize", () => {
      playListLibrary.seachAndClickPlayListById(playlistId);
      playListLibrary.header.clickOnUseThis();
      cy.url().should("contain", playlistId);
    });
    it(">edit customized-'add new test'", () => {
      playListLibrary.playlistCustom.clickOnManageContent();
      playListLibrary.playlistCustom.searchContainer.typeInSearchBar(testIds[3]);
      playListLibrary.playlistCustom.dragTestFromSearchToModule(1, testIds[3]);
    });
    it(">assign the customized", () => {
      playListLibrary.header.clickOnSave();
      playListLibrary.reviewTab.clickOnAssignButtonByModule(1);
      playListAssign.selectClass("Class");
      playListAssign.selectOpenPolicy("Automatically on Start Date");
      playListAssign.clickOnAssign();
    });
    it(">verify teacher side-'customized playlist'", () => {
      playListLibrary.seachAndClickPlayListById(playlistId, true);
      playListLibrary.reviewTab.clickExpandByModule(1);
      playListLibrary.reviewTab.verifyNoOfTestByModule(1, 3);
      playListLibrary.reviewTab.clickCollapseByModule(1);
    });
    it(">verify teacher side-'assignments page'", () => {
      playListLibrary.sidebar.clickOnAssignment();
      [testIds[0], testIds[1], testIds[3]].forEach(id => {
        authorAssignmentPage.getAssignmentRowsTestById(id).should("exist");
      });
    });
    it(">verify student side", () => {
      cy.login("student", student.email, student.pass);
      [testIds[0], testIds[1], testIds[3]].forEach(id => {
        assignmentsPage.getAssignmentByTestId(id).should("exist");
      });
    });
  });
});
