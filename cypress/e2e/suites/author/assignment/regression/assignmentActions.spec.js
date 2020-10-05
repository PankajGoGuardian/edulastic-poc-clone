import TestLibrary from '../../../../framework/author/tests/testLibraryPage'
import TestReviewTab from '../../../../framework/author/tests/testDetail/testReviewTab'
import TestAddItemTab from '../../../../framework/author/tests/testDetail/testAddItemTab'
import TestAssignPage from '../../../../framework/author/tests/testDetail/testAssignPage'
import AssignmentsPage from '../../../../framework/student/assignmentsPage'
import StudentTestPage from '../../../../framework/student/studentTestPage'
import Regrade from '../../../../framework/author/tests/regrade/regrade'
import LiveClassboardPage from '../../../../framework/author/assignments/LiveClassboardPage'
import AuthorAssignmentPage from '../../../../framework/author/assignments/AuthorAssignmentPage'
import TestSummayTab from '../../../../framework/author/tests/testDetail/testSummaryTab'
import { attemptTypes } from '../../../../framework/constants/questionTypes'
import ItemListPage from '../../../../framework/author/itemList/itemListPage'
import PreviewItemPopup from '../../../../framework/author/itemList/itemPreview'
import FileHelper from '../../../../framework/util/fileHelper'
import PlayListLibrary from '../../../../framework/author/playlist/playListLibrary'

const TEST = 'TEST_PREVIEW'
const testData = require('../../../../../fixtures/testAuthoring')

const ITEMS = testData[TEST].itemKeys
const grades = testData[TEST].grade
const subjects = testData[TEST].subject
const daTestId = '5edf954e53e7f00008aefc43'
let newItemId
const itemKeysInTest = []
ITEMS.forEach((ele) => {
  itemKeysInTest.push(ele.split('.')[0])
})
describe(`${FileHelper.getSpecName(
  Cypress.spec.name
)}Verify Actions Button In Author Side Assignments Page`, () => {
  const testLibraryPage = new TestLibrary()
  const assignmentsPage = new AssignmentsPage()
  const studentTestPage = new StudentTestPage()
  const testReviewTab = new TestReviewTab()
  const lcb = new LiveClassboardPage()
  const testAddItemTab = new TestAddItemTab()
  const testAssignPage = new TestAssignPage()
  const testSummayTab = new TestSummayTab()
  const regrade = new Regrade()
  const item = new ItemListPage()
  const itemPreview = new PreviewItemPopup()
  const playlist = new PlayListLibrary()

  const authorAssignmentPage = new AuthorAssignmentPage()
  const newItemKey = 'MCQ_STD.default'
  // const updatedPoints = '6'
  // const isAssigned = true
  const Teacher = {
    email: 'teacher.for.assign.actions@snapwiz.com',
    pass: 'snapwiz',
  }
  const Student1 = {
    email: 'student1.for.assign.actions@snapwiz.com',
    pass: 'snapwiz',
  }
  const Student2 = {
    email: 'student2.for.assign.actions@snapwiz.com',
    pass: 'snapwiz',
  }
  const questText = []
  const points = []
  const questionType = []
  const attempt = []
  const dropdownOptions = [
    'add-to-folder',
    'remove-from-folder',
    'assign',
    'duplicate',
    'preview',
    'view-details',
    'print-assignment',
    'release-grades',
    'summary-grades',
    'edit-Assignment',
    // 'delete-Assignment', *unassign option removed
  ]

  let OriginalTestId
  let newTestId
  let qType
  let num
  let itemIds
  let assignmentid_1
  let assignmentid_2

  before('> get data of test and its itemns', () => {
    cy.deleteAllAssignments(Student1.email, Teacher.email, Teacher.pass, [
      daTestId,
    ])
    cy.login('teacher', Teacher.email, Teacher.pass)
    cy.fixture('questionAuthoring').then((quesData) => {
      ITEMS.forEach((element) => {
        ;[qType, num] = element.split('.')
        questText.push(quesData[qType][num].quetext)
        questionType.push(qType)
        points.push(quesData[qType][num].setAns.points)
        attempt.push(quesData[qType][num].attemptData)
      })
    })
  })

  context('> verify assignment assigned by teacher', () => {
    before('> login and create new items and test', () => {
      testLibraryPage.createTest(TEST).then((id) => {
        OriginalTestId = id
        itemIds = testLibraryPage.items
      })
    })
    context('> verify navigation based on assignment ids(class)', () => {
      it('> verify navigations into lcb, eg and sbr- one assignment', () => {
        cy.deleteAllAssignments('', Teacher.email, Teacher.pass, [daTestId])
        testLibraryPage.assignPage.visitAssignPageById(OriginalTestId)
        testAssignPage.selectClass('Class Assignment Actions')
        testAssignPage.clickOnAssign().then((assignObj) => {
          assignmentid_1 = assignObj[OriginalTestId]

          testLibraryPage.sidebar.clickOnDashboard()
          testLibraryPage.sidebar.clickOnAssignment()

          authorAssignmentPage.clickOnLCBbyTestId(
            OriginalTestId,
            assignmentid_1
          )
          cy.go('back')
          authorAssignmentPage.clickOnExpressGraderByTestId(
            OriginalTestId,
            assignmentid_1
          )
          cy.go('back')
          authorAssignmentPage.clickOnStatndardBasedReportByTestId(
            OriginalTestId,
            assignmentid_1
          )
          cy.go('back')
        })
      })

      it('> verify navigations into lcb, eg and sbr- two assignments', () => {
        testLibraryPage.assignPage.visitAssignPageById(OriginalTestId)
        testLibraryPage.assignPage.selectClass('Class2')
        testAssignPage.clickOnAssign().then((assignObj) => {
          assignmentid_2 = assignObj[OriginalTestId]

          testLibraryPage.sidebar.clickOnDashboard()
          testLibraryPage.sidebar.clickOnAssignment()
          ;[assignmentid_1, assignmentid_2].forEach((assignmentid) => {
            authorAssignmentPage.clickOnLCBbyTestId(
              OriginalTestId,
              assignmentid
            )
            cy.go('back')
            authorAssignmentPage.clickOnExpressGraderByTestId(
              OriginalTestId,
              assignmentid
            )
            cy.go('back')
            authorAssignmentPage.clickOnStatndardBasedReportByTestId(
              OriginalTestId,
              assignmentid
            )
            cy.go('back')
          })
        })
      })
    })

    context(
      '> test libary page and lcb navigation in assign success page',
      () => {
        before('> assign test', () => {
          cy.deleteAllAssignments('', Teacher.email, Teacher.pass, [daTestId])
          testLibraryPage.assignPage.visitAssignPageById(OriginalTestId)
          testAssignPage.selectClass('Class Assignment Actions')
          testAssignPage.clickOnAssign().then((assignObj) => {
            assignmentid_1 = assignObj[OriginalTestId]
          })
        })
        it('> navigations to lcb and assignments page from assign success page', () => {
          cy.wait(3000)

          testAssignPage.navigateTolcbAndVerify(assignmentid_1)
          cy.go('back')
          testAssignPage.naviagateToTestlibraryAndVerify()
          cy.go('back')
        })
      }
    )

    context('> verify actions button in author side assignments page', () => {
      before('> assign test', () => {
        cy.deleteAllAssignments('', Teacher.email, Teacher.pass, [daTestId])
        testLibraryPage.assignPage.visitAssignPageById(OriginalTestId)
        testAssignPage.selectClass('Class Assignment Actions')
        testAssignPage.clickOnAssign()
      })
      it('> verify all options presence in action dropdown', () => {
        testLibraryPage.sidebar.clickOnAssignment()
        authorAssignmentPage.clickActionsBytestid(OriginalTestId)
        authorAssignmentPage
          .getAllOptionsInDropDown()
          .should('have.length', dropdownOptions.length)
        dropdownOptions.forEach((option) =>
          authorAssignmentPage
            .getOptionInDropDownByAttribute(option)
            .should('exist', `${option} in dropdown`)
        )
      })

      context('> duplicate', () => {
        before('> duplicate test', () => {
          testLibraryPage.sidebar.clickOnDashboard()
          testLibraryPage.sidebar.clickOnAssignment()
          authorAssignmentPage.clickOnDuplicateAndWait().then((id) => {
            newTestId = id
          })
        })
        it('> verify duplicate test', () => {
          testLibraryPage.verifyAbsenceOfIdInUrl(OriginalTestId)
          testSummayTab.header.clickOnReview()
          itemIds.forEach((itemId) => testReviewTab.verifyQustionById(itemId))
          testReviewTab.verifySummary(
            itemKeysInTest.length,
            points.reduce((a, b) => a + b, 0)
          )
        })
      })
      context('> preview', () => {
        before('> click on preview', () => {
          testLibraryPage.sidebar.clickOnTestLibrary()
          testLibraryPage.sidebar.clickOnAssignment()
          authorAssignmentPage.clickOnPreviewTestAndVerifyId(OriginalTestId)
        })
        it('> verify preview', () => {
          studentTestPage.verifyNoOfQuestions(itemKeysInTest.length)
          itemKeysInTest.forEach((itemId, index) => {
            studentTestPage.attemptQuestion(
              questionType[index],
              attemptTypes.RIGHT,
              attempt[index]
            )
            studentTestPage.clickOnNext(true)
          })
          // studentTestPage.clickOnExitTest(true); // preview assessment player automatically gets closed by last next button click
        })
      })
      context('> view details', () => {
        before('> click on view details', () => {
          testLibraryPage.sidebar.clickOnTestLibrary()
          testLibraryPage.sidebar.clickOnAssignment()
          authorAssignmentPage.clickOnViewDetailsAndverifyId(OriginalTestId)
        })
        it('> verify view details ', () => {
          testReviewTab.verifySummary(
            itemKeysInTest.length,
            points.reduce((a, b) => a + b, 0)
          )
          itemIds.forEach((itemId) => testReviewTab.verifyQustionById(itemId))
          subjects.forEach((subject, index) =>
            testReviewTab.verifyGradeSubject(grades[index], subject)
          )
        })
        itemKeysInTest.forEach((itemId, index) => {
          it(`> verify in the review tabs-collapsed mode-${itemId}`, () => {
            // Verify All questions' presence
            testReviewTab.verifyQustionById(itemIds[index])
            testReviewTab.asesrtPointsByid(itemIds[index], points[index])
          })
          it(`> verify in the review tabs-expanded mode-${itemId}`, () => {
            testReviewTab.clickOnExpandRow()
            // Verify All questions' presence along with thier correct answers and points
            testReviewTab.verifyQustionById(itemIds[index])
            attempt[index].itemId = itemIds[index]
            itemPreview.verifyQuestionResponseCard(
              itemKeysInTest[index],
              attempt[index],
              attemptTypes.RIGHT,
              true
            )
            testReviewTab.asesrtPointsByid(itemIds[index], points[index])
            testReviewTab.clickOnCollapseRow()
          })
        })
      })
      context('> edit test', () => {
        before('> create an item', () => {
          item.createItem(newItemKey).then((id) => {
            // New Item Details
            newItemId = id
            testLibraryPage.sidebar.clickOnAssignment()
            authorAssignmentPage.clickOnEditTest()
            authorAssignmentPage.verifyEditTestURLUnAttempted(OriginalTestId)
          })
        })
        before('> add created item to test', () => {
          // Add created Item using add item tab
          testReviewTab.testheader.clickOnAddItems()
          testReviewTab.searchFilters.clearAll()
          testReviewTab.searchFilters.getAuthoredByMe()
          testAddItemTab.addItemById(newItemId)
          itemKeysInTest.push(newItemKey)
          itemIds.push(newItemId)
          testAddItemTab.header.clickOnReview()
          // verify review tab before publish
          testReviewTab
            .getQueCardByItemIdInCollapsed(newItemId)
            .should('have.length', 1)
          // Publish
          testReviewTab.testheader.clickOnPublishButton()
        })

        beforeEach('> close assignment player if failed in between', () => {
          studentTestPage.clickOnExitTest()
        })

        it('> verify and attempt assignment', () => {
          cy.login('student', Student1.email, Student1.pass)
          assignmentsPage.verifyPresenceOfTest(OriginalTestId)
          assignmentsPage.clickOnAssigmentByTestId(OriginalTestId)
          studentTestPage.verifyNoOfQuestions(itemKeysInTest.length)
          studentTestPage.clickOnExitTest()
        })
        it('> edit test after attempt-regrade', () => {
          cy.login('teacher', Teacher.email, Teacher.pass)
          testLibraryPage.sidebar.clickOnAssignment()
          authorAssignmentPage.clickOnEditTest(true)
          // Remove Last item
          testReviewTab.clickOnCheckBoxByItemId(itemIds[itemIds.length - 1])
          itemIds.pop()
          testReviewTab.clickOnRemoveSelected()
          testLibraryPage.getVersionedTestID().then((id) => {
            newTestId = id
          })
          testLibraryPage.header.clickRegradePublish()
          regrade.applyRegrade()
        })
        it('> verify after edit-regrade', () => {
          cy.login('student', Student1.email, Student1.pass)
          assignmentsPage.clickOnAssigmentByTestId(newTestId)
          studentTestPage.verifyNoOfQuestions(itemIds.length)
          studentTestPage.clickOnExitTest()
        })
        /*   it("Edit Test after attempt- Without Regrade", () => {
          cy.login("teacher", Teacher.email, Teacher.pass);
          testLibraryPage.sidebar.clickOnAssignment();
          authorAssignmentPage.clickOnEditTest();
          testReviewTab.updatePointsByID(itemIds[itemIds.length - 1], updatedPoints);
          testLibraryPage.header.clickOnPublishButton(isAssigned);
          regrade.regradeSelection(false, true);
        });
        it("Verify After Edit-Without Regrade", () => {
          cy.login("student", Student1.email, Student1.pass);
          assignmentsPage.clickOnAssignmentButton();
          studentTestPage.getQuestionByIndex(0);
          itemIds.forEach((item, index) => {
            studentTestPage.attemptQuestion(itemKeysInTest[index], attemptTypes.RIGHT, attempt[index]);
            studentTestPage.clickOnNext(true);
          });
  
          studentTestPage.submitTest();
          assignmentsPage.sidebar.clickOnGrades();
          assignmentsPage.clickOnReviewButton();
          reportsPage.verifyNoOfQuesInReview(itemIds.length);
          reportsPage.verifyMaxScoreOfQueByIndex(itemIds.length - 1, points[itemIds.length - 1]);
        }); */
      })
      context('> assignment summary', () => {
        before('> click reports summary button', () => {
          cy.login('teacher', Teacher.email, Teacher.pass)
          testLibraryPage.sidebar.clickOnAssignment()
          authorAssignmentPage.clickAssignmentSummary()
        })
        it('> verify navigation', () => {
          cy.url().should(
            'contain',
            `author/reports/performance-by-students/test/${newTestId}`
          )
          cy.get('[title="Insights"]').should('exist')
        })
      })
      context('> unassign', () => {
        before('login as teacher and unassign', () => {
          cy.login('teacher', Teacher.email, Teacher.pass)
          testLibraryPage.sidebar.clickOnAssignment()
          authorAssignmentPage.clickOnLCBbyTestId(newTestId)
          lcb.header.clickOnUnassign()
        })
        it('> verify unassign', () => {
          cy.login('student', Student2.email, Student2.pass)
          assignmentsPage.sidebar.clickOnAssignment()
          assignmentsPage.verifyPresenceOfTest(daTestId)
          assignmentsPage.verifyAbsenceOfTest(newTestId)
        })
      })
    })
  })

  context(
    "> navigations in 'NEW ASSIGNMENT BUTTON' using existing playlists",
    () => {
      before('login as teacher', () => {
        cy.login('teacher', Teacher.email, Teacher.pass)
      })
      beforeEach("> click 'NEW ASSIGNMENT BUTTON'", () => {
        testLibraryPage.sidebar.clickOnDashboard()
        testLibraryPage.sidebar.clickOnAssignment()
        testLibraryPage.getCreateNewTestButton().click()
      })
      it('> choose from playlist', () => {
        testLibraryPage.searchFilters.routeSearch()
        authorAssignmentPage.clickChoosefromPlaylistButton()
        testLibraryPage.searchFilters.waitForSearchResponse()
        cy.url().should('contain', 'author/playlists')
        playlist.getPLaylistLibraryTitle().should('be.visible')
      })

      it('> choose from testlibary', () => {
        testLibraryPage.searchFilters.routeSearch()
        authorAssignmentPage.clickChooseFromTestLibrary()
        testLibraryPage.searchFilters.waitForSearchResponse()
        cy.url().should('contain', 'author/tests')
        testLibraryPage.getTestlibraryTitle().should('be.visible')
      })
    }
  )

  context('> verify assignment assigned by DA', () => {
    it('> verify author assignents page', () => {
      testLibraryPage.sidebar.clickOnAssignment()
      authorAssignmentPage.verifyAssignmentRowByTestId(
        daTestId,
        undefined,
        undefined,
        undefined,
        'C'
      )
      authorAssignmentPage.clickActionsBytestid(daTestId)
      dropdownOptions.slice(0, dropdownOptions.length - 2).forEach((option) => {
        authorAssignmentPage
          .getOptionInDropDownByAttribute(option)
          .should('exist', `${option} in dropdown`)
      })
      dropdownOptions.slice(dropdownOptions.length - 1).forEach((option) => {
        authorAssignmentPage
          .getOptionInDropDownByAttribute(option)
          .should('not.exist', `${option} in dropdown`)
      })
    })

    it('> verify student assignents page', () => {
      cy.login('student', Student1.email, Student1.pass)
      assignmentsPage.verifyAssignTypeByTestId(daTestId, 'C')
    })
  })
})
