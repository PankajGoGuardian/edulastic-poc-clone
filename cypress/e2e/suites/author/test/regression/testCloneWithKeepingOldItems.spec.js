import TestLibrary from '../../../../framework/author/tests/testLibraryPage'
import FileHelper from '../../../../framework/util/fileHelper'
import ItemListPage from '../../../../framework/author/itemList/itemListPage'
import LiveClassboardPage from '../../../../framework/author/assignments/LiveClassboardPage'
import StudentsReportCard from '../../../../framework/author/assignments/studentPdfReportCard'
import {
  grades as Grades,
  subject as Subjects,
  studentSide,
} from '../../../../framework/constants/assignmentStatus'

const TEST = 'TEST_CLONE'
const testData = require('../../../../../fixtures/testAuthoring')
const quesData = require('../../../../../fixtures/questionAuthoring')

const testName = testData[TEST].name
const ITEMS = testData[TEST].itemKeys
const grades = testData[TEST].grade
const subjects = testData[TEST].subject
const itemsInTest = []
const { _ } = Cypress
ITEMS.forEach((ele) => {
  itemsInTest.push(ele.split('.')[0])
})

describe(`${FileHelper.getSpecName(
  Cypress.spec.name
)} >> cloning with keeping reference to original items`, () => {
  const testLibraryPage = new TestLibrary()
  const itemListPage = new ItemListPage()
  const lcb = new LiveClassboardPage()
  const pdfReport = new StudentsReportCard()

  let clonedTestId
  let originalTestId
  const originalItemId = []
  let totalItemsInItemBank

  const questText = []
  const questionTypeMap = {}
  const itemDetails = []
  const stuAttempt = [
    {
      stuName: 'student',
      attempt: {
        Q1: 'right',
        Q2: 'right',
      },
      status: studentSide.SUBMITTED,
    },
  ]

  lcb.getQuestionTypeMap(ITEMS, quesData, questionTypeMap)
  itemListPage.getItemsMetadata(ITEMS, itemDetails, quesData)
  const standardTableData = pdfReport.getStandardTableData({
    stuAttempt,
    questionTypeMap,
  })
  const totalPoints = _.values(questionTypeMap)
    .map(({ points: pointss }) => pointss)
    .reduce((a, b) => a + b, 0)
  const totalTestSbjects = _.uniq([
    ...subjects,
    ...itemDetails.map(({ standards }) => standards.subject),
  ])

  const totalTestGrades = _.uniq([
    ...grades,
    ...itemDetails.map(({ standards }) => standards.grade[0]),
  ])

  const Teacher = {
    email: 'clone@withoutitem.com',
    pass: 'snapwiz',
  }
  before('>get data of test and its items', () => {
    cy.fixture('questionAuthoring').then((questData) => {
      ITEMS.forEach((element) => {
        const [qType, num] = element.split('.')
        if (Array.isArray(questData[qType][num].quetext)) {
          questText.push(questData[qType][num].quetext[0])
        } else questText.push(questData[qType][num].quetext)
      })
    })
  })

  before('login and create new items and test', () => {
    cy.login('teacher', Teacher.email, Teacher.pass)
    ITEMS.forEach((item) => {
      itemListPage.createItem(item).then((id) => {
        originalItemId.push(id)
      })
    })
    itemListPage.searchFilters.clearAll()
    itemListPage.searchFilters.getAuthoredByMe()
    itemListPage.getTotalNoOfItems().then((count) => {
      totalItemsInItemBank = count
    })
  })

  context('> in test review', () => {
    before(' > clone test along with items', () => {
      testLibraryPage.sidebar.clickOnDashboard()
      testLibraryPage.createTest(TEST, true, originalItemId).then((id) => {
        originalTestId = id
        testLibraryPage.seachTestAndGotoReviewById(originalTestId)
        testLibraryPage.header.getDuplicateButtonInReview().click()
        testLibraryPage
          .selectCloneOptionAndCloneTest(false)
          .then((clonedid) => {
            clonedTestId = clonedid
          })
      })
    })

    it(' > verify item ids, headers and action buttons', () => {
      cy.url().should('contain', `/author/tests/${clonedTestId}`)
      testLibraryPage.verifyDraftTestHeaders()
      testLibraryPage.header.clickOnDescription()
      testLibraryPage.header.clickOnReview()
      originalItemId.forEach((id, i) => {
        testLibraryPage.review
          .getQueCardByItemIdInCollapsed(id)
          .should('be.visible')
        testLibraryPage.review.verifyActionButtonsByItemId(id, true)
        itemListPage.verifyQuestionTextByItemId(id, questText[i])
      })
    })

    it('> verify test summary in review tab', () => {
      // Verify Test in summary panel
      testLibraryPage.review.verifySummary(originalItemId.length, totalPoints)
      testLibraryPage.review.verifyGrades(totalTestGrades)
      testLibraryPage.review.verifySubjects(totalTestSbjects)
    })

    it('> verify standard table data', () => {
      _.keys(standardTableData).forEach((standard) => {
        const { max, questions } = standardTableData[standard]
        testLibraryPage.verifyStandardTableRowByStandard(
          standard,
          questions.length,
          max
        )
      })
    })

    it('> edit test -"add grades and subjects in review" ', () => {
      testLibraryPage.review.selectGrade(Grades.GRADE_12)
      testLibraryPage.review.selectSubject(Subjects.CS)
      totalTestGrades.push(Grades.GRADE_12)
      totalTestSbjects.push(Subjects.CS)
    })

    it("> edit test - 'update points'", () => {
      testLibraryPage.review.updatePointsByID(
        originalItemId[0],
        questionTypeMap.Q1.points + 5
      )
    })

    it('> save, publish and verify success page', () => {
      testLibraryPage.header.clickOnPublishButton()
      testLibraryPage.verifyTestIdOnTestCardById(clonedTestId)
      testLibraryPage.verifyLinkShareOptions(clonedTestId, true)
    })

    it('> edit once more after publish', () => {
      testLibraryPage.seachTestAndGotoReviewById(clonedTestId)
      testLibraryPage.publishedToDraft()
      testLibraryPage.header.clickOnDescription()
      testLibraryPage.testSummary.setName('cloned test')
      testLibraryPage.header.clickOnPublishButton()
    })

    it('> verify item bank', () => {
      cy.login('teacher', Teacher.email)
      testLibraryPage.sidebar.clickOnItemBank()
      itemListPage.searchFilters.clearAll()
      itemListPage.searchFilters.getAuthoredByMe()
      itemListPage.verifyNoOfQuestionsInUI(totalItemsInItemBank)
      originalItemId.forEach((id) => {
        itemListPage.getItemById(id).should('exist')
      })
    })

    it('> verify cloned test', () => {
      testLibraryPage.sidebar.clickOnTestLibrary()
      testLibraryPage.searchFilters.clearAll()
      testLibraryPage.searchFilters.getAuthoredByMe()
      testLibraryPage.getTestCardById(clonedTestId).should('be.visible')
      testLibraryPage.verifyStatusOnTestCardById(clonedTestId, 'published')
      testLibraryPage.verifyNameOnTestCardById(clonedTestId, 'cloned test')
      testLibraryPage.verifyTotalItemCountByTestId(clonedTestId, 2)
      testLibraryPage.clickOnTestCardById(clonedTestId)
      testLibraryPage.verifySubjectsOnTestCardPopUp(totalTestSbjects)
      testLibraryPage.verifyGradesOnTestCardPopUp(totalTestGrades)
      testLibraryPage.verifyTotalPointsOnTestCardPopUp(totalPoints + 5)
    })

    it('> verify original test', () => {
      totalTestGrades.pop()
      totalTestSbjects.pop()
      cy.get('body').type('{esc}')
      testLibraryPage.getTestCardById(originalTestId).should('be.visible')
      testLibraryPage.verifyNameOnTestCardById(originalTestId, testName)
      testLibraryPage.verifyStatusOnTestCardById(originalTestId, 'published')
      testLibraryPage.verifyTotalItemCountByTestId(originalTestId, 2)
      testLibraryPage.clickOnTestCardById(originalTestId)
      testLibraryPage.verifySubjectsOnTestCardPopUp(totalTestSbjects)
      testLibraryPage.verifyGradesOnTestCardPopUp(totalTestGrades)
      testLibraryPage.verifyTotalPointsOnTestCardPopUp(totalPoints)
      testLibraryPage.clickOnDetailsOfCard()
      originalItemId.forEach((id) => {
        testLibraryPage.review
          .getQueCardByItemIdInCollapsed(id)
          .should('be.visible')
      })
    })
  })
  context('> in test card pop-up- tile view', () => {
    before(' > clone test along with items', () => {
      testLibraryPage.sidebar.clickOnDashboard()
      testLibraryPage.createTest(TEST, true, originalItemId).then((id) => {
        originalTestId = id
        testLibraryPage.sidebar.clickOnDashboard()
        testLibraryPage.sidebar.clickOnTestLibrary()
        testLibraryPage.searchFilters.clearAll()
        testLibraryPage.clickOnTileView()
        testLibraryPage.searchFilters.typeInSearchBox(originalTestId)
        testLibraryPage.clickOnTestCardById(originalTestId)
        testLibraryPage.clickCloneInTestCardPopUp()
        testLibraryPage
          .selectCloneOptionAndCloneTest(false)
          .then((clonedid) => {
            clonedTestId = clonedid
          })
      })
    })

    it(' > verify item ids, headers and action buttons', () => {
      cy.url().should('contain', `/author/tests/${clonedTestId}`)
      testLibraryPage.verifyDraftTestHeaders()
      testLibraryPage.header.clickOnDescription()
      testLibraryPage.testSummary.setName('cloned test')
      testLibraryPage.header.clickOnReview()
      originalItemId.forEach((id, i) => {
        testLibraryPage.review
          .getQueCardByItemIdInCollapsed(id)
          .should('be.visible')
        testLibraryPage.review.verifyActionButtonsByItemId(id, true)
        itemListPage.verifyQuestionTextByItemId(id, questText[i])
      })
    })

    it('> verify test summary in review tab', () => {
      // Verify Test in summary panel
      testLibraryPage.review.verifySummary(originalItemId.length, totalPoints)
      testLibraryPage.review.verifyGrades(totalTestGrades)
      testLibraryPage.review.verifySubjects(totalTestSbjects)
    })

    it('> verify standard table data', () => {
      _.keys(standardTableData).forEach((standard) => {
        const { max, questions } = standardTableData[standard]
        testLibraryPage.verifyStandardTableRowByStandard(
          standard,
          questions.length,
          max
        )
      })
    })

    it('> edit test -"add grades and subjects in review" ', () => {
      testLibraryPage.review.selectGrade(Grades.GRADE_12)
      testLibraryPage.review.selectSubject(Subjects.CS)
      totalTestGrades.push(Grades.GRADE_12)
      totalTestSbjects.push(Subjects.CS)
    })

    it("> edit test - 'update points'", () => {
      testLibraryPage.review.updatePointsByID(
        originalItemId[0],
        questionTypeMap.Q1.points + 5
      )
    })

    it('> save, publish and verify success page', () => {
      testLibraryPage.header.clickOnPublishButton()
      testLibraryPage.verifyTestIdOnTestCardById(clonedTestId)
      testLibraryPage.verifyLinkShareOptions(clonedTestId, true)
    })

    it('> verify item bank', () => {
      cy.login('teacher', Teacher.email)
      testLibraryPage.sidebar.clickOnItemBank()
      itemListPage.searchFilters.clearAll()
      itemListPage.searchFilters.getAuthoredByMe()
      itemListPage.verifyNoOfQuestionsInUI(totalItemsInItemBank)
      originalItemId.forEach((id) => {
        itemListPage.getItemById(id).should('exist')
      })
    })

    it('> verify cloned test', () => {
      testLibraryPage.sidebar.clickOnTestLibrary()
      testLibraryPage.searchFilters.clearAll()
      testLibraryPage.searchFilters.getAuthoredByMe()
      testLibraryPage.getTestCardById(clonedTestId).should('be.visible')
      testLibraryPage.verifyStatusOnTestCardById(clonedTestId, 'published')
      testLibraryPage.verifyNameOnTestCardById(clonedTestId, 'cloned test')
      testLibraryPage.verifyTotalItemCountByTestId(clonedTestId, 2)
      testLibraryPage.clickOnTestCardById(clonedTestId)
      testLibraryPage.verifySubjectsOnTestCardPopUp(totalTestSbjects)
      testLibraryPage.verifyGradesOnTestCardPopUp(totalTestGrades)
      testLibraryPage.verifyTotalPointsOnTestCardPopUp(totalPoints + 5)
    })

    it('> verify original test', () => {
      totalTestGrades.pop()
      totalTestSbjects.pop()
      cy.get('body').type('{esc}')
      testLibraryPage.getTestCardById(originalTestId).should('be.visible')
      testLibraryPage.verifyNameOnTestCardById(originalTestId, testName)
      testLibraryPage.verifyStatusOnTestCardById(originalTestId, 'published')
      testLibraryPage.verifyTotalItemCountByTestId(originalTestId, 2)
      testLibraryPage.clickOnTestCardById(originalTestId)
      testLibraryPage.verifySubjectsOnTestCardPopUp(totalTestSbjects)
      testLibraryPage.verifyGradesOnTestCardPopUp(totalTestGrades)
      testLibraryPage.verifyTotalPointsOnTestCardPopUp(totalPoints)
      testLibraryPage.clickOnDetailsOfCard()
      originalItemId.forEach((id) => {
        testLibraryPage.review
          .getQueCardByItemIdInCollapsed(id)
          .should('be.visible')
      })
    })
  })
  context('> in test card pop-up- list view', () => {
    before(' > clone test along with items', () => {
      testLibraryPage.sidebar.clickOnDashboard()
      testLibraryPage.createTest(TEST, true, originalItemId).then((id) => {
        originalTestId = id
        testLibraryPage.sidebar.clickOnDashboard()
        testLibraryPage.sidebar.clickOnTestLibrary()
        testLibraryPage.searchFilters.clearAll()
        testLibraryPage.clickOnListView()
        testLibraryPage.searchFilters.typeInSearchBox(originalTestId)
        testLibraryPage.clickOnTestCardById(originalTestId)
        testLibraryPage.clickCloneInTestCardPopUp()
        testLibraryPage
          .selectCloneOptionAndCloneTest(false)
          .then((clonedid) => {
            clonedTestId = clonedid
          })
      })
    })

    it(' > verify item ids, headers and action buttons', () => {
      cy.url().should('contain', `/author/tests/${clonedTestId}`)
      testLibraryPage.verifyDraftTestHeaders()
      testLibraryPage.header.clickOnDescription()
      testLibraryPage.testSummary.setName('cloned test')
      testLibraryPage.header.clickOnReview()
      originalItemId.forEach((id, i) => {
        testLibraryPage.review
          .getQueCardByItemIdInCollapsed(id)
          .should('be.visible')
        testLibraryPage.review.verifyActionButtonsByItemId(id, true)
        itemListPage.verifyQuestionTextByItemId(id, questText[i])
      })
    })

    it('> verify test summary in review tab', () => {
      // Verify Test in summary panel
      testLibraryPage.review.verifySummary(originalItemId.length, totalPoints)
      testLibraryPage.review.verifyGrades(totalTestGrades)
      testLibraryPage.review.verifySubjects(totalTestSbjects)
    })

    it('> verify standard table data', () => {
      _.keys(standardTableData).forEach((standard) => {
        const { max, questions } = standardTableData[standard]
        testLibraryPage.verifyStandardTableRowByStandard(
          standard,
          questions.length,
          max
        )
      })
    })

    it('> edit test -"add grades and subjects in review" ', () => {
      testLibraryPage.review.selectGrade(Grades.GRADE_12)
      testLibraryPage.review.selectSubject(Subjects.CS)
      totalTestGrades.push(Grades.GRADE_12)
      totalTestSbjects.push(Subjects.CS)
    })

    it("> edit test - 'update points'", () => {
      testLibraryPage.review.updatePointsByID(
        originalItemId[0],
        questionTypeMap.Q1.points + 5
      )
    })

    it('> save, publish and verify success page', () => {
      testLibraryPage.header.clickOnPublishButton()
      testLibraryPage.verifyTestIdOnTestCardById(clonedTestId)
      testLibraryPage.verifyLinkShareOptions(clonedTestId, true)
    })

    it('> verify item bank', () => {
      cy.login('teacher', Teacher.email)
      testLibraryPage.sidebar.clickOnItemBank()
      itemListPage.searchFilters.clearAll()
      itemListPage.searchFilters.getAuthoredByMe()
      itemListPage.verifyNoOfQuestionsInUI(totalItemsInItemBank)
      originalItemId.forEach((id) => {
        itemListPage.getItemById(id).should('exist')
      })
    })

    it('> verify cloned test', () => {
      testLibraryPage.sidebar.clickOnTestLibrary()
      testLibraryPage.searchFilters.clearAll()
      testLibraryPage.searchFilters.getAuthoredByMe()
      testLibraryPage.getTestCardById(clonedTestId).should('be.visible')
      testLibraryPage.verifyStatusOnTestCardById(clonedTestId, 'published')
      testLibraryPage.verifyNameOnTestCardById(clonedTestId, 'cloned test')
      testLibraryPage.verifyTotalItemCountByTestId(clonedTestId, 2)
      testLibraryPage.clickOnTestCardById(clonedTestId)
      testLibraryPage.verifySubjectsOnTestCardPopUp(totalTestSbjects)
      testLibraryPage.verifyGradesOnTestCardPopUp(totalTestGrades)
      testLibraryPage.verifyTotalPointsOnTestCardPopUp(totalPoints + 5)
    })

    it('> verify original test', () => {
      totalTestGrades.pop()
      totalTestSbjects.pop()
      cy.get('body').type('{esc}')
      testLibraryPage.getTestCardById(originalTestId).should('be.visible')
      testLibraryPage.verifyNameOnTestCardById(originalTestId, testName)
      testLibraryPage.verifyStatusOnTestCardById(originalTestId, 'published')
      testLibraryPage.verifyTotalItemCountByTestId(originalTestId, 2)
      testLibraryPage.clickOnTestCardById(originalTestId)
      testLibraryPage.verifySubjectsOnTestCardPopUp(totalTestSbjects)
      testLibraryPage.verifyGradesOnTestCardPopUp(totalTestGrades)
      testLibraryPage.verifyTotalPointsOnTestCardPopUp(totalPoints)
      testLibraryPage.clickOnDetailsOfCard()
      originalItemId.forEach((id) => {
        testLibraryPage.review
          .getQueCardByItemIdInCollapsed(id)
          .should('be.visible')
      })
    })
  })
})
