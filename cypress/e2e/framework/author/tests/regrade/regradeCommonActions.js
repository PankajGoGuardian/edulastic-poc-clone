import TestLibrary from '../testLibraryPage'
import AssignmentsPage from '../../../student/assignmentsPage'
import StudentTestPage from '../../../student/studentTestPage'
import ReportsPage from '../../../student/reportsPage'
import { studentSide } from '../../../constants/assignmentStatus'
import { attemptTypes } from '../../../constants/questionTypes'
import Regrade from './regrade'
import MCQMultiplePage from '../../itemList/questionType/mcq/mcqMultiplePage'

const testLibraryPage = new TestLibrary()
const assignmentsPage = new AssignmentsPage()
const studentTestPage = new StudentTestPage()
const reportsPage = new ReportsPage()
const regrade = new Regrade()
const mcqMultiplePage = new MCQMultiplePage()

const { _ } = Cypress

export function createtestandAssign(testname, testtitle, className) {
  return testLibraryPage.createTest(testname, false).then((id) => {
    testLibraryPage.header.clickOnDescription()
    testLibraryPage.testSummary.setName(testtitle)
    testLibraryPage.header.clickOnPublishButton()
    testLibraryPage.clickOnAssign()
    testLibraryPage.assignPage.selectClass(className)
    testLibraryPage.assignPage.clickOnAssign()
    cy.wait(1).then(() => [id, testLibraryPage.items])
  })
}

export function duplicateAndAssignTests(option, testid, testids, aType, cls) {
  aType.slice(1).forEach((attType) => {
    testLibraryPage.searchAndClickTestCardById(testid)
    testLibraryPage.clickOnDuplicate()
    testLibraryPage.testSummary.setName(`${option}-${attType}`)
    testLibraryPage.header.clickOnPublishButton().then((id) => {
      testids.push(id)
      testLibraryPage.clickOnAssign()
      testLibraryPage.assignPage.selectClass(cls)
      testLibraryPage.assignPage.clickOnAssign()
    })
  })
}

export function studentAttempt(testids, aType, aStatus, students, aData) {
  aStatus.forEach((status, ind) => {
    if (status !== studentSide.NOT_STARTED) {
      const { email } = students.filter(
        ({ stuStatus }) => stuStatus === status
      )[0]
      cy.login('student', email)
      testids.forEach((id, index) => {
        assignmentsPage.sidebar.clickOnAssignment()
        assignmentsPage.clickOnAssigmentByTestId(id)

        if (status === studentSide.SUBMITTED) {
          studentTestPage.attemptQuestion('MCQ_MULTI', aType[index], aData)
          studentTestPage.clickOnNext(false, aType[index] === attemptTypes.SKIP)
          studentTestPage.submitTest()
        } else studentTestPage.clickOnExitTest()
      })
    }
  })
}

export function updateAnsAndRegrade(
  assignedtestids,
  versionedtestids,
  oldCorrectAns,
  newCorrectAns,
  itemId,
  regradeOption
) {
  assignedtestids.forEach((id) => {
    testLibraryPage.visitTestById(id)
    testLibraryPage.publishedToDraftAssigned()
    testLibraryPage.getVersionedTestID().then((versionedtest) => {
      versionedtestids.push(versionedtest)
    })

    testLibraryPage.review.clickOnExpandRow()
    testLibraryPage.review.previewQuestById(itemId)
    testLibraryPage.review.previewItemPopUp.clickEditOnPreview()
    mcqMultiplePage.setCorrectAns(oldCorrectAns)
    mcqMultiplePage.setCorrectAns(newCorrectAns)

    mcqMultiplePage.header.saveAndgetId(true).then((itemversion) => {
      cy.saveItemDetailToDelete(itemversion)
    })

    testLibraryPage.header.clickRegradePublish()
    regrade.checkRadioByValue(regradeOption)
    regrade.applyRegrade()
  })
}

export function changePointsInReview(
  assignedtestids,
  versionedtestids,
  itemId,
  points,
  regradeOption
) {
  assignedtestids.forEach((id) => {
    testLibraryPage.visitTestById(id)
    testLibraryPage.publishedToDraftAssigned()
    testLibraryPage.getVersionedTestID().then((versionedtest) => {
      versionedtestids.push(versionedtest)
    })
    testLibraryPage.review.updatePointsByID(itemId, points)
    testLibraryPage.header.clickRegradePublish()
    regrade.checkRadioByValue(regradeOption)
    regrade.applyRegrade()
  })
}

export function changePointsInItem(
  testids,
  versionids,
  itemId,
  points,
  regradeOption
) {
  testids.forEach((id) => {
    testLibraryPage.visitTestById(id)
    testLibraryPage.publishedToDraftAssigned()
    testLibraryPage.getVersionedTestID().then((versionedtest) => {
      versionids.push(versionedtest)
    })

    testLibraryPage.review.clickOnExpandRow()
    testLibraryPage.review.previewQuestById(itemId)
    testLibraryPage.review.previewItemPopUp.clickEditOnPreview()
    mcqMultiplePage.updatePoints(points)
    mcqMultiplePage.header.saveAndgetId(true).then((itemversion) => {
      cy.saveItemDetailToDelete(itemversion)
    })

    testLibraryPage.header.clickRegradePublish()
    regrade.checkRadioByValue(regradeOption)
    regrade.applyRegrade()
  })
}

export function updateEval(assignedtestids, versionedtestids, itemId, option) {
  assignedtestids.forEach((id) => {
    testLibraryPage.visitTestById(id)
    testLibraryPage.publishedToDraftAssigned()
    testLibraryPage.getVersionedTestID().then((versionedtest) => {
      versionedtestids.push(versionedtest)
    })

    testLibraryPage.review.clickOnExpandRow()
    testLibraryPage.review.previewQuestById(itemId)
    testLibraryPage.review.previewItemPopUp.clickEditOnPreview()
    mcqMultiplePage.clickOnAdvancedOptions()
    mcqMultiplePage.getPanalty().type(`{selectall}1`, { force: true })
    mcqMultiplePage.header.saveAndgetId(true).then((itemversion) => {
      cy.saveItemDetailToDelete(itemversion)
    })

    testLibraryPage.header.clickRegradePublish()
    regrade.checkRadioByValue(option)
    regrade.applyRegrade()
  })
}

export function verifyStudentSide(
  data,
  attemptType,
  student,
  versionedtestids,
  attemptData
) {
  const { stuStatus, email } = student
  context(`> for Student,'${stuStatus}'`, () => {
    before('>login', () => {
      cy.login('student', email)
    })
    attemptType.forEach((attempt, attempIndex) => {
      const title = stuStatus === studentSide.SUBMITTED ? '' : 'attempt and '
      it(`> ${title}verify edited question-'${attempt}'`, () => {
        if (stuStatus !== studentSide.SUBMITTED) {
          assignmentsPage.sidebar.clickOnAssignment()
          assignmentsPage.clickOnAssigmentByTestId(
            versionedtestids[attempIndex]
          )
          studentTestPage.attemptQuestion('MCQ_MULTI', attempt, attemptData)
          studentTestPage.clickOnNext(false, attempt === attemptTypes.SKIP)
          studentTestPage.submitTest()
        } else assignmentsPage.sidebar.clickOnGrades()

        reportsPage.verifyPercentageOnTestCardByTestId(
          versionedtestids[attempIndex],
          _.round(
            (data.student[stuStatus][`${attempt}`] / data.points) * 100,
            2
          )
        )

        reportsPage.clickOnReviewButtonButtonByTestId(
          versionedtestids[attempIndex]
        )
        reportsPage.verifyAchievedScoreOfQueByIndex(
          0,
          data.student[stuStatus][`${attempt}`]
        )
        reportsPage.verifyMaxScoreOfQueByIndex(0, data.points)
      })
    })
  })
}
