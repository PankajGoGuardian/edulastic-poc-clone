import PlayListLibrary from "../../../../framework/author/playlist/playListLibrary";
import FileHelper from "../../../../framework/util/fileHelper";
import StudentTestPage from "../../../../framework/student/studentTestPage";
import SidebarPage from "../../../../framework/student/sidebarPage";
import StudenPlaylist from "../../../../framework/student/studentPlaylist";
// import TestLibrary from "../../../../framework/author/tests/testLibraryPage";

describe(`${FileHelper.getSpecName(Cypress.spec.name)}>> play list drop teacher flow`, () => {
  const playlistlibraryPage = new PlayListLibrary();
  const studentTestPage = new StudentTestPage();
  const studentSideBarPage = new SidebarPage();
  const studentPlaylistReviewPage = new StudenPlaylist();
  // const testlibraryPage = new TestLibrary();

  let playlistId;
  // const testToCreate = "PLAYLIST_TEST_2";
  const qType = ["MCQ_TF", "MCQ_TF"];
  const attemptdata = [{ right: "right" }, { right: "right" }];
  const testids = [];

  const playlistdata = {
    metadata: {
      name: "Play List",
      grade: "Grade 10",
      subject: "Social Studies"
    },
    moduledata: {}
  };
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

  // before("create test", () => {
  //   cy.login("teacher", teacher.email, teacher.pass);
  //   testlibraryPage.createTest(testToCreate).then(id => {
  //     testids.push(id);
  //     cy.contains("Share With Others");
  //     for (let k = 0; k < 3; k++) {
  //       testlibraryPage.sidebar.clickOnTestLibrary();
  //       testlibraryPage.searchFilters.clearAll();
  //       testlibraryPage.clickOnTestCardById(testids[0]);
  //       testlibraryPage.clickOnDuplicate();
  //       testlibraryPage.header.clickOnPublishButton().then(newId => {
  //         testids.push(newId);
  //         cy.contains("Share With Others");
  //       });
  //     }
  //   });
  // });
  context.skip(">drop", () => {
    context(">drop complete playlist-'by student'", () => {
      before(">create playlist", () => {
        playlistdata.moduledata.module1 = testids.slice(0, 2);
        playlistdata.moduledata.module2 = testids.slice(2, 4);

        playlistlibraryPage.createPlayListWithTests(playlistdata).then(id => {
          playlistId = id;
        });
      });
      it(">drop play list for entire class", () => {
        playlistlibraryPage.header.clickOnUseThis();
        playlistlibraryPage.header.clickOnDropPlalist();
        playlistlibraryPage.searchAndClickOnDropDownByClass("Class");
        playlistlibraryPage.searchAndClickOnDropDownByStudent(students[0].name);
        playlistlibraryPage.clickDoneDropPlaylist();
      });

      context(">verify at student-1", () => {
        beforeEach(">login and find playlist", () => {
          cy.login("student", students[0].email, students[0].pass);
          studentSideBarPage.clickOnPlaylistLibrary();
          studentPlaylistReviewPage.clickOpenDroppedPlaylist();
          studentPlaylistReviewPage.clickOnViewPlaylistById(playlistId);
        });
        it(`>practice for student-'partial attempt'`, () => {
          for (let i = 1; i <= 2; i++) {
            for (let j = 1; j <= 2; j++) {
              playlistlibraryPage.reviewTab.clickExpandByModule(i);
              studentPlaylistReviewPage.clickOnPractiseByTestByMod(i, j);
              studentTestPage.attemptQuestionsByQueType(qType.slice(0, 1), attemptdata.slice(0, 1));
              studentTestPage.clickOnExitTest();
            }
          }
        });
        it(`>practice for student-'resume practice'`, () => {
          for (let i = 1; i <= 2; i++) {
            for (let j = 1; j <= 2; j++) {
              playlistlibraryPage.reviewTab.clickExpandByModule(i);
              studentPlaylistReviewPage.clickOnResumeByTestByMod(i, j);
              studentTestPage.attemptQuestionsByQueType(qType, attemptdata);
              studentTestPage.clickSubmitButton();
            }
          }
        });
      });
      context(">verify at student-2", () => {
        it(">verify absense of playlist", () => {
          cy.login("student", students[1].email, students[1].pass);
          studentSideBarPage.clickOnPlaylistLibrary();
          studentPlaylistReviewPage.clickOpenDroppedPlaylist();
          studentPlaylistReviewPage.getPlaylistCardById(playlistId).should("not.exist");
        });
      }); // todo
    });
    context(">drop complete playlist-'by class'", () => {
      before(">create playlist", () => {
        playlistdata.moduledata.module1 = testids.slice(0, 2);
        playlistdata.moduledata.module2 = testids.slice(2, 4);

        cy.login("teacher", teacher.email, teacher.pass);
        playlistlibraryPage.createPlayListWithTests(playlistdata).then(id => {
          playlistId = id;
        });
      });
      it(">drop play list for entire class", () => {
        playlistlibraryPage.header.clickOnUseThis();
        playlistlibraryPage.header.clickOnDropPlalist();
        playlistlibraryPage.searchAndClickOnDropDownByClass("Class");
        playlistlibraryPage.clickDoneDropPlaylist();
      });
      students.forEach((student, index) => {
        context(`>verify at student-${index + 1}`, () => {
          beforeEach(">login and find playlist", () => {
            cy.login("student", student.email, student.pass);
            studentSideBarPage.clickOnPlaylistLibrary();
            studentPlaylistReviewPage.clickOpenDroppedPlaylist();
            studentPlaylistReviewPage.clickOnViewPlaylistById(playlistId);
          });
          it(`>practice for student-'partial attempt'`, () => {
            for (let i = 1; i <= 2; i++) {
              for (let j = 1; j <= 2; j++) {
                playlistlibraryPage.reviewTab.clickExpandByModule(i);
                studentPlaylistReviewPage.clickOnPractiseByTestByMod(i, j);
                studentTestPage.attemptQuestionsByQueType(qType.slice(0, 1), attemptdata.slice(0, 1));
                studentTestPage.clickOnExitTest();
              }
            }
          });
          it(`>practice for student-'resume practice'`, () => {
            for (let i = 1; i <= 2; i++) {
              for (let j = 1; j <= 2; j++) {
                playlistlibraryPage.reviewTab.clickExpandByModule(i);
                studentPlaylistReviewPage.clickOnResumeByTestByMod(i, j);
                studentTestPage.attemptQuestionsByQueType(qType, attemptdata);
                studentTestPage.clickSubmitButton();
              }
            }
          });
        });
      });
    });

    context(">hide module/test", () => {
      context(">hide module", () => {
        before("create play list", () => {
          playlistdata.moduledata.module1 = testids.slice(0, 2);
          playlistdata.moduledata.module2 = testids.slice(2, 4);

          cy.login("teacher", teacher.email, teacher.pass);
          playlistlibraryPage.createPlayListWithTests(playlistdata).then(id => {
            playlistId = id;
          });
        });
        before(">set customization", () => {
          playlistlibraryPage.header.clickOnEdit();
          playlistlibraryPage.header.clickOnSettings();
          playlistlibraryPage.setCustomization();
          playlistlibraryPage.header.clickOnPublish();
        });
        it(">hide the module", () => {
          playlistlibraryPage.header.clickOnUseThis();
          playlistlibraryPage.reviewTab.clickHideModuleByModule(1);
        });
        it(">drop playlist for student", () => {
          playlistlibraryPage.header.clickOnDropPlalist();
          playlistlibraryPage.searchAndClickOnDropDownByClass("Class");
          playlistlibraryPage.searchAndClickOnDropDownByStudent(students[0].name);
          playlistlibraryPage.clickDoneDropPlaylist();
        });
        context(">verify at student side", () => {
          before(">login and get playlist", () => {
            cy.login("student", students[0].email, students[0].pass);
          });
          it(`>verify hidden module`, () => {
            studentSideBarPage.clickOnPlaylistLibrary();
            studentPlaylistReviewPage.clickOpenDroppedPlaylist();
            studentPlaylistReviewPage.clickOnViewPlaylistById(playlistId);
            studentPlaylistReviewPage.getModuleRowByModule(1).should("not.exist");
            playlistlibraryPage.reviewTab.clickExpandByModule(2);
            for (let i = 1; i <= 2; i++) {
              studentPlaylistReviewPage.getStartPractice(2, i).should("be.visible");
            }
          });
        });
      });
      context(">hide test", () => {
        before("create play list", () => {
          playlistdata.moduledata = {};
          playlistdata.moduledata.module1 = testids;

          cy.login("teacher", teacher.email, teacher.pass);
          playlistlibraryPage.createPlayListWithTests(playlistdata).then(id => {
            playlistId = id;
          });
        });
        before(">set customization", () => {
          playlistlibraryPage.header.clickOnEdit();
          playlistlibraryPage.header.clickOnSettings();
          playlistlibraryPage.setCustomization();
          playlistlibraryPage.header.clickOnPublish();
        });
        it(">hide test", () => {
          playlistlibraryPage.header.clickOnUseThis();
          playlistlibraryPage.reviewTab.clickHideTestByModule(1, 4);
        });
        it(">drop playlist for student", () => {
          playlistlibraryPage.header.clickOnDropPlalist();
          playlistlibraryPage.searchAndClickOnDropDownByClass("Class");
          playlistlibraryPage.searchAndClickOnDropDownByStudent(students[0].name);
          playlistlibraryPage.clickDoneDropPlaylist();
        });
        context(">verify at student side", () => {
          before(">login and get playlist", () => {
            cy.login("student", students[0].email, students[0].pass);
            studentSideBarPage.clickOnPlaylistLibrary();
            studentPlaylistReviewPage.clickOpenDroppedPlaylist();
            studentPlaylistReviewPage.clickOnViewPlaylistById(playlistId);
          });
          it(`>verify hidden test`, () => {
            studentPlaylistReviewPage.clickExpandByModule(1);
            studentPlaylistReviewPage.getTestByTestByModule(1, 4).should("not.exist");
            playlistlibraryPage.reviewTab.clickExpandByModule(1);
            for (let i = 1; i <= 3; i++) {
              studentPlaylistReviewPage.getStartPractice(1, i).should("be.visible");
            }
          });
        });
      });
    });
    context(">show module/test-'edit after drop'", () => {
      context(">create and drop", () => {
        before("create play list", () => {
          playlistdata.moduledata = {};
          playlistdata.moduledata.module1 = [testids[0]];
          playlistdata.moduledata.module2 = testids.slice(1);

          cy.login("teacher", teacher.email, teacher.pass);
          playlistlibraryPage.createPlayListWithTests(playlistdata).then(id => {
            playlistId = id;
          });
        });
        before(">set customization", () => {
          playlistlibraryPage.header.clickOnEdit();
          playlistlibraryPage.header.clickOnSettings();
          playlistlibraryPage.setCustomization();
          playlistlibraryPage.header.clickOnPublish();
          playlistlibraryPage.header.clickOnUseThis();
        });
        before(">hide test in a module-'module-1 with 1 test'", () => {
          studentPlaylistReviewPage.clickExpandByModule(1);
          playlistlibraryPage.reviewTab.clickHideTestByModule(1, 1);
        });
        before(">hide two tests in module-'module-2 with 3 tests'", () => {
          studentPlaylistReviewPage.clickExpandByModule(2);
          playlistlibraryPage.reviewTab.clickHideTestByModule(2, 2);
          playlistlibraryPage.reviewTab.clickHideTestByModule(2, 3);
        });
        before(">drop playlist to one student", () => {
          playlistlibraryPage.header.clickOnDropPlalist();
          playlistlibraryPage.searchAndClickOnDropDownByClass("Class");
          playlistlibraryPage.searchAndClickOnDropDownByStudent(students[0].name);
          playlistlibraryPage.clickDoneDropPlaylist();
        });
        context(">verify at student side-'before edit'", () => {
          before(">login", () => {
            cy.login("student", students[0].email, students[0].pass);
            studentSideBarPage.clickOnPlaylistLibrary();
            studentPlaylistReviewPage.clickOpenDroppedPlaylist();
            studentPlaylistReviewPage.clickOnViewPlaylistById(playlistId);
          });
          it(">verify shown tests/modules", () => {
            studentPlaylistReviewPage.clickExpandByModule(2);
            studentPlaylistReviewPage.getStartPractice(2, 1).should("be.visible");
          });
          it(">verify hidden tests/modules", () => {
            studentPlaylistReviewPage.getModuleRowByModule(1).should("not.exist");
            studentPlaylistReviewPage.clickExpandByModule(2);
            studentPlaylistReviewPage.getTestByTestByModule(2, 2).should("not.exist");
            studentPlaylistReviewPage.getTestByTestByModule(2, 3).should("not.exist");
          });
          it(">verify for student-2-'no playlist'", () => {
            cy.login("student", students[1].email, students[1].pass);
            studentSideBarPage.clickOnPlaylistLibrary();
            studentPlaylistReviewPage.clickOpenDroppedPlaylist();
            studentPlaylistReviewPage.getPlaylistCardById(playlistId).should("not.exist");
          });
        });
      });
      context(">edit the playlist-'show hidden test/modules'", () => {
        before(">login", () => {
          cy.login("teacher", teacher.email, teacher.pass);
          playlistlibraryPage.sidebar.clickOnRecentUsedPlayList();
        });
        before(">show module in a module-'module-1 with 1 test'", () => {
          playlistlibraryPage.reviewTab.clickShowModuleByModule(1);
        });
        before(">show one test in module-'module 2 with 3 tests'", () => {
          studentPlaylistReviewPage.clickExpandByModule(2);
          playlistlibraryPage.reviewTab.clickShowTestByModule(2, 2);
        });
        before(">drop to entire class", () => {
          playlistlibraryPage.header.clickOnDropPlalist();
          playlistlibraryPage.clickDropDownByClass("Class");
          playlistlibraryPage.clickDoneDropPlaylist();
        });
        students.forEach((student, index) => {
          context(`>verify for student-${index + 1}-'after edit'`, () => {
            before(">login and verify presence of playlist", () => {
              cy.login("student", student.email, student.pass);
              studentSideBarPage.clickOnPlaylistLibrary();
              studentPlaylistReviewPage.clickOpenDroppedPlaylist();
              studentPlaylistReviewPage.clickOnViewPlaylistById(playlistId);
            });
            it(">verify shown test/modules", () => {
              studentPlaylistReviewPage.clickExpandByModule(1);
              studentPlaylistReviewPage.getStartPractice(1, 1).should("be.visible");

              studentPlaylistReviewPage.clickExpandByModule(2);
              studentPlaylistReviewPage.getStartPractice(2, 2).should("be.visible");
              studentPlaylistReviewPage.getTestByTestByModule(2, 3).should("not.exist");
            });
            it(">verify hidden test/modules", () => {
              studentPlaylistReviewPage.clickExpandByModule(2);
              studentPlaylistReviewPage.getTestByTestByModule(2, 3).should("not.exist");
            });
          });
        });
      });
    });
  });
});
