/* eslint-disable no-shadow */
import TestLibrary from '../../../../framework/author/tests/testLibraryPage'
import ItemListPage from '../../../../framework/author/itemList/itemListPage'
import GroupItemsPage from '../../../../framework/author/tests/testDetail/groupItemsPage'
import FileHelper from '../../../../framework/util/fileHelper'
import AuthorAssignmentPage from '../../../../framework/author/assignments/AuthorAssignmentPage'
import LiveClassboardPage from '../../../../framework/author/assignments/LiveClassboardPage'
import AssignmentsPage from '../../../../framework/student/assignmentsPage'
import StudentTestPage from '../../../../framework/student/studentTestPage'
import {
  attemptTypes,
  deliverType as DELIVERY_TYPE,
  CUSTOM_COLLECTIONS,
} from '../../../../framework/constants/questionTypes'
import CypressHelper from '../../../../framework/util/cypressHelpers'
import StandardBasedReportPage from '../../../../framework/author/assignments/standardBasedReportPage'
import { redirectType } from '../../../../framework/constants/assignmentStatus'

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> item groups`, () => {
  const testLibraryPage = new TestLibrary()
  const groupItemsPage = new GroupItemsPage()
  const item = new ItemListPage()
  const authorAssignPage = new AuthorAssignmentPage()
  const lcb = new LiveClassboardPage()
  const studentAssignment = new AssignmentsPage()
  const studentTestPage = new StudentTestPage()
  const sbr = new StandardBasedReportPage()

  const collection = 'auto collection 1'
  const testData = {
    name: 'Test Item Group',
    grade: 'Kindergarten',
    subject: 'Math',
    collections: collection,
  }

  const filterForAutoselect1 = {
    standard: {
      subject: 'Mathematics',
      standardSet: 'Math - Common Core',
      grade: ['Kindergarten'],
      standardsToSelect: ['K.CC.A.1'],
    },
    collection,
    deliveryCount: 1,
  }
  const filterForAutoselect2 = {
    standard: {
      subject: 'Mathematics',
      standardSet: 'Math - Common Core',
      grade: ['Kindergarten'],
      standardsToSelect: ['K.CC.A.2'],
    },
    collection,
    deliveryCount: 1,
  }

  const deliveredArray = [[], []]
  const redirected = [[], []]
  const message = [
    '-Expected items to be delivered in same order for  both students-',
    '-Expected items to be delivered in different order for  both students-',
  ]
  const queText = ' - This is MCQ_TF'
  const quesType = 'MCQ_TF'
  let queNum

  const contEditor = {
    email: 'content.editor.1@snapwiz.com',
    pass: 'snapwiz',
  }
  const Teacher = {
    email: 'teacher.auto.test@snapwiz.com',
    pass: 'snapwiz',
  }

  const students = [
    {
      name: 'Student1',
      email: 'student1.delivery.auto@snapwiz.com',
      pass: 'snapwiz',
    },
    {
      name: 'Student2',
      email: 'student2.delivery.auto@snapwiz.com',
      pass: 'snapwiz',
    },
  ]

  const attemptByQuestion = {
    1: attemptTypes.RIGHT,
    2: attemptTypes.WRONG,
    3: attemptTypes.RIGHT,
    4: attemptTypes.WRONG,
    5: attemptTypes.RIGHT,
    6: attemptTypes.WRONG,
    7: attemptTypes.WRONG,
    8: attemptTypes.RIGHT,
  }
  const attempData = { right: 'right', wrong: 'wrong' }

  let groups = {}
  /* auto collection 1 */
  const items = [
    'MCQ_TF.5',
    'MCQ_TF.5',
    'MCQ_TF.5',
    'MCQ_TF.5',
    'MCQ_TF.6',
    'MCQ_TF.6',
    'MCQ_TF.6',
    'MCQ_TF.6',
  ]
  const itemIds = []
  let testID
  const collectionid = CUSTOM_COLLECTIONS.AUTO_COLLECTION_1

  before('Login and create new items', () => {
    cy.getAllTestsAndDelete(contEditor.email, contEditor.pass, undefined, {
      collections: [collectionid],
    })
    cy.getAllItemsAndDelete(contEditor.email, contEditor.pass, undefined, {
      collections: [collectionid],
    })
    cy.login('publisher', contEditor.email, contEditor.pass)
    items.forEach((itemToCreate, index) => {
      item.createItem(itemToCreate, index).then((id) => {
        itemIds.push(id)
      })
    })
  })

  context('> dynamic tests having,', () => {
    context('> having two dynamic groups', () => {
      before('> login as CE', () => {
        groups = { 1: {}, 2: {} }
        groups[1].items = itemIds.slice(0, 4)
        groups[1].deliveryCount = filterForAutoselect1.deliveryCount
        groups[1].deliverType = DELIVERY_TYPE.ALL_RANDOM
        groups[2].items = itemIds.slice(4)
        groups[2].deliveryCount = filterForAutoselect2.deliveryCount
        groups[2].deliverType = DELIVERY_TYPE.ALL_RANDOM
        cy.deleteAllAssignments('', Teacher.email)
        cy.login('publisher', contEditor.email, contEditor.pass)
      })
      before('> create test fill details and associate collection', () => {
        testLibraryPage.createNewTestAndFillDetails(testData)
      })
      it('> create dynamic group-1', () => {
        testLibraryPage.testSummary.header.clickOnAddItems()
        testLibraryPage.testAddItem.clickOnGroupItem()
        groupItemsPage.createDynamicTest(1, filterForAutoselect1)
      })
      it('> create dynamic group-2', () => {
        groupItemsPage.clickOnAddGroup()
        groupItemsPage.createDynamicTest(2, filterForAutoselect2)
        cy.server()
        cy.route('POST', '**api/test').as('createTest')
        testLibraryPage.testAddItem.header.clickOnReview()
        cy.wait('@createTest').then((xhr) => {
          testLibraryPage.saveTestId(xhr)
          testID = xhr.response.body.result._id
        })
        testLibraryPage.review.testheader.clickOnPublishButton()
      })
      it(`> login as teacher find test using ${testData.collections}`, () => {
        cy.login('teacher', Teacher.email, Teacher.pass)
        testLibraryPage.sidebar.clickOnTestLibrary()
        testLibraryPage.searchFilters.clearAll()
        testLibraryPage.searchFilters.setCollection(testData.collections)
        testLibraryPage.clickOnTestCardById(testID)
        testLibraryPage.clickOnDetailsOfCard()
      })
      it('> verify test review at teacher side', () => {
        testLibraryPage.review.verifyItemCoutByGroupInPublisherPreview(
          filterForAutoselect1.deliveryCount,
          1,
          filterForAutoselect1.deliveryCount
        )
        testLibraryPage.review.verifyItemCoutByGroupInPublisherPreview(
          filterForAutoselect2.deliveryCount,
          2,
          filterForAutoselect2.deliveryCount
        )
        testLibraryPage.review.verifyItemIdsByGroupIndex(groups[1].items, 1)
        testLibraryPage.review.verifyItemIdsByGroupIndex(groups[2].items, 2)
      })
      it('> assign the test', () => {
        testLibraryPage.assignPage.visitAssignPageById(testID)
        testLibraryPage.assignPage.selectClass('class')
        testLibraryPage.assignPage.clickOnAssign()
      })
      it('> login as each student attempt and verify item delivered sequence', () => {
        students.forEach((student, index) => {
          cy.login('student', student.email, student.pass)
          // Response Verification
          studentAssignment
            .clickOnAssigmentByTestId(testID)
            .then((groupArray) => {
              deliveredArray[index] = groupItemsPage.getItemDeliverySeq(
                groupArray,
                groups
              )
              // UI Verification
              deliveredArray[index].forEach((item) => {
                queNum = itemIds.indexOf(item) + 1
                studentTestPage
                  .getQuestionText()
                  .should('contain', `Q${queNum}${queText}`)
                studentTestPage.attemptQuestion(
                  quesType,
                  attemptByQuestion[queNum],
                  attempData
                )
                studentTestPage.clickOnNext()
              })
              studentTestPage.submitTest()
            })
        })
        cy.wait(1).then(() =>
          CypressHelper.checkObjectInEquality(
            deliveredArray[0],
            deliveredArray[1],
            message[1]
          )
        )
      })
      it('> login as teacher verify item sequence for each student in lcb', () => {
        cy.login('teacher', Teacher.email, Teacher.pass)
        testLibraryPage.sidebar.clickOnAssignment()
        authorAssignPage.clcikOnPresenatationIconByIndex(0)
        lcb.clickOnStudentsTab()
        // UI Verification
        students.forEach((student, index) => {
          lcb.questionResponsePage.selectStudent(student.name)
          deliveredArray[index].forEach((item, ind) => {
            queNum = itemIds.indexOf(item) + 1
            lcb.questionResponsePage
              .getQuestionContainer(ind)
              .should('contain', `Q${queNum}${queText}`)
          })
        })

        lcb.getQuestionsTab().should('have.attr', 'disabled', `disabled`)
        lcb.header
          .getExpressGraderTab()
          .should('have.attr', 'disabled', `disabled`)

        lcb.header.clickOnStandardBasedReportTab()
        sbr.getTableHeaderElements().should('have.length', 4)
      })
      context('>redirect', () => {
        it('>redirect the test', () => {
          sbr.header.clickOnLCBTab()
          lcb.clickOnCardViewTab()
          lcb.checkSelectAllCheckboxOfStudent()
          lcb.clickOnRedirect()
          lcb.redirectPopup.selectRedirectPolicy(redirectType.FEEDBACK_ONLY)
          lcb.clickOnRedirectSubmit()
        })
        it('> login as each student attempt and verify item delivered sequence for redirected test', () => {
          students.forEach((student, index) => {
            if (index === 0) {
              cy.login('student', student.email, student.pass)
              // Response Verification
              studentAssignment
                .clickOnAssigmentByTestId(testID, { isFirstAttempt: false })
                .then((groupArray) => {
                  redirected[index] = groupItemsPage.getItemDeliverySeq(
                    groupArray,
                    groups
                  )
                  // UI Verification
                  redirected[index].forEach((item) => {
                    queNum = itemIds.indexOf(item) + 1
                    studentTestPage
                      .getQuestionText()
                      .should('contain', `Q${queNum}${queText}`)
                    studentTestPage.attemptQuestion(
                      quesType,
                      attemptByQuestion[queNum],
                      attempData
                    )
                    studentTestPage.clickOnNext()
                  })
                  studentTestPage.submitTest()
                })
            }
          })
          cy.wait(1).then(() => {
            CypressHelper.checkObjectEquality(
              redirected[0],
              deliveredArray[0],
              students[0].name
            )
            //  CypressHelper.checkObjectEquality(redirected[1], deliveredArray[1], students[1].name);
          })
        })
        it('> login as teacher verify item sequence for each student in lcb for redirected test', () => {
          cy.login('teacher', Teacher.email, Teacher.pass)
          testLibraryPage.sidebar.clickOnAssignment()
          authorAssignPage.clcikOnPresenatationIconByIndex(0)
          lcb.clickOnStudentsTab()
          // UI Verification
          students.forEach((student, index) => {
            if (index === 0) {
              lcb.questionResponsePage.selectStudent(student.name)
              for (let i = 1; i <= 2; i++) {
                lcb.questionResponsePage.selectAttempt(i)
                // eslint-disable-next-line no-loop-func
                deliveredArray[index].forEach((item, ind) => {
                  queNum = itemIds.indexOf(item) + 1
                  lcb.questionResponsePage
                    .getQuestionContainer(ind)
                    .should('contain', `Q${queNum}${queText}`)
                })
              }
            }
          })
          lcb.getQuestionsTab().should('have.attr', 'disabled', `disabled`)
          lcb.header
            .getExpressGraderTab()
            .should('have.attr', 'disabled', `disabled`)

          lcb.header.clickOnStandardBasedReportTab()
          sbr.getTableHeaderElements().should('have.length', 4)
        })
      })
    })
    context('> having one static and one dynamic group', () => {
      before('> login as CE', () => {
        groups = { 1: {}, 2: {} }
        groups[2].items = itemIds.slice(0, 4)
        groups[2].deliveryCount = groups[2].items.length
        groups[2].deliverType = DELIVERY_TYPE.ALL
        groups[1].items = itemIds.slice(4)
        groups[1].deliveryCount = filterForAutoselect2.deliveryCount
        groups[1].deliverType = DELIVERY_TYPE.ALL_RANDOM
        cy.deleteAllAssignments('', Teacher.email)
        cy.login('publisher', contEditor.email, contEditor.pass)
      })
      before('> create test fill details and associate collection', () => {
        testLibraryPage.createNewTestAndFillDetails(testData)
      })

      it('> create one dynamic group', () => {
        testLibraryPage.header.clickOnAddItems()
        testLibraryPage.testAddItem.clickOnGroupItem()
        groupItemsPage.createDynamicTest(1, filterForAutoselect2)
        cy.server()
        cy.route('POST', '**api/test').as('createTest')
        testLibraryPage.testAddItem.header.clickOnReview()
        cy.wait('@createTest').then((xhr) => {
          testLibraryPage.saveTestId(xhr)
          testID = xhr.response.body.result._id
        })
      })
      it("> create one static group with 'deliver by count'", () => {
        testLibraryPage.testAddItem.clickOnGroupItem()
        groupItemsPage.clickOnAddGroup()
        groupItemsPage.addItemsToGroup(groups[2].items, false)
        testLibraryPage.testAddItem.clickOnGroupItem()
        groupItemsPage.clickOnEditByGroup(2)
        groupItemsPage.checkDeliverAllItemForGroup(2)
        groupItemsPage.clickOnSaveByGroup(2)
        testLibraryPage.testAddItem.header.clickOnReview()
        testLibraryPage.review.testheader.clickOnPublishButton()
      })
      it(`> login as teacher find test using ${testData.collections}`, () => {
        cy.login('teacher', Teacher.email, Teacher.pass)
        testLibraryPage.sidebar.clickOnTestLibrary()
        testLibraryPage.searchFilters.clearAll()
        testLibraryPage.searchFilters.setCollection(testData.collections)
        testLibraryPage.clickOnTestCardById(testID)
        testLibraryPage.clickOnDetailsOfCard()
      })
      it('> verify test review at teacher side', () => {
        testLibraryPage.review.verifyItemCoutByGroupInPublisherPreview(
          filterForAutoselect1.deliveryCount,
          1,
          filterForAutoselect1.deliveryCount
        )
        testLibraryPage.review.verifyItemCoutByGroupInPublisherPreview(
          groups[2].items.length,
          2,
          groups[2].items.length
        )
        testLibraryPage.review.verifyItemIdsByGroupIndex(groups[1].items, 1)
        testLibraryPage.review.verifyItemIdsByGroupIndex(groups[2].items, 2)
      })
      it('> assign the test', () => {
        testLibraryPage.assignPage.visitAssignPageById(testID)
        testLibraryPage.assignPage.selectClass('class')
        testLibraryPage.assignPage.clickOnAssign()
      })
      it('> login as each student attempt and verify item delivered sequence', () => {
        students.forEach((student, index) => {
          cy.login('student', student.email, student.pass)
          // Response Verification
          studentAssignment
            .clickOnAssigmentByTestId(testID)
            .then((groupArray) => {
              deliveredArray[index] = groupItemsPage.getItemDeliverySeq(
                groupArray,
                groups
              )
              // UI Verification
              deliveredArray[index].forEach((item) => {
                queNum = itemIds.indexOf(item) + 1
                studentTestPage
                  .getQuestionText()
                  .should('contain', `Q${queNum}${queText}`)
                studentTestPage.attemptQuestion(
                  quesType,
                  attemptByQuestion[queNum],
                  attempData
                )
                studentTestPage.clickOnNext()
              })
              studentTestPage.submitTest()
            })
        })
        cy.wait(1).then(() => {
          CypressHelper.checkObjectInEquality(
            deliveredArray[0],
            deliveredArray[1],
            message[1]
          )
          CypressHelper.checkObjectEquality(
            deliveredArray[0].slice(filterForAutoselect2.deliveryCount),
            deliveredArray[1].slice(filterForAutoselect2.deliveryCount),
            message[0]
          )
        })
      })
      it('> login as teacher verify item sequence for each student in lcb', () => {
        cy.login('teacher', Teacher.email, Teacher.pass)
        testLibraryPage.sidebar.clickOnAssignment()
        authorAssignPage.clcikOnPresenatationIconByIndex(0)
        lcb.clickOnStudentsTab()
        // UI Verification
        students.forEach((student, index) => {
          lcb.questionResponsePage.selectStudent(student.name)
          deliveredArray[index].forEach((item, ind) => {
            queNum = itemIds.indexOf(item) + 1
            lcb.questionResponsePage
              .getQuestionContainer(ind)
              .should('contain', `Q${queNum}${queText}`)
          })
        })

        lcb.getQuestionsTab().should('have.attr', 'disabled', `disabled`)
        lcb.header
          .getExpressGraderTab()
          .should('have.attr', 'disabled', `disabled`)

        lcb.header.clickOnStandardBasedReportTab()
        sbr.getTableHeaderElements().should('have.length', 4)
      })
    })
  })
})
