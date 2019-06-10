import MCQStandardPage from "./mcqStandardPage";
import EditItemPage from "../../itemDetail/editPage";
import { questionType, questionGroup } from "../../../../constants/questionTypes";

class MCQTrueFalsePage extends MCQStandardPage {
  // default question
  createQuestion(queKey = "default", queIndex = 0) {
    const item = new EditItemPage();
    item.createNewItem();
    item.chooseQuestion(questionGroup.MCQ, questionType.MCQ_TF);
    cy.fixture("questionAuthoring").then(authoringData => {
      const { quetext, choices, setAns } = authoringData.MCQ_TF[queKey];

      if (quetext) {
        const text = `Q${queIndex + 1} - ${quetext}`;
        this.setQuestionEditorText(text);
      }

      if (choices) {
        const choicesCount = choices.length;
        this.getAllChoices().then(allChoices => {
          const defaultChoiceCount = allChoices.length;
          let choiceDiff = defaultChoiceCount - choicesCount;
          while (choiceDiff > 0) {
            this.deleteChoiceByIndex(0);
            choiceDiff -= 1;
          }
          while (choiceDiff < 0) {
            this.addNewChoice();
            choiceDiff += 1;
          }
          choices.forEach((choice, index) => {
            this.getChoiceByIndex(index)
              .clear({ force: true })
              .type(choice, { force: true });
          });
        });
      }

      if (setAns) {
        const { correct, points } = setAns;
        /* this.getPoints()
          .clear()
          .type(points); */

        // uncheck default ans
        this.getAllAnsChoicesLabel()
          .find("input:checked")
          .click({ force: true });

        this.getAllAnsChoicesLabel()
          .contains(correct)
          .click();

        this.header.save();
        item.updateItemLevelScore(points);
      }
      item.header.save(true);
    });
  }
}

export default MCQTrueFalsePage;
