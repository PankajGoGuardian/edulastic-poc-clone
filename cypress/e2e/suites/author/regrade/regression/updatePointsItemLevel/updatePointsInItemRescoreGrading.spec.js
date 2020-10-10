/* eslint-disable import/no-duplicates */
import FileHelper from '../../../../../framework/util/fileHelper'
import {
  regradeOptions,
  studentSide,
} from '../../../../../framework/constants/assignmentStatus'
import { attemptTypes } from '../../../../../framework/constants/questionTypes'
import {
  changePointsInItem,
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
    username: 'updatepointsitem@rescore.com',
    password: 'snapwiz',
  }
  const classs = 'update point item- rescore grade'
  const students = [
    {
      name: 'initem, rescore-1',
      email: 'irescore-14002',
      stuStatus: studentSide.SUBMITTED,
    },
    {
      name: 'initem, rescore-2',
      email: 'irescore-29623',
      stuStatus: studentSide.IN_PROGRESS,
    },
    {
      name: 'initem, rescore-3',
      email: 'irescore-33569',
      stuStatus: studentSide.NOT_STARTED,
    },
  ]

  const data = {
    points: 4,
    manualpoints: 1,
    student: {
      Submitted: { right: 4, wrong: 0, skip: 0, partialCorrect: 2 },
      'In Progress': { right: 4, wrong: 0, skip: 0, partialCorrect: 2 },
      'Not Started': { right: 4, wrong: 0, skip: 0, partialCorrect: 2 },
    },
    teacher: {
      Submitted: { right: 4, wrong: 0, skip: 0, partialCorrect: 2 },
      'In Progress': { right: 4, wrong: 0, skip: 0, partialCorrect: 2 },
      'Not Started': { right: 4, wrong: 0, skip: 0, partialCorrect: 2 },
    },
  }

  const aType = [attemptTypes.RIGHT, attemptTypes.WRONG]
  const aStatus = [studentSide.SUBMITTED, studentSide.IN_PROGRESS]
  const usedStudents = students.filter(({ stuStatus }) =>
    aStatus.includes(stuStatus)
  )
  const testidByAttempt = {}
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
      const points = data.points
      changePointsInItem(testids, vertestids, itemId, points, regradeOption)
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
      before('login', () => {
        aType.forEach((att, ind) => {
          testidByAttempt[att] = vertestids[ind]
        })
        cy.login('teacher', Teacher.username, Teacher.password)
      })
      if (aType.includes(attemptTypes.RIGHT))
        verifyTeacherSide(
          data,
          testidByAttempt,
          usedStudents,
          attemptTypes.RIGHT,
          aStatus,
          aData
        )
      if (aType.includes(attemptTypes.WRONG))
        verifyTeacherSide(
          data,
          testidByAttempt,
          usedStudents,
          attemptTypes.WRONG,
          aStatus,
          aData
        )
    })
  })
})
