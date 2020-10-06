/* eslint-disable import/no-duplicates */
import FileHelper from '../../../../../framework/util/fileHelper'
import {
  regradeOptions,
  studentSide,
} from '../../../../../framework/constants/assignmentStatus'
import { attemptTypes } from '../../../../../framework/constants/questionTypes'
import {
  updateEval,
  createTestAndAssign,
  duplicateAndAssignTests,
  studentAttempt,
  verifyStudentSide,
} from '../../../../../framework/author/tests/regrade/regradeCommonActions'

const { MCQ_MULTI } = require('../../../../../../fixtures/questionAuthoring')

describe(`${FileHelper.getSpecName(
  Cypress.spec.name
)}> update points and regrade`, () => {
  const Teacher = {
    username: 'updateeval@rescore.com',
    password: 'snapwiz',
  }
  const classs = 'update eval- rescore grade'
  const students = [
    {
      name: 'eval, rescore-1',
      email: 'erescore-10649',
      stuStatus: studentSide.SUBMITTED,
    },
    {
      name: 'eval, rescore-2',
      email: 'erescore-20046',
      stuStatus: studentSide.IN_PROGRESS,
    },
    {
      name: 'eval, rescore-3',
      email: 'erescore-34057',
      stuStatus: studentSide.NOT_STARTED,
    },
  ]

  const data = {
    points: 2,
    manualpoints: 1,
    student: {
      Submitted: { right: 2, wrong: 0, skip: 0, partialCorrect: 0.5 },
      'In Progress': { right: 2, wrong: 0, skip: 0, partialCorrect: 0.5 },
      'Not Started': { right: 2, wrong: 0, skip: 0, partialCorrect: 0.5 },
    },
    teacher: {
      Submitted: { right: 2, wrong: 0, skip: 0, partialCorrect: 0.5 },
      'In Progress': { right: 2, wrong: 0, skip: 0, partialCorrect: 0.5 },
      'Not Started': { right: 2, wrong: 0, skip: 0, partialCorrect: 0.5 },
    },
  }

  const aType = [attemptTypes.RIGHT, attemptTypes.WRONG]
  const aStatus = [studentSide.SUBMITTED, studentSide.IN_PROGRESS]
  const testids = []
  const vertestids = []
  const testname = 'REGRADE_EDITED_ITEM'
  const regradeOption = regradeOptions.edited.AUTO_POINTS

  const aData = MCQ_MULTI['5'].attemptData
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
      updateEval(testids, vertestids, itemId, regradeOption)
    })

    context('> verify student side', () => {
      if (aStatus.includes(studentSide.SUBMITTED))
        verifyStudentSide(data, aType, students[0], vertestids, aData)

      if (aStatus.includes(studentSide.IN_PROGRESS))
        verifyStudentSide(data, aType, students[1], vertestids, aData)

      if (aStatus.includes(studentSide.NOT_STARTED))
        verifyStudentSide(data, aType, students[2], vertestids, aData)
    })
  })
})
