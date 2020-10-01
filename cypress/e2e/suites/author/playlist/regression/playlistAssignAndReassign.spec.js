import PlayListLibrary from '../../../../framework/author/playlist/playListLibrary'
import FileHelper from '../../../../framework/util/fileHelper'
import TestLibrary from '../../../../framework/author/tests/testLibraryPage'
import AssignmentsPage from '../../../../framework/student/assignmentsPage'
import AuthorAssignmentPage from '../../../../framework/author/assignments/AuthorAssignmentPage'
import LiveClassboardPage from '../../../../framework/author/assignments/LiveClassboardPage'
import ExpressGraderPage from '../../../../framework/author/assignments/expressGraderPage'
import StandardBasedReportPage from '../../../../framework/author/assignments/standardBasedReportPage'
import { teacherSide } from '../../../../framework/constants/assignmentStatus'
import StudentTestPage from '../../../../framework/student/studentTestPage'

describe(`${FileHelper.getSpecName(
  Cypress.spec.name
)}> playlist assigning`, () => {
  const playlistlibraryPage = new PlayListLibrary()
  const testlibraryPage = new TestLibrary()
  const assignmentsPage = new AssignmentsPage()
  const authorAssignmentPage = new AuthorAssignmentPage()
  const studentTestPage = new StudentTestPage()
  const lcb = new LiveClassboardPage()
  const egp = new ExpressGraderPage()
  const sbr = new StandardBasedReportPage()

  let playListId
  let assignMentIdObj
  let testCount
  let length
  const classes = ['Class-1', 'Class-2']
  const class1_Id = '5f50a3e38fcfda0007d5ccbc'
  const class2_Id = '5f50a442b3a21900085f6613'
  const testIds = ['5f50ab07ec49840008a5dce3', '5f50aad39877a6000827b929']
  const commonData = { type: 'A', teacher: 'teacher1 ' }
  const metadata = {
    name: 'Play List',
    grade: 'Grade 10',
    subject: 'Social Studies',
  }
  const class1Student = {
    email: 'student.playlist.assign@snapwiz.com',
    pass: 'snapwiz',
  }
  const class2Student = {
    email: 'student2.playlist.assign@snapwiz.com',
    pass: 'snapwiz',
  }

  const teacher1 = {
    email: 'playlist.assign.reassign1@snapwiz.com',
    pass: 'snapwiz',
  }

  const teacher2 = {
    email: 'playlist.assign.reassign2@snapwiz.com',
    pass: 'snapwiz',
  }
  before('>create test', () => {
    cy.login('teacher', teacher1.email, teacher1.pass)
    cy.deleteAllAssignments('', teacher1.email)
    /*  testlibraryPage.createTest().then(id => {
      testIds.push(id);
      testlibraryPage.searchAndClickTestCardById(id);
      testlibraryPage.clickOnDuplicate();
      testlibraryPage.header.clickOnPublishButton().then(testid => {
        testIds.push(testid);
      });
    }); */
  })
  before('>create play list', () => {
    const moduledata = {
      module1: testIds,
    }
    playlistlibraryPage
      .createPlayListWithTests({ metadata, moduledata })
      .then((id) => {
        playListId = id
      })
  })
  context('> play list assign', () => {
    context('> assign whole module', () => {
      it('> assign whole module from playlist', () => {
        playlistlibraryPage.header.clickOnUseThis()
        playlistlibraryPage.reviewTab.clickOnAssignButtonByModule(1)

        playlistlibraryPage.playListAssign.selectClass(classes[0])
        playlistlibraryPage.playListAssign.clickOnAssign().then((idObj) => {
          assignMentIdObj = idObj
        })
      })

      it("> teacher side verification 'assignments page'", () => {
        playlistlibraryPage.sidebar.getFavouritePlaylist()
        playlistlibraryPage.sidebar.clickOnAssignment()
        authorAssignmentPage.getStatus().should('have.length', 2)

        testIds.forEach((id) => {
          authorAssignmentPage.getAssignmentRowsTestById(id).should('exist')
        })
      })

      it("> teacher side verification 'favourite playlist page'", () => {
        const rowData = {
          status: teacherSide.IN_PROGRESS,
          submitted: '0 of 1',
          graded: '0',
          className: classes[0],
        }
        playlistlibraryPage.sidebar.clickOnRecentUsedPlayList()
        playlistlibraryPage.reviewTab.verifyModuleProgress(1, 1)
        playlistlibraryPage.reviewTab.clickExpandByModule(1)
        ;[1, 2].forEach((test) => {
          playlistlibraryPage.reviewTab.clickShowAssignmentByTestByModule(
            1,
            test
          )
          playlistlibraryPage.reviewTab.verifyAssignmentRowByTestByMod(
            1,
            test,
            { ...commonData, ...rowData }
          )
        })
      })

      it("> verify lcb,express grader and reports navigations in 'favourite playlist page'", () => {
        cy.server()
        cy.route('GET', '**/playlists/*').as('go-to-playList')
        testIds.forEach((test, i) => {
          for (let k = 0; k < 3; k++) {
            playlistlibraryPage.reviewTab.clickExpandByModule(1)
            playlistlibraryPage.reviewTab.clickLcbIconByTestByIndex(1, i + 1, k)
            k === 0
              ? lcb.verifyClassAndAssignmntId(class1_Id, assignMentIdObj[test])
              : k === 1
              ? egp.verifyClassAndAssignmntId(class1_Id, assignMentIdObj[test])
              : k === 2
              ? sbr.verifyClassAndAssignmntId(class1_Id, assignMentIdObj[test])
              : assert.fail()

            cy.go('back')
            cy.wait('@go-to-playList')
          }
        })
      })

      it("> student side verification 'assignment buttons'", () => {
        cy.login('student', class1Student.email, class1Student.pass)
        assignmentsPage.getAssignmentButton().should('have.length', 2)
        testIds.forEach((id) => {
          assignmentsPage.getAssignmentByTestId(id).should('exist')
        })
      })

      it("> markstudents as 'submitted' and 'close' tests", () => {
        cy.login('teacher', teacher1.email, teacher1.pass)
        testIds.forEach((test, i) => {
          playlistlibraryPage.sidebar.getFavouritePlaylist()
          testlibraryPage.sidebar.clickOnAssignment()
          authorAssignmentPage.clickOnLCBbyTestId(test, assignMentIdObj[test])

          lcb.checkSelectAllCheckboxOfStudent()
          lcb.clickOnMarkAsSubmit()
          lcb.header.clickOnClose()
        })
      })

      it("> verify 'assignments rows' in 'favourite playlist page'", () => {
        const rowData = {
          status: teacherSide.DONE,
          submitted: '1 of 1',
          graded: '1',
          className: classes[0],
        }
        testlibraryPage.sidebar.clickOnRecentUsedPlayList()
        testIds.forEach((test, i) => {
          playlistlibraryPage.reviewTab.clickShowAssignmentByTestByModule(
            1,
            i + 1
          )
          playlistlibraryPage.reviewTab.verifyAssignmentRowByTestByMod(
            1,
            i + 1,
            { ...commonData, ...rowData }
          )
        })
      })
    })

    context('> one test in a module', () => {
      before('> search and use playlist', () => {
        cy.deleteAllAssignments('', teacher1.email)
        testCount = 1
        cy.login('teacher', teacher1.email, teacher1.pass)
        playlistlibraryPage.getPlayListAndClickOnUseThisById(playListId)
      })

      it('> assign 1 tests in a module from playlist', () => {
        playlistlibraryPage.reviewTab.clickOnAssignByTestByModule(1, 1)
        playlistlibraryPage.playListAssign.selectClass(classes[0])
        playlistlibraryPage.playListAssign.clickOnAssign().then((idObj) => {
          assignMentIdObj = idObj
        })
      })

      it("> teacher side verification 'assignments page'", () => {
        playlistlibraryPage.sidebar.getFavouritePlaylist()
        playlistlibraryPage.sidebar.clickOnAssignment()
        authorAssignmentPage.getStatus().should('have.length', testCount)
        authorAssignmentPage
          .getAssignmentRowsTestById(testIds[0])
          .should('exist')
      })

      it("> teacher side verification 'favourite playlist page'", () => {
        const rowData = {
          status: teacherSide.IN_PROGRESS,
          submitted: '0 of 1',
          graded: '0',
          className: classes[0],
        }
        playlistlibraryPage.sidebar.clickOnRecentUsedPlayList()
        playlistlibraryPage.reviewTab.verifyModuleProgress(1, 1)

        playlistlibraryPage.reviewTab.clickExpandByModule(1)
        playlistlibraryPage.reviewTab.clickShowAssignmentByTestByModule(1, 1)
        playlistlibraryPage.reviewTab.verifyAssignmentRowByTestByMod(1, 1, {
          ...commonData,
          ...rowData,
        })
      })

      it("> verify lcb,express grader and reports navigations from 'favourite playlist page'", () => {
        cy.server()
        cy.route('GET', '**/playlists/*').as('go-to-playList')

        for (let k = 0; k < 3; k++) {
          playlistlibraryPage.reviewTab.clickExpandByModule(1)
          playlistlibraryPage.reviewTab.clickLcbIconByTestByIndex(1, 1, k)
          k === 0
            ? lcb.verifyClassAndAssignmntId(
                class1_Id,
                assignMentIdObj[testIds[0]]
              )
            : k === 1
            ? egp.verifyClassAndAssignmntId(
                class1_Id,
                assignMentIdObj[testIds[0]]
              )
            : k === 2
            ? sbr.verifyClassAndAssignmntId(
                class1_Id,
                assignMentIdObj[testIds[0]]
              )
            : assert.fail()
          cy.go('back')
          cy.wait('@go-to-playList')
        }
      })

      it("> student side verification 'assignments buttons'", () => {
        cy.login('student', class1Student.email, class1Student.pass)
        assignmentsPage.getAssignmentButton().should('have.length', testCount)
        assignmentsPage.getAssignmentByTestId(testIds[0]).should('exist')
      })

      it("> mark student as 'submitted' and 'close' test", () => {
        cy.login('teacher', teacher1.email, teacher1.pass)
        playlistlibraryPage.sidebar.getFavouritePlaylist()
        testlibraryPage.sidebar.clickOnAssignment()
        authorAssignmentPage.clickOnLCBbyTestId(
          testIds[0],
          assignMentIdObj[testIds[0]]
        )

        lcb.checkSelectAllCheckboxOfStudent()
        lcb.clickOnMarkAsSubmit()
        lcb.header.clickOnClose()
      })

      it("> verify assignments rows in 'favourite playlist page'", () => {
        const rowData = {
          status: teacherSide.DONE,
          submitted: '1 of 1',
          graded: '1',
          className: classes[0],
        }
        testlibraryPage.sidebar.clickOnRecentUsedPlayList()
        playlistlibraryPage.reviewTab.clickShowAssignmentByTestByModule(1, 1)
        playlistlibraryPage.reviewTab.verifyAssignmentRowByTestByMod(1, 1, {
          ...commonData,
          ...rowData,
        })
      })
    })

    context("> one test in a module 'assign same test to two classes'", () => {
      before('> search and use playlist', () => {
        cy.deleteAllAssignments('', teacher1.email)
        testCount = 1
        cy.login('teacher', teacher1.email, teacher1.pass)
        playlistlibraryPage.getPlayListAndClickOnUseThisById(playListId)
      })

      it('> assign test to class-1 and class-2', () => {
        playlistlibraryPage.reviewTab.clickOnAssignByTestByModule(1, 1)
        playlistlibraryPage.playListAssign.selectClass(classes[0])
        playlistlibraryPage.playListAssign.selectClass(classes[1])
        playlistlibraryPage.playListAssign.clickOnAssign().then((idObj) => {
          assignMentIdObj = idObj
        })
      })

      it("> teacher side verification 'assignments page'", () => {
        playlistlibraryPage.sidebar.getFavouritePlaylist()
        playlistlibraryPage.sidebar.clickOnAssignment()

        authorAssignmentPage.getStatus().should('have.length', 2)
        authorAssignmentPage
          .getAssignmentRowsTestById(testIds[0])
          .should('have.length', 2)
      })

      it("> teacher side verification 'favourite playlist page'", () => {
        playlistlibraryPage.sidebar.clickOnRecentUsedPlayList()
        playlistlibraryPage.reviewTab.verifyModuleProgress(1, 1)

        playlistlibraryPage.reviewTab.clickExpandByModule(1)
        playlistlibraryPage.reviewTab.clickShowAssignmentByTestByModule(1, 1)
        classes.forEach((clas, ind) => {
          const rowData = {
            status: teacherSide.IN_PROGRESS,
            submitted: '0 of 1',
            graded: '0',
            className: clas,
          }
          playlistlibraryPage.reviewTab.verifyAssignmentRowByTestByMod(
            1,
            1,
            { ...commonData, ...rowData },
            ind
          )
        })
      })

      it('> verify lcb,express grader and reports navigation from favourite playlist page', () => {
        cy.server()
        cy.route('GET', '**/playlists/*').as('go-to-playList')
        classes.forEach((clas, ind) => {
          const classId = ind ? class2_Id : class1_Id
          for (let k = 0; k < 3; k++) {
            playlistlibraryPage.reviewTab.clickExpandByModule(1)
            playlistlibraryPage.reviewTab.clickLcbIconByTestByIndex(
              1,
              1,
              k,
              ind
            )
            k === 0
              ? lcb.verifyClassAndAssignmntId(
                  classId,
                  assignMentIdObj[testIds[0]]
                )
              : k === 1
              ? egp.verifyClassAndAssignmntId(
                  classId,
                  assignMentIdObj[testIds[0]]
                )
              : k === 2
              ? sbr.verifyClassAndAssignmntId(
                  classId,
                  assignMentIdObj[testIds[0]]
                )
              : assert.fail()
            cy.go('back')
            cy.wait('@go-to-playList')
          }
        })
      })

      it("> student side verification-'assignment buttons' for class-1", () => {
        cy.login('student', class1Student.email, class1Student.pass)
        assignmentsPage.getAssignmentButton().should('have.length', 1)
        assignmentsPage.getAssignmentByTestId(testIds[0]).should('exist')
      })

      it("> student side verification-'assignment buttons' for class-2", () => {
        cy.login('student', class2Student.email, class1Student.pass)
        assignmentsPage.getAssignmentButton().should('have.length', 1)

        assignmentsPage.clickOnAssigmentByTestId(testIds[0])
        studentTestPage.clickOnNext()
        studentTestPage.submitTest()
      })

      it('> verify assignments rows in favourite playlist page', () => {
        cy.login('teacher', teacher1.email, teacher1.pass)
        testlibraryPage.sidebar.clickOnRecentUsedPlayList()
        playlistlibraryPage.reviewTab.clickShowAssignmentByTestByModule(1, 1)

        const rowData_1 = {
          status: teacherSide.IN_PROGRESS,
          submitted: '0 of 1',
          graded: '0',
          className: classes[0],
        }
        playlistlibraryPage.reviewTab.verifyAssignmentRowByTestByMod(1, 1, {
          ...commonData,
          ...rowData_1,
        })

        const rowData_2 = {
          status: teacherSide.IN_GRADING,
          submitted: '1 of 1',
          graded: '1',
          className: classes[1],
        }
        playlistlibraryPage.reviewTab.verifyAssignmentRowByTestByMod(
          1,
          1,
          { ...commonData, ...rowData_2 },
          1
        )
      })
    })
  })

  context('> reassign tests with playlists', () => {
    context('> reassign test from playList', () => {
      before('> search and use playlist', () => {
        testCount = 2
        cy.deleteAllAssignments('', teacher1.email)
        cy.login('teacher', teacher1.email, teacher1.pass)
        playlistlibraryPage.getPlayListAndClickOnUseThisById(playListId)
        playlistlibraryPage.reviewTab.clickOnAssignByTestByModule(1, 1)

        playlistlibraryPage.playListAssign.selectClass(classes[0])
        playlistlibraryPage.playListAssign.clickOnAssign()
        playlistlibraryPage.getPlayListAndClickOnUseThisById(playListId)
      })

      it("> reassign test from 'favourite playlist page'", () => {
        playlistlibraryPage.reviewTab.clickOnAssignByTestByModule(1, 1, true)
        playlistlibraryPage.playListAssign.selectClass(classes[0])
        playlistlibraryPage.playListAssign.clickOnAssign({ duplicate: true })
      })

      it("> teacher side verification-'assignments page'", () => {
        playlistlibraryPage.sidebar.getFavouritePlaylist()
        playlistlibraryPage.sidebar.clickOnAssignment()

        authorAssignmentPage.getStatus().should('have.length', testCount)
        authorAssignmentPage
          .getAssignmentRowsTestById(testIds[0])
          .should('have.length', testCount)
        playlistlibraryPage.sidebar.clickOnRecentUsedPlayList()
      })
      it("> student side verification-'assignments button'", () => {
        cy.login('student', class1Student.email, class1Student.pass)
        assignmentsPage.getAssignmentButton().should('have.length', testCount)
        assignmentsPage
          .getAssignmentByTestId(testIds[0])
          .should('have.length', testCount)
      })
    })
    context(
      "> reassign test-'already assigned test is part of a playlist'",
      () => {
        before('> assign the test and use playlist', () => {
          testCount = [testIds[1], ...testIds].length
          cy.deleteAllAssignments('', teacher1.email)
          cy.login('teacher', teacher1.email, teacher1.pass)
          playlistlibraryPage.playListAssign.visitAssignPageById(testIds[1])

          playlistlibraryPage.playListAssign.selectClass(classes[0])
          playlistlibraryPage.playListAssign.clickOnAssign()
          playlistlibraryPage.getPlayListAndClickOnUseThisById(playListId)
        })

        it("> assign whole module-'includes assigned test'", () => {
          playlistlibraryPage.reviewTab.clickOnAssignButtonByModule(1)
          playlistlibraryPage.playListAssign.selectClass(classes[0])
          playlistlibraryPage.playListAssign.clickOnAssign({ duplicate: true })
        })

        it("> teacher side verification-'assignments page'", () => {
          playlistlibraryPage.sidebar.getFavouritePlaylist()
          playlistlibraryPage.sidebar.clickOnAssignment()
          authorAssignmentPage.getStatus().should('have.length', testCount)

          testIds.forEach((id) => {
            length = id === testIds[1] ? 2 : 1
            authorAssignmentPage
              .getAssignmentRowsTestById(id)
              .should('have.length', length)
          })
        })

        it("> student side verification-'assignments button'", () => {
          cy.login('student', class1Student.email, class1Student.pass)
          assignmentsPage.getAssignmentButton().should('have.length', testCount)
          testIds.forEach((id) => {
            length = id === testIds[1] ? 2 : 1
            assignmentsPage
              .getAssignmentByTestId(id)
              .should('have.length', length)
          })
        })
      }
    )
  })

  context('> two teacher part of a same class', () => {
    before('> share the playlist', () => {
      cy.deleteAllAssignments('', teacher1.email)
      cy.deleteAllAssignments('', teacher2.email)
      testCount = 1
      cy.login('teacher', teacher1.email, teacher1.pass)
      playlistlibraryPage.getPlayListAndClickOnUseThisById(playListId)
      playlistlibraryPage.header.clickOnShare()
      testlibraryPage.selectPeopletoshare(teacher2.email, true)
    })

    it("> assign one test in play list 'by teacher-1'", () => {
      playlistlibraryPage.getPlayListAndClickOnUseThisById(playListId)
      playlistlibraryPage.reviewTab.clickOnAssignByTestByModule(1, 1)

      playlistlibraryPage.playListAssign.selectClass(classes[0])
      playlistlibraryPage.playListAssign.clickOnAssign()
    })

    it("> verify assignments page 'by teacher-1'", () => {
      playlistlibraryPage.sidebar.getFavouritePlaylist()
      playlistlibraryPage.sidebar.clickOnAssignment()

      authorAssignmentPage.getStatus().should('have.length', testCount)
      authorAssignmentPage.getAssignmentRowsTestById(testIds[0]).should('exist')
    })

    it("> verify favourite playlist page 'by teacher-1'", () => {
      const rowData = {
        status: teacherSide.IN_PROGRESS,
        submitted: '0 of 1',
        graded: '0',
        className: classes[0],
      }
      playlistlibraryPage.sidebar.clickOnRecentUsedPlayList()
      playlistlibraryPage.reviewTab.verifyModuleProgress(1, 1)

      playlistlibraryPage.reviewTab.clickShowAssignmentByTestByModule(1, 1)
      playlistlibraryPage.reviewTab.verifyAssignmentRowByTestByMod(1, 1, {
        ...commonData,
        ...rowData,
      })
    })

    it(">verify assignments page 'by teacher-2'", () => {
      cy.login('teacher', teacher2.email, teacher2.pass)
      playlistlibraryPage.sidebar.getFavouritePlaylist()
      playlistlibraryPage.sidebar.clickOnAssignment()

      authorAssignmentPage.getStatus().should('have.length', testCount)
      authorAssignmentPage.getAssignmentRowsTestById(testIds[0]).should('exist')
    })

    it(">verify favourite playlist page 'by teacher-2'", () => {
      const rowData = {
        status: teacherSide.IN_PROGRESS,
        submitted: '0 of 1',
        graded: '0',
        className: classes[0],
      }

      playlistlibraryPage.sidebar.clickOnPlayListLibrary()
      playlistlibraryPage.searchFilter.clearAll()
      playlistlibraryPage.searchFilter.sharedWithMe()

      playlistlibraryPage.searchFilter.typeInSearchBox(playListId)
      playlistlibraryPage.clickOnPlayListCardById(playListId)
      playlistlibraryPage.header.clickOnUseThis()

      playlistlibraryPage.reviewTab.verifyModuleProgress(1, 1)
      playlistlibraryPage.reviewTab.clickShowAssignmentByTestByModule(1, 1)
      playlistlibraryPage.reviewTab.verifyAssignmentRowByTestByMod(1, 1, {
        ...commonData,
        ...rowData,
      })
    })
  })
})
