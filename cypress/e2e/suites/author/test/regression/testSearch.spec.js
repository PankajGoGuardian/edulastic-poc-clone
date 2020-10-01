import TeacherSideBar from '../../../../framework/author/SideBarPage'
import SearchFilters from '../../../../framework/author/searchFiltersPage'
import TestLibrary from '../../../../framework/author/tests/testLibraryPage'
import TestSummayTab from '../../../../framework/author/tests/testDetail/testSummaryTab'
import TestHeader from '../../../../framework/author/tests/testDetail/header'
import FileHelper from '../../../../framework/util/fileHelper'
import CypressHelper from '../../../../framework/util/cypressHelpers'

const userData = require('../../../../../fixtures/users')
const quesData = require('../../../../../fixtures/questionAuthoring')
const testData = require('../../../../../fixtures/testAuthoring')

const { search_1, search_2, search_3 } = testData

describe(`${FileHelper.getSpecName(Cypress.spec.name)}>searching tests`, () => {
  const techersidebar = new TeacherSideBar()
  const searchFilters = new SearchFilters()
  const testLibrary = new TestLibrary()
  const testHeader = new TestHeader()
  const testSummaryTab = new TestSummayTab()
  let itemsInTest
  let standardsOfTest
  const testToCreate = ['search_1', 'search_2', 'search_3']

  const Author = {
    email: 'teacher.test.search@snapwiz.com',
    pass: 'snapwiz',
  }
  const tags = []
  const testNames = []
  const tagsToTest = {}
  const tests = [search_1, search_2, search_3]
  const standardToTest = {}
  const test_ids = []

  context(">searching in 'draft' state", () => {
    before('>login as author and create tests in draft-state', () => {
      cy.getAllTestsAndDelete(Author.email)
      cy.getAllItemsAndDelete(Author.email)
      cy.login('teacher', Author.email, Author.pass)
      tests.forEach((test, i) => {
        testLibrary.createTest(testToCreate[i], false).then((id) => {
          test_ids[i] = id
          itemsInTest = test.itemKeys
          itemsInTest.forEach((item) => {
            const [queType, queKey] = item.split('.')
            if (quesData[queType][queKey].standards) {
              standardsOfTest = quesData[queType][queKey].standards[0].standard
              standardsOfTest.forEach((standardOfTest) => {
                if (!standardToTest.hasOwnProperty(standardOfTest)) {
                  standardToTest[standardOfTest] = []
                }
                standardToTest[standardOfTest].push(id)
              })
            }
          })
          testHeader.clickOnDescription()
          tags.push(test.tags)
          testNames.push(test.name)
          testSummaryTab.addTags(tags[i])
          tags[i].forEach((tag) => {
            // eslint-disable-next-line no-prototype-builtins
            if (!tagsToTest.hasOwnProperty(tag)) {
              tagsToTest[tag] = []
            }
            tagsToTest[tag].push(id)
          })
          // testHeader.clickOnReview();
          testHeader.clickOnSaveButton(true)
        })
      })
    })
    context(">searching in 'authored by me'", () => {
      // Searched Draft Tests should Be visible in Authored By Me
      it('>search by standards', () => {
        techersidebar.clickOnTestLibrary()
        Object.keys(standardToTest).forEach((ele) => {
          searchFilters.clearAll()
          searchFilters.getAuthoredByMe()
          searchFilters.typeInSearchBox(ele)
          standardToTest[ele].forEach((id) => {
            testLibrary.getTestCardById(id).should('be.visible')
          })
        })
      })
      it('>search by tags', () => {
        Object.keys(tagsToTest).forEach((ele) => {
          searchFilters.clearAll()
          searchFilters.getAuthoredByMe()
          searchFilters.typeInSearchBox(ele)
          tagsToTest[ele].forEach((id) => {
            testLibrary.getTestCardById(id).should('be.visible')
          })
        })
      })
      it('>search by name', () => {
        test_ids.forEach((id, i) => {
          searchFilters.clearAll()
          searchFilters.getAuthoredByMe()
          searchFilters.typeInSearchBox(testNames[i])
          testLibrary.getTestCardById(id).should('be.visible')
        })
      })
      it('>search by id', () => {
        test_ids.forEach((id) => {
          searchFilters.clearAll()
          searchFilters.getAuthoredByMe()
          searchFilters.typeInSearchBox(id)
          testLibrary.getTestCardById(id).should('be.visible')
        })
      })
    })
    context(">searching in 'entire library'", () => {
      // Searched Draft Tests should Not Be visible in Entire Library
      it('>search by standards in draft-state', () => {
        Object.keys(standardToTest).forEach((ele) => {
          searchFilters.clearAll()
          searchFilters.typeInSearchBox(ele)
          standardToTest[ele].forEach((id) => {
            testLibrary.checkforNonExistanceOfTest(id)
          })
        })
      })
      it('>search by tags', () => {
        // techersidebar.clickOnTestLibrary();
        Object.keys(tagsToTest).forEach((ele) => {
          searchFilters.clearAll()
          searchFilters.typeInSearchBox(ele)
          tagsToTest[ele].forEach((id) => {
            testLibrary.checkforNonExistanceOfTest(id)
          })
        })
      })
      it('>search by name', () => {
        test_ids.forEach((id, i) => {
          searchFilters.clearAll()
          searchFilters.typeInSearchBox(testNames[i])
          testLibrary.checkforNonExistanceOfTest(id)
        })
      })
      it('>search by id', () => {
        test_ids.forEach((id) => {
          searchFilters.clearAll()
          searchFilters.typeInSearchBox(id)
          testLibrary.checkforNonExistanceOfTest(id)
        })
      })
    })
  })
  context(">searching in 'published' state", () => {
    context(">searching in 'entire library'", () => {
      // Searched Published Tests should be visible in Entire Library
      before('Publish all the tests', () => {
        techersidebar.clickOnPlayListLibrary()
        test_ids.forEach((id) => {
          testLibrary.seachTestAndGotoReviewById(id)
          testLibrary.header.clickOnPublishButton()
        })
      })

      it('>search by standards', () => {
        techersidebar.clickOnTestLibrary()
        Object.keys(standardToTest).forEach((ele) => {
          searchFilters.clearAll()
          searchFilters.typeInSearchBox(ele)
          standardToTest[ele].forEach((id) => {
            testLibrary.getTestCardById(id).should('be.visible')
          })
        })
      })
      it('>search by tags', () => {
        Object.keys(tagsToTest).forEach((ele) => {
          searchFilters.clearAll()
          searchFilters.typeInSearchBox(ele)
          tagsToTest[ele].forEach((id) => {
            testLibrary.getTestCardById(id).should('be.visible')
          })
        })
      })
      it('>search by name', () => {
        test_ids.forEach((id, i) => {
          searchFilters.clearAll()
          searchFilters.typeInSearchBox(testNames[i])
          testLibrary.getTestCardById(id).should('be.visible')
        })
      })
      it('>search by id', () => {
        test_ids.forEach((id) => {
          searchFilters.clearAll()
          searchFilters.typeInSearchBox(id)
          testLibrary.getTestCardById(id).should('be.visible')
        })
      })
    })
    context(">searching in 'authored by me'", () => {
      // Searched Draft Tests should Be visible in Authored By Me
      it('>search by standards', () => {
        Object.keys(standardToTest).forEach((ele) => {
          searchFilters.clearAll()
          searchFilters.getAuthoredByMe()
          searchFilters.typeInSearchBox(ele)
          standardToTest[ele].forEach((id) => {
            testLibrary.getTestCardById(id).should('be.visible')
          })
        })
      })
      it('>search by tags in', () => {
        Object.keys(tagsToTest).forEach((ele) => {
          searchFilters.clearAll()
          searchFilters.getAuthoredByMe()
          searchFilters.typeInSearchBox(ele)
          tagsToTest[ele].forEach((id) => {
            testLibrary.getTestCardById(id).should('be.visible')
          })
        })
      })
      it('>search by name', () => {
        test_ids.forEach((id, i) => {
          searchFilters.clearAll()
          searchFilters.getAuthoredByMe()
          searchFilters.typeInSearchBox(testNames[i])
          testLibrary.getTestCardById(id).should('be.visible')
        })
      })
      it('>search by id', () => {
        test_ids.forEach((id) => {
          searchFilters.clearAll()
          searchFilters.getAuthoredByMe()
          searchFilters.typeInSearchBox(id)
          testLibrary.getTestCardById(id).should('be.visible')
        })
      })
    })
  })
})
