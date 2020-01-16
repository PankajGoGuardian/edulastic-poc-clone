import MathFormulaEdit from "../math/mathFormulaEdit";
import CypressHelper from "../../../../util/cypressHelpers";

class MathTextDropDown extends MathFormulaEdit {
  constructor() {
    super();
    this.test = {};
  }

  // ADDITIONAL COMPOMNENTS FOR MATH ENGINE SUITE STARTs HERE

  clickOnMathCloze = () => cy.get('[class^="ClozeMathAnswer]').click({ force: true });

  clickOnAdditionalToggle = () => cy.contains("Additional Options").click({ force: true });

  uncheckAllOptions = () =>
    cy.get('[class^="Widget__WidgetMethods"]').then(ele => {
      if (Cypress.$(ele).find("input:checked").length > 0) {
        cy.wrap(ele)
          .find("input:checked")
          .uncheck({ force: true });
      }
    });

  selectEvaluationMethod = methodName => {
    CypressHelper.selectDropDownByAttribute("method-selection-dropdown", methodName);
  };

  checkOption = option => cy.get(`[data-cy="${option}"]`).check({ force: true });

  // allow variable
  setAllowedVariable = variable =>
    cy
      .get(".allowed-variables")
      .clear()
      .type(variable);

  // set decimal seperator
  setDecimalSeperator = seperator => {
    const key = seperator === "," ? "Comma" : "Dot";
    const selector = `[data-cy="answer-set-decimal-separator-dropdown-list-${key}"]`;

    cy.get(`[data-cy="answer-set-decimal-separator-dropdown"]`).click({ force: true });
    cy.get(selector).click({ force: true });
  };

  // set thousand seperator
  setThousandSeperator = seperator => {
    const key = seperator === " " ? "Space" : seperator === "." ? "Dot" : "Comma";
    const selector = `[data-cy="thousands-separator-dropdown-list-${key}"]`;

    cy.get(`[data-cy="thousands-separator-dropdown"]`).click({ force: true });
    cy.get(selector).click({ force: true });
  };

  // set tolerance
  setTolerance = tolerance =>
    cy
      .get('[data-cy="answer-tolerance"]')
      .clear()
      .type(tolerance, { force: true });

  // set significant decimal
  setSignificantDecimalPlace = significant =>
    cy
      .get('[data-cy="answer-significant-decimal-places"]')
      .clear()
      .type(significant);

  // ADDITIONAL COMPOMNENTS FOR MATH ENGINE SUITE ENDs HERE
}

export default MathTextDropDown;
