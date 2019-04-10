import MathFractionPage from "./mathFractionPage";

class mathEssayPage extends MathFractionPage {
  constructor() {
    super();
    this.selectData = {
      BOLD: {
        option: "bold",
        tag: "strong"
      },
      ITALIC: {
        option: "italic",
        tag: "em"
      },
      UNDERLINE: {
        option: "underline",
        tag: "u"
      },
      REMOVE_FORMAT: {
        option: "removeFormat",
        tag: "p"
      },
      UNORDERED_LIST: {
        option: "unorderedList",
        tag: "ul"
      },
      ORDERED_LIST: {
        option: "orderedList",
        tag: "ol"
      },
      SUPER_SCRIPT: {
        option: "superscript",
        tag: "sup"
      },
      SUBSCRIPT: {
        option: "subscript",
        tag: "sub"
      },
      BULLET: {
        option: "bullet",
        tag: "ul"
      },
      ORDERED: {
        option: "ordered",
        tag: "ol"
      },
      CLEAN: {
        option: "clean"
      },
      SUPER: {
        option: "super",
        tag: "sup"
      },
      SUB: {
        option: "sub",
        tag: "sub"
      }
    };
  }

  getAddedAlternateAnswer = () => cy.get('[data-cy="styled-wrapped-component"] p');

  getDeleteBtnByIndex = index => cy.get(`[data-cy="deleteprefix${index}"]`);

  getDeleteIcon = () => cy.get('[data-cy="TypedListItem"]').find('[data-cypress="deleteButton"]');

  getDeleteButton = () => cy.get('[data-cypress="deleteButton"]');

  getAnswerMathTextBtn = () => cy.get('[data-cy="answer-math-text-btn"]');

  getAnswerTextEditor = () => cy.get('[data-cy="answer-text-editor"]');

  getAnswerTextInput = () => cy.get('[data-cy="answer-text-editor"] input');

  getAnswerTextEditorTEST = () => cy.get('[data-cy="answer-text-editor"]');

  getAnswerTextEditorValue = () => this.getAnswerTextEditor().find(".ql-editor p");

  getAnswerTextEditorBulletList = () => this.getAnswerTextEditor().find(".ql-editor ul li");

  getAnswerTextEditorOrderedList = () => this.getAnswerTextEditor().find(".ql-editor ol li");

  getEditirInput = () => this.getAnswerTextEditor().find(".ql-editor");

  getAddButton = () => cy.get('[data-cy="addButton"]');

  getTextFormattingOptionsSelect = () => cy.get('[data-cy="text-formatting-options-select"]');

  getTextFormattingEditorOptions = option => cy.get(`[data-cy="text-formatting-options-${option}"]`);
  // getTextFormattingEditorOptions

  getMethodSelectionDropdowList = method => cy.get(`[data-cy="text-formatting-options-selected-${method}"]`);

  setFormattingOptions = method => {
    this.getAddButton().click();
    this.getTextFormattingOptionsSelect()
      .click({ force: true })
      .then(() => {
        this.getMethodSelectionDropdowList(method).click();
      });
  };

  removeAllFormattingOptions = () =>
    this.getDeleteButton().each(() => {
      this.getDeleteButton()
        .first()
        .click();
    });

  moveToPreview = preview => {
    preview.header.preview();
    this.getAnswerTextEditor().click();
  };

  moveToEdit = preview => {
    preview.header.edit();
    this.removeAllFormattingOptions();
  };

  checkAnswerTextEditorValue = (tag, testText) =>
    this.getAnswerTextEditorValue()
      .clear({ force: true })
      .type(testText, { force: true })
      .contains(tag, testText);

  checkDataExist = (tag, testText) =>
    this.getEditirInput()
      .find(tag)
      .contains("li", testText);

  checkTextFormattingOption = (preview, option, expectedText, expectedTag) => {
    preview.header.preview();
    this.getAnswerTextEditor().click();

    this.getAnswerTextEditorValue().clear({ force: true });
    this.getTextFormattingEditorOptions(option).click();

    this.checkAnswerTextEditorValue(expectedTag, expectedText);
  };
}

export default mathEssayPage;
