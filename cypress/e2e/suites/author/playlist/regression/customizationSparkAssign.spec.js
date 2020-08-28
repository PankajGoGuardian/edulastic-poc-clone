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

  const qType = ["MCQ_TF"];
  const attemptdata = [{ right: "right" }];
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
  /* before{
  1. login as CE
  2. Create 4 tests
  3. create playlist with 2 modules having 2 tests each and associate the playlist with 'spark math collection'
  4. set customization 'on' for the playlist
} */
  before("> create tests ", () => {
    cy.login("publisher", contentEditor.email, contentEditor.pass);
    for (let k = 0; k <= 3; k++) {
      testlibraryPage.searchAndClickTestCardById("5f47c957d5d91400086d3b39");
      testlibraryPage.clickOnDuplicate();
      testlibraryPage.testSummary.setName(`test- ${k + 1}`);
      testlibraryPage.testSummary.selectCollection("Spark Math - Spark Math Bucket");
      testlibraryPage.header.clickOnPublishButton().then(id => {
        testIds.push(id);
        testlibraryPage.sidebar.clickOnItemBank();
      });
    }

    cy.wait(1).then(() => {
      plalistdata.moduledata.module1 = testIds.slice(0, 2);
      plalistdata.moduledata.module2 = testIds.slice(2, 4);
    });
  });
  before("> create playlist", () => {
    playlistlibraryPage.createPlayListWithTests(plalistdata).then(id => {
      playlisid = id;
      playlistlibraryPage.header.clickOnEdit();
      playlistlibraryPage.header.clickOnSettings();
      playlistlibraryPage.setCustomization();
      playlistlibraryPage.header.clickOnPublish();
    });
  });

  context("> customization by adding new test to module", () => {
    /* before{
      login as teacher(having access to 'spark math collection')
      create one test
    } 
    test{
      1. search playlist created by CE using 'spark math collection'
      2. Assign module1 
      3. customize playlist(will create new copy)
      4. Add test created in before to module1
      5. Re-assign module1 to same class, wiwth 'no duplicates'
      6. verify student side the 'presence of 3 unique tests'
    }
    */
    before("> login as teacher and create one test", () => {
      cy.deleteAllAssignments("", teacher.email);
      cy.login("teacher", teacher.email, teacher.pass);
      testlibraryPage.createTest("default").then(id => {
        newtest = id;
      });
    });
    it("> search using 'spark math' collection and use playlist", () => {
      playlistlibraryPage.searchByCollection(collection);
      playlistlibraryPage.clickOnPlayListCardById(playlisid);
      playlistlibraryPage.header.clickOnUseThis();
    });
    it("> assign one whole module in playlist", () => {
      playlistlibraryPage.playlistCustom.clickOnAssignButtonByModule(1);
      playlistlibraryPage.playListAssign.selectClass("Class");
      playlistlibraryPage.playListAssign.clickOnAssign();
    });
    it("> customize playlist by adding new test", () => {
      playlistlibraryPage.sidebar.clickOnRecentUsedPlayList();
      playlistlibraryPage.playlistCustom.clickOnManageContent(true).then(id => {
        customplaylist = id;
        expect(customplaylist).to.not.eq(playlisid);
      });
      playlistlibraryPage.playlistCustom.searchContainer.setFilters({ collection: "Private Library" });
      playlistlibraryPage.playlistCustom.searchContainer.typeInSearchBar(newtest);
      playlistlibraryPage.playlistCustom.dragTestFromSearchToModule(1, newtest);
      playlistlibraryPage.header.clickOnSave();
      playlistlibraryPage.reviewTab.getTestsInModuleByModule(1).should("have.length", 3);
    });
    it("> reassign the module", () => {
      playlistlibraryPage.reviewTab.clickOnAssignButtonByModule(1);
      playlistlibraryPage.playListAssign.selectClass("Class");
      playlistlibraryPage.playListAssign.clickOnAssign({ duplicate: false });
    });
    it("> verify student side no of tests and attempt new test", () => {
      cy.login("student", students.email, students.pass);
      [...testIds.slice(0, 2), newtest].forEach(id => {
        assignmentsPage.getAssignmentByTestId(id).should("have.length", 1);
      });
      assignmentsPage.clickOnAssigmentByTestId(newtest);
      studentTestPage.attemptQuestionsByQueType(qType.slice(1), attemptdata);
      studentTestPage.submitTest();
    });
  });
  context("> customization by moving test from one module2 to module1", () => {
    /* before{
      login as teacher(having access to 'spark math collection')
      delete all assignments
    } 
    test{
      1. search playlist created while 'customization'
      2. move one test from module2 to module1
      3. Assign module2(now has 4 tests)
      4. verify student side the 'presence of 4th test'
    }
    */
    before(">login", () => {
      cy.login("teacher", teacher.email, teacher.pass);
    });
    it("> search and use customizesd playlist", () => {
      playlistlibraryPage.seachAndClickPlayListById(customplaylist);
      playlistlibraryPage.header.clickOnUseThis();
      cy.url().should("contain", customplaylist);
    });
    it("> move test and verify", () => {
      playlistlibraryPage.playlistCustom.clickOnManageContent();
      playlistlibraryPage.reviewTab.moveTestBetweenModule(2, 1, 1);
      playlistlibraryPage.reviewTab.getTestsInModuleByModule(1).should("have.length", 4);
      playlistlibraryPage.reviewTab.getTestsInModuleByModule(2).should("have.length", 1);
      // TODO: need to clarify as playlist will be in draft state and publish button is not visible there
    });

    it("> assign the moved test", () => {
      playlistlibraryPage.reviewTab.clickOnAssignByTestByModule(1, 4);
      playlistlibraryPage.playListAssign.selectClass("Class");
      playlistlibraryPage.playListAssign.clickOnAssign();
    });
    it("> verify moved test at student side ", () => {
      cy.login("student", students.email, students.pass);
      assignmentsPage.getAssignmentByTestId(testIds[2]).should("have.length", 1);
    });
  });
  context(">customization by removing assigned test", () => {
    // TODO: get clarified about need of this context
    /* before{
      login as teacher(having access to 'spark math collection')
    } 
    test{
      1. search playlist created while 'customization'
      2. delete assigned test from module1  
      3. verify student side the 'presence of deleted test' and attempt the test
    }
    */
    before(">login", () => {
      cy.login("teacher", teacher.email, teacher.pass);
    });
    it("> search and use playlist", () => {
      playlistlibraryPage.seachAndClickPlayListById(customplaylist);
      playlistlibraryPage.header.clickOnUseThis();
      cy.url().should("contain", customplaylist);
    });
    it("> remove a assigned test and verify", () => {
      playlistlibraryPage.playlistCustom.clickOnManageContent();
      playlistlibraryPage.reviewTab.clickExpandByModule(1);
      playlistlibraryPage.reviewTab.clickOnDeleteByTestByModule(1, 4);
      // TODO: need to clarify as playlist will be in draft state and publish button is not visible there
      playlistlibraryPage.header.clickOnSave();
      playlistlibraryPage.reviewTab.getTestsInModuleByModule(1).should("have.length", 3);
      playlistlibraryPage.reviewTab.getTestsInModuleByModule(2).should("have.length", 1);
    });
    it("> verify student side 'presence of deleted test and attempt'", () => {
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
