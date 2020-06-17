import MathFormulaEdit from "./mathFormulaEdit";
import EditItemPage from "../../itemDetail/editPage";
import { questionGroup, questionType } from "../../../../constants/questionTypes";

class MathFractionPage extends MathFormulaEdit {
  constructor() {
    super();
    this.virtualKeyBoardButtons = [
      {
        handler: "x",
        label: "x",
        types: ["all", "basic", "algebra", "general"]
      },
      {
        handler: "y",
        label: "y",
        types: ["all", "basic", "algebra", "general"]
      },
      {
        handler: "leftright2",
        label: "x²",
        clas: ".mq-sup",
        types: ["all", "basic", "algebra", "general"]
      },
      {
        handler: "\\sqrt",
        label: "sqrt",
        clas: ".mq-sqrt-stem",
        types: ["all", "basic", "algebra", "general"]
      },
      {
        handler: "/",
        label: "divide",
        clas: ".mq-fraction",
        types: ["all", "basic", "algebra"]
      },
      {
        handler: "\\frac{}{}",
        label: "fraction",
        clas: ".mq-fraction",
        types: ["all", "basic", "basic_junior", "algebra", "general"]
      },
      {
        handler: "^",
        label: "super",
        clas: ".mq-sup",
        types: ["all", "basic", "algebra", "general"]
      },
      {
        handler: "<",
        label: "<",
        types: ["all", "basic", "basic_junior", "algebra", "comparison"]
      },
      {
        handler: "_",
        label: "sub",
        clas: ".mq-sub",
        types: ["all", "basic", "general"]
      },
      {
        handler: ">",
        label: ">",
        types: ["all", "basic", "basic_junior", "algebra", "comparison"]
      },
      {
        handler: "\\pm",
        label: "±",
        types: ["all", "basic", "algebra", "general"]
      },
      {
        handler: "$",
        label: "$",
        clas: ".mq-text-mode",
        types: ["all", "basic"]
      },
      {
        handler: "%",
        label: "%",
        types: ["all", "basic", "general"]
      },
      {
        handler: "°",
        label: "°",
        types: ["all", "basic"]
      },
      {
        handler: ":",
        label: ":",
        types: ["all", "basic", "general", "sets"]
      },
      {
        handler: "(",
        label: "(",
        types: ["all", "basic", "algebra"]
      },
      {
        handler: "|",
        label: "|",
        types: ["all", "basic", "algebra", "general"]
      },
      {
        handler: "π",
        label: "π",
        types: ["all", "basic", "algebra"]
      },
      // {
      //   handler: "Backspace",
      //   label: "backspace",
      //   types: ["all", "basic"]
      // },
      {
        handler: "\\infinity",
        label: "∞",
        types: ["all", "basic", "algebra", "general"]
      }
    ];
  }

  // template

  addResponseBox = () => {
    this.getVirtualKeyBoard()
      .find("span.response-embed")
      .click();
    this.getVirtualKeyBoard()
      .last()
      .contains("Response")
      .should("be.exist");
  };

  getTemplateRoot = () =>
    cy
      .get('[data-cy="template-container"]')
      .next()
      .get(".mq-root-block");

  createQuestion = (queKey = "default", queIndex = 0, onlyItem = true) => {
    const item = new EditItemPage();
    item.createNewItem(onlyItem);
    item.chooseQuestion(questionGroup.MATH, questionType.MATH_NUMERIC);
    cy.fixture("questionAuthoring").then(authoringData => {
      const { quetext, setAns } = authoringData.MATH_NUMERIC[queKey];

      this.getComposeQuestionTextBox().clear({ force: true });
      this.getComposeQuestionTextBox().type(`Q${queIndex + 1} - ${quetext}`);

      this.getPointsInput()
        .type("{selectall}")
        .type(setAns.points);
      this.getTemplateInput().typeWithDelay(setAns.correct);
    });
  };
}

export default MathFractionPage;
