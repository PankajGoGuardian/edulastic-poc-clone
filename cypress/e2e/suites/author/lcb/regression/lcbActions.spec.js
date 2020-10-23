import FileHelper from '../../../../framework/util/fileHelper'
import StudentTestPage from '../../../../framework/student/studentTestPage'
import LiveClassboardPage from '../../../../framework/author/assignments/LiveClassboardPage'
import AuthorAssignmentPage from '../../../../framework/author/assignments/AuthorAssignmentPage'
import {
  studentSide,
  teacherSide,
  openPolicyTypes,
} from '../../../../framework/constants/assignmentStatus'
import TestLibrary from '../../../../framework/author/tests/testLibraryPage'
import TeacherSideBar from '../../../../framework/author/SideBarPage'
import ReportsPage from '../../../../framework/student/reportsPage'

const { LCB_2 } = require('../../../../../fixtures/testAuthoring')
const questionData = require('../../../../../fixtures/questionAuthoring')

const test = new StudentTestPage()
const lcb = new LiveClassboardPage()
const authorAssignmentPage = new AuthorAssignmentPage()
const testLibrary = new TestLibrary()
const teacherSidebar = new TeacherSideBar()
const gradesPage = new ReportsPage()
const students = {
  1: {
    email: 'student1.regression.automation@snapwiz.com',
    stuName: '1, student1',
  },
  2: {
    email: 'student2.regression.automation@snapwiz.com',
    stuName: 'regression, student2',
  },
  3: {
    email: 'student3.regression.automation@snapwiz.com',
    stuName: 'regression, student3',
  },
  4: {
    email: 'student4.regression.automation@snapwiz.com',
    stuName: 'regression, student4',
  },
  5: {
    email: 'student5.regression.automation@snapwiz.com',
    stuName: 'regression, student5',
  },
  6: {
    email: 'student6.regression.automation@snapwiz.com',
    stuName: 'regression, student6',
  },
  7: {
    email: 'student7.regression.automation@snapwiz.com',
    stuName: 'regression, student7',
  },
}

const lcbTestData = {
  className: 'Regression Automation Class',
  teacher: 'teacher1.regression.automation@snapwiz.com',
  student: students[1].email,
  password: 'automation',
  assignmentName: LCB_2.name,
  attemptsData: [
    {
      attempt: { Q1: 'right' },
      status: studentSide.GRADED,
      ...students[1],
    },
    {
      attempt: { Q1: 'wrong' },
      status: studentSide.IN_PROGRESS,
      ...students[2],
    },
    {
      attempt: {
        Q1: 'noattempt',
      },
      status: studentSide.NOT_STARTED,
      ...students[3],
    },
    {
      attempt: {
        Q1: 'noattempt',
      },
      status: studentSide.NOT_STARTED,
      ...students[4],
    },
    {
      attempt: {
        Q1: 'right',
      },
      status: studentSide.IN_PROGRESS,
      ...students[5],
    },
    {
      attempt: {
        Q1: 'noattempt',
      },
      status: studentSide.NOT_STARTED,
      ...students[6],
    },
  ],
  submitStudent: {
    1: students[3],
    2: students[2],
  },
  absentStudent: {
    1: students[4],
    2: students[2],
  },
  removeStudent: {
    1: students[1],
    2: students[5],
    3: students[6],
  },
}

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> LCB Actions`, () => {
  const {
    attemptsData,
    student,
    teacher,
    className,
    password,
    submitStudent,
    absentStudent,
    removeStudent,
    assignmentName,
  } = lcbTestData
  let stuCount = attemptsData.length
  const statsMap = {}
  const { itemKeys } = LCB_2
  const studentAssignList = attemptsData.map((stu) => stu.stuName)
  const studentSubittedCount = attemptsData.filter(
    (stu) => stu.status === studentSide.GRADED
  ).length
  let questionTypeMap = {}
  let testId
  let addStuCount = 1

  before(' > create new assessment and assign', () => {
    questionTypeMap = lcb.getQuestionTypeMap(
      itemKeys,
      questionData,
      questionTypeMap
    )
    cy.deleteAllAssignments(student, teacher, password)
    cy.login('teacher', teacher, password)
    testLibrary.createTest('LCB_2').then((_id) => {
      testId = _id
      testLibrary.clickOnAssign()
      // testLibrary.assignPage.visitAssignPageById(testId)
      // assign to specific students
      testLibrary.assignPage.selectClass(className)
      // testLibrary.assignPage.clickOnSpecificStudent()
      testLibrary.assignPage.selectStudent(studentAssignList)
      testLibrary.assignPage.clickOnAssign()
    })
  })

  before(' > attempt by all students', () => {
    attemptsData.forEach((attempts) => {
      const { attempt, email, stuName, status } = attempts
      statsMap[stuName] = lcb.getScoreAndPerformance(attempt, questionTypeMap)
      statsMap[stuName].attempt = attempt
      statsMap[stuName].status = status
      test.attemptAssignment(email, status, attempt, questionTypeMap, password)
    })
  })

  describe('mark as absent', () => {
    beforeEach('login as teacher', () => {
      cy.login('teacher', teacher, password)
      teacherSidebar.clickOnAssignment()
      authorAssignmentPage.verifyStatus(teacherSide.IN_PROGRESS)
      authorAssignmentPage.verifySubmitted(`1 of ${studentAssignList.length}`)
      authorAssignmentPage.verifyGraded('1')
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0)
    })

    it(" > marking 'Not Started' student to absent and verify", () => {
      // marking student as absent
      lcb.selectCheckBoxByStudentName(absentStudent[1].stuName)
      lcb.clickOnMarkAsAbsent()

      //  verify submitted/absent count
      lcb.verifySubmittedCount(1, studentAssignList.length)
      lcb.verifyAbsentCount(1)

      // verify student card
      lcb.verifyStudentCard(
        absentStudent[1].stuName,
        studentSide.ABSENT,
        '0 / 2',
        '0%',
        {
          Q1: 'noattempt',
        },
        absentStudent[1].email
      )

      // verify assignment page counts
      teacherSidebar.clickOnAssignment()
      authorAssignmentPage.verifyStatus(teacherSide.IN_PROGRESS)
      authorAssignmentPage.verifySubmitted(`1 of ${studentAssignList.length}`)
      authorAssignmentPage.verifyGraded('1')

      // verify student side assignment no entry
      cy.login('student', absentStudent[1].email, password)
      test.assignmentPage.verifyNoAssignments()
      test.assignmentPage.sidebar.clickOnGrades()
      gradesPage.validateAssignment(assignmentName, studentSide.ABSENT, false)
    })

    it(" > marking 'In progress' student to absent and verify", () => {
      // marking student as absent
      lcb.selectCheckBoxByStudentName(absentStudent[2].stuName)
      lcb.clickOnMarkAsAbsent(false)
    })
  })

  describe('mark as submit', () => {
    beforeEach('login as teacher', () => {
      cy.login('teacher', teacher, password)
      teacherSidebar.clickOnAssignment()
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0)
    })

    it(" > marking 'Not Started' student as submitted and verify", () => {
      // verify submitted count before submit
      lcb.verifySubmittedCount(studentSubittedCount, stuCount)
      // submit the student
      lcb.selectCheckBoxByStudentName(submitStudent[1].stuName)
      lcb.clickOnMarkAsSubmit()

      // verify submitted count after submit
      lcb.verifySubmittedCount(2, stuCount)
      // verify student card after submit
      lcb.verifyStudentCard(
        submitStudent[1].stuName,
        studentSide.GRADED,
        '0 / 2',
        '0%',
        {
          Q1: 'skip',
        },
        submitStudent[1].email
      )

      // verify assignment page counts
      teacherSidebar.clickOnAssignment()
      authorAssignmentPage.verifyStatus(teacherSide.IN_PROGRESS)
      authorAssignmentPage.verifySubmitted(`2 of ${studentAssignList.length}`)
      authorAssignmentPage.verifyGraded('2')

      // verify student side assignment entry
      cy.login('student', submitStudent[1].email, password)
      test.assignmentPage.verifyNoAssignments()
      test.assignmentPage.sidebar.clickOnGrades()
      gradesPage.validateAssignment(
        assignmentName,
        studentSide.GRADED,
        'REVIEW'
      )
    })

    it(" > marking 'In Progress' student as submitted and verify", () => {
      // submit the student
      lcb.selectCheckBoxByStudentName(submitStudent[2].stuName)
      lcb.clickOnMarkAsSubmit()

      // verify submitted count after submit
      lcb.verifySubmittedCount(studentSubittedCount + 2, stuCount)
      // verify student card after submit
      lcb.verifyStudentCard(
        submitStudent[2].stuName,
        studentSide.GRADED,
        '0 / 2',
        '0%',
        {
          Q1: 'wrong',
        },
        submitStudent[2].email
      )

      // verify assignment page counts
      teacherSidebar.clickOnAssignment()
      authorAssignmentPage.verifyStatus(teacherSide.IN_PROGRESS)
      authorAssignmentPage.verifySubmitted(`3 of ${studentAssignList.length}`)
      authorAssignmentPage.verifyGraded('3')

      // verify student side assignment entry
      cy.login('student', submitStudent[2].email, password)
      test.assignmentPage.verifyNoAssignments()
      test.assignmentPage.sidebar.clickOnGrades()
      gradesPage.validateAssignment(
        assignmentName,
        studentSide.GRADED,
        'REVIEW'
      )
    })
  })

  describe('remove student', () => {
    before('login as teacher', () => {
      cy.login('teacher', teacher, password)
      teacherSidebar.clickOnAssignment()
    })

    it(' > verifying counts on assignement page', () => {
      // verify assignment page counts
      authorAssignmentPage.verifyStatus(teacherSide.IN_PROGRESS)
      authorAssignmentPage.verifySubmitted(`3 of ${studentAssignList.length}`)
      authorAssignmentPage.verifyGraded('3')
    })

    it(" > removing 'Graded' student verify", () => {
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0)
      // select graded student
      lcb.selectCheckBoxByStudentName(removeStudent[1].stuName)
      // click on Remove and assert
      lcb.clickOnRemove(false)
    })

    it(" > removing 'Graded'+'In progress' student verify", () => {
      // select graded student
      lcb.selectCheckBoxByStudentName(removeStudent[1].stuName)
      // select inprogress student
      lcb.selectCheckBoxByStudentName(removeStudent[2].stuName)
      // click on Remove and assert
      lcb.clickOnRemove(false)
    })

    it(" > removing 'In progress' student verify", () => {
      cy.login('teacher', teacher, password)
      teacherSidebar.clickOnAssignment()
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0)
      // select inprogress student
      lcb.selectCheckBoxByStudentName(removeStudent[2].stuName)
      // click on Remove and assert
      lcb.clickOnRemove(false, true)
      /*    // assert student card should not be present
      lcb
        .getStudentCardByStudentName(removeStudent[2].stuName)
        .should(
          'not.be.visible',
          'after removing student student card should not be present'
        )
      // assert total student count
      lcb
        .getSubmitSummary()
        .should(
          'contain.text',
          `${--stuCount} Submitted`,
          "after remove 'In progress' student total student count should change"
        )

      // verify student side assignment entry
      cy.login('student', removeStudent[2].email, password)
      test.assignmentPage.getAssignmentButton().should('not.be.visible') */
    })

    context("> removing 'Not Started' student", () => {
      it(' > Go to lcb and remove student', () => {
        cy.login('teacher', teacher, password)
        teacherSidebar.clickOnAssignment()
        authorAssignmentPage.clcikOnPresenatationIconByIndex(0)
        // select inprogress student
        lcb.selectCheckBoxByStudentName(removeStudent[3].stuName)
        // click on Remove and assert
        lcb.clickOnRemove()
        // assert student card should not be present
        lcb
          .getStudentCardByStudentName(removeStudent[3].stuName)
          .should(
            'not.be.visible',
            'after removing student student card should not be present'
          )
        // assert total student count
        lcb
          .getSubmitSummary()
          .should(
            'contain.text',
            `${--stuCount} Submitted`,
            "after remove 'Not Started' student total student count should change"
          )

        lcb.verifyStudentCardCount(stuCount)
      })

      it(" > toggle off 'show active student' and verify card entry", () => {
        // toggle the view and verify
        lcb.disableShowActiveStudents()

        // verify student card after remove
        lcb.verifyStudentCard(
          removeStudent[3].stuName,
          studentSide.UNASSIGNED,
          '0 / 2',
          '0%',
          {
            Q1: 'noattempt',
          },
          removeStudent[3].email
        )
      })

      it(' > verify assignment page counts', () => {
        // verify assignment page counts
        teacherSidebar.clickOnAssignment()
        authorAssignmentPage.verifyStatus(teacherSide.IN_PROGRESS)
        authorAssignmentPage.verifySubmitted(`3 of ${stuCount}`)
        authorAssignmentPage.verifyGraded('3')
      })

      // verify student side assignment entry
      it(' > verify student side assignment & grades page entry', () => {
        cy.login('student', removeStudent[3].email, password)
        test.assignmentPage.verifyNoAssignments()
        test.assignmentPage.sidebar.clickOnGrades(false)
      })

      it(' > adding back the previously removed user(not-started) and verify lcb', () => {
        cy.login('teacher', teacher, password)
        teacherSidebar.clickOnAssignment()

        authorAssignmentPage.verifyStatus(teacherSide.IN_PROGRESS)
        authorAssignmentPage.verifySubmitted(`3 of ${stuCount}`)
        authorAssignmentPage.verifyGraded('3')

        authorAssignmentPage.clcikOnPresenatationIconByIndex(0)
        lcb.addOneStudent(removeStudent[3].email)

        // LCB status doesn't change, needs navigation away
        lcb.header.clickOnExpressGraderTab()
        lcb.header.clickOnLCBTab()

        // verify student card
        lcb.verifyStudentCard(
          removeStudent[3].stuName,
          studentSide.NOT_STARTED,
          '0 / 2',
          '0%',
          {
            Q1: 'noattempt',
          },
          removeStudent[3].email
        )

        // assert total student count
        lcb
          .getSubmitSummary()
          .should(
            'contain.text',
            `${++stuCount} Submitted`,
            'after adding student total student count should change'
          )

        // verify assignment page counts
        teacherSidebar.clickOnAssignment()
        authorAssignmentPage.verifyStatus(teacherSide.IN_PROGRESS)
        authorAssignmentPage.verifySubmitted(`3 of ${stuCount}`)
        authorAssignmentPage.verifyGraded('3')
      })

      // verify student side assignment entry after
      it(' > verify student side, after adding back previously removed user(absent)', () => {
        cy.login('student', removeStudent[3].email, password)
        test.assignmentPage.getAssignmentButton().should('be.visible')
      })
    })

    context("> removing 'Absent' student", () => {
      it(' > Go to lcb and remove student', () => {
        cy.login('teacher', teacher, password)
        teacherSidebar.clickOnAssignment()
        authorAssignmentPage.clcikOnPresenatationIconByIndex(0)
        // select inprogress student
        lcb.selectCheckBoxByStudentName(absentStudent[1].stuName)
        // click on Remove and assert
        lcb.clickOnRemove()
        // assert student card should not be present
        lcb
          .getStudentCardByStudentName(absentStudent[1].stuName)
          .should(
            'not.be.visible',
            'after removing student student card should not be present'
          )
        // assert total student count
        lcb
          .getSubmitSummary()
          .should(
            'contain.text',
            `${--stuCount} Submitted`,
            "after remove 'Not Started' student total student count should change"
          )

        lcb.verifyStudentCardCount(stuCount)
      })

      it(" > toggle off 'show active student' and verify card entry", () => {
        // toggle the view and verify
        lcb.disableShowActiveStudents()

        // verify student card after remove
        lcb.verifyStudentCard(
          absentStudent[1].stuName,
          studentSide.UNASSIGNED,
          '0 / 2',
          '0%',
          {
            Q1: 'noattempt',
          },
          absentStudent[1].email
        )
      })

      it(' > verify assignment page counts', () => {
        // verify assignment page counts
        teacherSidebar.clickOnAssignment()
        authorAssignmentPage.verifyStatus(teacherSide.IN_PROGRESS)
        authorAssignmentPage.verifySubmitted(`3 of ${stuCount}`)
        authorAssignmentPage.verifyGraded('3')
      })

      // verify student side assignment entry
      it(' > verify student side assignment & grades page entry', () => {
        cy.login('student', absentStudent[1].email, password)
        test.assignmentPage.verifyNoAssignments()
        test.assignmentPage.sidebar.clickOnGrades(false)
      })

      it(' > adding back the previously removed user(absent) and verify lcb', () => {
        cy.login('teacher', teacher, password)
        teacherSidebar.clickOnAssignment()

        authorAssignmentPage.verifyStatus(teacherSide.IN_PROGRESS)
        authorAssignmentPage.verifySubmitted(`3 of ${stuCount}`)
        authorAssignmentPage.verifyGraded('3')

        authorAssignmentPage.clcikOnPresenatationIconByIndex(0)
        lcb.addOneStudent(absentStudent[1].email)

        // LCB status doesn't change, needs navigation away
        lcb.header.clickOnExpressGraderTab()
        lcb.header.clickOnLCBTab()

        // assert student card should be present
        // verify student card
        lcb.verifyStudentCard(
          absentStudent[1].stuName,
          studentSide.ABSENT,
          '0 / 2',
          '0%',
          {
            Q1: 'noattempt',
          },
          absentStudent[1].email
        )

        // assert total student count
        lcb
          .getSubmitSummary()
          .should(
            'contain.text',
            `${++stuCount} Submitted`,
            'after adding student total student count should change'
          )

        // verify assignment page counts
        teacherSidebar.clickOnAssignment()
        authorAssignmentPage.verifyStatus(teacherSide.IN_PROGRESS)
        authorAssignmentPage.verifySubmitted(`3 of ${stuCount}`)
        authorAssignmentPage.verifyGraded('3')
      })

      // verify student side assignment entry after
      it(' > verify student side, after adding back previously removed user(absent)', () => {
        cy.login('student', absentStudent[1].email, password)
        test.assignmentPage.verifyNoAssignments()
        test.assignmentPage.sidebar.clickOnGrades()
        gradesPage.validateAssignment(assignmentName, studentSide.ABSENT, false)
      })
    })
  })

  describe('add student', () => {
    before('login as teacher', () => {
      cy.deleteAllAssignments(student, teacher, password)
      cy.login('teacher', teacher, password)
      teacherSidebar.clickOnTestLibrary()
      testLibrary.searchFilters.clearAll()
      testLibrary.searchFilters.typeInSearchBox(testId)
      testLibrary.clickOnTestCardById(testId)
      testLibrary.clickOnDetailsOfCard()
      testLibrary.header.clickOnAssign()
      // assign to specific students
      testLibrary.assignPage.selectClass(className)
      // testLibrary.assignPage.clickOnSpecificStudent();
      testLibrary.assignPage.selectStudent(students[1].stuName)
      testLibrary.assignPage.selectOpenPolicy(openPolicyTypes.MANUAL)
      testLibrary.assignPage.clickOnAssign()
      teacherSidebar.clickOnAssignment()
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0)
    })

    it(' > existing student should be disabled', () => {
      lcb.addOneStudent(students[1].email, false)
    })

    it(' > add new student and verify, when assignment is in - Not Open state', () => {
      cy.login('teacher', teacher, password)
      teacherSidebar.clickOnAssignment()
      // verify assignment page counts
      authorAssignmentPage.verifyStatus(teacherSide.NOT_OPEN)
      authorAssignmentPage.verifySubmitted(`0 of ${addStuCount}`)
      authorAssignmentPage.verifyGraded('0')

      authorAssignmentPage.clcikOnPresenatationIconByIndex(0)
      lcb.addOneStudent(students[2].email)

      lcb.header.clickOnExpressGraderTab()
      lcb.header.clickOnLCBTab()

      // assert student card should be present
      lcb
        .getStudentCardByStudentName(students[2].stuName)
        .should(
          'be.visible',
          'after adding student student card should be present'
        )
      lcb
        .getStudentStatusByIndex(1)
        .should('have.text', studentSide.NOT_STARTED)
      // assert total student count
      lcb
        .getSubmitSummary()
        .should(
          'contain.text',
          `${++addStuCount} Submitted`,
          'after adding student total student count should change'
        )

      // verify assignment page counts
      teacherSidebar.clickOnAssignment()
      authorAssignmentPage.verifyStatus(teacherSide.NOT_OPEN)
      authorAssignmentPage.verifySubmitted(`0 of ${addStuCount}`)
      authorAssignmentPage.verifyGraded('0')

      // NOT OPEN assingment should not be listed at student side now
      cy.login('student', students[2].email, password)
      // test.assignmentPage.verifyAssignmentIslocked()
      test.assignmentPage.verifyNoAssignments()
      test.assignmentPage.sidebar.clickOnGrades(false)

      // open the assingment and verify
      cy.login('teacher', teacher, password)
      teacherSidebar.clickOnAssignment()
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0)
      lcb.getStudentCardByStudentName(students[2].stuName).should('be.visible')
      lcb.header.clickOnOpen()

      // LCB status doesn't change, needs navigation away
      lcb.header.clickOnExpressGraderTab()
      lcb.header.clickOnLCBTab()

      lcb.header.verifyAssignmentStatus(teacherSide.IN_PROGRESS)

      // verify assignment page counts
      teacherSidebar.clickOnAssignment()
      authorAssignmentPage.verifyStatus(teacherSide.IN_PROGRESS)
      authorAssignmentPage.verifySubmitted(`0 of ${addStuCount}`)
      authorAssignmentPage.verifyGraded('0')

      // verify at student side
      cy.login('student', students[2].email, password)
      test.assignmentPage.getAssignmentButton().should('be.visible')
    })

    it(' > add new student and verify, when assignment is in - In Progress state', () => {
      cy.login('teacher', teacher, password)
      teacherSidebar.clickOnAssignment()
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0)
      lcb.header.verifyAssignmentStatus(teacherSide.IN_PROGRESS)
      lcb.addOneStudent(students[3].email)

      // LCB status doesn't change, needs navigation away
      lcb.header.clickOnExpressGraderTab()
      lcb.header.clickOnLCBTab()

      // assert student card should be present
      lcb
        .getStudentCardByStudentName(students[3].stuName)
        .should(
          'be.visible',
          'after adding student student card should be present'
        )
      lcb
        .getStudentStatusByIndex(2)
        .should('have.text', studentSide.NOT_STARTED)
      // assert total student count
      lcb
        .getSubmitSummary()
        .should(
          'contain.text',
          `${++addStuCount} Submitted`,
          'after adding student total student count should change'
        )

      // verify assignment page counts
      teacherSidebar.clickOnAssignment()
      authorAssignmentPage.verifyStatus(teacherSide.IN_PROGRESS)
      authorAssignmentPage.verifySubmitted(`0 of ${addStuCount}`)
      authorAssignmentPage.verifyGraded('0')

      // verify student side assignment entry
      cy.login('student', students[3].email, password)
      test.assignmentPage.getAssignmentButton().should('be.visible')
    })

    it(' > add new student and verify, when assignment is in - In Grading state', () => {
      cy.login('teacher', teacher, password)
      teacherSidebar.clickOnAssignment()
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0)
      lcb.header.verifyAssignmentStatus(teacherSide.IN_PROGRESS)
      lcb.checkSelectAllCheckboxOfStudent()
      lcb.clickOnMarkAsSubmit()

      // LCB status doesn't change, needs navigation away
      lcb.header.clickOnExpressGraderTab()
      lcb.header.clickOnLCBTab()

      lcb.header.verifyAssignmentStatus(teacherSide.IN_GRADING)
      lcb.addOneStudent(students[4].email)

      // LCB status doesn't change, needs navigation away
      lcb.header.clickOnExpressGraderTab()
      lcb.header.clickOnLCBTab()

      lcb.header.verifyAssignmentStatus(teacherSide.IN_PROGRESS)
      // assert student card should be present
      lcb
        .getStudentCardByStudentName(students[4].stuName)
        .should(
          'be.visible',
          'after adding student student card should be present'
        )
      lcb
        .getStudentStatusByIndex(3)
        .should('have.text', studentSide.NOT_STARTED)
      // assert total student count
      lcb
        .getSubmitSummary()
        .should(
          'contain.text',
          `${++addStuCount} Submitted`,
          'after adding student total student count should change'
        )

      // verify assignment page counts
      teacherSidebar.clickOnAssignment()
      authorAssignmentPage.verifyStatus(teacherSide.IN_PROGRESS)
      authorAssignmentPage.verifySubmitted(`3 of ${addStuCount}`)
      authorAssignmentPage.verifyGraded('3')

      // verify student side assignment entry
      cy.login('student', students[4].email, password)
      test.assignmentPage.getAssignmentButton().should('be.visible')
    })
    it(' > add new student and verify, when assignment is in - In Done state', () => {
      cy.login('teacher', teacher, password)
      teacherSidebar.clickOnAssignment()
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0)
      lcb.header.verifyAssignmentStatus(teacherSide.IN_PROGRESS)
      lcb.selectCheckBoxByStudentName(students[4].stuName)
      lcb.clickOnMarkAsSubmit()
      teacherSidebar.clickOnAssignment()
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0)
      lcb.header.clickOnExpressGraderTab()
      lcb.header.clickOnLCBTab()
      lcb.header.clickOnMarkAsDone()

      // LCB status doesn't change, needs navigation away
      lcb.header.clickOnExpressGraderTab()
      lcb.header.clickOnLCBTab()

      lcb.header.verifyAssignmentStatus(teacherSide.DONE)
      lcb.addOneStudent(students[5].email)

      // LCB status doesn't change, needs navigation away
      lcb.header.clickOnExpressGraderTab()
      lcb.header.clickOnLCBTab()

      lcb.header.verifyAssignmentStatus(teacherSide.IN_PROGRESS)
      // assert student card should be present
      lcb
        .getStudentCardByStudentName(students[5].stuName)
        .should(
          'be.visible',
          'after adding student student card should be present'
        )
      lcb
        .getStudentStatusByIndex(4)
        .should('have.text', studentSide.NOT_STARTED)
      // assert total student count
      lcb
        .getSubmitSummary()
        .should(
          'contain.text',
          `${++addStuCount} Submitted`,
          'after adding student total student count should change'
        )

      // verify assignment page counts
      teacherSidebar.clickOnAssignment()
      authorAssignmentPage.verifyStatus(teacherSide.IN_PROGRESS)
      authorAssignmentPage.verifySubmitted(`4 of ${addStuCount}`)
      authorAssignmentPage.verifyGraded('4')

      // verify student side assignment entry
      cy.login('student', students[5].email, password)
      test.assignmentPage.getAssignmentButton().should('be.visible')
    })
  })
})
