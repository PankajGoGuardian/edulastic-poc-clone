import MCQStandardPage from './mcqStandardPage'
import EditItemPage from '../../itemDetail/editPage'
import {
  questionType,
  questionGroup,
} from '../../../../constants/questionTypes'

class MCQBlockLayoutPage extends MCQStandardPage {
  // default question
  createQuestion(queKey = 'default', queIndex = 0, onlyItem = true) {
    const item = new EditItemPage()
    item.createNewItem(onlyItem)
    item.chooseQuestion(questionGroup.MCQ, questionType.MCQ_BLOCK)
    cy.fixture('questionAuthoring').then((authoringData) => {
      const { quetext, choices, setAns } = authoringData.MCQ_BLOCK[queKey]

      if (quetext) {
        const text = `Q${queIndex + 1} - ${quetext}`
        this.setQuestionEditorText(text)
      }

      if (choices) {
        const choicesCount = choices.length
        this.getAllChoices().then((allChoices) => {
          const defaultChoiceCount = allChoices.length
          let choiceDiff = defaultChoiceCount - choicesCount
          while (choiceDiff > 0) {
            this.deleteChoiceByIndex(0)
            choiceDiff -= 1
          }
          while (choiceDiff < 0) {
            this.addNewChoice()
            choiceDiff += 1
          }
          choices.forEach((choice, index) => {
            this.getChoiceByIndex(index)
              .clear({ force: true })
              .type(choice, { force: true })
          })
        })
      }

      if (setAns) {
        const { correct, points } = setAns
        this.getPoints().clear({ force: true }).type(`{selectAll}${points}`)

        this.getAllAnsChoicesLabel()
          .find('input:checked')
          .click({ force: true })

        correct.forEach((choice) => {
          this.getAllAnsChoicesLabel().contains(choice).click()
        })

        // this.header.save();
        /*  item.updateItemLevelScore(points);
        item.header.save(true); */
      }
    })
  }
}
export default MCQBlockLayoutPage
