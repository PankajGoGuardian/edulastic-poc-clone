/* eslint-disable import/no-duplicates */
import FileHelper from '../../../../../framework/util/fileHelper'
import {
  regradeOptions,
  studentSide,
} from '../../../../../framework/constants/assignmentStatus'
import { attemptTypes } from '../../../../../framework/constants/questionTypes'
import {
  updateAnsAndRegrade,
  duplicateAndAssignTests,
  studentAttempt,
  verifyStudentSide,
  createTestAndAssign,
  verifyTeacherSide,
} from '../../../../../framework/author/tests/regrade/regradeCommonActions'

const { MCQ_MULTI } = require('../../../../../../fixtures/questionAuthoring')

describe(`${FileHelper.getSpecName(
  Cypress.spec.name
)}> update answer and regrade`, () => {
  const Teacher = {
    username: 'updateans@rescore.com',
    password: 'snapwiz',
  }
  const classs = 'upadate ans rescore grade'
  const students = [
    {
      name: 'upadateans, rescore-1',
      email: 'urescore-17585',
      stuStatus: studentSide.SUBMITTED,
    },
    {
      name: 'upadateans, rescore-2',
      email: 'urescore-29878',
      stuStatus: studentSide.IN_PROGRESS,
    },
    {
      name: 'upadateans, rescore-3',
      email: 'urescore-30694',
      stuStatus: studentSide.NOT_STARTED,
    },
  ]

  const data = {
    points: 2,
    manualpoints: 1,
    student: {
      Submitted: { right: 0, wrong: 2, skip: 0, partialCorrect: 1 },
      'In Progress': { right: 2, wrong: 0, skip: 0, partialCorrect: 1 },
      'Not Started': { right: 2, wrong: 0, skip: 0, partialCorrect: 1 },
    },
    teacher: {
      Submitted: { right: 0, wrong: 2, skip: 0, partialCorrect: 1 },
      'In Progress': { right: 2, wrong: 0, skip: 0, partialCorrect: 1 },
      'Not Started': { right: 2, wrong: 0, skip: 0, partialCorrect: 1 },
    },
  }

  const aType = [attemptTypes.RIGHT, attemptTypes.WRONG]
  const aStatus = [studentSide.SUBMITTED, studentSide.IN_PROGRESS]
  const testids = []
  const vertestids = []
  const testname = 'REGRADE_EDITED_ITEM'
  const oldAns = MCQ_MULTI['5'].setAns.correct
  const newAns = MCQ_MULTI['6'].setAns.correct
  const regradeOption = regradeOptions.edited.AUTO_POINTS
  const usedStudents = students.filter(({ stuStatus }) =>
    aStatus.includes(stuStatus)
  )
  const testidByAttempt = {}

  let aData = MCQ_MULTI['5'].attemptData
  const newAttempt = MCQ_MULTI['6'].attemptData
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
      aData = newAttempt
      updateAnsAndRegrade(
        testids,
        vertestids,
        oldAns,
        newAns,
        itemId,
        regradeOption
      )
    })

    context('> verify student side', () => {
      const param1 = [data, aType]
      const param2 = [vertestids, newAttempt, 0, true]

      if (aStatus.includes(studentSide.SUBMITTED))
        verifyStudentSide(...param1, students[0], ...param2)

      if (aStatus.includes(studentSide.IN_PROGRESS))
        verifyStudentSide(...param1, students[1], ...param2)

      if (aStatus.includes(studentSide.NOT_STARTED))
        verifyStudentSide(...param1, students[2], ...param2)
    })

    context('> verify teacherside', () => {
      const param1 = [data, testidByAttempt, usedStudents]
      const param2 = [aStatus, newAttempt, true]

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
