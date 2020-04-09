import MCQStandardPage from "./mcqStandardPage";
import EditItemPage from "../../itemDetail/editPage";
import { questionType, questionGroup } from "../../../../constants/questionTypes";

class MCQTrueFalsePage extends MCQStandardPage {
  setCorrectAnswer = answerChoice => {
    this.getAllAnsChoicesLabel()
      .contains(answerChoice)
      .click();
  };

  // default question
  createQuestion(queKey = "default", queIndex = 0, onlyItem = true) {
    const item = new EditItemPage();
    item.createNewItem(onlyItem);
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
              .click()
              .type(`{selectall}${choice}`, { force: true });
          });
        });
      }

      if (setAns) {
        const { correct, points } = setAns;
        this.getPoints()
          .clear({ force: true })
          .type(`{selectAll}${points}`);

        // uncheck default ans
        this.getAllAnsChoicesLabel()
          .find("input:checked")
          .click({ force: true });

        this.setCorrectAnswer(correct);

        // this.header.save();
        // item.updateItemLevelScore(points);
      }
      // item.header.save(true);
    });
  }
}

export default MCQTrueFalsePage;
