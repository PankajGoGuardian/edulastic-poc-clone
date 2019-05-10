import MCQStandardPage from "./mcqStandardPage";
import EditItemPage from "../../itemDetail/editPage";
import { questionType, questionGroup } from "../../../../constants/questionTypes";

class MCQMultiplePage extends MCQStandardPage {
  constructor() {
    super();
  }

  // default question
  createQuestion(queKey = "default", queIndex = 0) {
    const item = new EditItemPage();
    item.createNewItem();
    item.chooseQuestion(questionGroup.MCQ, questionType.MCQ_MULTI);
    cy.fixture("questionAuthoring").then(authoringData => {
      const { quetext, choices, setAns } = authoringData.MCQ_MULTI[queKey];

      if (quetext) {
        const text = `Q${queIndex + 1} - ${quetext}`;
        this.getQuestionEditor()
          .clear()
          .type(text);
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
              .clear()
              .type(choice);
          });
        });
      }

      if (setAns) {
        const { correct, points } = setAns;
        this.getPoints()
          .clear()
          .type(points);

        correct.forEach(choice => {
          this.getAllAnsChoicesLabel()
            .contains(choice)
            .click();
        });
      }

      this.header.save();
    });
  }
}
export default MCQMultiplePage;
