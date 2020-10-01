import PlayListLibrary from '../../../../framework/author/playlist/playListLibrary'
import FileHelper from '../../../../framework/util/fileHelper'
import TestLibrary from '../../../../framework/author/tests/testLibraryPage'
import StudentTestPage from '../../../../framework/student/studentTestPage'
import AuthorAssignmentPage from '../../../../framework/author/assignments/AuthorAssignmentPage'
import PlayListAssign from '../../../../framework/author/playlist/playListAssignPage'
import CypressHelper from '../../../../framework/util/cypressHelpers'
import {
  grades,
  subject,
} from '../../../../framework/constants/assignmentStatus'
import AssignmentsPage from '../../../../framework/student/assignmentsPage'

describe(`${FileHelper.getSpecName(
  Cypress.spec.name
)}>> play list basics`, () => {
  const playlistlibraryPage = new PlayListLibrary()
  const testlibraryPage = new TestLibrary()
  const studentTestPage = new StudentTestPage()
  const authorAssignmentPage = new AuthorAssignmentPage()
  const playlistAssignPage = new PlayListAssign()
  const assignmentsPage = new AssignmentsPage()

  let playlistId_1
  let playlistId_2

  let tests = []

  const standard = 'K.CC.A.1'
  const testIds = []
  const playListData = {
    name: 'playlist',
    grade: grades.GRADE_10,
    subject: subject.MATH,
  }
  const student = {
    email: 'student.playlistbasic@snapwiz.com',
    pass: 'snapwiz',
  }
  const teacher_1 = {
    email: 'teacher.playlistbasic@snapwiz.com',
    pass: 'snapwiz',
  }
  const teacher_2 = {
    email: 'teacher.playlistbasic1@snapwiz.com',
    pass: 'snapwiz',
  }

  before('create test', () => {
    /* before(){
      create 4 tests and save ids
    } */
    cy.login('teacher', teacher_1.email, teacher_1.pass)
    testlibraryPage.createTest().then((id) => {
      testIds.push(id)
      for (let k = 0; k < 3; k++) {
        testlibraryPage.sidebar.clickOnTestLibrary()
        testlibraryPage.searchFilters.clearAll()
        testlibraryPage.clickOnTestCardById(testIds[0])
        testlibraryPage.clickOnDuplicate()
        testlibraryPage.header.clickOnPublishButton().then((newId) => {
          testIds.push(newId)
        })
      }
    })
  })

  context('> authoring', () => {
    it("> author playlist-'summary tab'", () => {
      /*  1. enter name, subject,grade from summary tab */
      tests = testIds.slice(0, 2)
      playlistlibraryPage.sidebar.clickOnPlayListLibrary()
      playlistlibraryPage.clickOnNewPlayList()
      playlistlibraryPage.playListSummary.setName(playListData.name)
      playlistlibraryPage.playListSummary.selectGrade(playListData.grade, true)
      playlistlibraryPage.playListSummary.selectSubject(
        playListData.subject,
        true
      )
    })

    it("> author playlist-'create modules in manage content'", () => {
      /*  2. create modules from manage content tab(playlist will be created) */
      playlistlibraryPage.header.clickOnReview(true)
      for (let i = 1; i <= tests.length; i++) {
        playlistlibraryPage.reviewTab.clickAddNewModule()
        playlistlibraryPage.reviewTab.setModuleDetails(
          `module-${i}`,
          `m${i}`,
          `module-title-${i}`,
          `module description for module-${i}`
        )
        // eslint-disable-next-line no-loop-func
        playlistlibraryPage.reviewTab.addModule(i === 1).then((id) => {
          if (i === 1) playlistId_1 = id
        })
        CypressHelper.verifyAntMesssage('Module Added to playlist')
        if (i === 1) CypressHelper.verifyAntMesssage('Playlist created')
      }
    })

    it("> verify search container -'view test' and 'standards'", () => {
      /*  3. search above test in search container - verify 'test preview' and 'standards on the test row in search results' */
      playlistlibraryPage.reviewTab.searchContainer.setFilters({
        subject: subject.MATH,
        authoredByme: true,
      })
      tests.forEach((id) => {
        playlistlibraryPage.reviewTab.searchContainer.verifyStandardsByTestInSearch(
          id,
          standard
        )
        playlistlibraryPage.reviewTab.searchContainer
          .clickOnViewTestById(id)
          .then((test) => {
            expect(id).to.eq(test)
          })
        studentTestPage.getNext()
        studentTestPage.clickOnExitTest(true)
      })
    })

    it("> author playlist-'add tests'", () => {
      /*  4. drag and drop test from search to modules created in #2 */
      tests.forEach((id, index) => {
        playlistlibraryPage.reviewTab.dragTestFromSearchToModule(index + 1, id)
      })
    })

    it("> verify review- 'module name,id and test count'", () => {
      /*  5. verify module id, name and title */
      tests.forEach((id, index) => {
        playlistlibraryPage.reviewTab.clickExpandByModule(index + 1)
        playlistlibraryPage.reviewTab.verifyModuleDetailsByModule(
          index + 1,
          `module-${index + 1}`,
          `m${index + 1}`,
          `module description for module-${index + 1}`
        )
        playlistlibraryPage.reviewTab.verifyNoOfTestByModule(index + 1, 1)
        playlistlibraryPage.reviewTab.clickCollapseByModule(index + 1)
      })
    })

    it("> verify grade and subject-'manage content tab'", () => {
      /*  7. Verify playlist's grade and subjects in 'manage content header part' */
      playlistlibraryPage.reviewTab.verifyPlalistGrade(playListData.grade)
      playlistlibraryPage.reviewTab.verifyPlalistSubject(playListData.subject)
    })

    it(">verify review- 'view test in test row'", () => {
      /* 6. verify test preview and  */
      tests.forEach((id, index) => {
        playlistlibraryPage.reviewTab.clickExpandByModule(index + 1)
        playlistlibraryPage.reviewTab
          .clickOnViewTestByTestByModule(index + 1, 1)
          .then((test) => {
            expect(id).to.eq(test)
          })
        studentTestPage.getNext()
        studentTestPage.clickOnExitTest(true)
        playlistlibraryPage.reviewTab.clickExpandByModule(index + 1)
      })
    })

    it(">verify review- 'standards in test row'", () => {
      /* 8. standard tags on test cards inside modules */
      tests.forEach((id, index) => {
        playlistlibraryPage.reviewTab.verifyStandardsByTestByModule(
          index + 1,
          1,
          standard
        )
      })
    })

    it('> shuffle tests between modules', () => {
      /* 9. drag and drop tests between modules- drop test will be at last in target module */
      playlistlibraryPage.reviewTab.moveTestBetweenModule(1, 1, 2, testIds[0])
      playlistlibraryPage.reviewTab.verifyNoOfTestByModule(1, 0)

      playlistlibraryPage.reviewTab.moveTestBetweenModule(2, 1, 1, testIds[1])
      playlistlibraryPage.reviewTab.verifyNoOfTestByModule(2, 1)
    })

    it('> expand and collapse search container tab', () => {
      /* 10. expand and collapse search container */
      playlistlibraryPage.reviewTab.searchContainer.closeCustomizationTab()
      playlistlibraryPage.reviewTab.clickOpenCustomizationTab()
    })

    it("> manage modules-'delete a test'", () => {
      /* 11. delete a test inside a module and verify action by test count in that module */
      // delete test by module
      playlistlibraryPage.reviewTab.clickExpandByModule(1)
      playlistlibraryPage.reviewTab.clickOnDeleteByTestByModule(1, 1)
      CypressHelper.verifyAntMesssage('Test removed from playlist')
      tests.pop()
      // verify
      playlistlibraryPage.reviewTab.verifyNoOfTestByModule(1, 0)
      playlistlibraryPage.reviewTab.clickCollapseByModule(1)
    })

    it("> manage modules-'rename module'", () => {
      /* 13. rename module and verify new name of module */
      // edit module name
      playlistlibraryPage.reviewTab.clickManageModuleByModule(1)
      playlistlibraryPage.reviewTab.clickEditModule()
      playlistlibraryPage.reviewTab.setModuleName(`module name edited`)
      playlistlibraryPage.reviewTab.clickUpdateModule()
      CypressHelper.verifyAntMesssage('Module updated successfully')
      // verify
      playlistlibraryPage.reviewTab
        .getModuleNameByModule(1)
        .should('contain', 'module name edited')
    })

    it('> adding already used test', () => {
      /* 14. try to add already added test- will show error msg below, test will not be added */
      playlistlibraryPage.reviewTab.dragTestFromSearchToModule(1, tests[0])
      playlistlibraryPage.reviewTab.verifyNoOfTestByModule(1, 1)

      playlistlibraryPage.reviewTab.dragTestFromSearchToModule(1, tests[0])
      CypressHelper.verifyAntMesssage(
        'Dropped Test already exists in this module'
      )

      playlistlibraryPage.reviewTab.dragTestFromSearchToModule(2, tests[0])
      playlistlibraryPage.reviewTab.verifyNoOfTestByModule(2, 1)
    })

    it("> manage modules-'delete module'", () => {
      /* 15. delete a module using manage module dropdown and verify deleted module by modules count */
      // delete module
      playlistlibraryPage.reviewTab.clickManageModuleByModule(2)
      playlistlibraryPage.reviewTab.clickDeleteModule()
      CypressHelper.verifyAntMesssage('Module Removed from playlist')
      // verify
      playlistlibraryPage.reviewTab
        .getModuleNameByModule(1)
        .should('contain', 'module name edited')
      playlistlibraryPage.reviewTab.getModuleRowByModule(2).should('not.exist')
    })

    it('> delete unused playlist', () => {
      playlistlibraryPage.seachAndClickPlayListById(playlistId_1, true)
      playlistlibraryPage.header.clickDeletePlaylist(playlistId_1)
      playlistlibraryPage.searchFilter.clearAll()
      playlistlibraryPage.searchFilter.typeInSearchBox(playlistId_1)
      cy.contains('Playlists not available')
    })
  })

  context('> using existing playlist template', () => {
    /* before(){
      create a playlist using above tests
      go to playlist library and search playlist and click on edit
    } */
    before('> create a playlist', () => {
      const moduledata = {
        module1: [testIds[0]],
        module2: [testIds[1]],
      }
      cy.deleteAllAssignments('', teacher_1.email)
      cy.login('teacher', teacher_1.email, teacher_1.pass)

      playlistlibraryPage
        .createPlayListWithTests({ metadata: playListData, moduledata })
        .then((id) => {
          playlistId_2 = id
          playlistlibraryPage.seachAndClickPlayListById(playlistId_2)
          playlistlibraryPage.header.clickOnEdit()
        })
    })

    it('> edit name, grades, and subjects', () => {
      /* 1. set new name, subject, grade  */
      playlistlibraryPage.header.clickOnDescription()
      playlistlibraryPage.playListSummary.setName('new name')
      playlistlibraryPage.playListSummary.selectGrade(grades.GRADE_4, true)
      playlistlibraryPage.playListSummary.selectSubject(
        subject.SOCIAL_STUDIES,
        true
      )
    })

    it('> verify edited name,grades and subjects', () => {
      /* 2. verify new name,grade, subjects in manage content tab header */
      playlistlibraryPage.header.clickOnReview()
      playlistlibraryPage.reviewTab.verifyPlalistGrade(grades.GRADE_4)
      playlistlibraryPage.reviewTab.verifyPlalistSubject(subject.SOCIAL_STUDIES)
      playlistlibraryPage.reviewTab.verifyPlaylistTitle('new name')
    })

    it('> add / remove tests', () => {
      /* 3. add one test into module 1 and delete a test from same and verify the action by test ids/count */
      playlistlibraryPage.reviewTab.clickOpenCustomizationTab()
      playlistlibraryPage.reviewTab.searchContainer.setFilters({
        subject: subject.MATH,
        authoredByme: true,
      })
      playlistlibraryPage.reviewTab.dragTestFromSearchToModule(1, testIds[2])
      playlistlibraryPage.reviewTab.clickOnDeleteByTestByModule(1, 1)
    })

    it('> remove modules', () => {
      /* 4. delete a module and verify notification and action by module rows count */
      playlistlibraryPage.reviewTab.clickManageModuleByModule(2)
      playlistlibraryPage.reviewTab.clickDeleteModule()
      CypressHelper.verifyAntMesssage('Module Removed from playlist')
      // verify
      playlistlibraryPage.reviewTab
        .getModuleNameByModule(1)
        .should('contain', 'module-1')
      playlistlibraryPage.reviewTab.getModuleRowByModule(2).should('not.exist')
    })

    it('> add modules', () => {
      /* 5. Add a new module(module no:2) and add test to it */
      playlistlibraryPage.reviewTab.clickAddNewModule()
      playlistlibraryPage.reviewTab.setModuleDetails(
        'module3',
        'mod3',
        'module-3',
        'module-description-3'
      )
      playlistlibraryPage.reviewTab.addModule()
      playlistlibraryPage.reviewTab.dragTestFromSearchToModule(2, testIds[3])
    })

    it('> publish and use playlist, verify new module details', () => {
      /* 6. publish playlist and click on use this */
      playlistlibraryPage.header.clickOnPublish()
      playlistlibraryPage.header.clickOnUseThis()
      playlistlibraryPage.reviewTab.clickExpandByModule(2)
      playlistlibraryPage.reviewTab.verifyModuleDetailsByModule(
        2,
        'module3',
        'mod3',
        'module-description-3'
      )
    })

    it('> assign the existing module', () => {
      /* 7. assign old module(edited) */
      playlistlibraryPage.reviewTab.clickOnAssignButtonByModule(1)
      playlistAssignPage.selectClass('Class')
      playlistAssignPage.clickOnAssign()
    })

    it('> verify assignments page for existing module assigned', () => {
      /* 8. verify assignments wrt test present in module no:1 */
      playlistlibraryPage.sidebar.clickOnAssignment()
      authorAssignmentPage.getAssignmentRowsTestById(testIds[2])
    })

    it('> assign the new module', () => {
      /* 9. assign new module created */
      playlistlibraryPage.sidebar.clickOnRecentUsedPlayList()
      playlistlibraryPage.reviewTab.clickOnAssignButtonByModule(2)
      playlistAssignPage.selectClass('Class')
      playlistAssignPage.clickOnAssign()
    })

    it('> verify assignments page for new module assigned', () => {
      /* 10. verify assignments wrt test present in module no:2 */
      playlistlibraryPage.sidebar.clickOnAssignment()
      authorAssignmentPage.getAssignmentRowsTestById(testIds[3])
    })

    it('> verify student side', () => {
      /* 11. verify student side  */
      cy.login('student', student.email)
      ;[testIds[2], testIds[3]].forEach((id) => {
        assignmentsPage.getAssignmentByTestId(id).should('exist')
      })
    })

    it("> 'clone' in playlist library", () => {
      /* 13. click on clone button in playlist library */
      cy.login('teacher', teacher_1.email, teacher_1.pass)
      playlistlibraryPage.searchPlaylistById(playlistId_2)
      playlistlibraryPage
        .clickOnCloneOnCardByPlaylistId(playlistId_2)
        .then((id) => {
          expect(
            id,
            `playlist clone ${id === playlistId_2 ? 'failed' : 'success'}`
          ).not.eq(playlistId_2)
          cy.url().should('not.contain', playlistId_2).should('contain', id)
        })
      playlistlibraryPage.playListSummary.setName('name')
    })

    it('> verify review tab', () => {
      /* 14. verify manage content tab with test ids of original playlist */
      playlistlibraryPage.header.clickOnReview()
      testIds.slice(2).forEach((test, i) => {
        playlistlibraryPage.reviewTab.clickExpandByModule(i + 1)
        playlistlibraryPage.reviewTab
          .getTestByTestByModule(i + 1, 1)
          .then(($ele, i) => {
            cy.wrap($ele).should('have.attr', 'data-test', test)
          })
      })
    })

    it("> 'clone' in review tab", () => {
      /* 15. click on clone button in manage content tab */
      playlistlibraryPage.seachAndClickPlayListById(playlistId_2)
      playlistlibraryPage.header.clickOnClone().then((id) => {
        expect(
          id,
          `playlist clone ${id === playlistId_2 ? 'failed' : 'success'}`
        ).not.eq(playlistId_2)
        cy.url().should('not.contain', playlistId_2).should('contain', id)
      })
      playlistlibraryPage.playListSummary.setName('name')
    })

    it('> verify review tab after playlist clone', () => {
      /* 16. verify manage content tab with test ids of original playlist */
      playlistlibraryPage.header.clickOnReview()
      testIds.slice(2).forEach((test, i) => {
        playlistlibraryPage.reviewTab.clickExpandByModule(i + 1)
        playlistlibraryPage.reviewTab
          .getTestByTestByModule(i + 1, 1)
          .then(($ele, i) => {
            cy.wrap($ele).should('have.attr', 'data-test', test)
          })
      })
    })

    it("> 'clone' in customization tab", () => {
      /* 17. click on clone button in customization tab */
      playlistlibraryPage.getPlayListAndClickOnUseThisById(playlistId_2)
      playlistlibraryPage.header.clickOnClone().then((id) => {
        expect(
          id,
          `playlist clone ${id === playlistId_2 ? 'failed' : 'success'}`
        ).not.eq(playlistId_2)
        cy.url().should('not.contain', playlistId_2).should('contain', id)
      })
      playlistlibraryPage.playListSummary.setName('name')
    })

    it('> verify review tab after playlist clone from customization tab', () => {
      /* 18. verify manage content tab with test ids of original playlist */
      playlistlibraryPage.header.clickOnReview()
      testIds.slice(2).forEach((test, i) => {
        playlistlibraryPage.reviewTab.clickExpandByModule(i + 1)
        playlistlibraryPage.reviewTab
          .getTestByTestByModule(i + 1, 1)
          .then(($ele, i) => {
            cy.wrap($ele).should('have.attr', 'data-test', test)
          })
      })
    })
  })
  context('> deleting used playlist', () => {
    /* before{
      search and get playlist created in previous context and share ith teacher-2
    } */
    before('> share the playlist with other teacher', () => {
      cy.deleteAllAssignments('', teacher_1.email)
      playlistlibraryPage.seachAndClickPlayListById(playlistId_2)
      playlistlibraryPage.header.clickOnUseThis()
      playlistlibraryPage.header.clickOnShare()
      testlibraryPage.selectPeopletoshare(teacher_2.email, false, false)
    })

    it('> login as teacher-2 and use shared playlist', () => {
      /* 1. login as teacher-2  and use playlist, verify absence os customization button */
      cy.login('teacher', teacher_2.email, teacher_2.pass)
      cy.visit(`/author/playlists/${playlistId_2}#review`)
      cy.wait(5000)
      playlistlibraryPage.header.clickOnUseThis()
      playlistlibraryPage.reviewTab.getModuleNameByModule(1)
      playlistlibraryPage.reviewTab.getCustomizationButton().should('not.exist')
    })

    it('> login as teacher-1 and delete used test', () => {
      /* 2. login as teacher-1 (author) and delete used test */
      cy.login('teacher', teacher_1.email, teacher_1.pass)
      playlistlibraryPage.seachAndClickPlayListById(playlistId_2)
      playlistlibraryPage.header.clickDeletePlaylist()
    })

    it("> verify playlist library tab 'playlist should not be present'", () => {
      /* 3. verify in library by id, playlist should not be available */
      playlistlibraryPage.searchFilter.clearAll()
      playlistlibraryPage.searchFilter.typeInSearchBox(playlistId_2)
      cy.contains('Playlists not available')
    })

    it("> verify recent playlist tab 'playlist should be present'", () => {
      /* 4. click on recent playlist deleted playlist should be there as current fav playlist */
      playlistlibraryPage.sidebar.clickOnRecentUsedPlayList()
      playlistlibraryPage.playlistCustom.clickExpandByModule(1)
      cy.url().should('contain', `${playlistId_2}/use-this`)
    })

    it('> verify by assigning one test in deleted playlist', () => {
      /* 5. verify assign action by assigning one test in deleted playlist */
      playlistlibraryPage.playlistCustom.clickOnAssignByTestByModule(1, 1)
      playlistlibraryPage.playListAssign.selectClass('Class')
      playlistlibraryPage.playListAssign.clickOnAssign()
    })

    it("> verify recent playlist tab for teacher-2 'playlist should be present'", () => {
      /* 6. verify teacher-2 side recent playlist tab, playlist should be there */
      cy.login('teacher', teacher_2.email, teacher_2.pass)
      playlistlibraryPage.sidebar.clickOnRecentUsedPlayList()
      playlistlibraryPage.playlistCustom.clickExpandByModule(1)
      cy.url().should('contain', `${playlistId_2}/use-this`)
    })

    it('> verify by assigning one test', () => {
      /* 7. verify assign action by assigning one test */
      playlistlibraryPage.playlistCustom.clickOnAssignByTestByModule(1, 1)
      playlistlibraryPage.playListAssign.selectClass('Class')
      playlistlibraryPage.playListAssign.clickOnAssign()
    })
  })
})
