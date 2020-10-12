/* eslint-disable import/no-duplicates */
import FileHelper from '../../../../../framework/util/fileHelper'
import {
  regradeOptions,
  studentSide,
} from '../../../../../framework/constants/assignmentStatus'
import { attemptTypes } from '../../../../../framework/constants/questionTypes'
import {
  changePointsInReview,
  createTestAndAssign,
  duplicateAndAssignTests,
  studentAttempt,
  verifyStudentSide,
  verifyTeacherSide,
} from '../../../../../framework/author/tests/regrade/regradeCommonActions'

const { MCQ_MULTI } = require('../../../../../../fixtures/questionAuthoring')

describe(`${FileHelper.getSpecName(
  Cypress.spec.name
)}> update points and regrade`, () => {
  const Teacher = {
    username: 'updatepointsinreview@skip.com',
    password: 'snapwiz',
  }
  const classs = 'update point in review- skip grade'
  const students = [
    {
      name: 'inreview, skip-1',
      email: 'iskip-13517',
      stuStatus: studentSide.SUBMITTED,
    },
    {
      name: 'inreview, skip-2',
      email: 'iskip-21966',
      stuStatus: studentSide.IN_PROGRESS,
    },
    {
      name: 'inreview, skip-3',
      email: 'iskip-31085',
      stuStatus: studentSide.NOT_STARTED,
    },
  ]

  const data = {
    points: 4,
    manualpoints: 1,
    student: {
      Submitted: { right: 2, wrong: 0, skip: 0, partialCorrect: 1 },
      'In Progress': { right: 4, wrong: 0, skip: 0, partialCorrect: 2 },
      'Not Started': { right: 4, wrong: 0, skip: 0, partialCorrect: 2 },
    },
    teacher: {
      Submitted: { right: 2, wrong: 0, skip: 0, partialCorrect: 1 },
      'In Progress': { right: 4, wrong: 0, skip: 0, partialCorrect: 2 },
      'Not Started': { right: 4, wrong: 0, skip: 0, partialCorrect: 2 },
    },
  }

  const aType = [attemptTypes.RIGHT, attemptTypes.WRONG]
  const aStatus = [studentSide.SUBMITTED, studentSide.IN_PROGRESS]
  const testids = []
  const vertestids = []
  const testname = 'REGRADE_EDITED_ITEM'
  const regradeOption = regradeOptions.edited.NO_POINTS
  const aData = MCQ_MULTI['5'].attemptData
  const usedStudents = students.filter(({ stuStatus }) =>
    aStatus.includes(stuStatus)
  )
  const testidByAttempt = {}

  let itemId
  let testid

  before('create tests', () => {
    cy.deleteAllAssignments('', Teacher.username)
    cy.login('teacher', Teacher.username, Teacher.password)

    const title = `${regradeOption}-${aType[0]}`
    createTestAndAssign(testname, title, classs).then((arr) => {
      ;[testid, [itemId]] = arr
      testids.push(testid)
    })
  })
  before('> duplicate and assign ', () => {
    duplicateAndAssignTests(regradeOption, testid, testids, aType, classs)
  })

  before('> duplicate, assign and attempt the test', () => {
    studentAttempt(testids, aType, aStatus, students, aData)
  })

  context(`> edit item and apply '${regradeOption}'`, () => {
    before('> login as teacher', () => {
      cy.login('teacher', Teacher.username, Teacher.password)
    })

    before('> edit test and apply regrade', () => {
      const points = data.points
      changePointsInReview(testids, vertestids, itemId, points, regradeOption)
    })

    context('> verify student side', () => {
      if (aStatus.includes(studentSide.SUBMITTED))
        verifyStudentSide(data, aType, students[0], vertestids, aData)

      if (aStatus.includes(studentSide.IN_PROGRESS))
        verifyStudentSide(data, aType, students[1], vertestids, aData)

      if (aStatus.includes(studentSide.NOT_STARTED))
        verifyStudentSide(data, aType, students[2], vertestids, aData)
    })
    context('> verify teacherside', () => {
      const param1 = [data, testidByAttempt, usedStudents]
      const param2 = [aStatus, aData]

      before('login', () => {
        cy.login('teacher', Teacher.username, Teacher.password)
        aType.forEach((att, ind) => {
          testidByAttempt[att] = vertestids[ind]
        })
      })

      if (aType.includes(attemptTypes.RIGHT))
        verifyTeacherSide(...param1, attemptTypes.RIGHT, ...param2)

      if (aType.includes(attemptTypes.WRONG))
        verifyTeacherSide(...param1, attemptTypes.WRONG, ...param2)
    })
  })
})
