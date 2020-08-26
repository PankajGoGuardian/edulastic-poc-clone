import PlayListLibrary from "../../../../framework/author/playlist/playListLibrary";
import FileHelper from "../../../../framework/util/fileHelper";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import StudentTestPage from "../../../../framework/student/studentTestPage";
import AuthorAssignmentPage from "../../../../framework/author/assignments/AuthorAssignmentPage";
import PlayListAssign from "../../../../framework/author/playlist/playListAssignPage";
import CypressHelper from "../../../../framework/util/cypressHelpers";
import { grades, subject } from "../../../../framework/constants/assignmentStatus";
import AssignmentsPage from "../../../../framework/student/assignmentsPage";

describe(`${FileHelper.getSpecName(Cypress.spec.name)}>> play list basics`, () => {
  const playlistlibraryPage = new PlayListLibrary();
  const testlibraryPage = new TestLibrary();
  const studentTestPage = new StudentTestPage();
  const authorAssignmentPage = new AuthorAssignmentPage();
  const playlistAssignPage = new PlayListAssign();
  const assignmentsPage = new AssignmentsPage();

  let playlistId;
  let tests = [];

  const standard = "K.CC.A.1";
  const testIds = [];
  const playListData = {
    name: "Play List",
    grade: grades.GRADE_10,
    subject: subject.MATH
  };
  const student = {
    email: "student.playlistbasic@snapwiz.com",
    pass: "snapwiz"
  };
  const teacher = {
    email: "teacher.playlistbasic@snapwiz.com",
    pass: "snapwiz"
  };

  before("create test", () => {
    cy.login("teacher", teacher.email, teacher.pass);
    testlibraryPage
      .createTest()
      .then(id => {
        testIds.push(id);
        cy.contains("Share With Others");
        for (let k = 0; k < 3; k++) {
          testlibraryPage.sidebar.clickOnTestLibrary();
          testlibraryPage.searchFilters.clearAll();
          testlibraryPage.clickOnTestCardById(testIds[0]);
          testlibraryPage.clickOnDuplicate();
          testlibraryPage.header.clickOnPublishButton().then(newId => {
            testIds.push(newId);
            cy.contains("Share With Others");
          });
        }
      })
      .then(() => {
        tests = testIds.slice(0, 2);
      });
  });

  context("> authoring", () => {
    it("> author playlist-'summary tab'", () => {
      playlistlibraryPage.sidebar.clickOnPlayListLibrary();
      playlistlibraryPage.clickOnNewPlayList();
      playlistlibraryPage.playListSummary.setName(playListData.name);
      playlistlibraryPage.playListSummary.selectGrade(playListData.grade, true);
      playlistlibraryPage.playListSummary.selectSubject(playListData.subject, true);
    });

    it("> author playlist-'create modules in manage content'", () => {
      playlistlibraryPage.header.clickOnReview(true);
      for (let i = 1; i <= tests.length; i++) {
        playlistlibraryPage.reviewTab.clickAddNewModule();
        playlistlibraryPage.reviewTab.setModuleDetails(`module-${i}`, `m${i}`, `module-title-${i}`);
        playlistlibraryPage.reviewTab.addModule(i === 1);
        CypressHelper.verifyAntMesssage("Module Added to playlist");
        if (i === 1) CypressHelper.verifyAntMesssage("Playlist created");
      }
    });

    it("> verify search container -'view test' and 'standards'", () => {
      playlistlibraryPage.reviewTab.searchContainer.setFilters({ subject: subject.MATH, authoredByme: true });
      tests.forEach(id => {
        playlistlibraryPage.reviewTab.searchContainer.verifyStandardsByTestInSearch(id, standard);
        playlistlibraryPage.reviewTab.searchContainer.clickOnViewTestById(id).then(test => {
          expect(id).to.eq(test);
        });
        studentTestPage.getNext();
        studentTestPage.clickOnExitTest(true);
      });
    });

    it("> author playlist-'add tests'", () => {
      tests.forEach((id, index) => {
        playlistlibraryPage.reviewTab.dragTestFromSearchToModule(index + 1, id);
      });
    });

    it("> verify review- 'module name,id and test count'", () => {
      tests.forEach((id, index) => {
        playlistlibraryPage.reviewTab.clickExpandByModule(index + 1);
        playlistlibraryPage.reviewTab.verifyModuleNameByMod(index + 1, `module-${index + 1}`);
        playlistlibraryPage.reviewTab.verifyModuleIdByMod(index + 1, `m${index + 1}`);
        playlistlibraryPage.reviewTab.verifyNoOfTestByModule(index + 1, 1);
        playlistlibraryPage.reviewTab.clickCollapseByModule(index + 1);
      });
    });

    it("> verify grade and subject-'manage content tab'", () => {
      playlistlibraryPage.reviewTab.verifyPlalistGrade(playListData.grade);
      playlistlibraryPage.reviewTab.verifyPlalistSubject(playListData.subject);
    });

    it(">verify review- 'view test in test row'", () => {
      tests.forEach((id, index) => {
        playlistlibraryPage.reviewTab.clickExpandByModule(index + 1);
        playlistlibraryPage.reviewTab.clickOnViewTestByTestByModule(index + 1, 1).then(test => {
          expect(id).to.eq(test);
        });
        studentTestPage.getNext();
        studentTestPage.clickOnExitTest(true);
        playlistlibraryPage.reviewTab.clickExpandByModule(index + 1);
      });
    });

    it(">verify review- 'standards in test row'", () => {
      tests.forEach((id, index) => {
        playlistlibraryPage.reviewTab.verifyStandardsByTestByModule(index + 1, 1, standard);
      });
    });

    it("> shuffle tests between modules", () => {
      playlistlibraryPage.reviewTab.moveTestBetweenModule(1, 1, 2, testIds[0]);
      playlistlibraryPage.reviewTab.verifyNoOfTestByModule(1, 0);

      playlistlibraryPage.reviewTab.moveTestBetweenModule(2, 1, 1, testIds[1]);
      playlistlibraryPage.reviewTab.verifyNoOfTestByModule(2, 1);
    });

    it("> expand and collapse customizaton tab", () => {
      playlistlibraryPage.reviewTab.searchContainer.closeCustomizationTab();
      playlistlibraryPage.reviewTab.clickOpenCustomizationTab();
    });

    it("> manage modules-'delete a test'", () => {
      // delete test by module
      playlistlibraryPage.reviewTab.clickExpandByModule(1);
      playlistlibraryPage.reviewTab.clickOnDeleteByTestByModule(1, 1);
      CypressHelper.verifyAntMesssage("Test removed from playlist");
      tests.pop();
      // verify
      playlistlibraryPage.reviewTab.verifyNoOfTestByModule(1, 0);
      playlistlibraryPage.reviewTab.clickCollapseByModule(1);
    });

    it("> manage modules-'rename module'", () => {
      // edit module name
      playlistlibraryPage.reviewTab.clickManageModuleByModule(1);
      playlistlibraryPage.reviewTab.clickEditModule();
      playlistlibraryPage.reviewTab.setModuleName(`module name edited`);
      playlistlibraryPage.reviewTab.clickUpdateModule();
      CypressHelper.verifyAntMesssage("Module updated successfully");
      // verify
      playlistlibraryPage.reviewTab.getModuleNameByModule(1).should("contain", "module name edited");
    });

    it("> adding already used test", () => {
      playlistlibraryPage.reviewTab.dragTestFromSearchToModule(1, tests[0]);
      playlistlibraryPage.reviewTab.verifyNoOfTestByModule(1, 1);

      playlistlibraryPage.reviewTab.dragTestFromSearchToModule(1, tests[0]);
      CypressHelper.verifyAntMesssage("Dropped Test already exists in this module");

      playlistlibraryPage.reviewTab.dragTestFromSearchToModule(2, tests[0]);
      playlistlibraryPage.reviewTab.verifyNoOfTestByModule(2, 1);
    });

    it("> manage modules-'delete module'", () => {
      // delete module
      playlistlibraryPage.reviewTab.clickManageModuleByModule(2);
      playlistlibraryPage.reviewTab.clickDeleteModule();
      CypressHelper.verifyAntMesssage("Module Removed from playlist");
      // verify
      playlistlibraryPage.reviewTab.getModuleNameByModule(1).should("contain", "module name edited");
      playlistlibraryPage.reviewTab.getModuleRowByModule(2).should("not.exist");
    });
  });

  context("> using existing playlist template", () => {
    before("> create a playlist", () => {
      const moduledata = {
        module1: [testIds[0]],
        module2: [testIds[1]]
      };
      cy.deleteAllAssignments("", teacher.email);
      cy.login("teacher", teacher.email, teacher.pass);

      playlistlibraryPage.createPlayListWithTests({ metadata: playListData, moduledata }).then(id => {
        playlistId = id;
        playlistlibraryPage.seachAndClickPlayListById(playlistId);
        playlistlibraryPage.header.clickOnEdit();
      });
    });

    it("> edit name, grades, and subjects", () => {
      playlistlibraryPage.header.clickOnDescription();
      playlistlibraryPage.playListSummary.setName("new name");
      playlistlibraryPage.playListSummary.selectGrade(grades.GRADE_4, true);
      playlistlibraryPage.playListSummary.selectSubject(subject.SOCIAL_STUDIES, true);
    });

    it("> verify edited name,grades and subjects", () => {
      playlistlibraryPage.header.clickOnReview();
      playlistlibraryPage.reviewTab.verifyPlalistGrade(grades.GRADE_4);
      playlistlibraryPage.reviewTab.verifyPlalistSubject(subject.SOCIAL_STUDIES);
      playlistlibraryPage.reviewTab.verifyPlaylistTitle("new name");
    });

    it("> add / remove tests", () => {
      playlistlibraryPage.reviewTab.clickOpenCustomizationTab();
      playlistlibraryPage.reviewTab.searchContainer.setFilters({ subject: subject.MATH, authoredByme: true });
      playlistlibraryPage.reviewTab.dragTestFromSearchToModule(1, testIds[2]);
      playlistlibraryPage.reviewTab.clickOnDeleteByTestByModule(1, 1);
    });

    it("> remove modules", () => {
      playlistlibraryPage.reviewTab.clickManageModuleByModule(2);
      playlistlibraryPage.reviewTab.clickDeleteModule();
      CypressHelper.verifyAntMesssage("Module Removed from playlist");
      // verify
      playlistlibraryPage.reviewTab.getModuleNameByModule(1).should("contain", "module-1");
      playlistlibraryPage.reviewTab.getModuleRowByModule(2).should("not.exist");
    });

    it("> add modules", () => {
      playlistlibraryPage.reviewTab.clickAddNewModule();
      playlistlibraryPage.reviewTab.setModuleDetails("module3", "mod3", "module-3");
      playlistlibraryPage.reviewTab.addModule();
      playlistlibraryPage.reviewTab.dragTestFromSearchToModule(2, testIds[3]);
    });

    it("> publish and use playlist", () => {
      playlistlibraryPage.header.clickOnPublish();
      playlistlibraryPage.header.clickOnUseThis();
    });

    it("> assign the existing module", () => {
      playlistlibraryPage.reviewTab.clickOnAssignButtonByModule(1);
      playlistAssignPage.selectClass("Class");
      playlistAssignPage.clickOnAssign();
    });

    it("> verify assignments page", () => {
      playlistlibraryPage.sidebar.clickOnAssignment();
      authorAssignmentPage.getAssignmentRowsTestById(testIds[2]);
    });

    it("> assign the new module", () => {
      playlistlibraryPage.sidebar.clickOnRecentUsedPlayList();
      playlistlibraryPage.reviewTab.clickOnAssignButtonByModule(2);
      playlistAssignPage.selectClass("Class");
      playlistAssignPage.clickOnAssign();
    });

    it("> verify assignments page", () => {
      playlistlibraryPage.sidebar.clickOnAssignment();
      authorAssignmentPage.getAssignmentRowsTestById(testIds[3]);
    });

    it("> verify student side", () => {
      cy.login("student", student.email);
      [testIds[2], testIds[3]].forEach(id => {
        assignmentsPage.getAssignmentByTestId(id).should("exist");
      });
    });
  });

  context("> customization-'own playlist'", () => {
    before("> create a playlist", () => {
      const moduledata = {
        module1: testIds.slice(0, 2)
      };
      cy.deleteAllAssignments("", teacher.email);
      cy.login("teacher", teacher.email, teacher.pass);
      playlistlibraryPage.createPlayListWithTests({ metadata: playListData, moduledata }).then(id => {
        playlistId = id;
        playlistlibraryPage.seachAndClickPlayListById(playlistId);
      });
    });

    it("> get playlist and customize", () => {
      playlistlibraryPage.seachAndClickPlayListById(playlistId);
      playlistlibraryPage.header.clickOnUseThis();
      cy.url().should("contain", playlistId);
    });

    it("> edit customized-'add new test'", () => {
      playlistlibraryPage.playlistCustom.clickOnManageContent();
      playlistlibraryPage.reviewTab.searchContainer.setFilters({ subject: subject.MATH, authoredByme: true });
      playlistlibraryPage.playlistCustom.dragTestFromSearchToModule(1, testIds[3]);
      playlistlibraryPage.header.clickOnSave();
    });

    it("> assign the 'customized module'", () => {
      playlistlibraryPage.reviewTab.clickOnAssignButtonByModule(1);
      playlistAssignPage.selectClass("Class");
      playlistAssignPage.clickOnAssign();
    });

    it("> verify teacher side-'customized playlist'", () => {
      playlistlibraryPage.seachAndClickPlayListById(playlistId, true);
      playlistlibraryPage.reviewTab.clickExpandByModule(1);
      playlistlibraryPage.reviewTab.verifyNoOfTestByModule(1, 3);
    });

    it("> verify teacher side-'assignments page'", () => {
      playlistlibraryPage.sidebar.clickOnAssignment();
      [testIds[0], testIds[1], testIds[3]].forEach(id => {
        authorAssignmentPage.getAssignmentRowsTestById(id).should("exist");
      });
    });

    it("> verify student side", () => {
      cy.login("student", student.email);
      [testIds[0], testIds[1], testIds[3]].forEach(id => {
        assignmentsPage.getAssignmentByTestId(id).should("exist");
      });
    });
  });
});
