import MathFillInTheBlanksPage from "./MathFillInTheBlanksPage";

class MathWithUnitsPage extends MathFillInTheBlanksPage {
  // template

  getMathKeyboardResponse = () => cy.get('[data-cy="math-keyboard-response"]');

  clearTemplateInput = () =>
    this.getMathquillBlockId().then(inputElements => {
      const { length } = inputElements[0].children;
      this.getTemplateInput()
        .movesCursorToEnd(length)
        .type("{backspace}".repeat(length || 1), { force: true });
    });

  setResponseInput = () =>
    this.getTemplateInput()
      .click({ force: true })
      .then(() => this.getMathKeyboardResponse().click({ force: true }));
}
export default MathWithUnitsPage;
