// / <reference types="Cypress"/>
import EditItemPage from '../../../../framework/author/itemList/itemDetail/editPage'
import EssayPlainTextPage from '../../../../framework/author/itemList/questionType/writtenAndSpoken/essayPlainTextPage'
import FileHelper from '../../../../framework/util/fileHelper'
import validateSolutionBlockTests from '../../../../framework/author/itemList/questionType/common/validateSolutionBlockTests'
import { questionType } from '../../../../framework/constants/questionTypes'
import Helpers from '../../../../framework/util/Helpers'

describe(`${FileHelper.getSpecName(
  Cypress.spec.name
)} >> Author "Essay with plain text" type question`, () => {
  const queData = {
    group: 'Writing',
    queType: questionType.ESSAY_PLAIN,
    queText: 'Describe yourself in one sentence?',
    extlink: 'www.testdomain.com',
    testtext: 'testtext',
    copycut: 'testcopycutpaste',
    formula: 's=ar^2',
    placeHolder: 'PlaceHolder Text',
    fontSize: ['normal', 'large', 'xlarge', 'xxlarge'],
  }

  const question = new EssayPlainTextPage()
  const editItem = new EditItemPage()
  const words = [1, 2, 3, 4, 5]
  let i

  before(() => {
    cy.login()
  })

  context(' > User creates question', () => {
    before('visit items page and select question type', () => {
      editItem.createNewItem()
      // create new que and select type
      editItem.chooseQuestion(queData.group, queData.queType)
    })
    context(' > [essay_p_s1]] => verify default options', () => {
      it(' > user create question ,update points and save', () => {
        // temporialy visiting preview page in order to question editor box in edit page
        question
          .getQuestionEditor()
          .clear()
          .type(queData.queText)
          .should('have.text', queData.queText)
        // update points and save que
        question.clickOnAdvancedOptions()
        question.getScoreInput().type(3)
        question.header.save()
      })

      it(' > preview - verify default cut/copy/paste options', () => {
        question.header.preview()
        // verify copy paste option
        question.getTextEditor().clear().type(queData.testtext)
        question.getTextEditor().then(($ele) => {
          $ele.select()
        })
        question.clickOnCopy()
        question.getTextEditor().type(`{rightarrow}${queData.copycut}`)
        question.clickOnpaste()
        question
          .getTextEditor()
          .should(
            'have.text',
            `${queData.testtext}${queData.copycut}${queData.testtext}`
          )

        // verify cut paste option
        question.getTextEditor().clear().type(queData.testtext)
        question.getTextEditor().then(($ele) => {
          $ele.select()
        })
        question.clickOnCut()
        question.getTextEditor().type(queData.copycut)
        question.clickOnpaste()
        question
          .getTextEditor()
          .should('have.text', `${queData.copycut}${queData.testtext}`)
      })
    })

    context(' > [essay_p_s2] => validate word count', () => {
      it(' > preview - verify show word counts option', () => {
        // uncheck word counts
        question.header.edit()
        question.clickOnAdvancedOptions()
        question.getShowWordCount().click({ force: true })
        question.getShowWordCount().should('not.be.checked')
        question.header.preview()
        question.getWordCount().should('not.exist')

        // select word counts
        question.header.edit()
        question.clickOnAdvancedOptions()
        question.getShowWordCount().click({ force: true })
        question.getShowWordCount().should('be.checked')
        question.header.preview()
        question.getWordCount().should('exist')
      })

      it(' > validate word count on typing ans text', () => {
        question.getTextEditor().clear()
        // typing 5 words
        for (i in words) {
          question.getTextEditor().type(queData.testtext).type(' ')
          question.getWordCount().should('have.text', `${words[i]} Words`)
        }
      })
    })

    context(' > [essay_p_s3] => preview - verify Word Limit visibility', () => {
      it('> Verify visibility off', () => {
        question.header.edit()
        question.clickOnAdvancedOptions()
        question.selectWordlimitOption('Off')
        question.getWordLimitInput().type(3)
        question.header.preview()
        question.getWordCount().should('not.have.text', `0 / 3 Word limit`)
      })

      it('> Verify visiblity on limit', () => {
        question.header.edit()
        question.clickOnAdvancedOptions()
        question.selectWordlimitOption('On limit')
        question.getWordLimitInput().clear().type(3)
        question.header.preview()
        for (i in words) {
          question.getTextEditor().type(queData.testtext).type(' ')
          if (i < 3) {
            question.getWordCount().should('have.text', `${words[i]} Words`)
          } else {
            question
              .getWordCount()
              .should('have.text', `${words[i]} / 3 Word limit`)
          }
        }
      })

      it('> Verify always visible option', () => {
        question.header.edit()
        question.clickOnAdvancedOptions()
        question.selectWordlimitOption('Always visible')
        question.getWordLimitInput().clear().type(3)
        question.header.preview()
        for (i in words) {
          question.getTextEditor().type(queData.testtext).type(' ')
          question
            .getWordCount()
            .should('have.text', `${words[i]} / 3 Word limit`)
        }
      })
    })

    context(' >[essay_p_s4] => verify browser spellcheck', () => {
      const spellcheck = ['true', 'false']
      it(' > Verify check and uncheck spellcheck option', () => {
        spellcheck.forEach((value) => {
          question.header.edit()
          question.clickOnAdvancedOptions()
          question.getBrowserSpellCheckOption().click({ force: true })
          if (value == 'true') {
            question.getBrowserSpellCheckOption().should('be.checked')
          } else {
            question.getBrowserSpellCheckOption().should('not.be.checked')
          }
          question.header.preview()
          question
            .getPreviewBoxContainer()
            .should('have.attr', 'spellcheck', value)
        })
      })
    })

    context(
      ' > [essay_p_s5] => preview - verify cut copy paste option settings',
      () => {
        it(' > verify unselect copy option checkbox', () => {
          question.header.edit()
          question.getCopyCheckBox().click({ force: true })
          question.header.preview()
          question.getCut().should('be.visible')
          question.getCopy().should('not.exist')
          question.getPaste().should('be.visible')
        })

        it(' > verify unselect cut and copy options checkboxes', () => {
          question.header.edit()
          question.getCutCheckBox().click({ force: true })
          question.header.preview()
          question.getPaste().should('be.visible')
          question.getCopy().should('not.exist')
          question.getCut().should('not.exist')
        })

        it(' > verify unselect cut,copy and paste option checkboxes', () => {
          //
          question.header.edit()
          question.getPasteCheckBox().click({ force: true })
          question.header.preview()
          question.getPreviewBoxContainer().should('be.visible')
          question.getCopy().should('not.exist')
          question.getCut().should('not.exist')
          question.getPaste().should('not.exist')
        })
      }
    )

    context(' > [essay_p_s6] => Display block tests', () => {
      it(' > Verify Special character', () => {
        question.header.edit()
        question.clickOnAdvancedOptions()
        question.getSpecialCharactersOption().click({ force: true })
        question.getSpecialCharactersOption().should('be.checked')
        question.getCharactersToDisplayOption().type('&')
        question.header.preview()
        question.selectSpecialCharacterInPreview('&')
      })

      it(' > Min height and Max Height', () => {
        question.header.edit()
        question.getMinHeightOption().type(`{selectall}500`)
        question.getMaxHeightOption().type(`{selectall}500`)
        question.header.preview()
        question
          .getPreviewBoxContainer()
          .should('have.attr', 'minheight', '500')
        question
          .getPreviewBoxContainer()
          .should('have.attr', 'maxheight', '500')
      })

      it(' > Verify PlaceHolder', () => {
        question.header.edit()
        question.clickOnAdvancedOptions()
        question.getPlaceholderOption().type(queData.placeHolder)
        question.header.preview()
        question
          .getPreviewBoxContainer()
          .should('have.attr', 'placeholder', queData.placeHolder)
      })

      it(' > verify font size', () => {
        queData.fontSize.forEach((value) => {
          question.header.edit()
          const { name, font } = Helpers.fontSize(value)
          question.selectFont(value)
          question.getFontSizeSelect().should('contain', name)
          question.checkFontSize(font)
        })
      })
    })

    validateSolutionBlockTests(queData.group, queData.queType)
  })
})
