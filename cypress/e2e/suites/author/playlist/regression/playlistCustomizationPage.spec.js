import PlayListLibrary from '../../../../framework/author/playlist/playListLibrary'
import FileHelper from '../../../../framework/util/fileHelper'
import TestLibrary from '../../../../framework/author/tests/testLibraryPage'
import StudentTestPage from '../../../../framework/student/studentTestPage'
import AuthorAssignmentPage from '../../../../framework/author/assignments/AuthorAssignmentPage'
import PlayListAssign from '../../../../framework/author/playlist/playListAssignPage'
import {
  grades,
  subject,
} from '../../../../framework/constants/assignmentStatus'
import AssignmentsPage from '../../../../framework/student/assignmentsPage'
import Helpers from '../../../../framework/util/Helpers'
import { COLLECTION } from '../../../../framework/constants/questionTypes'

describe(`${FileHelper.getSpecName(
  Cypress.spec.name
)}> Playlist customization`, () => {
  const playlistlibraryPage = new PlayListLibrary()
  const testlibraryPage = new TestLibrary()
  const studentTestPage = new StudentTestPage()
  const authorAssignmentPage = new AuthorAssignmentPage()
  const playlistAssignPage = new PlayListAssign()
  const assignmentsPage = new AssignmentsPage()

  // const testToCreate = ["search_1", "search_2"];
  const testName = 'test search 1 '
  const testId = {
    testId1: '5e70b870c513dc0008b25fde',
    testId2: '5e70b89ac513dc0008b25fe0',
    testId3: '5e832816702a3600074b2edc',
    testId4: '5e7c920bc76d000007405675',
    testId5: '5e831ac97c24fd0007a20255',
    testId6: '5e832912591abd0008e5d9c7',
    testId7: '5e832d59252e620008b24039',
    testId8: '5e8478a6fd94480008873f85',
  }
  const collection = {
    col1: COLLECTION.school,
    col2: COLLECTION.district,
    col3: COLLECTION.public,
    col4: COLLECTION.private,
  }
  const testStandard = {
    standard1: '8.G.C.9',
    standard2: '7.EE.A.1',
  }
  const testTag = {
    tag1: 'test tag 1 ',
    tag2: 'wrong tag',
  }
  const resources = ['Website URL', 'Youtube']
  const urls = ['www.someweb.com', 'www.youtube.com']

  const newResourceId = []
  const oldresourceId = ['5f48d548275b4d0008fef456', '5f48d59fb44c55000801cea1']
  const randomString = Helpers.getRamdomString(
    5,
    Helpers.stringTypes().ALPHA_NUM
  )
  const testIds = []
  const playListData = {
    name: 'playlist',
    grade: grades.GRADE_10,
    subject: subject.MATH,
  }
  const student = {
    email: 'student.playlistcustom@snapwiz.com',
    pass: 'snapwiz',
  }
  const teacher = {
    email: 'teacher.playlistcustom@snapwiz.com',
    pass: 'snapwiz',
  }

  let itemid
  let playlistId_2
  let playlistId_1

  /*   before(">create test", () => {
          cy.login("teacher", teacher1.email, teacher1.pass);
          testToCreate.forEach((test, i) => {
              testLibrary.createTest(test).then(id => {
                  originalTestIds[i] = id;
                  cy.contains("Share With Others");
              });
          });
      }); */
  context('>Content managment toggle button', () => {
    /*   before(">Create new playlist", () => {
              cy.deleteAllAssignments("", teacher1.email);
              playListLibrary.createPlayList(playListData).then(id => {
                  playListId = id;
              })
  
          });
  
          before(">Add Test to module", () => {
              playListLibrary.searchFilter.clearAll();
              playListLibrary.searchFilter.getAuthoredByMe();
              originalTestIds.forEach(id => {
                  playListLibrary.addTestTab.addTestByIdByModule(id, 1);
              });
              playListLibrary.header.clickOnReview();
              playListLibrary.header.clickOnPublish();
              playListLibrary.header.clickOnUseThis();
          }); */

    before('Log in as tecaher', () => {
      cy.login('teacher', 'playschooltecaher@snapwiz.com', 'snapwiz')
      testlibraryPage.sidebar.clickOnRecentUsedPlayList('Test Search Playlist')
    })
    it('ManageContent toggle', () => {
      cy.contains('Summary').should('be.visible')
      playlistlibraryPage.playlistCustom.clickOnManageContent()
      playlistlibraryPage.playlistCustom.searchContainer.getKeywordsSearchBar()
      playlistlibraryPage.playlistCustom.searchContainer.closeCustomizationTab()
      cy.contains('Summary').should('be.visible')
    })
  })

  context('Search from search bar', () => {
    before('Go to Resource Container', () => {
      playlistlibraryPage.playlistCustom.clickOnManageContent()
      playlistlibraryPage.playlistCustom.searchContainer.setFilters({
        authoredByme: true,
      })
    })
    it('search By Name', () => {
      playlistlibraryPage.playlistCustom.searchContainer.typeInSearchBar(
        `${testName}`
      )
      playlistlibraryPage.playlistCustom.searchContainer
        .getTestInSearchResultsById(testId.testId1)
        .should('contain', `${testName}`)
    })
    it('Search by Id', () => {
      playlistlibraryPage.playlistCustom.searchContainer.typeInSearchBar(
        `${testId.testId2}`
      )
      playlistlibraryPage.playlistCustom.searchContainer.verifySearchResultVisible(
        `${testId.testId2}`
      )
    })
    it('Search By standard', () => {
      playlistlibraryPage.playlistCustom.searchContainer.typeInSearchBar(
        `${testStandard.standard1}`
      )
      playlistlibraryPage.playlistCustom.searchContainer.verifySearchResultVisible(
        `${testId.testId1}`
      )
      playlistlibraryPage.playlistCustom.searchContainer.verifySearchResultVisible(
        `${testId.testId2}`
      )

      playlistlibraryPage.playlistCustom.searchContainer.typeInSearchBar(
        `${testStandard.standard2}`,
        false
      )
      playlistlibraryPage.playlistCustom.searchContainer
        .getSearchContainer()
        .should('contain', 'test search 2 ')
    })
    it('Search by Tag', () => {
      playlistlibraryPage.playlistCustom.searchContainer.typeInSearchBar(
        `${testTag.tag1}`
      )
      playlistlibraryPage.playlistCustom.searchContainer.verifySearchResultVisible(
        `${testId.testId1}`
      )

      playlistlibraryPage.playlistCustom.searchContainer.typeInSearchBar(
        `${testTag.tag2}`
      )
      playlistlibraryPage.playlistCustom.searchContainer
        .getSearchContainer()
        .should('contain', 'No Data')
    })
  })

  context('search from Authored by me folder', () => {
    it('Verifiy grade,subject and status filter', () => {
      playlistlibraryPage.playlistCustom.searchContainer.setFilters({
        authoredByme: true,
      })
      playlistlibraryPage.playlistCustom.searchContainer.verifySearchResultVisible(
        `${testId.testId1}`
      )

      playlistlibraryPage.playlistCustom.searchContainer.setFilters({
        grade: grades.GRADE_4,
      })
      playlistlibraryPage.playlistCustom.searchContainer.verifySearchResultVisible(
        `${testId.testId1}`
      )
      playlistlibraryPage.playlistCustom.searchContainer.VerififySearchResultNotVisible(
        `${testId.testId8}`
      )

      playlistlibraryPage.playlistCustom.searchContainer.setFilters({
        status: 'Draft',
      })
      playlistlibraryPage.playlistCustom.searchContainer.VerififySearchResultNotVisible(
        `${testId.testId8}`
      )
      playlistlibraryPage.playlistCustom.searchContainer.verifySearchResultVisible(
        `${testId.testId4}`
      )

      playlistlibraryPage.playlistCustom.searchContainer.setFilters({
        status: 'Published',
        subject: subject.MATH,
      })
      playlistlibraryPage.playlistCustom.searchContainer.verifySearchResultVisible(
        `${testId.testId2}`
      )
      playlistlibraryPage.playlistCustom.searchContainer.VerififySearchResultNotVisible(
        `${testId.testId8}`
      )
    })
    it('Verify collection dropdwon', () => {
      playlistlibraryPage.playlistCustom.searchContainer.setFilters({
        collection: collection.col1,
      })
      playlistlibraryPage.playlistCustom.searchContainer.verifySearchResultVisible(
        `${testId.testId1}`
      )
      playlistlibraryPage.playlistCustom.searchContainer.VerififySearchResultNotVisible(
        `${testId.testId2}`
      )

      playlistlibraryPage.playlistCustom.searchContainer.setFilters({
        collection: collection.col2,
      })
      playlistlibraryPage.playlistCustom.searchContainer.verifySearchResultVisible(
        `${testId.testId2}`
      )
      playlistlibraryPage.playlistCustom.searchContainer.VerififySearchResultNotVisible(
        `${testId.testId3}`
      )

      playlistlibraryPage.playlistCustom.searchContainer.setFilters({
        collection: collection.col3,
      })
      playlistlibraryPage.playlistCustom.searchContainer.verifySearchResultVisible(
        `${testId.testId3}`
      )
      playlistlibraryPage.playlistCustom.searchContainer.VerififySearchResultNotVisible(
        `${testId.testId2}`
      )

      playlistlibraryPage.playlistCustom.searchContainer.setFilters({
        collection: collection.col4,
      })
      playlistlibraryPage.playlistCustom.searchContainer.verifySearchResultVisible(
        `${testId.testId3}`
      )
      playlistlibraryPage.playlistCustom.searchContainer.VerififySearchResultNotVisible(
        `${testId.testId6}`
      )
    })
  })

  context('search from Entire Library folder', () => {
    it('Verify collection dropdwon', () => {
      playlistlibraryPage.playlistCustom.searchContainer.setFilters({
        collection: collection.col1,
      })
      playlistlibraryPage.playlistCustom.searchContainer.verifySearchResultVisible(
        `${testId.testId1}`
      )
      playlistlibraryPage.playlistCustom.searchContainer.VerififySearchResultNotVisible(
        `${testId.testId2}`
      )

      playlistlibraryPage.playlistCustom.searchContainer.setFilters({
        collection: collection.col2,
      })
      playlistlibraryPage.playlistCustom.searchContainer.verifySearchResultVisible(
        `${testId.testId2}`
      )
      playlistlibraryPage.playlistCustom.searchContainer.VerififySearchResultNotVisible(
        `${testId.testId3}`
      )

      playlistlibraryPage.playlistCustom.searchContainer.setFilters({
        collection: collection.col3,
      })
      playlistlibraryPage.playlistCustom.searchContainer.verifySearchResultVisible(
        `${testId.testId3}`
      )
      playlistlibraryPage.playlistCustom.searchContainer.VerififySearchResultNotVisible(
        `${testId.testId2}`
      )

      playlistlibraryPage.playlistCustom.searchContainer.setFilters({
        collection: collection.col4,
      })
      playlistlibraryPage.playlistCustom.searchContainer.verifySearchResultVisible(
        `${testId.testId3}`
      )
      playlistlibraryPage.playlistCustom.searchContainer.VerififySearchResultNotVisible(
        `${testId.testId6}`
      )
    })
    it('Verify grade, subject', () => {
      playlistlibraryPage.playlistCustom.searchContainer.setFilters({
        entireLibrary: true,
        status: 'All',
      })
      playlistlibraryPage.playlistCustom.searchContainer.verifySearchResultVisible(
        `${testId.testId3}`
      )
      playlistlibraryPage.playlistCustom.searchContainer.VerififySearchResultNotVisible(
        `${testId.testId4}`
      )

      playlistlibraryPage.playlistCustom.searchContainer.setFilters({
        grade: grades.GRADE_8,
      })
      playlistlibraryPage.playlistCustom.searchContainer.verifySearchResultVisible(
        `${testId.testId3}`
      )
      playlistlibraryPage.playlistCustom.searchContainer.VerififySearchResultNotVisible(
        `${testId.testId8}`
      )
      playlistlibraryPage.playlistCustom.searchContainer.setFilters({
        subject: subject.MATH,
      })

      playlistlibraryPage.playlistCustom.searchContainer.verifySearchResultVisible(
        `${testId.testId5}`
      )
      playlistlibraryPage.playlistCustom.searchContainer.VerififySearchResultNotVisible(
        `${testId.testId8}`
      )
    })
  })

  context('search from Shared with me folder', () => {
    it('Shared with Me', () => {
      playlistlibraryPage.playlistCustom.clickOnManageContent()

      playlistlibraryPage.playlistCustom.searchContainer.setFilters({
        SharedWithMe: true,
        grade: grades.GRADE_8,
      })
      playlistlibraryPage.playlistCustom.searchContainer.verifySearchResultVisible(
        `${testId.testId6}`
      )

      playlistlibraryPage.playlistCustom.searchContainer.setFilters({
        SharedWithMe: true,
        subject: subject.ELA,
      })
      playlistlibraryPage.playlistCustom.searchContainer.verifySearchResultVisible(
        `${testId.testId7}`
      )
    })
  })

  context('add / search resources', () => {
    /* before{
      deleting sub resources(if any are present);
    } 
    test{
      1. create new resource(YouTube and Web site link)
      2. Search new resources using titles
      3. Search old resources using titles
      4. Add new/old resources as sub resources to the tests in modules
      5. save and navigate and verify
    }
     */
    before('> delete sub resources', () => {
      playlistlibraryPage.playlistCustom.clickExpandByModule(1)
      playlistlibraryPage.playlistCustom.deleteAllSubResourceRows(1)
      playlistlibraryPage.playlistCustom
        .getAllSubResourceRowsByMod(1)
        .should('not.have.descendants')

      playlistlibraryPage.playlistCustom.clickExpandByModule(2)
      playlistlibraryPage.playlistCustom.deleteAllSubResourceRows(2)
      playlistlibraryPage.playlistCustom
        .getAllSubResourceRowsByMod(2)
        .should('not.have.descendants')
    })
    beforeEach('> click on resource tab', () => {
      playlistlibraryPage.playlistCustom.clickOnManageContent()
      playlistlibraryPage.playlistCustom.searchContainer.clickOnResourceTab()
    })
    resources.forEach((resource, i) => {
      it(`> add resource '${resource}'`, () => {
        const details = {
          title: `${resource}-${randomString.slice(0, 3)}`,
          desc: resource,
          url: `${urls[i]}/${randomString}`,
        }
        playlistlibraryPage.playlistCustom.searchContainer.clickAddResourceButton()
        playlistlibraryPage.playlistCustom.searchContainer.clickOptionInDropDownByText(
          resource
        )
        playlistlibraryPage.playlistCustom.searchContainer.setInformationInAddResourcePopUp(
          details
        )
        playlistlibraryPage.playlistCustom.searchContainer
          .clickAddResourceInPopUp()
          .then((id) => {
            newResourceId.push(id)
          })
      })
    })
    it('> search new resource', () => {
      resources.forEach((resource, i) => {
        playlistlibraryPage.playlistCustom.searchContainer.typeInSearchBar(
          `${resource}-${randomString.slice(0, 3)}`
        )
        playlistlibraryPage.playlistCustom.searchContainer
          .getTestInSearchResultsById(newResourceId[i])
          .should('be.visible')
      })
    })
    it('> search existing resource', () => {
      resources.forEach((resource, i) => {
        playlistlibraryPage.playlistCustom.searchContainer.typeInSearchBar(
          `${resource}-existing`
        )
        playlistlibraryPage.playlistCustom.searchContainer
          .getTestInSearchResultsById(newResourceId[i])
          .should('be.visible')
      })
    })

    it('> add resources to test as sub-resource', () => {
      ;[oldresourceId[0], newResourceId[1]].forEach((resource, i) => {
        playlistlibraryPage.playlistCustom.searchContainer.typeInSearchBar(
          resource
        )
        playlistlibraryPage.playlistCustom.dragResourceFromSearchToModule(
          i + 1,
          1,
          resource
        )
      })
      playlistlibraryPage.header.clickOnSave()
    })

    it('> verify resources after navigations', () => {
      testlibraryPage.sidebar.clickOnItemBank()
      testlibraryPage.sidebar.clickOnRecentUsedPlayList()
      ;[oldresourceId[0], newResourceId[1]].forEach((resource, i) => {
        playlistlibraryPage.playlistCustom.clickExpandByModule(i + 1)
        playlistlibraryPage.playlistCustom.getSubResourceByTestByMod(
          i + 1,
          1,
          resource
        )
      })
    })
  })

  context("> customization page-'own playlist'", () => {
    before('> create test', () => {
      /* before(){
        create 4 tests and save ids
      } */
      cy.login('teacher', teacher.email, teacher.pass)
      testlibraryPage.createTest().then((id) => {
        ;[itemid] = testlibraryPage.items
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
    before('> create a playlist', () => {
      /* before{
        create 2 playlists using above tests
      } */

      const moduledata = {
        module1: testIds.slice(0, 2),
      }
      cy.deleteAllAssignments('', teacher.email)
      playlistlibraryPage
        .createPlayListWithTests({ metadata: playListData, moduledata })
        .then((id) => {
          playlistId_1 = id
          playlistlibraryPage.header.clickOnUseThis()
          playlistlibraryPage.searchPlaylistById(playlistId_1)
          playlistlibraryPage
            .clickOnCloneOnCardByPlaylistId(playlistId_1)
            .then((id) => {
              playlistId_2 = id
              playlistlibraryPage.header.clickOnPublish()
            })
        })
    })

    it('> get playlist and click on use this', () => {
      /* 1. get playlist and click on use this */
      playlistlibraryPage.seachAndClickPlayListById(playlistId_2)
      playlistlibraryPage.header.clickOnUseThis()
      cy.url().should('contain', playlistId_2)
    })

    it('> switch playlist', () => {
      /* 2. switch to playlist created in previous context and verify id in url */
      playlistlibraryPage.reviewTab.clickOpenDroppedPlaylist()
      playlistlibraryPage.reviewTab.clickOnViewPlaylistById(playlistId_1)
      cy.url().should('contain', `${playlistId_1}/use-this`)
    })

    it('> remove from favourites', () => {
      /* 3. remove playlist created in previous context from fav using dropdown in header and verify in switch tab and current url
      it should navigate to prev used playlist(created in this context) */
      playlistlibraryPage.header.clickRemoveFromFavorite()
      cy.url().should('not.contain', `${playlistId_1}/use-this`)
      playlistlibraryPage.reviewTab.clickOpenDroppedPlaylist()
      playlistlibraryPage.reviewTab.getPlaylistCardById(playlistId_2)
      playlistlibraryPage.reviewTab
        .getPlaylistCardById(playlistId_1)
        .should('not.exist')
      cy.url().should('contain', `${playlistId_2}/use-this`)
    })

    it("> manage test dropdown 'Preview Test'", () => {
      /* 4. verify preview test in manage test dropdown */
      playlistlibraryPage.reviewTab.closeSwitchPlaylistWindow()
      playlistlibraryPage.reviewTab
        .clickOnViewTestByTestByModule(1, 1, true)
        .then((test) => {
          expect(testIds[0]).to.eq(test)
        })
      studentTestPage.getNext()
      studentTestPage.clickOnExitTest(true)
    })

    it("> manage test dropdown 'assign test'", () => {
      /* 5. verify assign test in manage test dropdown */
      playlistlibraryPage.reviewTab.clickOnAssignByTestByModule(1, 1, true)
      playlistAssignPage.selectClass('Class')
      playlistAssignPage.clickOnAssign()

      playlistlibraryPage.sidebar.clickOnAssignment()
      authorAssignmentPage.getTestRowByTestId(testIds[0]).should('exist')
    })

    it("> manage test dropdown 'view test details'", () => {
      /* 6. verify view test details in manage test dropdown, will open test review window */
      playlistlibraryPage.sidebar.clickOnRecentUsedPlayList()
      playlistlibraryPage.reviewTab.clickOnViewDetailsInDropDownByTestByMod(
        1,
        1,
        true
      )
      testlibraryPage.review.verifyGradeSubject(grades.GRADE_10, subject.MATH)
      testlibraryPage.review.verifySummary(1, 1)
      testlibraryPage.review.clickExpandByItemId(itemid)
      testlibraryPage.review.getQueContainerById(itemid).should('be.visible')
    })

    it("> manage test dropdown 'unassign test'", () => {
      /* 7. verify unassign test(assigned in #5) in manage test dropdown , */
      playlistlibraryPage.reviewTab.clickBackToPlaylistInTestReview()
      playlistlibraryPage.reviewTab.clickOnUnAssignInDropDownByTestByModule(
        1,
        1
      )
      playlistlibraryPage.sidebar.clickOnAssignment()
      cy.contains('Assignments not available')
      playlistlibraryPage.playlistCustom.clickOnManageContent()
    })

    it("> edit customized-'add new test'", () => {
      /* 8. add new test to module1 in customization tab  */
      cy.deleteAllAssignments('', teacher.email)
      playlistlibraryPage.sidebar.clickOnRecentUsedPlayList()
      playlistlibraryPage.playlistCustom.clickOnManageContent()
      playlistlibraryPage.reviewTab.searchContainer.setFilters({
        subject: subject.MATH,
        authoredByme: true,
      })
      playlistlibraryPage.playlistCustom.dragTestFromSearchToModule(
        1,
        testIds[3]
      )
      playlistlibraryPage.header.clickOnSave()
    })

    it("> assign the 'customized module'", () => {
      /* 9. assign module customized in #8 */
      playlistlibraryPage.reviewTab.clickOnAssignButtonByModule(1)
      playlistAssignPage.selectClass('Class')
      playlistAssignPage.clickOnAssign()
    })

    it("> verify teacher side-'customized playlist'", () => {
      /* 10. verify playlist after navigations */
      playlistlibraryPage.seachAndClickPlayListById(playlistId_2, true)
      playlistlibraryPage.reviewTab.clickExpandByModule(1)
      playlistlibraryPage.reviewTab.verifyNoOfTestByModule(1, 3)
    })

    it("> verify teacher side-'assignments page'", () => {
      /* 11. verify assignments in assignments page wrt #9 */
      playlistlibraryPage.sidebar.clickOnAssignment()
      ;[testIds[0], testIds[1], testIds[3]].forEach((id) => {
        authorAssignmentPage.getAssignmentRowsTestById(id).should('exist')
      })
    })

    it('> verify student side', () => {
      /* 12. verify student side assignments page wrt #9 */
      cy.login('student', student.email)
      ;[testIds[0], testIds[1], testIds[3]].forEach((id) => {
        assignmentsPage.getAssignmentByTestId(id).should('exist')
      })
    })
  })
})
