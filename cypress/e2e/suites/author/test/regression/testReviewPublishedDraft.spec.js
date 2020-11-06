import TestLibrary from '../../../../framework/author/tests/testLibraryPage'
import StudentTestPage from '../../../../framework/student/studentTestPage'
import {
  attemptTypes,
  COLLECTION,
  questionTypeKey,
} from '../../../../framework/constants/questionTypes'
import FileHelper from '../../../../framework/util/fileHelper'
import LiveClassboardPage from '../../../../framework/author/assignments/LiveClassboardPage'
import ItemListPage from '../../../../framework/author/itemList/itemListPage'
import { studentSide } from '../../../../framework/constants/assignmentStatus'
import StudentsReportCard from '../../../../framework/author/assignments/studentPdfReportCard'

const TEST = 'TEST_PREVIEW_1'
const testData = require('../../../../../fixtures/testAuthoring')
const quesData = require('../../../../../fixtures/questionAuthoring')

const testName = testData[TEST].name
const ITEMS = testData[TEST].itemKeys
const grades = testData[TEST].grade
const subjects = testData[TEST].subject

const itemsInTest = []
const { _ } = Cypress
ITEMS.forEach((ele) => {
  itemsInTest.push(ele.split('.')[0])
})

describe(`${FileHelper.getSpecName(
  Cypress.spec.name
)} >> Reviewing Test In Test Review Tab`, () => {
  const testLibraryPage = new TestLibrary()
  const studentTestPage = new StudentTestPage()
  const lcb = new LiveClassboardPage()
  const itemListPage = new ItemListPage()
  const pdfReport = new StudentsReportCard()

  let testId
  let itemIds = []
  const questText = []
  const questionTypeMap = {}
  const itemDetails = []
  const stuAttempt = [
    {
      stuName: 'student',
      attempt: {
        Q1: 'right',
        Q2: 'right',
        Q3: 'right',
        Q4: 'right',
        Q5: 'right',
        Q6: 'right',
      },
      status: studentSide.SUBMITTED,
    },
  ]

  lcb.getQuestionTypeMap(ITEMS, quesData, questionTypeMap)
  itemListPage.getItemsMetadata(ITEMS, itemDetails, quesData)
  const standardTableData = pdfReport.getStandardTableData({
    stuAttempt,
    questionTypeMap,
  })
  const totalPoints = _.values(questionTypeMap)
    .map(({ points: pointss }) => pointss)
    .reduce((a, b) => a + b, 0)
  const totalTestSbjects = Array.from(
    new Set([
      ...subjects,
      ...itemDetails.map(({ standards }) => standards.subject),
    ])
  )
  const totalTestGrades = Array.from(
    new Set([
      ...grades,
      ...itemDetails.map(({ standards }) => standards.grade[0]),
    ])
  )

  before('>get data of test and its items', () => {
    cy.fixture('questionAuthoring').then((questData) => {
      ITEMS.forEach((element) => {
        const [qType, num] = element.split('.')
        if (Array.isArray(questData[qType][num].quetext)) {
          questText.push(questData[qType][num].quetext[0])
        } else questText.push(questData[qType][num].quetext)
      })
    })
  })
  before('>login and create test', () => {
    cy.login('teacher', 'teacher.testreview@snapwiz.com', 'snapwiz')
    testLibraryPage.createTest(TEST, false).then((id) => {
      testId = id
      itemIds = testLibraryPage.items
    })
  })

  context('>review draft test', () => {
    context('> verify header action buttons', () => {
      it('> verify tabs and navigations', () => {
        testLibraryPage.header.verifyHeaders(true, true, true, true)
        testLibraryPage.header
          .getTestSummaryHeader()
          .should('not.have.css', 'cursor', 'not-allowed')
          .click({ force: true })
        testLibraryPage.testSummary.getTestGradeSelect().should('be.visible')
        testLibraryPage.header.verifyHeaderActionButtons(
          true,
          true,
          true,
          true,
          true,
          false
        )
        testLibraryPage.header
          .getTestAddItemHeader()
          .should('not.have.css', 'cursor', 'not-allowed')
          .click({ force: true })
        testLibraryPage.testAddItem.searchFilters
          .getSearchTextBox()
          .should('be.visible')
        testLibraryPage.header.verifyHeaderActionButtons(
          true,
          true,
          true,
          true,
          true,
          false
        )
        testLibraryPage.header
          .getTestSettingsHeader()
          .should('not.have.css', 'cursor', 'not-allowed')
          .click({ force: true })
        testLibraryPage.testSettings.getAnsOnPaperSwitch().should('exist')
        testLibraryPage.header.verifyHeaderActionButtons(
          true,
          true,
          true,
          true,
          true,
          false
        )
        testLibraryPage.header
          .getTestReviewHeader()
          .should('not.have.css', 'cursor', 'not-allowed')
          .click({ force: true })
        testLibraryPage.review.getTestSubjectSelect().should('be.visible')
        testLibraryPage.header.verifyHeaderActionButtons(
          true,
          true,
          true,
          true,
          true,
          false
        )
      })

      it('> verify print test pop-up', () => {
        testLibraryPage.header.clickPrintTest()
        testLibraryPage.header.verifyPrintCompleteTestInfo()
        testLibraryPage.header.verifyPrintPartialTestInfo()
        testLibraryPage.header.verifyPrintManualGradesInfo()
      })

      it('> verify share test pop-up', () => {
        testLibraryPage.closePopUp()
        testLibraryPage.header.clickOnShare()
        testLibraryPage.verifySharePopUp(true, testId)
        testLibraryPage.closePopUp()
      })
    })

    context('> verifying items in collapsed rows,', () => {
      before(`> get test card-${testName} and go-to review`, () => {
        testLibraryPage.closePopUp()
        testLibraryPage.visitTestById(testId)
      })
      itemsInTest.forEach((item, index) => {
        it(`> verify ${item}-${index + 1} question content and points`, () => {
          // Verify All questions' presence
          itemListPage.verifyQuestionTextByItemId(
            itemIds[index],
            questText[index]
          )
          testLibraryPage.review.asesrtPointsByid(
            itemIds[index],
            questionTypeMap[`Q${index + 1}`].points
          )
        })
        it(`> verify  ${item}-${index + 1} metadata`, () => {
          itemListPage.verifyItemMetadataByItemId(
            itemIds[index],
            itemDetails[index]
          )
        })

        it(`> verify  ${item}-${index + 1}, verify action buttons`, () => {
          testLibraryPage.review.verifyActionButtonsByItemId(
            itemIds[index],
            true
          )
        })
      })
    })
    context('> verifying items in expanded', () => {
      itemsInTest.forEach((item, index) => {
        it(`> verify  ${item}-${
          index + 1
        } correct ans, question text, points`, () => {
          // Verify All questions' presence along with thier correct answers and points

          testLibraryPage.review.clickExpandByItemId(itemIds[index])
          itemListPage.verifyQuestionTextByItemId(
            itemIds[index],
            questText[index]
          )
          testLibraryPage.review.verifyQustionById(itemIds[index])
          questionTypeMap[`Q${index + 1}`].attemptData.item = itemIds[index]
          itemListPage.itemPreview.verifyQuestionResponseCard(
            itemsInTest[index],
            questionTypeMap[`Q${index + 1}`].attemptData,
            attemptTypes.RIGHT,
            true
          )
          testLibraryPage.review.asesrtPointsByid(
            itemIds[index],
            questionTypeMap[`Q${index + 1}`].points
          )
        })

        it(`> verify  ${item}-${index + 1} metadata`, () => {
          itemListPage.verifyItemMetadataByItemId(
            itemIds[index],
            itemDetails[index]
          )
        })

        it(`> verify  ${item}-${index + 1}, verify action buttons`, () => {
          testLibraryPage.review.verifyActionButtonsByItemId(
            itemIds[index],
            true,
            true
          )
          testLibraryPage.review.clickExpandByItemId(itemIds[index])
        })
      })
    })

    context('> verify summary and view as student', () => {
      it('> verify test summary in review tab', () => {
        // Verify Test in summary panel
        testLibraryPage.review.verifySummary(itemIds.length, totalPoints)
        testLibraryPage.review.verifyGrades(totalTestGrades)
        testLibraryPage.review.verifySubjects(totalTestSbjects)
      })

      it('> verify standard table data', () => {
        _.keys(standardTableData).forEach((standard) => {
          const { max, questions } = standardTableData[standard]
          testLibraryPage.verifyStandardTableRowByStandard(
            standard,
            questions.length,
            max
          )
        })
      })

      it('> verify test gardes should be editable', () => {
        testLibraryPage.review
          .getTestSubjectSelect()
          .parent()
          .should('not.have.class', 'ant-select-disabled')
        testLibraryPage.review
          .getTestGradeSelect()
          .parent()
          .should('not.have.class', 'ant-select-disabled')
      })
      it('> verify test in- view as student', () => {
        testLibraryPage.visitTestById(testId)
        testLibraryPage.review.clickOnViewAsStudent()
        studentTestPage.verifyNoOfQuestions(itemIds.length)
        studentTestPage.getQuestionByIndex(0)
        _.values(questionTypeMap).forEach((que) => {
          const { queKey, attemptData } = que
          if (![questionTypeKey.ESSAY_RICH].includes(queKey.split('.')[0]))
            studentTestPage.attemptQuestion(
              queKey.split('.')[0],
              attemptTypes.RIGHT,
              attemptData
            )
          studentTestPage.clickOnNext(true)
        })
      })
    })

    context('> preview test items', () => {
      before(`> Get Test Card-"${testName}" and Go-To Review`, () => {
        studentTestPage.clickOnExitTest()
        testLibraryPage.closeTestAttemptSummary()
      })
      itemsInTest.forEach((item, index) => {
        const { attemptData } = questionTypeMap[`Q${index + 1}`]
        const { tags, difficulty, dok, standards } = itemDetails[index]
        const { points } = questionTypeMap[`Q${index + 1}`]
        it(`> verify meta data on preview for "${item}-${index + 1} `, () => {
          itemListPage.itemPreview.closePreiview()
          testLibraryPage.review.previewQuestById(itemIds[index])
          itemListPage.itemPreview.verifyMetadataOnPreview(
            itemIds[index],
            'Teacher',
            points,
            dok,
            difficulty,
            standards.standard,
            tags
          )
          itemListPage.itemPreview.verifyActionsButtonsOnPreview(true)
        })
        if (![questionTypeKey.ESSAY_RICH].includes(item.split('.')[0])) {
          it(`> verify show ans for "${item}-${index + 1} "`, () => {
            itemListPage.itemPreview.verifyShowAnsOnPreview(
              itemsInTest[index],
              attemptData
            )
          })

          it(`> verify right ans for "${item}-${index + 1} "`, () => {
            // Correct ans should have green bg-color
            itemListPage.itemPreview.attemptAndVerifyResponseOnPreview(
              itemsInTest[index],
              attemptData,
              points,
              attemptTypes.RIGHT
            )
          })

          it(`> verify wrong ans for "${item}-${index + 1} "`, () => {
            // Wrong ans should have red bg-color
            itemListPage.itemPreview.attemptAndVerifyResponseOnPreview(
              itemsInTest[index],
              attemptData,
              points,
              attemptTypes.WRONG
            )
          })
        }
      })
    })

    context('> verify test-items order using move-to option', () => {
      before('> close pop-up', () => {
        itemListPage.itemPreview.closePreiview()
      })
      itemsInTest.forEach((item, index, totalItems) => {
        it(`> move question-${index + 1}`, () => {
          testLibraryPage.review.clickOnCheckBoxByItemId(itemIds[index])
          // Move question at last-- totalItems.length
          testLibraryPage.review.moveQuestionByIndex(totalItems.length)
          // Item should be at last-- totalItems.length
          testLibraryPage.review.verifyMovedQuestionById(
            itemIds[index],
            totalItems.length
          )
          // testLibraryPage.review.clickOnCheckBoxByItemId(itemIds[index]);
        })
      })
    })
  })

  context('> review published test', () => {
    before('> publish test', () => {
      testLibraryPage.visitTestById(testId)
      testLibraryPage.header.clickOnPublishButton()
    })

    it('> verify success page', () => {
      testLibraryPage.verifyCollectionOnTestCardbyId(testId, COLLECTION.private)
      testLibraryPage.verifyStandardsOnTestCardById(
        testId,
        _.keys(standardTableData)
      )
      testLibraryPage.verifyTestIdOnTestCardById(testId)
      testLibraryPage.verifyNameOnTestCardById(testId, testName)
      testLibraryPage.verifyTotalItemCountByTestId(testId, itemIds.length)
      testLibraryPage.verifyLinkShareOptions(testId, true)
      testLibraryPage.editsharing()
      testLibraryPage.verifySharePopUp(false, testId)
    })
    it('> verify tabs and navigations', () => {
      testLibraryPage.closePopUp()
      testLibraryPage.seachTestAndGotoReviewById(testId)
      testLibraryPage.header.verifyHeaders(true, true, true, true)
      testLibraryPage.header
        .getTestSummaryHeader()
        .should('have.css', 'cursor', 'not-allowed')
        .click({ force: true })
      testLibraryPage.header
        .getTestAddItemHeader()
        .should('have.css', 'cursor', 'not-allowed')
        .click({ force: true })
      testLibraryPage.review.getTestSubjectSelect().should('be.visible')
      testLibraryPage.header
        .getTestSettingsHeader()
        .should('not.have.css', 'cursor', 'not-allowed')
        .click({ force: true })
      testLibraryPage.testSettings.getAnsOnPaperSwitch().should('exist')

      testLibraryPage.header
        .getTestReviewHeader()
        .should('not.have.css', 'cursor', 'not-allowed')
        .click({ force: true })
      testLibraryPage.review.getTestSubjectSelect().should('be.visible')

      testLibraryPage.review.getMoveTo().should('not.exist')
      testLibraryPage.review.getRemoveSelected().should('not.exist')
    })

    context('> verify header action buttons', () => {
      before('> goto review', () => {
        testLibraryPage.header.clickOnReview()
        testLibraryPage.review.getTestSubjectSelect().should('be.visible')
      })
      it('> verify actions headers', () => {
        testLibraryPage.header.verifyHeaderActionButtons(
          true,
          true,
          false,
          false
        )
      })

      it('> verify print test pop-up', () => {
        testLibraryPage.header.clickPrintTest()
        testLibraryPage.header.verifyPrintCompleteTestInfo()
        testLibraryPage.header.verifyPrintPartialTestInfo()
        testLibraryPage.header.verifyPrintManualGradesInfo()
      })

      it('> verify clone test pop-up', () => {
        testLibraryPage.closePopUp()
        testLibraryPage.verifyCloneTestPopUp()
      })

      it('> verify share test pop-up', () => {
        testLibraryPage.closePopUp()
        testLibraryPage.header.clickOnShare()
        testLibraryPage.verifySharePopUp(false, testId)
        testLibraryPage.closePopUp()
        // TODO: verify below once copy-paste is known in cypress
        /* testLibraryPage.sidebar.clickOnTestLibrary()
        testLibraryPage.searchFilters.clearAll()
        testLibraryPage.searchFilters
          .getSearchTextBox()
          .type(`{ctrl}v`, { release: false, force: true })
        testLibraryPage.searchFilters
          .getSearchBar()
          .should(
            'have.text',
            `${Cypress.config('baseUrl')}author/tests/tab/review/id/${OriginalTestId}`
          ) */
      })
    })

    context('> verifying items in collapsed rows,', () => {
      before(`> get test card-${testName} and go-to review`, () => {
        testLibraryPage.visitTestById(testId)
        testLibraryPage.closePopUp()
      })
      itemsInTest.forEach((item, index) => {
        it(`> verify ${item}-${index + 1} question content and points`, () => {
          // Verify All questions' presence
          testLibraryPage.review.verifyQustionById(itemIds[index])
          testLibraryPage.review.asesrtPointsByid(
            itemIds[index],
            questionTypeMap[`Q${index + 1}`].points
          )
        })
        it(`> verify  ${item}-${index + 1} metadata`, () => {
          itemListPage.verifyItemMetadataByItemId(
            itemIds[index],
            itemDetails[index]
          )
        })

        it(`> verify  ${item}-${index + 1}, verify action buttons`, () => {
          testLibraryPage.review.verifyActionButtonsByItemId(
            itemIds[index],
            false,
            false
          )
        })
      })
    })
    context('> verifying items in expanded', () => {
      itemsInTest.forEach((item, index) => {
        it(`> verify  ${item}-${
          index + 1
        } correct ans, question text, points`, () => {
          // Verify All questions' presence along with thier correct answers and points
          testLibraryPage.review.clickExpandByItemId(itemIds[index])
          testLibraryPage.review.verifyQustionById(itemIds[index])
          questionTypeMap[`Q${index + 1}`].attemptData.item = itemIds[index]
          itemListPage.itemPreview.verifyQuestionResponseCard(
            itemsInTest[index],
            questionTypeMap[`Q${index + 1}`].attemptData,
            attemptTypes.RIGHT,
            true
          )
          testLibraryPage.review.asesrtPointsByid(
            itemIds[index],
            questionTypeMap[`Q${index + 1}`].points
          )
        })

        it(`> verify  ${item}-${index + 1} metadata`, () => {
          itemListPage.verifyItemMetadataByItemId(
            itemIds[index],
            itemDetails[index]
          )
        })

        it(`> verify  ${item}-${index + 1}, verify action buttons`, () => {
          testLibraryPage.review.verifyActionButtonsByItemId(
            itemIds[index],
            false,
            true
          )

          testLibraryPage.review.clickExpandByItemId(itemIds[index])
        })
      })
    })

    context('> verify summary and view as student', () => {
      it('> verify test summary in review tab', () => {
        // Verify Test in summary panel
        testLibraryPage.closePopUp()
        testLibraryPage.review.verifySummary(itemIds.length, totalPoints)
        testLibraryPage.review.verifyGrades(totalTestGrades)
        testLibraryPage.review.verifySubjects(totalTestSbjects)
      })

      it('> verify standard table data', () => {
        _.keys(standardTableData).forEach((standard) => {
          const { max, questions } = standardTableData[standard]
          testLibraryPage.verifyStandardTableRowByStandard(
            standard,
            questions.length,
            max
          )
        })
      })

      it('> verify test gardes should be editable', () => {
        testLibraryPage.review
          .getTestSubjectSelect()
          .parent()
          .should('have.class', 'ant-select-disabled')
        testLibraryPage.review
          .getTestGradeSelect()
          .parent()
          .should('have.class', 'ant-select-disabled')
      })
      it('> verify test in- view as student', () => {
        testLibraryPage.visitTestById(testId)
        testLibraryPage.review.clickOnViewAsStudent()
        studentTestPage.verifyNoOfQuestions(itemIds.length)
        studentTestPage.getQuestionByIndex(0)
        _.values(questionTypeMap).forEach((que) => {
          const { queKey, attemptData } = que
          if (![questionTypeKey.ESSAY_RICH].includes(queKey.split('.')[0]))
            studentTestPage.attemptQuestion(
              queKey.split('.')[0],
              attemptTypes.RIGHT,
              attemptData
            )
          studentTestPage.clickOnNext(true)
        })
      })
    })
    context('>preview test items', () => {
      before(`> Get Test Card-"${testName}" and Go-To Review`, () => {
        testLibraryPage.closeTestAttemptSummary()
        studentTestPage.clickOnExitTest()
      })
      itemsInTest.forEach((item, index) => {
        const { attemptData } = questionTypeMap[`Q${index + 1}`]
        const { tags, difficulty, dok, standards } = itemDetails[index]
        const { points } = questionTypeMap[`Q${index + 1}`]
        it(`> verify meta data on preview for "${item}-${index + 1} `, () => {
          itemListPage.itemPreview.closePreiview()
          testLibraryPage.review.previewQuestById(itemIds[index])
          itemListPage.itemPreview.verifyMetadataOnPreview(
            itemIds[index],
            'Teacher',
            points,
            dok,
            difficulty,
            standards.standard,
            tags
          )
          itemListPage.itemPreview.verifyActionsButtonsOnPreview(false)
        })
        if (![questionTypeKey.ESSAY_RICH].includes(item.split('.')[0])) {
          it(`> verify show ans for "${item}-${index + 1} "`, () => {
            itemListPage.itemPreview.verifyShowAnsOnPreview(
              itemsInTest[index],
              attemptData
            )
          })

          it(`> verify right ans for "${item}-${index + 1} "`, () => {
            // Correct ans should have green bg-color
            itemListPage.itemPreview.attemptAndVerifyResponseOnPreview(
              itemsInTest[index],
              attemptData,
              points,
              attemptTypes.RIGHT
            )
          })

          it(`> verify wrong ans for "${item}-${index + 1} "`, () => {
            // Wrong ans should have red bg-color
            itemListPage.itemPreview.attemptAndVerifyResponseOnPreview(
              itemsInTest[index],
              attemptData,
              points,
              attemptTypes.WRONG
            )
          })
        }
      })
    })
  })
})
