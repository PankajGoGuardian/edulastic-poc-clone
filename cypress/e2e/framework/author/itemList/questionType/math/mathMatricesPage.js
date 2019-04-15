import MathFillInTheBlanksPage from "./MathFillInTheBlanksPage";

class MathMatricesPage extends MathFillInTheBlanksPage {
  constructor() {
    super();
    this.virtualMatrixKeyBoardButtons = [
      // Matrices
      {
        name: "ldots",
        label: "…"
      },
      {
        name: "squareBrackets",
        clas: ".mq-scaled"
      },
      {
        name: "ldoddotsts",
        label: "⋱"
      },
      {
        name: "bmatrix",
        clas: ".mq-non-leaf"
      },
      {
        name: "vdots",
        label: "⋮"
      },
      {
        name: "tripleMatrix",
        clas: ".mq-matrix > .mq-non-leaf"
      },
      {
        name: "caret",
        clas: ".mq-sup"
      },
      {
        name: "underscore",
        clas: ".mq-supsub"
      },
      {
        name: "shiftSpacebar",
        clas: ".mq-root-block"
      },
      {
        name: "shiftEnter",
        clas: ".mq-root-block"
      }
    ];
  }

  // template
  getTemplateOutputCY = () =>
    cy
      .get('[data-cy="template-container"]')
      .next()
      .get("[data-cy=answer-math-input-field]");

  getAnswerMathInputTemplate = () => this.getAnswerMathInputField().find("[mathquill-block-id]");

  getAnswerMathTextArea = () => this.getAnswerMathInputField().find("textarea");
}

export default MathMatricesPage;
