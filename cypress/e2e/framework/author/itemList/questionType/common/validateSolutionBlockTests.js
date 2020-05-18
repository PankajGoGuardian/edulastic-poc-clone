import solutionBlockPage from "../../../../author/itemList/questionType/common/solutionBlock.js";
import EditItemPage from "../../../../../framework/author/itemList/itemDetail/editPage.js";

const validateSolutionBlockTests = (questionGroup, questionType) => {
  const editItem = new EditItemPage();
  const question = new solutionBlockPage();
  const hints = ["Hint One", "Hint Two", "Hint Three"];

  context(" > Solution block tests", () => {
    before("visit items page and select question type", () => {
      editItem.sideBar.clickOnDashboard();
      editItem.createNewItem();
      // add new question
      editItem.chooseQuestion(questionGroup, questionType);
      question.clickOnAdvancedOptions();
    });

    it(" > Check DISTRACTOR RATIONALE added in the question", () => {
      question.VerifyDistractor("Distractor");
    });

    it(" > Check EXPLANATION added in the question", () => {
      question.verifyExplanation("Explanation");
    });

    it(" > Check HINT added in the question", () => {
      question.header.edit();
      question.addHint(hints[0]);
      question.header.preview();
      question.clickOnShowHintButton(1);
      question.VerifyHintInPreview(0, 1, hints[0]);
    });

    it(" > Check multiple HINTS added in the question", () => {
      question.header.edit();
      let hintLength = 1;
      hints.forEach((hint, index) => {
        question.addHint(hint, index);
        question.header.preview();
        question.clickOnShowHintButton();
        question.VerifyHintInPreview(index, hintLength, hint);
        hintLength++;
        question.header.edit();
      });
    });

    it(" > Delete all HINTS in the question", () => {
      question.header.edit();
      let lengthOfhint = hints.length;
      hints.forEach(hint => {
        question.deleteHint(--lengthOfhint);
      });
      question.header.preview();
      question.getHintContainer().should("not.exist");
    });

    it(" > Should be able to delete 1st HINT in the question", () => {
      question.header.edit();
      question.addNewHint();
      hints.forEach((hint, index) => {
        question.addHint(hint, index);
      });
      question.deleteHint(0);
      const deletedHint = hints[0];
      hints.shift();
      hints.forEach((hint, index) => {
        question.verifyHintNotExist(deletedHint, hints.length);
      });
      question.header.preview();
      question.clickOnShowHintButton();
      hints.forEach((hint, index) => {
        question.VerifyDeletedHintInPreview(index, index + 1, deletedHint, hints.length);
      });
    });
  });
};
export default validateSolutionBlockTests;
