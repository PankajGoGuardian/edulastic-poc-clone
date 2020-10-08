import TestLibrary from '../testLibraryPage'
import AssignmentsPage from '../../../student/assignmentsPage'
import StudentTestPage from '../../../student/studentTestPage'
import ReportsPage from '../../../student/reportsPage'
import { studentSide } from '../../../constants/assignmentStatus'
import { attemptTypes } from '../../../constants/questionTypes'
import Regrade from './regrade'
import MCQMultiplePage from '../../itemList/questionType/mcq/mcqMultiplePage'
import AuthorAssignmentPage from '../../assignments/AuthorAssignmentPage'
import BarGraph from '../../assignments/barGraphs'
import PreviewItemPopup from '../../itemList/itemPreview'
import CypressHelper from '../../../util/cypressHelpers'
import ExpressGraderPage from '../../assignments/expressGraderPage'
import LiveClassboardPage from '../../assignments/LiveClassboardPage'

const testLibraryPage = new TestLibrary()
const assignmentsPage = new AssignmentsPage()
const studentTestPage = new StudentTestPage()
const reportsPage = new ReportsPage()
const regrade = new Regrade()
const mcqMultiplePage = new MCQMultiplePage()
const expressGrader = new ExpressGraderPage()
const authorAssignmentsPage = new AuthorAssignmentPage()
const barGraphs = new BarGraph()
const itemPreview = new PreviewItemPopup()
const lcb = new LiveClassboardPage()

const { _ } = Cypress
let attemptsData
const queCentric = {}

export function createTestAndAssign(testname, testtitle, className) {
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

export function studentAttempt(
  testids,
  aType,
  aStatus,
  students,
  aData,
  isRegradeAdded = 0
) {
  /* 
  isRegradeAdded: index of added item in test,while regrade
  */
  aStatus.forEach((status, _ind) => {
    if (status !== studentSide.NOT_STARTED) {
      const { email } = students.filter(
        ({ stuStatus }) => stuStatus === status
      )[0]
      cy.login('student', email)
      testids.forEach((id, index) => {
        assignmentsPage.sidebar.clickOnAssignment()
        assignmentsPage.clickOnAssigmentByTestId(id)
        if (status === studentSide.SUBMITTED) {
          if (!isRegradeAdded)
            studentTestPage.attemptQuestion('MCQ_MULTI', aType[index], aData)
          studentTestPage.clickOnNext(
            false,
            isRegradeAdded || aType[index] === attemptTypes.SKIP
          )
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
  /* assignedtestids:[...original test ids], 
     versionids:[empty array], 
     itemId:item id of to be edited,
     oldCorrectAns:[...old correct ans],
     newCorrectAns:[...new correct ans],
     regradeOption: regrade option to be applied
   */

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
  /* assignedtestids:[...original test ids], 
     versionids:[empty array], 
     itemId:item id of to be edited, 
     option: regrade option to be applied
   */
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
  /* testids:[...original test ids], 
     versionids:[empty array], 
     itemId:item id of to be edited, 
     option: regrade option to be applied
   */
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
  /* testids:[...original test ids], 
     versionids:[empty array], 
     itemId:item id of to be edited, 
     option: regrade option to be applied
   */
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

export function addItemAndRegrade(testids, versionids, itemId, option) {
  /* testids:[...original test ids], 
     versionids:[empty array], 
     itemId:item id of to be added, 
     option: regrade option to be applied
   */
  testids.forEach((id) => {
    testLibraryPage.visitTestById(id)
    testLibraryPage.publishedToDraftAssigned()
    testLibraryPage.getVersionedTestID().then((versionedtest) => {
      versionids.push(versionedtest)
    })

    testLibraryPage.header.clickOnAddItems()
    testLibraryPage.testAddItem.searchFilters.clearAll()
    testLibraryPage.testAddItem.addItemById(itemId)

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
  attemptData,
  isRegradeAdded = 0
) {
  /* {
    isRegradeAdded: index of added item while regrade
    versionedtestids: [...activetest ids]
  } */
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
          if (isRegradeAdded) studentTestPage.getQuestionByIndex(1, 1)
          studentTestPage.attemptQuestion('MCQ_MULTI', attempt, attemptData)
          studentTestPage.clickOnNext(false, attempt === attemptTypes.SKIP)
          studentTestPage.submitTest()
        } else assignmentsPage.sidebar.clickOnGrades()

        reportsPage.verifyPercentageOnTestCardByTestId(
          versionedtestids[attempIndex],
          _.round(
            (data.student[stuStatus][`${attempt}`] /
              (data.points + (isRegradeAdded ? 2 : 0))) *
              100,
            2
          )
        )

        reportsPage.clickOnReviewButtonButtonByTestId(
          versionedtestids[attempIndex]
        )
        reportsPage.verifyAchievedScoreOfQueByIndex(
          isRegradeAdded,
          data.student[stuStatus][`${attempt}`]
        )
        reportsPage.verifyMaxScoreOfQueByIndex(isRegradeAdded, data.points)
      })
    })
  })
}
export function mapScoreToAttemptdata(data, status, attempt, students) {
  return _.entries(data.student)
    .filter((e) => status.includes(e[0]))
    .map((e) => e[1])
    .map((e) => e[attempt])
    .map(function (e) {
      return {
        Q1:
          e === ''
            ? attemptTypes.MANUAL_GRADE
            : e === data.points
            ? attemptTypes.RIGHT
            : !e
            ? attemptTypes.WRONG
            : attemptTypes.PARTIAL_CORRECT,
      }
    })
    .map((e, i) => {
      return {
        stuName: students[i].name,
        status: status[i],
        attempt: e,
      }
    })
}

export function verifyTeacherSide(
  data,
  testidByAttempt,
  students,
  aType,
  status,
  attemptData,
  isAnsUpdated = false
) {
  /* 
  data:{
    points: 2,
    student: {
      Submitted: { right: '', wrong: '', skip: '', partialCorrect: '' },
      'In Progress': { right: 2, wrong: 0, skip: 0, partialCorrect: 1 },
      'Not Started': { right: 2, wrong: 0, skip: 0, partialCorrect: 1 },
    },
    teacher: {
      Submitted: { right: 0, wrong: 0, skip: 0, partialCorrect: 0 },
      'In Progress': { right: 2, wrong: 0, skip: 0, partialCorrect: 1 },
      'Not Started': { right: 2, wrong: 0, skip: 0, partialCorrect: 1 },
    },
  },
  testidByAttempt:{
    aType:testid
  },
  students:[{
      name: 'updateans, manual-1',
      email: 'umanual-11752',
      stuStatus: studentSide.SUBMITTED,
    }],
  aType:string,
  status:[...required status],
  attemptData:{
    question attempt data
  },
  isAnsUpdated: bool, whether the ans updated, while regrading
   */
  context(
    `> verify edited question-'attempted as ${aType}', and submitted`,
    () => {
      before('>click assignments', () => {
        testLibraryPage.sidebar.clickOnAssignment()
        authorAssignmentsPage.clickOnLCBbyTestId(testidByAttempt[aType])
        attemptsData = mapScoreToAttemptdata(data, status, aType, students)
      })
      students.forEach((student, ind) => {
        const { stuStatus } = student
        it(`> verif lcb card view for ${stuStatus}, before regrade`, () => {
          lcb.verifyScoreByStudentIndex(
            ind,
            data.teacher[stuStatus][aType],
            data.points
          )

          lcb.getQuestionsByIndex(0).find('div').should('have.length', 1)
          barGraphs.verifyQueBarAndToolTipBasedOnAttemptData(attemptsData, [
            'Q1',
          ])

          lcb.verifyQuestionCards(ind, _.values(attemptsData[ind].attempt))
        })
      })
      students.forEach((student, ind) => {
        const { name, stuStatus } = student
        it(`> verify student centric view, for ${stuStatus}, before regrade`, () => {
          const attempType =
            isAnsUpdated &&
            aType === attemptTypes.RIGHT &&
            stuStatus === studentSide.SUBMITTED
              ? attemptTypes.WRONG
              : isAnsUpdated &&
                aType === attemptTypes.WRONG &&
                stuStatus === studentSide.SUBMITTED
              ? attemptTypes.RIGHT
              : aType

          lcb.clickOnStudentsTab()
          lcb.questionResponsePage.selectStudent(
            name.split(',').reverse().join(', ')
          )
          cy.wait(3000)

          lcb.questionResponsePage
            .getTotalScore()
            .should('have.text', `${data.teacher[stuStatus][aType]}`)
          lcb.questionResponsePage
            .getMaxScore()
            .should('have.text', `${data.points}`)

          itemPreview.verifyQuestionResponseCard(
            'MCQ_MULTI',
            attemptData,
            attempType
          )
          barGraphs.verifyQueBarAndToolTipBasedOnAttemptData(
            attemptsData[ind],
            ['Q1']
          )
        })
      })
      students.forEach((student, ind) => {
        const { name, stuStatus } = student
        it(`> verify Question centric view, ${stuStatus}, before regrade`, () => {
          const attempType =
            isAnsUpdated &&
            aType === attemptTypes.RIGHT &&
            stuStatus === studentSide.SUBMITTED
              ? attemptTypes.WRONG
              : isAnsUpdated &&
                aType === attemptTypes.WRONG &&
                stuStatus === studentSide.SUBMITTED
              ? attemptTypes.RIGHT
              : aType

          if (!ind) {
            lcb.clickonQuestionsTab()
            cy.wait(3000)
            lcb.questionResponsePage.getDropDown().click({ force: true })
            CypressHelper.getDropDownList().then((questions) => {
              expect(questions).to.have.lengthOf(1)
            })

            lcb.getQuestionCentricData(attemptsData, queCentric)
            barGraphs.verifyQueBarBasedOnQueAttemptData(queCentric.Q1)
          }

          lcb.questionResponsePage
            .getQuestionContainerByStudent(name.split(',').reverse().join(', '))
            .as('updatecard')
          itemPreview.verifyQuestionResponseCard(
            'MCQ_MULTI',
            attemptData,
            attempType,
            false,
            ind
          )

          lcb.questionResponsePage.verifyScoreAndPointsByCard(
            cy.get('@updatecard'),
            data.student[stuStatus][`${aType}`],
            data.points
          )
        })
      })
      students.forEach((student, _ind) => {
        it('> verify express grader view', () => {
          const { name, stuStatus } = student
          lcb.header.clickOnExpressGraderTab()

          expressGrader.getGridRowByStudent(
            name.split(',').reverse().join(', ')
          )
          expressGrader.verifyScoreAndPerformance(
            `${data.teacher[stuStatus][`${aType}`]}/${data.points}`,
            _.round(
              (data.teacher[stuStatus][`${aType}`] / data.points) * 100,
              2
            )
          )

          expressGrader.verifyNumberOfQuestions(1)
        })
      })
    }
  )
}
