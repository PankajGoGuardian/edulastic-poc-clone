import ItemListPage from '../../../../framework/author/itemList/itemListPage'
import FileHelper from '../../../../framework/util/fileHelper'
import {
  subject,
  grades,
} from '../../../../framework/constants/assignmentStatus'
import {
  DOK,
  DIFFICULTY,
} from '../../../../framework/constants/questionAuthoring'
import {
  COLLECTION,
  questionTypeKey,
} from '../../../../framework/constants/questionTypes'

describe(`${FileHelper.getSpecName(Cypress.spec.name)}> item bank`, () => {
  const itemlist = new ItemListPage()
  const itemKeys = [
    'ESSAY_RICH.1',
    'ESSAY_RICH.2',
    'ESSAY_RICH.3',
    'ESSAY_RICH.4',
    'ESSAY_RICH.5',
    'MCQ_MULTI.6',
  ]
  const user = 'teacher2.item.filters@snapwiz.com'
  const mathCommonCore = 'Math - Common Core'
  const standard_1 = 'K.CC.A.1'
  const standard_2 = 'K.CC.A.2'
  const filterAttr = Cypress._.values(
    itemlist.searchFilters.itemBankFilterAttrs
  )

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
      id: '5f69c8639a8a8e0008fa2e3f',
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
      id: '5f69c88f9a88640007cc6957',
      queType: 'ESSAY_RICH',
    },
    {
      standards: {
        subject: 'ELA',
        standardSet: 'ELA - Common Core',
        standard: ['CCRA.L.2'],
        grade: ['Grade 2'],
      },
      dok: 'Strategic Thinking',
      difficulty: 'Easy',
      tags: ['item tag 1'],
      id: '5f69c8c529207d00077e4d7f',
      queType: 'ESSAY_RICH',
    },
    {
      standards: {
        subject: 'ELA',
        standardSet: 'ELA - Common Core',
        standard: ['CCRA.L.1', 'CCRA.L.2'],
        grade: ['Grade 2'],
      },
      dok: 'Skill/Concept',
      difficulty: 'Easy',
      tags: ['item tag 2'],
      id: '5f69c915be36ce00073fdb7e',
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
    itemKeys.slice(4).forEach((item, index) => {
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

  // exact verification of all filters as all own items of known count
  context("> filters in 'authored by me'", () => {
    it('> grades', () => {
      const customFilter = { standards: { grade: [grades.GRADE_2] } }
      const expectedItem = filters.filter(
        (item) => item.standards.grade.indexOf(grades.GRADE_2) !== -1
      )

      itemlist.searchFilters.clearAll()
      itemlist.searchFilters.getAuthoredByMe()
      itemlist.searchFilters.setFilters(customFilter)
      itemlist.verifyNoOfQuestionsInUI(expectedItem.length)
      expectedItem.forEach((item) => {
        itemlist.getItemContainerInlistById(item.id)
      })
    })

    it('> subject', () => {
      const customFilter = { standards: { subject: subject.ELA } }
      const expectedItem = filters.filter(
        (item) => item.standards.subject === subject.ELA
      )

      itemlist.searchFilters.clearAll()
      itemlist.searchFilters.getAuthoredByMe()
      itemlist.searchFilters.setFilters(customFilter)
      itemlist.verifyNoOfQuestionsInUI(expectedItem.length)
      expectedItem.forEach((item) => {
        itemlist.getItemContainerInlistById(item.id)
      })
    })

    it('> standard set', () => {
      const customFilter = {
        standards: {
          subject: subject.MATH,
          grade: [grades.GRADE_4],
          standardSet: mathCommonCore,
        },
      }
      const expectedItem = filters.filter(
        (item) => item.standards.standardSet === mathCommonCore
      )

      itemlist.searchFilters.clearAll()
      itemlist.searchFilters.getAuthoredByMe()
      itemlist.searchFilters.setFilters(customFilter)
      itemlist.verifyNoOfQuestionsInUI(expectedItem.length)
      expectedItem.forEach((item) => {
        itemlist.getItemContainerInlistById(item.id)
      })
    })

    it('> question type', () => {
      const customFilter = { queType: questionTypeKey.ESSAY_RICH }
      customFilter.queType = itemlist.mapQueTypeKeyToUITextInDropDown(
        customFilter.queType
      )
      const expectedItem = filters.filter(
        (item) => item.queType === questionTypeKey.ESSAY_RICH
      )

      itemlist.searchFilters.clearAll()
      itemlist.searchFilters.getAuthoredByMe()
      itemlist.searchFilters.setFilters(customFilter)
      itemlist.verifyNoOfQuestionsInUI(expectedItem.length)
      expectedItem.forEach((item) => {
        itemlist.getItemContainerInlistById(item.id)
      })
    })

    it('> standards', () => {
      const customFilter = {
        standards: {
          subject: subject.MATH,
          grade: [grades.GRADE_4],
          standardSet: mathCommonCore,
          standard: ['4.G.A.2'],
        },
      }
      const expectedItem = filters.filter(
        (item) => item.standards.standard.indexOf('4.G.A.2') !== -1
      )

      itemlist.searchFilters.clearAll()
      itemlist.searchFilters.getAuthoredByMe()
      itemlist.searchFilters.setFilters(customFilter)
      itemlist.verifyNoOfQuestionsInUI(expectedItem.length)
      expectedItem.forEach((item) => {
        itemlist.getItemContainerInlistById(item.id)
      })
    })

    it('> tags', () => {
      const customFilter = { tags: ['item tag 1'] }
      const expectedItem = filters.filter(
        (item) => item.tags.indexOf('item tag 1') !== -1
      )

      itemlist.searchFilters.clearAll()
      itemlist.searchFilters.getAuthoredByMe()
      itemlist.searchFilters.setFilters(customFilter)
      itemlist.verifyNoOfQuestionsInUI(expectedItem.length)
      expectedItem.forEach((item) => {
        itemlist.getItemContainerInlistById(item.id)
      })
    })

    it('> dok', () => {
      const customFilter = { dok: DOK.StrategicThinking }
      const expectedItem = filters.filter(
        (item) => item.dok === DOK.StrategicThinking
      )

      itemlist.searchFilters.clearAll()
      itemlist.searchFilters.getAuthoredByMe()
      itemlist.searchFilters.setFilters(customFilter)
      itemlist.verifyNoOfQuestionsInUI(expectedItem.length)
      expectedItem.forEach((item) => {
        itemlist.getItemContainerInlistById(item.id)
      })
    })

    it('> difficulty', () => {
      const customFilter = { difficulty: DIFFICULTY.Easy }
      const expectedItem = filters.filter(
        (item) => item.difficulty === DIFFICULTY.Easy
      )

      itemlist.searchFilters.clearAll()
      itemlist.searchFilters.getAuthoredByMe()
      itemlist.searchFilters.setFilters(customFilter)
      itemlist.verifyNoOfQuestionsInUI(expectedItem.length)
      expectedItem.forEach((item) => {
        itemlist.getItemContainerInlistById(item.id)
      })
    })

    it("> collection 'Private Library'", () => {
      const customFilter = { collection: COLLECTION.private }

      itemlist.searchFilters.clearAll()
      itemlist.searchFilters.setFilters(customFilter)
      itemlist.verifyNoOfQuestionsInUI(filters.length)
      filters.forEach((item) => {
        itemlist.getItemContainerInlistById(item.id)
      })
      // TODO : do with custom collection
    })

    it('> status', () => {
      let customFilter = { status: 'Published' }
      itemlist.searchFilters.clearAll()
      itemlist.searchFilters.getAuthoredByMe()
      itemlist.searchFilters.setFilters(customFilter)
      itemlist.verifyNoOfQuestionsInUI(filters.length)

      customFilter = { status: 'Draft' }
      itemlist.searchFilters.setFilters(customFilter)
      itemlist.verifyNoOfQuestionsInUI(0)
    })

    it('> grades + subject', () => {
      const customFilter = {
        standards: { grade: [grades.GRADE_4], subject: subject.MATH },
      }
      const expectedItem = filters.filter(
        (item) =>
          item.standards.grade.indexOf(grades.GRADE_4) !== -1 &&
          item.standards.subject === subject.MATH
      )

      itemlist.searchFilters.clearAll()
      itemlist.searchFilters.getAuthoredByMe()
      itemlist.searchFilters.setFilters(customFilter)
      itemlist.verifyNoOfQuestionsInUI(expectedItem.length)
      expectedItem.forEach((item) => {
        itemlist.getItemContainerInlistById(item.id)
      })
    })

    it('> grades + standardset', () => {
      const customFilter = {
        standards: {
          grade: [grades.GRADE_4],
          subject: subject.MATH,
          standardSet: mathCommonCore,
        },
      }
      const expectedItem = filters.filter(
        (item) =>
          item.standards.grade.indexOf(grades.GRADE_4) !== -1 &&
          item.standards.standardSet === mathCommonCore
      )

      itemlist.searchFilters.clearAll()
      itemlist.searchFilters.getAuthoredByMe()
      itemlist.searchFilters.setFilters(customFilter)
      itemlist.verifyNoOfQuestionsInUI(expectedItem.length)
      expectedItem.forEach((item) => {
        itemlist.getItemContainerInlistById(item.id)
      })
    })

    it('> grades + standard', () => {
      const customFilter = {
        standards: {
          grade: [grades.GRADE_4],
          subject: subject.MATH,
          standardSet: mathCommonCore,
          standard: ['4.G.A.2'],
        },
      }
      const expectedItem = filters.filter(
        (item) =>
          item.standards.grade.indexOf(grades.GRADE_4) !== -1 &&
          item.standards.standard.indexOf('4.G.A.2') !== -1
      )

      itemlist.searchFilters.clearAll()
      itemlist.searchFilters.getAuthoredByMe()
      itemlist.searchFilters.setFilters(customFilter)
      itemlist.verifyNoOfQuestionsInUI(expectedItem.length)
      expectedItem.forEach((item) => {
        itemlist.getItemContainerInlistById(item.id)
      })
    })

    it('> grades + question type', () => {
      const customFilter = {
        standards: { grade: [grades.GRADE_4] },
        queType: questionTypeKey.MULTIPLE_CHOICE_MULTIPLE,
      }
      customFilter.queType = itemlist.mapQueTypeKeyToUITextInDropDown(
        customFilter.queType
      )
      const expectedItem = filters.filter(
        (item) =>
          item.standards.grade.indexOf(grades.GRADE_4) !== -1 &&
          item.queType === questionTypeKey.MULTIPLE_CHOICE_MULTIPLE
      )

      itemlist.searchFilters.clearAll()
      itemlist.searchFilters.getAuthoredByMe()
      itemlist.searchFilters.setFilters(customFilter)
      itemlist.verifyNoOfQuestionsInUI(expectedItem.length)
      expectedItem.forEach((item) => {
        itemlist.getItemContainerInlistById(item.id)
      })
    })

    it('> grades + tags', () => {
      const customFilter = {
        standards: { grade: [grades.GRADE_4] },
        tags: ['item tag 1'],
      }
      const expectedItem = filters.filter(
        (item) =>
          item.standards.grade.indexOf(grades.GRADE_4) !== -1 &&
          item.tags.indexOf('item tag 1') !== -1
      )

      itemlist.searchFilters.clearAll()
      itemlist.searchFilters.getAuthoredByMe()
      itemlist.searchFilters.setFilters(customFilter)
      itemlist.verifyNoOfQuestionsInUI(expectedItem.length)
      expectedItem.forEach((item) => {
        itemlist.getItemContainerInlistById(item.id)
      })
    })

    it('> difficulty + dok', () => {
      const customFilter = {
        difficulty: DIFFICULTY.Easy,
        dok: DOK.ExtendedThinking,
      }
      const expectedItem = filters.filter(
        (item) =>
          item.difficulty === DIFFICULTY.Easy &&
          item.dok === DOK.ExtendedThinking
      )

      itemlist.searchFilters.clearAll()
      itemlist.searchFilters.getAuthoredByMe()
      itemlist.searchFilters.setFilters(customFilter)
      itemlist.verifyNoOfQuestionsInUI(expectedItem.length)
      expectedItem.forEach((item) => {
        itemlist.getItemContainerInlistById(item.id)
      })
    })
  })

  // just UI text verification as items come from multiple users only possible filters along with item cards are verified
  context(`> filters in 'entire libray'`, () => {
    it('> presence/absence of filter dropdowns', () => {
      itemlist.searchFilters.clearAll()
      filterAttr
        .filter((value) => value !== 'selectStatus')
        .forEach((attr) => {
          itemlist.searchFilters.getFilterButtonByAttr(attr).should('exist')
        })
      itemlist.searchFilters
        .getFilterButtonByAttr('selectStatus')
        .should('not.exist')
    })

    context(`> question type on item cards`, () => {
      it("> verify question type with 'Cloze Drop Down'", () => {
        const customFilter = { queType: questionTypeKey.CLOZE_DROP_DOWN }
        customFilter.queType = itemlist.mapQueTypeKeyToUITextInDropDown(
          customFilter.queType
        )

        itemlist.searchFilters.clearAll()
        itemlist.searchFilters.setFilters(customFilter)
        itemlist.verifyQuestionTypeAllItemsInCurrentPage(
          questionTypeKey.CLOZE_DROP_DOWN
        )
      })
      it("> verify question type with 'Cloze Drag Drop'", () => {
        const customFilter = { queType: questionTypeKey.CLOZE_DRAG_DROP }
        customFilter.queType = itemlist.mapQueTypeKeyToUITextInDropDown(
          customFilter.queType
        )

        itemlist.searchFilters.clearAll()
        itemlist.searchFilters.setFilters(customFilter)
        itemlist.verifyQuestionTypeAllItemsInCurrentPage(
          questionTypeKey.CLOZE_DRAG_DROP
        )
      })
    })

    context(`> standards on item cards`, () => {
      it("> verify standards with 'K.CC.A.1'", () => {
        const customFilter = {
          standards: {
            subject: subject.MATH,
            grade: [grades.KINDERGARTEN],
            standardSet: mathCommonCore,
            standard: [standard_1],
          },
        }
        itemlist.searchFilters.clearAll()
        itemlist.searchFilters.setFilters(customFilter)
        itemlist.verifyStandardOfAllItemsInCurrentPage(standard_1)
      })
      it("> verify question type with 'K.CC.A.2'", () => {
        const customFilter = {
          standards: {
            subject: subject.MATH,
            grade: [grades.KINDERGARTEN],
            standardSet: mathCommonCore,
            standard: [standard_2],
          },
        }
        itemlist.searchFilters.clearAll()
        itemlist.searchFilters.setFilters(customFilter)
        itemlist.verifyStandardOfAllItemsInCurrentPage(standard_2)
      })
    })

    context('> dok on item cards', () => {
      Cypress._.values(DOK).forEach((dok) => {
        it(`> for dok ${dok}`, () => {
          const customFilter = {
            dok,
          }
          itemlist.searchFilters.clearAll()
          itemlist.searchFilters.setFilters(customFilter)
          itemlist.verifyDokOfAllItemsInCurrentPage(dok)
        })
      })
    })
  })

  context(`> filters in 'shared with me'`, () => {
    it('> presence/absence of filter dropdowns', () => {
      itemlist.searchFilters.clearAll()
      itemlist.searchFilters.sharedWithMe()
      filterAttr.forEach((attr) => {
        itemlist.searchFilters.getFilterButtonByAttr(attr).should('exist')
      })
    })
  })
})
