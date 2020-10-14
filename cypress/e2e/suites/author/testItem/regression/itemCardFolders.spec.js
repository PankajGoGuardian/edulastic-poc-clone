/* eslint-disable no-unused-vars */
import { FolderPage } from '../../../../framework/author/folderPage'
import ItemListPage from '../../../../framework/author/itemList/itemListPage'
import CypressHelper from '../../../../framework/util/cypressHelpers'
import FileHelper from '../../../../framework/util/fileHelper'

describe(`${FileHelper.getSpecName(Cypress.spec.name)}> item bank`, () => {
  const itemlist = new ItemListPage()
  const folderPage = new FolderPage()
  const itemKeys = [
    'ESSAY_RICH.1',
    'ESSAY_RICH.2',
    'ESSAY_RICH.5',
    'MCQ_MULTI.6',
  ]
  const user = 'teacher.item.filters@snapwiz.com'

  let queType
  let itemIds = []
  const filters = [
    {
      standards: {
        subject: 'Mathematics',
        standardSet: 'Math - Common Core',
        standard: ['4.G.A.2', '4.G.A.1'],
        grade: ['Grade 4'],
      },
      dok: 'Skill/Concept',
      difficulty: 'Easy',
      tags: ['item tag 3'],
      id: '5ef9e96a7a986800076ade20',
      queType: 'ESSAY_RICH',
    },
    {
      standards: {
        subject: 'Mathematics',
        standardSet: 'Math - Common Core',
        standard: ['4.G.A.2', '4.G.A.1'],
        grade: ['Grade 4'],
      },
      dok: 'Extended Thinking',
      difficulty: 'Hard',
      tags: ['item tag 1'],
      id: '5ef9e98e75d5e70008726fdc',
      queType: 'ESSAY_RICH',
    },
  ]

  before('> create items and hard code them', () => {
    cy.login('teacher', user)
    itemlist.sidebar.clickOnItemBank()
    cy.getAllTestsAndDelete(user)
    cy.getAllItemsAndDelete(
      user,
      'snapwiz',
      filters.map((obj) => obj.id)
    )
    /*  filters = [];
    itemKeys.slice(0, 4).forEach((item, index) => {
      itemlist.createItem(item, index + 1).then(id => {
        const filtersObj = {};
        cy.fixture("questionAuthoring").then(questionData => {
          const itemProps = questionData[`${item.split(".")[0]}`][`${item.split(".")[1]}`];

          filtersObj.standards = {};
          filtersObj.standards.subject = itemProps.standards[0].subject;
          filtersObj.standards.standardSet = itemProps.standards[0].standardSet;
          filtersObj.standards.standard = itemProps.standards[0].standard;
          filtersObj.standards.grade = [itemProps.standards[0].grade];
          if (itemProps.meta) {
            if (itemProps.meta.dok) filtersObj.dok = itemProps.meta.dok;
            if (itemProps.meta.difficulty) filtersObj.difficulty = itemProps.meta.difficulty;
            if (itemProps.meta.tags) filtersObj.tags = itemProps.meta.tags;
          }
          filtersObj.id = id;
          filtersObj.queType = item.split(".")[0];
          filters.push(filtersObj);
        });
      });
    }); */
  })

  /*  before(">", () => {
    cy.writeFile("temp.json", filters);
  }); */

  before('> create new items', () => {
    itemKeys.slice(2).forEach((item, index) => {
      itemlist.createItem(item, index + 5).then((id) => {
        const filtersObj = {}
        cy.fixture('questionAuthoring').then((questionData) => {
          const itemProps =
            questionData[`${item.split('.')[0]}`][`${item.split('.')[1]}`]

          filtersObj.standards = {}
          filtersObj.standards.subject = itemProps.standards[0].subject
          filtersObj.standards.standardSet = itemProps.standards[0].standardSet
          filtersObj.standards.standard = itemProps.standards[0].standard
          filtersObj.standards.grade = [itemProps.standards[0].grade]
          if (itemProps.meta) {
            if (itemProps.meta.dok) filtersObj.dok = itemProps.meta.dok
            if (itemProps.meta.difficulty)
              filtersObj.difficulty = itemProps.meta.difficulty
            if (itemProps.meta.tags) filtersObj.tags = itemProps.meta.tags
          }
          filtersObj.id = id
          filtersObj.queType = item.split('.')[0]
          filters.push(filtersObj)
        })
      })
    })
  })

  context('> total questions, search, collapse/expand filters', () => {
    it('> total questions in authored by me', () => {
      itemlist.sidebar.clickOnDashboard()
      itemlist.sidebar.clickOnItemBank()
      itemlist.searchFilters.clearAll()
      itemlist.searchFilters.getAuthoredByMe()
      itemlist.verifyNoOfQuestionsInUI(itemKeys.length)
      itemlist.verifyNoOfItemsInContainer(itemKeys.length)
    })
    it('> total questions in entire library vs total page count', () => {
      itemlist.searchFilters.clearAll()
      itemlist.verifyTotalPagesAndTotalQuestions()
    })

    it('> expand and collapse filters', () => {
      itemlist.searchFilters.collapseFilters()
      cy.wait(1000)
      itemlist.searchFilters.expandFilters()
    })
  })

  context('> paginations', () => {
    beforeEach('> clear filters', () => {
      itemlist.searchFilters.clearAll()
    })
    it('> jump to next 5 pages and previous 5 pages', () => {
      itemlist.searchFilters.clickButtonInPaginationByPageNo('Next 5 Pages')
      itemlist.searchFilters.verfifyActivePageIs(6)

      itemlist.searchFilters.clickButtonInPaginationByPageNo('Next 5 Pages')
      itemlist.searchFilters.verfifyActivePageIs(11)

      itemlist.searchFilters.clickButtonInPaginationByPageNo('Previous 5 Pages')
      itemlist.searchFilters.verfifyActivePageIs(6)
    })

    it('> go to random page', () => {
      itemlist.searchFilters.clickButtonInPaginationByPageNo(5)
      itemlist.searchFilters.verfifyActivePageIs(5)

      itemlist.searchFilters.clickButtonInPaginationByPageNo(3)
      itemlist.searchFilters.verfifyActivePageIs(3)
    })

    it('> go to next page and previous page', () => {
      itemlist.searchFilters.clickButtonInPaginationByPageNo('Next Page')
      itemlist.searchFilters.verfifyActivePageIs(2)

      itemlist.searchFilters.clickButtonInPaginationByPageNo('Previous Page')
      itemlist.searchFilters.verfifyActivePageIs(1)
    })

    it('> go to last page', () => {
      itemlist.searchFilters.getTotalPagesInPagination().then((pages) => {
        itemlist.searchFilters.clickJumpToLastPage()
        itemlist.searchFilters.verfifyActivePageIs(pages)
      })
    })
  })

  context(
    `> ques type, standards, author and item id on item cards in 'authored by me'`,
    () => {
      context(`> for existing item `, () => {
        before('> set filter', () => {
          queType = filters[1].queType
          itemlist.searchFilters.clearAll()
          itemlist.searchFilters.getAuthoredByMe()
          filters[1].queType = itemlist.mapQueTypeKeyToUITextInDropDown(
            filters[1].queType
          )
          itemlist.searchFilters.setFilters(filters[1])
        })

        it('> quetype, author and item id', () => {
          filters[1].queType = queType
          itemlist.verifyQuestionTypeById(filters[1].id, filters[1].queType)
          itemlist.verifyAuthorById(filters[1].id, 'Teacher')
          itemlist.verifyItemIdById(filters[1].id)
        })

        it('> standards and dok', () => {
          itemlist.getHiddenStandards(filters[1].id)
          filters[1].standards.standard.forEach((std) => {
            itemlist.verifyContentById(filters[1].id, std)
          })
          itemlist.verifydokByItemId(filters[1].id, filters[1].dok)
        })
      })

      context(`> for new item`, () => {
        before('> set filter', () => {
          queType = filters[3].queType
          itemlist.searchFilters.clearAll()
          itemlist.searchFilters.getAuthoredByMe()
          filters[3].queType = itemlist.mapQueTypeKeyToUITextInDropDown(
            filters[3].queType
          )
          itemlist.searchFilters.setFilters(filters[3])
        })

        it('> quetype, author and item id', () => {
          filters[3].queType = queType
          itemlist.verifyQuestionTypeById(filters[3].id, filters[3].queType)
          itemlist.verifyAuthorById(filters[3].id, 'Teacher')
          itemlist.verifyItemIdById(filters[3].id)
        })

        it('> standards and dok', () => {
          itemlist.getHiddenStandards(filters[3].id)
          filters[3].standards.standard.forEach((std) => {
            itemlist.verifyContentById(filters[3].id, std)
          })
          itemlist.verifydokByItemId(filters[3].id, filters[3].dok)
        })
      })
    }
  )

  context('> folder actions', () => {
    before('> delete all existing folders', () => {
      itemlist.searchFilters.clearAll()
      folderPage.clickFolderButton()
      folderPage.deleteAllFolders()
      itemIds = filters.map((obj) => obj.id)
    })

    it('> create new folders', () => {
      ;[1, 2].forEach((folderIndex) => {
        folderPage.clickAddNewFolderButton()
        folderPage.setNewFolderName(`Folder -${folderIndex}`)

        folderPage.clickCreateNewFolderBuuton(`Folder -${folderIndex}`)
      })
      ;[1, 2].forEach((folderIndex) => {
        folderPage
          .getFolderByName(`Folder -${folderIndex}`)
          .should('be.visible')
      })
    })

    it('> add items to folder', () => {
      itemlist.searchFilters.getAuthoredByMe()
      itemIds.slice(0, 2).forEach((item) => {
        itemlist.addItemById(item)
      })

      folderPage.clickAddToFolderInDropDown()
      CypressHelper.removeAllAntMessages()
      folderPage.addToFolderByFolderName(`Folder -1`)
      CypressHelper.verifyAntMesssage(
        `2 item(s) successfully moved to "Folder -1"`
      )
    })

    it('> verify added item', () => {
      folderPage.clickOnFolderByName(`Folder -1`)
      itemlist.verifyNoOfQuestionsInUI(2)
      itemIds.slice(0, 2).forEach((item) => {
        itemlist.getAddButtonById(item).should('be.visible')
      })
    })

    it('> add used item to other folder along with new item', () => {
      itemlist.searchFilters.getAuthoredByMe()
      itemIds.slice(1, 3).forEach((item) => {
        itemlist.addItemById(item)
      })

      folderPage.clickAddToFolderInDropDown()
      folderPage.addToFolderByFolderName(`Folder -2`)
      CypressHelper.verifyAntMesssage(
        `${2} item(s) successfully moved to "Folder -2"`
      )
    })

    it('> verify added item', () => {
      folderPage.clickOnFolderByName(`Folder -2`)
      itemlist.verifyNoOfQuestionsInUI(2)
      itemIds.slice(1, 3).forEach((item) => {
        itemlist.getAddButtonById(item).should('be.visible')
      })

      folderPage.clickOnFolderByName(`Folder -1`)
      itemlist.verifyNoOfQuestionsInUI(1)
      itemIds.slice(0, 1).forEach((item) => {
        itemlist.getAddButtonById(item).should('be.visible')
      })
    })

    it('> remove from folder', () => {
      folderPage.clickOnFolderByName(`Folder -2`)
      itemlist.addItemById(itemIds[1])
      folderPage.clickRemoveFromFolderInDropDown()

      folderPage.removeFromFolderByFolderName(`Folder -2`)
      CypressHelper.verifyAntMesssage(
        `1 item(s) successfully removed from "Folder -2"`
      )
    })

    it('> verify removed item', () => {
      folderPage.clickOnFolderByName(`Folder -2`)
      itemlist.verifyNoOfQuestionsInUI(1)

      itemlist.getAddButtonById(itemIds[2]).should('be.visible')
      folderPage.clickOnFolderByName(`Folder -1`)

      itemlist.verifyNoOfQuestionsInUI(1)
      itemIds.slice(0, 1).forEach((item) => {
        itemlist.getAddButtonById(item).should('be.visible')
      })
    })

    it('> try to add already added item', () => {
      itemlist.searchFilters.getAuthoredByMe()
      itemlist.addItemById(itemIds[0])

      folderPage.clickAddToFolderInDropDown()
      folderPage.selectFolderByNameInPopUp(`Folder -1`)

      CypressHelper.removeAllAntMessages()
      folderPage.getAddButtonInPopUp().click({ force: true })

      CypressHelper.verifyAntMesssage(
        `1 item(s) already exist in Folder -1 folder`
      )
      folderPage.clickCancelButtonInPopUp()
    })

    it('> update folder name', () => {
      folderPage.clickFolderButton()

      folderPage.clickOnMoreOptionsByFolderName(`Folder -2`)
      folderPage.clickRenameFolder()

      folderPage.setNewFolderName(`Folder -3`)
      folderPage.clickUpdateFolder(`Folder -3`)
    })

    it('> verify updated folder', () => {
      folderPage.clickOnFolderByName(`Folder -3`)
      itemlist.verifyNoOfQuestionsInUI(1)
      itemlist.getAddButtonById(itemIds[2]).should('be.visible')
    })

    it('> delete folder', () => {
      folderPage.clickFolderButton()
      folderPage.clickOnMoreOptionsByFolderName(`Folder -1`)

      folderPage.clickDeleteFolderInDropDown()
      folderPage.clickDeleteFolder()
    })

    it('> verify deleted folder', () => {
      folderPage.clickFolderButton()
      folderPage.getFolderByName(`Folder -3`).should('be.visible')
      folderPage.getFolderByName(`Folder -1`).should('not.exist')
    })
  })
})
