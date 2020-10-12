/* eslint-disable import/no-duplicates */
import FileHelper from '../../../../../framework/util/fileHelper'
import {
  regradeOptions,
  studentSide,
} from '../../../../../framework/constants/assignmentStatus'
import { attemptTypes } from '../../../../../framework/constants/questionTypes'
import {
  createTestAndAssign,
  duplicateAndAssignTests,
  studentAttempt,
  verifyStudentSide,
  addItemAndRegrade,
  verifyTeacherSide,
} from '../../../../../framework/author/tests/regrade/regradeCommonActions'
import ItemListPage from '../../../../../framework/author/itemList/itemListPage'

const { MCQ_MULTI } = require('../../../../../../fixtures/questionAuthoring')

describe(`${FileHelper.getSpecName(
  Cypress.spec.name
)}> add item and regrade`, () => {
  const itemListPage = new ItemListPage()
  const Teacher = {
    username: 'additem@rescore.com',
    password: 'snapwiz',
  }
  const classs = 'add item- rescore grade'
  const students = [
    {
      name: 'add, rescore-1',
      email: 'arescore-17488',
      stuStatus: studentSide.SUBMITTED,
    },
    {
      name: 'add, rescore-2',
      email: 'arescore-25272',
      stuStatus: studentSide.IN_PROGRESS,
    },
    {
      name: 'add, rescore-3',
      email: 'arescore-39165',
      stuStatus: studentSide.NOT_STARTED,
    },
  ]

  const data = {
    points: 2,
    manualpoints: 1,
    student: {
      Submitted: { right: 2, wrong: 2, skip: 2, partialCorrect: 2 },
      'In Progress': { right: 2, wrong: 0, skip: 0, partialCorrect: 1 },
      'Not Started': { right: 2, wrong: 0, skip: 0, partialCorrect: 1 },
    },
    teacher: {
      Submitted: { right: 2, wrong: 2, skip: 2, partialCorrect: 2 },
      'In Progress': { right: 2, wrong: 0, skip: 0, partialCorrect: 1 },
      'Not Started': { right: 2, wrong: 0, skip: 0, partialCorrect: 1 },
    },
  }

  const aType = [attemptTypes.RIGHT, attemptTypes.WRONG]
  const aStatus = [studentSide.SUBMITTED, studentSide.IN_PROGRESS]
  const testids = []
  const vertestids = []
  const testname = 'REGRADE_EDITED_ITEM'
  const regradeOption = regradeOptions.added.FULL_POINTS
  const usedStudents = students.filter(({ stuStatus }) =>
    aStatus.includes(stuStatus)
  )
  const testidByAttempt = {}

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
    studentAttempt(testids, aType, aStatus, students, aData, 1)
  })

  context(`> add item and apply '${regradeOption}'`, () => {
    before('> login as teacher', () => {
      cy.login('teacher', Teacher.username, Teacher.password)
      itemListPage.createItem('MCQ_MULTI.5').then((id) => {
        itemId = id
      })
    })

    before('> edit test and apply regrade', () => {
      addItemAndRegrade(testids, vertestids, itemId, regradeOption)
    })

    context('> verify student side', () => {
      if (aStatus.includes(studentSide.SUBMITTED))
        verifyStudentSide(data, aType, students[0], vertestids, aData, 1)

      if (aStatus.includes(studentSide.IN_PROGRESS))
        verifyStudentSide(data, aType, students[1], vertestids, aData, 1)

      if (aStatus.includes(studentSide.NOT_STARTED))
        verifyStudentSide(data, aType, students[2], vertestids, aData, 1)
    })

    context('> verify teacherside', () => {
      const param1 = [data, testidByAttempt, usedStudents]
      const param2 = [aStatus, aData, false, 1]

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
