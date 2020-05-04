import PlayListLibrary from "../../../../framework/author/playlist/playListLibrary";
import FileHelper from "../../../../framework/util/fileHelper";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import AssignmentsPage from "../../../../framework/student/assignmentsPage";
import StudenPlaylist from "../../../../framework/student/studentPlaylist";
import StudentTestPage from "../../../../framework/student/studentTestPage";

// TODO:  As there is no difference between normal teachet and CE flows in case of customization we are restricting CE flow only until the feature changes
describe(`${FileHelper.getSpecName(Cypress.spec.name)}>> spark playlist customization`, () => {
  const playlistlibraryPage = new PlayListLibrary();
  const testlibraryPage = new TestLibrary();
  const assignmentsPage = new AssignmentsPage();
  const studentplaylistPage = new StudenPlaylist();
  const studenttestPage = new StudentTestPage();
  let playlistid;
  let customplaylist;

  const qType = ["MCQ_TF", "MCQ_TF"];
  const attemptdata = [{ right: "right" }, { right: "right" }];

  const testToCreate = "PLAYLIST_TEST_1";
  const collection = "Spark Math";
  const testIds = [];
  let newtest;

  const playlistdata = {
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
      console.log(testIds, testIds.slice(0, 2), testIds.slice(2, 4));
      playlistdata.moduledata.module1 = testIds.slice(0, 2);
      playlistdata.moduledata.module2 = testIds.slice(2, 4);
    });
  });

  context(">allowing customization- drop", () => {
    /* customizing CE playlist will create new copy and changes made will reflect only at teacher and student side not at CE side */
    before(">create playlist", () => {
      playlistlibraryPage.createPlayListWithTests(playlistdata).then(id => {
        playlistid = id;
        playlistlibraryPage.header.clickOnEdit();
        playlistlibraryPage.header.clickOnSettings();
        playlistlibraryPage.setCustomization();
        playlistlibraryPage.header.clickOnPublish();
      });
    });
    context(">add a test to module-'from other module'", () => {
      before(">login", () => {
        cy.login("teacher", teacher.email, teacher.pass);
      });
      it(">search and use", () => {
        playlistlibraryPage.searchByCollection(collection);
        playlistlibraryPage.clickOnPlayListCardById(playlistid);
        playlistlibraryPage.header.clickOnUseThis();
      });
      it(">customize-'add a test from other module and verify'", () => {
        playlistlibraryPage.playlistCustom.clickOnManageContent(true).then(id => {
          customplaylist = id;
          expect(customplaylist).to.not.eq(playlistid);
        });
        playlistlibraryPage.reviewTab.moveTestBetweenModule(2, 2, 1);
        playlistlibraryPage.playlistCustom.clickUpdatePlaylist();
        playlistlibraryPage.reviewTab.getTestsInModuleByModule(1).should("have.length", 3);
        playlistlibraryPage.reviewTab.getTestsInModuleByModule(2).should("have.length", 1);
      });
      it(">drop the playlist", () => {
        playlistlibraryPage.sidebar.clickOnRecentUsedPlayList(false);
        playlistlibraryPage.header.clickOnDropPlalist();
        playlistlibraryPage.searchAndClickOnDropDownByClass("Class");
        playlistlibraryPage.clickDoneDropPlaylist();
      });
      context(">verify student side", () => {
        before(">login", () => {
          cy.login("student", students.email, students.pass);
          assignmentsPage.sidebar.clickOnPlaylistLibrary();
        });
        it(">verify student side-'new test'", () => {
          studentplaylistPage.clickOpenDroppedPlaylist();
          studentplaylistPage.clickOnViewPlaylistById(customplaylist);
          studentplaylistPage.clickExpandByModule(1);
          studentplaylistPage.getTestByTestByModule(1, 3).should("exist");
        });
        it(">attempt test-'practice'", () => {
          studentplaylistPage.clickOnPractiseByTestByMod(1, 3);
          studenttestPage.attemptQuestionsByQueType(qType, attemptdata);
          studenttestPage.clickOnExitTest();
        });
      });
    });
    context(">add new test to module-'from search bar'", () => {
      before(">login", () => {
        cy.login("teacher", teacher.email, teacher.pass);
        testlibraryPage.createTest("default").then(id => {
          newtest = id;
        });
      });

      it(">search and use", () => {
        playlistlibraryPage.seachAndClickPlayListById(customplaylist);
        playlistlibraryPage.header.clickOnUseThis();
        cy.url().should("contain", customplaylist);
      });

      it(">customize-'add new test'", () => {
        playlistlibraryPage.playlistCustom.clickOnManageContent();
        playlistlibraryPage.playlistCustom.searchContainer.setFilters({ collection: "Private Library" });
        playlistlibraryPage.playlistCustom.searchContainer.typeInSearchBar(newtest);
        playlistlibraryPage.playlistCustom.dragTestFromSearchToModule(1, newtest);
        // TODO: need to clarify as playlist will be in draft state and publish button is not visible there
        playlistlibraryPage.header.clickOnSave();
        playlistlibraryPage.reviewTab.getTestsInModuleByModule(1).should("have.length", 4);
      });
      context(">verify student side", () => {
        before(">login", () => {
          cy.login("student", students.email, students.pass);
          assignmentsPage.sidebar.clickOnPlaylistLibrary();
        });
        it(">verify student side-'new test'", () => {
          studentplaylistPage.clickOpenDroppedPlaylist();
          studentplaylistPage.clickOnViewPlaylistById(customplaylist);
          studentplaylistPage.clickExpandByModule(1);
          studentplaylistPage.getTestByTestByModule(1, 4).should("exist");
        });
        it(">attempt test-'practice'", () => {
          studentplaylistPage.clickOnPractiseByTestByMod(1, 4);
          studenttestPage.attemptQuestionsByQueType(qType.slice(1), attemptdata);
          studenttestPage.clickSubmitButton();
        });
      });
    });
    context(">remove test", () => {
      before(">login", () => {
        cy.login("teacher", teacher.email, teacher.pass);
      });
      it(">search and use", () => {
        playlistlibraryPage.seachAndClickPlayListById(customplaylist);
        playlistlibraryPage.header.clickOnUseThis();
        cy.url().should("contain", customplaylist);
      });
      it(">customize-'delete a test and verify'", () => {
        playlistlibraryPage.playlistCustom.clickOnManageContent();
        playlistlibraryPage.reviewTab.clickOnDeleteByTestByModule(1, 4);
        // TODO: need to clarify as playlist will be in draft state and publish button is not visible there
        playlistlibraryPage.header.clickOnSave();
        playlistlibraryPage.reviewTab.getTestsInModuleByModule(1).should("have.length", 3);
        playlistlibraryPage.reviewTab.getTestsInModuleByModule(2).should("have.length", 1);
      });
      it(">verify student side-'removed test'", () => {
        cy.login("student", students.email, students.pass);
        assignmentsPage.sidebar.clickOnPlaylistLibrary();
        studentplaylistPage.clickOpenDroppedPlaylist();
        studentplaylistPage.clickOnViewPlaylistById(customplaylist);
        studentplaylistPage.clickExpandByModule(1);
        studentplaylistPage.getTestByTestByModule(1, 4).should("not.exist");
      });
    });
    context(">remove module", () => {
      before(">login", () => {
        cy.login("teacher", teacher.email, teacher.pass);
      });
      it(">search and use", () => {
        playlistlibraryPage.seachAndClickPlayListById(customplaylist);
        playlistlibraryPage.header.clickOnUseThis();
        cy.url().should("contain", customplaylist);
      });
      it(">customize-'delete module'", () => {
        playlistlibraryPage.playlistCustom.clickOnManageContent();
        playlistlibraryPage.addTestTab.clickOnManageModule();
        playlistlibraryPage.addTestTab.clickOnDeleteByModule(2);
        playlistlibraryPage.addTestTab.clickOnDone();
        // TODO: need to clarify as playlist will be in draft state and publish button is not visible there
        playlistlibraryPage.header.clickOnSave();
      });
      it(">verify student side-'removed test'", () => {
        cy.login("student", students.email, students.pass);
        assignmentsPage.sidebar.clickOnPlaylistLibrary();
        studentplaylistPage.clickOpenDroppedPlaylist();
        studentplaylistPage.clickOnViewPlaylistById(customplaylist);
        studentplaylistPage.getModuleRowByModule(2).should("not.exist");
      });
    });
    context(">edit module and add new module", () => {
      before(">login", () => {
        cy.login("teacher", teacher.email, teacher.pass);
      });
      it(">search and use", () => {
        playlistlibraryPage.seachAndClickPlayListById(customplaylist);
        playlistlibraryPage.header.clickOnUseThis();
        cy.url().should("contain", customplaylist);
      });
      it(">customize-'create new module'", () => {
        playlistlibraryPage.playlistCustom.clickOnManageContent();
        playlistlibraryPage.addTestTab.clickOnManageModule();
        playlistlibraryPage.addTestTab.clickOnAddModule();
        playlistlibraryPage.addTestTab.setModuleGroupNameByModule(2, "module-group-3");
        playlistlibraryPage.addTestTab.setModuleName(2, "module-3");
        playlistlibraryPage.addTestTab.clickOnSaveByModule(2);
      });
      it(">customize-'edit module name-module 1", () => {
        playlistlibraryPage.addTestTab.clickOnEditByModule(1);
        playlistlibraryPage.addTestTab.setModuleName(1, "edited module");
        playlistlibraryPage.addTestTab.clickOnDone();
        playlistlibraryPage.header.clickOnSave();
      });
      it(">customize-'add test to new module'", () => {
        playlistlibraryPage.playlistCustom.searchContainer.setFilters({ collection: "Private Library" });
        playlistlibraryPage.playlistCustom.searchContainer.typeInSearchBar(newtest);
        playlistlibraryPage.playlistCustom.dragTestFromSearchToModule(2, newtest);
        playlistlibraryPage.header.clickOnSave();
      });
      context(">verify student side", () => {
        before(">login", () => {
          cy.login("student", students.email, students.pass);
          assignmentsPage.sidebar.clickOnPlaylistLibrary();
        });
        it(">edited module and new module", () => {
          studentplaylistPage.clickOpenDroppedPlaylist();
          studentplaylistPage.clickOnViewPlaylistById(customplaylist);
          studentplaylistPage.getModuleNameByModule(1).should("contain.text", "edited module");
          studentplaylistPage.clickExpandByModule(2);
          studentplaylistPage.getTestByTestByModule(2, 1).should("exist");
        });
        it(">attempt test from new module-'practice'", () => {
          studentplaylistPage.clickExpandByModule(2);
          studentplaylistPage.clickOnPractiseByTestByMod(2, 1);
          studenttestPage.attemptQuestionsByQueType(qType.slice(1), attemptdata);
          studenttestPage.clickOnExitTest();
        });
      });
    });
    context(">verify and edit by owner", () => {
      before(">create new test", () => {
        cy.login("publisher", contentEditor.email, contentEditor.pass);
      });
      it(">search playlist and verify", () => {
        playlistlibraryPage.seachAndClickPlayListById(playlistid);
        for (let i of [1, 2]) {
          playlistlibraryPage.reviewTab.getTestsInModuleByModule(i).should("have.length", 2);
          playlistlibraryPage.reviewTab.getModuleNameByModule(i).should("have.text", `module-${i}`);
        }
      });
      it(">remove test", () => {
        playlistlibraryPage.header.clickOnEdit();
        playlistlibraryPage.header.clickOnReview();
        playlistlibraryPage.reviewTab.clickExpandByModule(2);
        playlistlibraryPage.reviewTab.clickOnDeleteByTestByModule(2, 2);
        playlistlibraryPage.header.clickOnPublish();
      });
      it(">verify at teacher side-'removed test'", () => {
        cy.login("teacher", teacher.email, teacher.pass);
        playlistlibraryPage.searchByCollection(collection);
        playlistlibraryPage.clickOnPlayListCardById(playlistid);
        playlistlibraryPage.reviewTab.getTestByTestByModule(2, 2).should("not.exist");
      });
    });
  });
  context(">not allowing customization- drop", () => {
    /* not allowing customization will not create new  copy after customize and changes made at CE side will reflect to every one who has  acces to playlist(teachers and students) */
    before(">create playlist", () => {
      cy.login("publisher", contentEditor.email, contentEditor.pass);
      playlistlibraryPage.createPlayListWithTests(playlistdata).then(id => {
        playlistid = id;
      });
    });

    it(">verify shared playlist", () => {
      cy.login("teacher", teacher.email, teacher.pass);
      playlistlibraryPage.searchByCollection(collection);
      playlistlibraryPage.clickOnPlayListCardById(playlistid);
      playlistlibraryPage.header.clickOnUseThis().then(() => {
        playlistlibraryPage.playlistCustom.getModuleRowByModule(1);
        cy.url().should("contain", playlistid);
      });
      /* can't customize */
      playlistlibraryPage.playlistCustom.getManageContentButton().should("not.exist");
    });
    it(">drop playlist to the class", () => {
      playlistlibraryPage.header.clickOnDropPlalist();
      playlistlibraryPage.searchAndClickOnDropDownByClass("Class");
      playlistlibraryPage.clickDoneDropPlaylist();
    });
    it(">verify student side", () => {
      cy.login("student", students.email, students.pass);
      assignmentsPage.sidebar.clickOnPlaylistLibrary();
      studentplaylistPage.clickOpenDroppedPlaylist();
      studentplaylistPage.clickOnViewPlaylistById(playlistid);

      studentplaylistPage.clickExpandByModule(1);
      studentplaylistPage.getTestsInModuleByModule(1).should("have.length", 2);

      studentplaylistPage.clickExpandByModule(2);
      studentplaylistPage.getTestsInModuleByModule(2).should("have.length", 2);
    });
    /* when customization is off changes made at CE side  should reflect at teacher and student side  */
    context(">edit by owner", () => {
      before(">create new test", () => {
        cy.login("publisher", contentEditor.email, contentEditor.pass);
        testlibraryPage.createTest(testToCreate).then(id => {
          newtest = id;
        });
      });
      before(">edit the playlist", () => {
        playlistlibraryPage.seachAndClickPlayListById(playlistid);
        playlistlibraryPage.header.clickOnEdit();

        /* add new test module 2 */
        playlistlibraryPage.header.clickOnAddTests();
        playlistlibraryPage.searchFilter.clearAll();
        playlistlibraryPage.addTestTab.addTestByIdByModule(newtest, 2);

        /* delete a test from module 1 */
        playlistlibraryPage.header.clickOnReview();
        playlistlibraryPage.playlistCustom.clickExpandByModule(1);
        playlistlibraryPage.playlistCustom.clickOnDeleteByTestByModule(1, 2);
        playlistlibraryPage.header.clickOnPublish();
      });
      it(">verify at teacher side", () => {
        cy.login("teacher", teacher.email, teacher.pass);
        playlistlibraryPage.searchByCollection(collection);
        playlistlibraryPage.clickOnPlayListCardById(playlistid);
        playlistlibraryPage.header.clickOnUseThis().then(() => {
          playlistlibraryPage.playlistCustom.clickExpandByModule(1);
          cy.url().should("contain", playlistid);
        });

        /* verify deleted test */
        playlistlibraryPage.playlistCustom.getTestsInModuleByModule(1).should("have.length", 1);
        playlistlibraryPage.playlistCustom.getTestByTestByModule(1, 2).should("not.exist");

        /* verify new test */
        playlistlibraryPage.playlistCustom.clickExpandByModule(2);
        playlistlibraryPage.playlistCustom.getTestsInModuleByModule(2).should("have.length", 3);
      });
      it(">verify at student side", () => {
        cy.login("student", students.email, students.pass);
        assignmentsPage.sidebar.clickOnPlaylistLibrary();
        studentplaylistPage.clickOpenDroppedPlaylist();
        studentplaylistPage.clickOnViewPlaylistById(playlistid);

        /* verify deleted test */
        studentplaylistPage.clickExpandByModule(1);
        studentplaylistPage.getTestsInModuleByModule(1).should("have.length", 1);

        /* verify new test */
        studentplaylistPage.clickExpandByModule(2);
        studentplaylistPage.getTestsInModuleByModule(2).should("have.length", 3);
      });
      it(">attempt test added by owner", () => {
        studentplaylistPage.clickOnPractiseByTestByMod(2, 3);
        studenttestPage.attemptQuestionsByQueType(qType, attemptdata);
        studenttestPage.clickSubmitButton();
      });
    });
  });
});
