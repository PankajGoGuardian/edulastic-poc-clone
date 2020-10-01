import EditItemPage from '../../../../framework/author/itemList/itemDetail/editPage'
import ItemListPage from '../../../../framework/author/itemList/itemListPage'
import ClassificationPage from '../../../../framework/author/itemList/questionType/classifyMatchOrder/classificationPage'
import FileHelper from '../../../../framework/util/fileHelper'
import Helpers from '../../../../framework/util/Helpers'
import CypressHelper from '../../../../framework/util/cypressHelpers'
import { questionType } from '../../../../framework/constants/questionTypes'

describe(`${FileHelper.getSpecName(
  Cypress.spec.name
)} >> Author "Classification" type question`, () => {
  const queData = {
    group: 'Classify, Match & Order',
    queType: questionType.CLASSIFICATION,
    queText: 'Select the correct option?',
    template: " is the world's largest democracy",
    correctAns: 'India',
    choices: ['China', 'India'],
    forScoring: ['Choice B', 'Choice C', 'Choice A', 'Choice D'],
    extlink: 'www.testdomain.com',
    testtext: 'testtext',
    formula: 's=ar^2',
    column: 2,
    row: 1,
    columnTitles: ['Column1', 'Column2'],
    rowTitles: ['Row1'],
    points: 2,
  }

  const question = new ClassificationPage()
  const editItem = new EditItemPage()
  const itemList = new ItemListPage()
  let preview

  let testItemId

  before(() => {
    cy.login()
  })

  context(' > Advanced Options', () => {
    before('visit items page and select question type', () => {
      editItem.createNewItem()
      // add new question
      editItem.chooseQuestion(queData.group, queData.queType)
    })

    beforeEach(() => {
      editItem.header.edit()
      editItem.showAdvancedOptions() // UI toggle has been removed
    })

    afterEach(() => {
      editItem.header.edit()
    })

    describe(' > Layout', () => {
      it(' > should be able to select top response container position', () => {
        const select = question
          .getResponseContainerPositionSelect()
          .scrollIntoView()

        select.should('be.visible').click()

        question.getTopResContainerOption().should('be.visible').click()

        select.should('contain', 'Top')
        question.checkResponseContainerPosition('top')
      })
      it(' > should be able to select bottom response container position', () => {
        const select = question
          .getResponseContainerPositionSelect()
          .scrollIntoView()

        select.should('be.visible').click()

        question.getBottomResContainerOption().should('be.visible').click()

        select.should('contain', 'Bottom')
        question.checkResponseContainerPosition('bottom')
      })
      it(' > should be able to select left response container position', () => {
        const select = question
          .getResponseContainerPositionSelect()
          .scrollIntoView()

        select.should('be.visible').click()

        question.getLeftResContainerOption().should('be.visible').click()

        select.should('contain', 'Left')
        question.checkResponseContainerPosition('left')
      })
      it(' > should be able to select right response container position', () => {
        const select = question
          .getResponseContainerPositionSelect()
          .scrollIntoView()

        select.should('be.visible').click()

        question.getRightResContainerOption().should('be.visible').click()

        select.should('contain', 'Right')
        question.checkResponseContainerPosition('right')
      })
      it(' > should be able to select numerical stem numeration', () => {
        const select = question.getStemNumerationSelect().scrollIntoView()

        select.should('be.visible').click()

        question.getNumericalOption().should('be.visible').click()

        select.should('contain', 'Numerical')
      })
      it(' > should be able to select Uppercase Alphabet stem numeration', () => {
        const select = question.getStemNumerationSelect().scrollIntoView()

        select.should('be.visible').click()

        question.getUppercaseAlphabetOption().click()

        select.should('contain', 'Uppercase Alphabet')
      })
      it(' > should be able to select Lowercase Alphabet stem numeration', () => {
        const select = question.getStemNumerationSelect().scrollIntoView()

        select.should('be.visible').click()

        question.getLowercaseAlphabetOption().click()

        select.should('contain', 'Lowercase Alphabet')
      })
      it(' > should be able to change row titles width', () => {
        const width = '133px'
        question.getRowTitlesWidthInput().type(`{selectall}${width}`)

        question.checkRowTitlesWidth(width)
      })
      it(' > should be able to change row min height width', () => {
        const height = '173px'

        question
          .getRowMinHeightInput()
          .should('be.visible')
          .type(`{selectall}${height}`)

        question.checkRowTitlesMinHeight(height)
      })
      it(' > should be able to type row header and change it', () => {
        const text = 'Row header'

        question
          .getRowHeaderInput()
          .should('be.visible')
          .type(text, { force: true })
          .should('contain', text)

        question.checkRowHeader(text)
      })
      it(' > should be able to type maximum response per cell', () => {
        const resPerCell = 2

        question
          .getMaximumResponsesPerCellInput()
          .should('be.visible')
          .type(`{selectall}${resPerCell}`)
          .should('have.value', `${resPerCell}`)
      })
      it(' > should be able to select small font size', () => {
        const select = question.getFontSizeSelect()
        const { name, font } = Helpers.fontSize('small')

        select.scrollIntoView().should('be.visible').click()

        question.getSmallFontSizeOption().should('be.visible').click()

        select.scrollIntoView().should('contain', name)
        question.checkFontSize(font)
      })
      it(' > should be able to select normal font size', () => {
        const select = question.getFontSizeSelect()
        const { name, font } = Helpers.fontSize('normal')

        select.scrollIntoView().should('be.visible').click()

        question.getNormalFontSizeOption().should('be.visible').click()

        select.scrollIntoView().should('contain', name)
        question.checkFontSize(font)
      })
      it(' > should be able to select large font size', () => {
        const select = question.getFontSizeSelect()
        const { name, font } = Helpers.fontSize('large')

        select.scrollIntoView().should('be.visible').click()

        question.getLargeFontSizeOption().should('be.visible').click()

        select.scrollIntoView().should('contain', name)
        question.checkFontSize(font)
      })
      it(' > should be able to select extra large font size', () => {
        const select = question.getFontSizeSelect()
        const { name, font } = Helpers.fontSize('xlarge')

        select.scrollIntoView().should('be.visible').click()

        question.getExtraLargeFontSizeOption().should('be.visible').click()

        select.scrollIntoView().should('contain', name)
        question.checkFontSize(font)
      })
      it(' > should be able to select huge font size', () => {
        const select = question.getFontSizeSelect()
        const { name, font } = Helpers.fontSize('xxlarge')

        select.scrollIntoView().should('be.visible').click()

        question.getHugeFontSizeOption().should('be.visible').click()

        select.scrollIntoView().should('contain', name)
        question.checkFontSize(font)
      })
    })
  })

  context(' > User creates question', () => {
    before('visit items page and select question type', () => {
      editItem.createNewItem()
      // add new question
      editItem.chooseQuestion(queData.group, queData.queType)
    })

    context(' > TC_57 => Enter the column and row', () => {
      it(' > Enter only numbers', () => {
        question
          .getDropDownColumn()
          .click()
          .then(() => {
            question
              .getDropDownListColumn(queData.column - 1)
              .should('be.visible')
              .click()
          })

        question.getDropDownColumn().contains('div', queData.column)

        question
          .getDropDownRow()
          .click()
          .then(() => {
            question
              .getDropDownListRow(queData.row - 1)
              .should('be.visible')
              .click()
          })

        question.getDropDownRow().contains('div', queData.row)
      })
    })

    context(' > TC_58 => Column titles', () => {
      before('Should have existing titles', () => {
        question
          .getColumnTitleInptuList()
          .should('have.length', queData.columnTitles.length)
      })

      it(' > Edit the column names', () => {
        question.getColumnTitleInptuList().each(($el, index) => {
          cy.wrap($el)
            .click()
            .clear()
            .type(queData.columnTitles[index])
            .should('contain', queData.columnTitles[index])
        })
      })

      it(' > Add new column', () => {
        CypressHelper.selectDropDownByAttribute('coloumn-dropdown-list-2', '3')
        question
          .getColumnTitleInptuList()
          .should('have.length', queData.columnTitles.length + 1)
        /* .last()
        .click()
        .clear()
        .type("Last")
        .should("contain", "Last"); */
      })

      it(' > Delete existing column', () => {
        question
          .getColumnDeleteByIndex(queData.columnTitles.length)
          .click()
          .should('not.exist')

        question
          .getColumnTitleInptuList()
          .should('have.length', queData.columnTitles.length)
      })
    })

    context(' > TC_59 => Row titles', () => {
      before('Should have existing titles', () => {
        question.getRowAddButton().click()
        question
          .getRowTitleInptuList()
          .should('have.length', queData.rowTitles.length)
      })

      it(' > Add new row', () => {
        question
          .getRowAddButton()
          .click()
          .then(() => {
            question
              .getRowTitleInptuList()
              .should('have.length', queData.rowTitles.length + 1)
              .last()
              .click()
              .clear()
              .type('Last')
              .should('contain', 'Last')
          })
      })

      it(' > Edit the row names for existing', () => {
        question
          .getRowTitleInputByIndex(1)
          .click()
          .clear()
          .type(queData.rowTitles[0])
          .should('contain', queData.rowTitles[0])
      })

      it(' > Delete existing / newly created rows', () => {
        question
          .getRowDeleteByIndex(queData.rowTitles.length)
          .click()
          .should('not.exist')

        question
          .getRowTitleInptuList()
          .should('have.length', queData.rowTitles.length)
      })
    })

    context(' > TC_60 => Group possible responses', () => {
      it(' > Check the group possible responses checkbox', () => {
        question.getGroupResponsesCheckbox().click()

        question.getGroupResponsesCheckbox().find('input').should('be.checked')

        question.getGroupContainerByIndex(0).should('be.visible')
      })

      it(' > Enter the title of group', () => {
        question
          .getTitleInputByIndex(0)
          .clear()
          .type('Group1')
          .should('have.value', 'Group1')
      })

      it(' > Add/Delete new choices', () => {
        question
          .getChoiceListByGroup(0)
          .each(($el, index, $list) => {
            const cusIndex = $list.length - (index + 1)
            question.deleteChoiceByGroup(0, cusIndex)
          })
          .should('have.length', 0)

        queData.choices.forEach((ch, index) => {
          question.getAddNewChoiceByIndex(0).should('be.visible').click()
          question
            .getChoiceEditorByGroup(0, index)
            .type(`{selectall}${ch}`)
            .should('be.visible')
          question.getDragDropBox().contains('p', ch).should('be.visible')
        })
      })

      it(' > Add new group', () => {
        question
          .getAddNewGroupButton()
          .click()
          .then(() => {
            question.getGroupContainerByIndex(1).should('be.visible')
          })
      })

      it(' > Delete group', () => {
        question
          .getGroupContainerByIndex(1)
          .contains('div', 'Group 2')
          .parent()
          .next()
          .should('be.visible')
          .click()
          .then(() => {
            question.getGroupContainerByIndex(1).should('not.exist')
          })
      })
    })

    context(' > TC_61 => Set Correct Answer(s)', () => {
      it(' > Update Points', () => {
        question
          .getPontsInput()
          .focus()
          .clear()
          .type('{selectall}1')
          .should('have.value', '1')
          .type('{uparrow}')
          .should('have.value', '1.5')
          .blur()
      })

      it(' > Drag and drop the answer choices inside the box', () => {
        queData.choices.forEach((ch, index) => {
          question
            .getDragDropItemByIndex(0)
            .customDragDrop(`#drag-drop-board-${index}`)
          question.getDragDropBoardByIndex(index).contains('p', ch)
        })
      })

      it(' > Click on + symbol', () => {
        question.addAlternate()
        question
          .getAddedAlternate()
          .then(($el) => {
            cy.wrap($el).should('be.visible').click()
          })
          .should('not.exist')
      })
    })

    context(' > TC_62 => Save question', () => {
      it(' > Click on save button', () => {
        question.header.save()
        cy.url().should('contain', 'item-detail')
      })
    })

    context(' > TC_63 => Preview Items', () => {
      it(' > Click on preview', () => {
        preview = editItem.header.preview()
        cy.get('body').contains('span', 'Check Answer')

        queData.choices.forEach((ch, index) => {
          question
            .getDragDropItemByIndex(index)
            .customDragDrop(`#drag-drop-board-${index}`)
          question.getDragDropBoardByIndex(index).contains('p', ch)
        })
      })

      it(' > Click on Check answer', () => {
        preview.checkScore('2/2')
      })

      it(' > Click on Show Answers', () => {
        preview
          .getShowAnswer()
          .click()
          .then(() => {
            cy.get('body').children().contains('h3', 'Correct Answers')
          })
      })

      it(' > Click on Clear', () => {
        preview
          .getClear()
          .click()
          .then(() => {
            cy.get('body').children().should('not.contain', 'Correct Answers')
          })

        preview.header.edit()
      })
    })
  })

  context(' > Edit the questin created', () => {
    before('delete old question and create dummy que to edit', () => {
      editItem.createNewItem()
      // add new question
      editItem.chooseQuestion(queData.group, queData.queType)
    })

    context(' > TC_65 => Enter the column and row', () => {
      it(' > Enter only numbers', () => {
        question
          .getDropDownColumn()
          .click()
          .then(() => {
            question
              .getDropDownListColumn(queData.column - 1)
              .should('be.visible')
              .click()
          })

        question.getDropDownColumn().contains('div', queData.column)

        question
          .getDropDownRow()
          .click()
          .then(() => {
            question
              .getDropDownListRow(queData.row - 1)
              .should('be.visible')
              .click()
          })

        question.getDropDownRow().contains('div', queData.row)
      })
    })

    context(' > TC_66 => Column titles', () => {
      before('Should have existing titles', () => {
        question
          .getColumnTitleInptuList()
          .should('have.length', queData.columnTitles.length)
      })

      it(' > Edit the column names', () => {
        question.getColumnTitleInptuList().each(($el, index) => {
          cy.wrap($el)
            .click()
            .clear()
            .type(queData.columnTitles[index])
            .should('contain', queData.columnTitles[index])
        })
      })

      it(' > Add new column', () => {
        question
          .getColumnAddButton()
          .click()
          .then(() => {
            question
              .getColumnTitleInptuList()
              .should('have.length', queData.columnTitles.length + 1)
              .last()
              .click()
              .clear()
              .type('Last')
              .should('contain', 'Last')
          })
      })

      it(' > Delete existing column', () => {
        question
          .getColumnDeleteByIndex(queData.columnTitles.length)
          .click()
          .should('not.exist')

        question
          .getColumnTitleInptuList()
          .should('have.length', queData.columnTitles.length)
      })
    })

    context(' > TC_67 => Row titles', () => {
      before('Should have existing titles', () => {
        question.getRowAddButton().click()
        question
          .getRowTitleInptuList()
          .should('have.length', queData.rowTitles.length)
      })

      it(' > Add new row', () => {
        question
          .getRowAddButton()
          .click()
          .then(() => {
            question
              .getRowTitleInptuList()
              .should('have.length', queData.rowTitles.length + 1)
              .last()
              .click()
              .clear()
              .type('Last')
              .should('contain', 'Last')
          })
      })

      it(' > Edit the row names for existing', () => {
        question
          .getRowTitleInputByIndex(1)
          .click()
          .clear()
          .type(queData.rowTitles[0])
          .should('contain', queData.rowTitles[0])
      })

      it(' > Delete existing / newly created rows', () => {
        question
          .getRowDeleteByIndex(queData.rowTitles.length)
          .click()
          .should('not.exist')

        question
          .getRowTitleInptuList()
          .should('have.length', queData.rowTitles.length)
      })
    })

    context(' > TC_68 => Group possible responses', () => {
      it(' > Check the group possible responses checkbox', () => {
        question.getGroupResponsesCheckbox().click()

        question.getGroupResponsesCheckbox().find('input').should('be.checked')

        question.getGroupContainerByIndex(0).should('be.visible')
      })

      it(' > Enter the title of group', () => {
        question
          .getTitleInputByIndex(0)
          .clear()
          .type('Group1')
          .should('have.value', 'Group1')
      })

      it(' > Add/Delete new choices', () => {
        question
          .getChoiceListByGroup(0)
          .each(($el, index, $list) => {
            const cusIndex = $list.length - (index + 1)
            question.deleteChoiceByGroup(0, cusIndex)
          })
          .should('have.length', 0)

        queData.choices.forEach((ch, index) => {
          question.getAddNewChoiceByIndex(0).should('be.visible').click()
          question
            .getChoiceEditorByGroup(0, index)
            .type(`{selectall}${ch}`)
            .should('be.visible')
          question.getDragDropBox().contains('p', ch).should('be.visible')
        })
      })

      it(' > Add new group', () => {
        question
          .getAddNewGroupButton()
          .click()
          .then(() => {
            question.getGroupContainerByIndex(1).should('be.visible')
          })
      })

      it(' > Delete group', () => {
        question
          .getGroupContainerByIndex(1)
          .contains('div', 'Group 2')
          .parent()
          .next()
          .should('be.visible')
          .click()
          .then(() => {
            question.getGroupContainerByIndex(1).should('not.exist')
          })
      })
    })

    context(' > TC_69 => Set Correct Answer(s)', () => {
      it(' > Update Points', () => {
        question
          .getPontsInput()
          .focus()
          .clear()
          .type('{selectall}1')
          .should('have.value', '1')
          .type('{uparrow}')
          .should('have.value', '1.5')
          .blur()
      })

      it(' > Drag and drop the answer choices inside the box', () => {
        queData.choices.forEach((ch, index) => {
          question
            .getDragDropItemByIndex(0)
            .customDragDrop(`#drag-drop-board-${index}`)
          question.getDragDropBoardByIndex(index).contains('p', ch)
        })
      })

      it(' > Click on + symbol', () => {
        question.addAlternate()
        question
          .getAddedAlternate()
          .then(($el) => {
            cy.wrap($el).should('be.visible').click()
          })
          .should('not.exist')
      })
    })

    context(' > TC_70 => Save question', () => {
      it(' > Click on save button', () => {
        question.header.save()
        cy.url().should('contain', 'item-detail')
      })
    })
  })

  context(' > Delete the question after creation', () => {
    context(' > Tc_71 => Delete option', () => {
      before(() => {
        editItem.createNewItem()
        // add new question
        editItem.chooseQuestion(queData.group, queData.queType)
        editItem.header.save()
      })

      it(' > Click on delete button in Item Details page', () => {
        editItem
          .getDelButton()
          .should('have.length', 1)
          .click()
          .should('have.length', 0)
      })

      it(' > After delete, UI should not break', () => {
        editItem.getEditButton().should('be.visible')
      })
    })
  })

  context(' > Scoring block tests', () => {
    before('visit items page and select question type', () => {
      editItem.createNewItem()
      // add new question
      editItem.chooseQuestion(queData.group, queData.queType)
    })

    afterEach(() => {
      const preiview = question.header.preview()
      preiview.getClear().click()

      question.header.edit()

      // question.clickOnAdvancedOptions();
    })

    /*  it(" > test score with max score", () => {
       // question.clickOnAdvancedOptions();
 
       question
         .getMaxScore()
         .clear()
         .type(1);
 
       const preiview = question.header.preview();
 
       preiview
         .getCheckAnswer()
         .click()
         .then(() => {
           cy.get("body")
             .children()
             .should("contain", "score: 0/10");
         });
     }); */

    it(' > test score with min score if attemted', () => {
      question.getMaxScore().clear()

      question.getEnableAutoScoring().click()

      question.getPontsInput().clear().type('12{del}')

      question.getMinScore().clear().type(2)

      const preiview = question.header.preview()

      question.getDragDropItemByIndex(0).customDragDrop(`#drag-drop-board-${0}`)

      preiview
        .getCheckAnswer()
        .click()
        .then(() => {
          cy.get('body').children().should('contain', 'score: 2/12')
        })
    })

    it(' > test score with partial match and penalty', () => {
      question.getMinScore().clear()

      question.selectScoringType('Partial match')

      question.getPanalty().clear().type(4)

      const preiview = question.header.preview()

      queData.forScoring.forEach((choice, index) => {
        question
          .getDragDropItemByIndex(index)
          .customDragDrop(`#drag-drop-board-${index < 2 ? 0 : 1}`)
      })

      preiview
        .getCheckAnswer()
        .click()
        .then(() => {
          cy.get('body').children().should('contain', 'score: 4/12')
        })
    })
  })
})
