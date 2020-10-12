/* eslint-disable func-names */
/* eslint-disable cypress/no-unnecessary-waiting */
import TestLibrary from '../testLibraryPage'
import AssignmentsPage from '../../../student/assignmentsPage'
import StudentTestPage from '../../../student/studentTestPage'
import ReportsPage from '../../../student/reportsPage'
import {
  releaseGradeTypes,
  studentSide,
} from '../../../constants/assignmentStatus'
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

const questData = require('../../../../../fixtures/questionAuthoring')

const { _ } = Cypress
let attemptsData
const queCentric = {}
let questions

export function createTestAndAssign(testname, testtitle, className) {
  return testLibraryPage.createTest(testname, false).then((id) => {
    testLibraryPage.header.clickOnDescription()
    testLibraryPage.testSummary.setName(testtitle)
    testLibraryPage.header.clickOnSettings()
    testLibraryPage.testSettings.setRealeasePolicy(
      releaseGradeTypes.WITH_ANSWERS
    )
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
  aStatus.forEach((status) => {
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
  isRegradeAdded = 0,
  isAnsUpdated = false
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
      if (stuStatus !== studentSide.SUBMITTED) {
        it(`> attempt and verify edited question-'${attempt}'`, () => {
          assignmentsPage.sidebar.clickOnAssignment()
          assignmentsPage.clickOnAssigmentByTestId(
            versionedtestids[attempIndex]
          )
          if (isRegradeAdded) studentTestPage.getQuestionByIndex(1, 1)
          studentTestPage.attemptQuestion('MCQ_MULTI', attempt, attemptData)
          studentTestPage.clickOnNext(false, attempt === attemptTypes.SKIP)
          studentTestPage.submitTest()
        })
      }
      it(`> verify edited question-'in grades page'`, () => {
        let attempType = attempt
        if (stuStatus === studentSide.SUBMITTED)
          attempType = isRegradeAdded
            ? attemptTypes.SKIP
            : isAnsUpdated && attempt === attemptTypes.RIGHT
            ? attemptTypes.WRONG
            : isAnsUpdated && attempt === attemptTypes.WRONG
            ? attemptTypes.RIGHT
            : attempt

        assignmentsPage.sidebar.clickOnGrades()

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
        reportsPage.verifyQuestionResponseCard(
          undefined,
          'MCQ_MULTI',
          attempType,
          attemptData,
          true
        )
      })
    })
  })
}
export function mapScoreToAttemptdata(
  data,
  status,
  attemptType,
  students,
  isAddedItemRegrade = false,
  isRegradeNoPoints = false
) {
  return _.entries(data.student)
    .filter((e) => status.includes(e[0]))
    .map(function (e) {
      const attempt =
        isRegradeNoPoints && e[0] === studentSide.SUBMITTED
          ? attemptTypes.SKIP
          : e[1][attemptType] === ''
          ? attemptTypes.MANUAL_GRADE
          : e[1][attemptType] === data.points
          ? attemptTypes.RIGHT
          : e[1][attemptType] === 0
          ? attemptTypes.WRONG
          : attemptTypes.PARTIAL_CORRECT

      if (isAddedItemRegrade)
        return {
          Q1: attemptTypes.SKIP,
          Q2: attempt,
        }
      return {
        Q1: attempt,
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
  isAnsUpdated = false,
  isAddedItem = 0,
  isRegradeNoPoints = false
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
    `> verify '${
      isAddedItem ? 'added' : 'edited'
    }' item regrade-'attempted as ${aType}', and submitted`,
    () => {
      before('>click assignments', () => {
        expressGrader.clickOnExit()
        testLibraryPage.sidebar.clickOnAssignment()
        authorAssignmentsPage.clickOnLCBbyTestId(testidByAttempt[aType])
        attemptsData = mapScoreToAttemptdata(
          data,
          status,
          aType,
          students,
          isAddedItem,
          isRegradeNoPoints
        )
        questions = isAddedItem ? ['Q1', 'Q2'] : ['Q1']
      })
      students.forEach((student, ind) => {
        const { stuStatus } = student
        it(`> verif lcb card view for "${stuStatus}" student, before regrade`, () => {
          lcb.verifyScoreByStudentIndex(
            ind,
            data.teacher[stuStatus][aType],
            isAddedItem ? data.points + 2 : data.points
          )

          lcb
            .getQuestionsByIndex(ind)
            .find('div')
            .should('have.length', questions.length)
          barGraphs.verifyQueBarAndToolTipBasedOnAttemptData(
            attemptsData,
            questions
          )

          lcb.verifyQuestionCards(ind, _.values(attemptsData[ind].attempt))
        })
      })
      students.forEach((student, ind) => {
        const { name, stuStatus } = student
        it(`> verify student centric view, for "${stuStatus}" student, before regrade`, () => {
          let attempType = aType
          if (stuStatus === studentSide.SUBMITTED)
            attempType = isAddedItem
              ? attemptTypes.SKIP
              : isAnsUpdated && aType === attemptTypes.RIGHT
              ? attemptTypes.WRONG
              : isAnsUpdated && aType === attemptTypes.WRONG
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
            .should(
              'have.text',
              `${isAddedItem ? data.points + 2 : data.points}`
            )

          itemPreview.verifyQuestionResponseCard(
            'MCQ_MULTI',
            attemptData,
            attempType,
            false,
            isAddedItem
          )

          lcb.questionResponsePage
            .getQuestionContainer(isAddedItem)
            .as('updatecard')

          lcb.questionResponsePage.verifyScoreAndPointsByCard(
            cy.get('@updatecard'),
            data.student[stuStatus][`${aType}`],
            data.points
          )
          barGraphs.verifyQueBarAndToolTipBasedOnAttemptData(
            attemptsData[ind],
            questions
          )
        })
      })
      students.forEach((student, ind) => {
        const { name, stuStatus } = student
        it(`> verify Question centric view, "${stuStatus}" student, before regrade`, () => {
          let attempType = aType
          if (stuStatus === studentSide.SUBMITTED)
            attempType = isAddedItem
              ? attemptTypes.SKIP
              : isAnsUpdated && aType === attemptTypes.RIGHT
              ? attemptTypes.WRONG
              : isAnsUpdated && aType === attemptTypes.WRONG
              ? attemptTypes.RIGHT
              : aType

          if (!ind) {
            lcb.clickonQuestionsTab()
            cy.wait(3000)
            lcb.questionResponsePage.getDropDown().click({ force: true })
            CypressHelper.getDropDownList().then((questionsInDropDown) => {
              expect(questionsInDropDown).to.have.lengthOf(questions.length)
              if (isAddedItem) lcb.questionResponsePage.selectQuestion('Q2')
            })

            lcb.getQuestionCentricData(attemptsData, queCentric)
            barGraphs.verifyQueBarBasedOnQueAttemptData(
              queCentric[`${isAddedItem ? 'Q2' : 'Q1'}`]
            )
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
        it(`> verify express grader view for -"${student.stuStatus}" student, before regrade`, () => {
          expressGrader.clickOnExit()

          let { name } = student
          const { stuStatus } = student
          const { attempt } = attemptsData[_ind]
          const questionTypeMap = {}
          let attempType = aType

          if (stuStatus === studentSide.SUBMITTED)
            attempType = isAddedItem
              ? attemptTypes.SKIP
              : isAnsUpdated && aType === attemptTypes.RIGHT
              ? attemptTypes.WRONG
              : isAnsUpdated && aType === attemptTypes.WRONG
              ? attemptTypes.RIGHT
              : aType

          lcb.getQuestionTypeMap(
            isAddedItem
              ? ['MCQ_MULTI.5', 'MCQ_MULTI.5']
              : isAnsUpdated
              ? ['MCQ_MULTI.6']
              : ['MCQ_MULTI.5'],
            questData,
            questionTypeMap
          )

          name = name.split(',').reverse().join(', ')
          lcb.header.clickOnExpressGraderTab()

          expressGrader.setToggleToScore()
          expressGrader.getGridRowByStudent(name)
          expressGrader.verifyScoreAndPerformance(
            `${data.teacher[stuStatus][`${aType}`]}/${
              isAddedItem ? data.points + 2 : data.points
            }`,
            _.round(
              (data.teacher[stuStatus][`${aType}`] /
                (isAddedItem ? data.points + 2 : data.points)) *
                100,
              2
            )
          )

          expressGrader.verifyNumberOfQuestions(questions.length)
          expressGrader.verifyScoreGridColor(name, attemptsData[_ind].attempt)

          _.entries(attemptsData[_ind].attempt).forEach((entry) => {
            const score =
              entry[1] === attemptTypes.MANUAL_GRADE
                ? '-'
                : entry[1] === attemptTypes.SKIP
                ? '0'
                : data.teacher[stuStatus][`${aType}`]
            expressGrader
              .getScoreforQueNum(entry[0])
              .should('have.text', score.toString())
          })

          expressGrader.setToggleToResponse()
          expressGrader.verifyResponseGrid(
            isAnsUpdated ? { Q1: attempType } : attempt,
            questionTypeMap,
            name
          )

          expressGrader
            .getScoreforQueNum(`${isAddedItem ? 'Q2' : 'Q1'}`)
            .click()
          expressGrader.questionResponsePage.verifyQuestionResponseCard(
            undefined,
            'MCQ_MULTI',
            attempType,
            attemptData,
            false,
            name
          )
        })
      })
    }
  )
}

export function manualEvaluation(
  data,
  testidByAttempt,
  students,
  aType,
  status,
  isAddedItem = 0
) {
  context(
    '> update and verify points in question centric view, for student "submitted" before regrade',
    () => {
      before('> set attempt data', () => {
        expressGrader.clickOnExit()
        testLibraryPage.sidebar.clickOnDashboard()
        testLibraryPage.sidebar.clickOnAssignment()
        authorAssignmentsPage.clickOnLCBbyTestId(testidByAttempt[aType])
        attemptsData = mapScoreToAttemptdata(
          data,
          status,
          aType,
          students,
          isAddedItem
        )
        questions = isAddedItem ? ['Q1', 'Q2'] : ['Q1']
      })
      it('> upadate score and verify in question centric view', () => {
        const student = students[0].name.split(',').reverse().join(', ')
        lcb.clickonQuestionsTab()
        if (isAddedItem) lcb.questionResponsePage.selectQuestion('Q2')

        lcb.questionResponsePage.updateScoreAndFeedbackForStudent(
          student,
          data.manualpoints
        )
        attemptsData[0].attempt[`${isAddedItem ? 'Q2' : 'Q1'}`] =
          attemptTypes.PARTIAL_CORRECT
        cy.wait(3000)
        lcb.getQuestionCentricData(attemptsData, queCentric)
        barGraphs.verifyQueBarBasedOnQueAttemptData(
          queCentric[`${isAddedItem ? 'Q2' : 'Q1'}`]
        )
      })

      it('> verify student centric view', () => {
        const student = students[0].name.split(',').reverse().join(', ')
        lcb.clickOnStudentsTab()
        cy.wait(3000)
        lcb.questionResponsePage.selectStudent(student)
        lcb.questionResponsePage
          .getTotalScore()
          .should('have.text', `${data.manualpoints}`)
        lcb.questionResponsePage
          .getMaxScore()
          .should('have.text', `${isAddedItem ? data.points + 2 : data.points}`)

        lcb.questionResponsePage
          .getQuestionContainer(isAddedItem)
          .as('updatecard')

        lcb.questionResponsePage.verifyScoreAndPointsByCard(
          cy.get('@updatecard'),
          data.manualpoints,
          data.points
        )
        barGraphs.verifyQueBarAndToolTipBasedOnAttemptData(
          attemptsData[0],
          questions
        )
      })

      it(`> verify lcb card view-`, () => {
        lcb.clickOnCardViewTab()
        cy.wait(3000)
        lcb.verifyScoreByStudentIndex(
          0,
          data.manualpoints,
          isAddedItem ? data.points + 2 : data.points
        )
        lcb.verifyQuestionCards(0, _.values(attemptsData[0].attempt))
        barGraphs.verifyQueBarAndToolTipBasedOnAttemptData(
          attemptsData,
          questions
        )
      })
      it(`> verify express grader view for student, before regrade`, () => {
        const student = students[0].name.split(',').reverse().join(', ')

        lcb.header.clickOnExpressGraderTab()

        expressGrader.getGridRowByStudent(student)
        expressGrader.verifyScoreAndPerformance(
          `${data.manualpoints}/${isAddedItem ? data.points + 2 : data.points}`,
          _.round(
            (data.manualpoints /
              (isAddedItem ? data.points + 2 : data.points)) *
              100,
            2
          )
        )

        expressGrader.verifyScoreGridColor(student, attemptsData[0].attempt)

        expressGrader
          .getScoreforQueNum(`${isAddedItem ? 'Q2' : 'Q1'}`)
          .should('have.text', data.manualpoints.toString())
      })
    }
  )
}
