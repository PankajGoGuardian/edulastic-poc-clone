import MathFractionPage from "./mathFractionPage";

class MathFillInTheBlanksPage extends MathFractionPage {
  constructor() {
    super();
    this.virtualKeyBoardButtons = [];
  }

  // template
  getKeyboard = () => cy.get('[data-cy="keyboard"]');
  gettemplate = () => cy.get("[answer-math-input-field] [mathquill-block-id]");
}

export default MathFillInTheBlanksPage;
