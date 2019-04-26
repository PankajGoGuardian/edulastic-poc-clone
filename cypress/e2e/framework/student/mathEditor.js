class MathEditor {
  // formular

  formularBoard = () => cy.get(".mq-editable-field");

  formularInput = () => this.formularBoard().find("textarea");

  typeFormula = answer => {
    this.clearFormula();
    this.formularInput()
      .click({ force: true })
      .then($el => {
        cy.wrap($el)
          .typeWithDelay(answer)
          .then(() => {
            this.checkTypedFormulaCount(answer.length);
          });
      });
  };

  checkTypedFormulaCount = length => {
    this.formularBoard()
      .find(".mq-root-block > [mathquill-command-id]")
      .should("have.length", length);
  };

  clearFormula = () => {
    this.formularBoard().then($el => {
      if ($el.find(".mq-root-block > [mathquill-command-id]").length > 0) {
        this.formularBoard()
          .find(".mq-root-block > [mathquill-command-id]")
          .each(() => {
            this.formularInput().typeWithDelay("{backspace}{del}");
          });
        this.checkTypedFormulaCount(0);
      }
    });
  };

  clickVirtualKeyboardByNumber = char => {
    cy.get(`[data-cy="virtual-keyboard-${char}"]`).click();
  };

  typeFormulaWithVirtualKeyboard = answer => {
    this.clearFormula();
    this.formularInput()
      .click({ force: true })
      .then(() => {
        cy.get(".input__keyboard").should("be.visible");
        answer.split("").forEach(c => this.clickVirtualKeyboardByNumber(c));
      });
    this.checkTypedFormulaCount(answer.length);
  };

  // fraction

  numeratorBoard = () => cy.get(".mq-numerator > .mq-editable-field");

  numeratorInput = () => this.numeratorBoard().find("textarea");

  typeFractionNumerator = answer => {
    this.clearFractionNumerator();
    this.numeratorInput()
      .click({ force: true })
      .then($el => {
        cy.wrap($el)
          .typeWithDelay(answer)
          .then(() => {
            this.checkTypedFractionNumeratorCount(answer.length);
          });
      });
  };

  checkTypedFractionNumeratorCount = length => {
    this.numeratorBoard()
      .find(".mq-root-block > [mathquill-command-id]")
      .should("have.length", length);
  };

  clearFractionNumerator = () => {
    this.numeratorBoard().then($el => {
      if ($el.find(".mq-root-block > [mathquill-command-id]").length > 0) {
        this.numeratorBoard()
          .find(".mq-root-block > [mathquill-command-id]")
          .each(() => {
            this.numeratorInput().typeWithDelay("{backspace}{del}");
          });
        this.checkTypedFractionNumeratorCount(0);
      }
    });
  };

  typeFractionNumeratorWithVirtualKeyboard = answer => {
    this.clearFractionNumerator();
    this.numeratorInput()
      .click({ force: true })
      .then(() => {
        cy.get(".input__keyboard").should("be.visible");
        answer.split("").forEach(c => this.clickVirtualKeyboardByNumber(c));
      });
    this.checkTypedFractionNumeratorCount(answer.length);
  };

  denominatorBoard = () => cy.get(".mq-denominator > .mq-editable-field");

  denominatorInput = () => this.denominatorBoard().find("textarea");

  typeFractionDenominator = answer => {
    this.clearFractionDenominator();
    this.denominatorInput()
      .click({ force: true })
      .then($el => {
        cy.wrap($el)
          .typeWithDelay(answer)
          .then(() => {
            this.checkTypedFractionDenominatorCount(answer.length);
          });
      });
  };

  checkTypedFractionDenominatorCount = length => {
    this.denominatorBoard()
      .find(".mq-root-block > [mathquill-command-id]")
      .should("have.length", length);
  };

  clearFractionDenominator = () => {
    this.denominatorBoard().then($el => {
      if ($el.find(".mq-root-block > [mathquill-command-id]").length > 0) {
        this.denominatorBoard()
          .find(".mq-root-block > [mathquill-command-id]")
          .each(() => {
            this.denominatorInput().typeWithDelay("{backspace}{del}");
          });
        this.checkTypedFractionDenominatorCount(0);
      }
    });
  };

  typeFractionDenominatorWithVirtualKeyboard = answer => {
    this.clearFractionDenominator();
    this.denominatorInput()
      .click({ force: true })
      .then(() => {
        cy.get(".input__keyboard").should("be.visible");
        answer.split("").forEach(c => this.clickVirtualKeyboardByNumber(c));
      });
    this.checkTypedFractionDenominatorCount(answer.length);
  };
}
export default MathEditor;
