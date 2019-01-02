import ItemListPage from '../../../../framework/author/itemList/itemListPage.js';
import ChoiceMatrixStandardPage from '../../../../framework/author/itemList/questionType/mcq/choiceMatrixStandardPage.js';

describe('Test Authoring - \"Choice matrix - standard\" Type Question', () => {
  before(() => {
    cy.setToken();
  });

  const queGroup = 'Multiple Choice';
  const queType = 'Choice matrix - standard'
  const testText = 'test content'
  const questionData = {"queText":"Choose the correct number of days in following month",
                        "ansChoiceMap":{"JAN":31,"APR":30,"MAY":31,"JUN":30}
                        }

  context('sanity of all the option', () => {
    const question = new ChoiceMatrixStandardPage();
    before('visit items list page and select question', () => {
      cy.visit('/author/Items');
      const items = new ItemListPage();

      items.clickOnCreate()
        .addNew()
        .chooseQuestion(queGroup,queType);  
    })

      
    it('test => edit question text', () => {
      question.getQuestionEditor()
        .clear()
        .type(questionData.queText)
        .should('contain',questionData.queText);
    })

    it('test => edit/delete multiple choice options', () => {
      // edit the 1st ans choice
      question.getChoiceByIndex(0)
        .clear()
        .type(testText)
        .should('contain',testText);

      // delete the 1st ans choice
      question.deleteChoiceByIndex(0);

      question.getChoiceByIndex(0)
        .should('not.contain',testText);

      // add new choice
      question.addNewChoice();

      question.getChoiceByIndex(3)
        .type(testText)
        .should('contain',testText);

      question.getallChoices()
        .should('be.have.length',4);

    })

    it('test => edit/delete steam options', () => {
      // edit the 1st steam
      question.getSteamByIndex(0)
        .clear()
        .type(testText)
        .should('contain',testText);

      // delete the 1st steam
      question.deleteSteamByIndex(0);

      question.getSteamByIndex(0)
        .should('not.contain',testText);

      // add new steam
      question.addNewSteam();

      question.getSteamByIndex(1)
        .type(testText)
        .should('contain',testText);

      question.getallSteam()
        .should('be.have.length',2);

    })

    it('test => set correct ans,points,mupltiple response,alternate', () => {

      // setting correct ans
      question.getCorrectAnsTable()
                .each(($ele, index, $list)  => {
                  cy.wrap($ele).find('input')
                    .eq(index % 2)
                    .click();
                })

      // points

      // add alternate
      question.addAlternate()

      question.getAlternates()
        .should('have.length',1);

      // delete alternate
      question.deleteAlternate();

      question.getAlternates().should('not.exist');

      // check muplti response
      question.getMultipleResponse().click();
      question.getCorrectAnsTable()
                .each(($ele)  => {
                  cy.wrap($ele)
                    .find('input')
                    .should('have.attr','type','checkbox');
                });

    })
  })
});

