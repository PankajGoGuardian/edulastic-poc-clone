import EditToolBar from "../common/editToolBar";
import Header from "../../itemDetail/header";

class solutionBlockPage {
  constructor() {
    this.editToolBar = new EditToolBar();
    this.header = new Header();
  }

  getHintContainer = () => cy.get('[data-cy="hint-container"]');

  getShowHintButton = () => this.getHintContainer().find(".ant-btn");

  getTemplateEditor = () => cy.get(".fr-element").eq(0);

  getMoreHint = () => cy.get('[data-cy="more-hint"]');

  getHintArea = () => {
    cy.get('[data-cy="hints"]')
      .next()
      .find('[contenteditable="true"]');
  };

  clickOnAdvancedOptions = () => {
    cy.get('[class^="AdvancedOptionsLink"]').then(ele => {
      if (ele.siblings().length === 3) cy.wrap(ele).click();
    });
    return this;
  };

  VerifyDistractor = value => {
    cy.get('[data-cy="instructor_stimulus"]')
      .next()
      .find('[contenteditable="true"]')
      .type(value)
      .should("contain", value);
  };

  verifyExplanation = value => {
    cy.get('[data-cy="sample_answer"]')
      .next()
      .find('[contenteditable="true"]')
      .type(value)
      .should("contain", value);
  };

  addNewHint = () => {
    cy.get('[data-cy="add-new-ch"]')
      .last()
      .click({ force: true });
    cy.wait(500);
  };

  addHint = (value, index = 0) => {
    if (index > 0) {
      this.addNewHint();
    }
    cy.get('[data-cy="hints"]')
      .next()
      .find('[contenteditable="true"]')
      .eq(`${index}`)
      .clear()
      .type(value)
      .should("contain", value);
  };

  deleteHint = index => {
    cy.get(`[data-cy="deletehints${index}"]`).click();
  };

  VerifyHintInPreview = (hintIndex, hintCount, hintvalue) => {
    if (hintIndex > 0) this.clickOnMoreHint(hintCount);
    cy.get('[data-cy="hint-count"]')
      .eq(hintIndex)
      .should("have.text", `${hintIndex + 1}/${hintCount}`);
    cy.get('[data-cy="hint-subcontainer"]')
      .eq(hintIndex)
      .find('[data-cy="styled-wrapped-component"]')
      .should("have.text", hintvalue);
    if (hintIndex == 0) this.getMoreHint().should("not.exist");
  };

  verifyHintNotExist = (value, index) => {
    cy.get('[data-cy="hints"]')
      .next()
      .find('[contenteditable="true"]')
      .eq(`${index}`)
      .should("not.contain", value);
  };

  VerifyDeletedHintInPreview = (hintIndex, hintCount, hintvalue, hintlength) => {
    this.clickOnMoreHint(hintCount);
    cy.get('[data-cy="hint-count"]')
      .eq(hintIndex)
      .should("have.text", `${hintIndex + 1}/${hintlength}`);
    cy.get('[data-cy="hint-subcontainer"]')
      .eq(hintIndex)
      .find('[data-cy="styled-wrapped-component"]')
      .should("not.have.text", hintvalue);
  };

  clickOnShowHintButton = () => this.getShowHintButton().click({ force: true });

  clickOnMoreHint = hintCount => {
    for (let i = 1; i < hintCount; i++) {
      this.getMoreHint().click({ force: true });
    }
  };
}
export default solutionBlockPage;
