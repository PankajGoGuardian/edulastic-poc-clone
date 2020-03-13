import PlayListReview from "./playListReview";
import DndSimulatorDataTransfer from "../../../../support/misc/dndSimulator";

class PlaylistCustom extends PlayListReview {
  dragTestFromSearchToModule = (mod, test) => {
    // extend and get test .as("source-container");

    this.getModuleRowByModule(mod).as("@target-container");

    const opts = {
      offsetX: 0,
      offsetY: 0
    };

    cy.get("@source-container")
      .trigger("dragstart")
      .trigger("drag");

    cy.get("@target-container").then($el => {
      const { x, y } = $el.get(0).getBoundingClientRect();
      cy.wrap($el.get(0)).as("target");
      cy.get("@target").trigger("dragover");
      cy.get("@target").trigger("drop", {
        clientX: x + opts.offsetX,
        clientY: y + opts.offsetY
      });
    });
  };

  getManageContentButton = () => cy.get('[data-cy="manage-content"]');

  getKeywords = () => cy.get('[class*="SearchByTab"]').contains("keywords");

  getStandards = () => cy.get('[class*="SearchByTab"]').contains("standards");

  getKeywordsSearchBar = () => cy.get('[placeholder="Search by keywords"]').should("be.visible");

  getStandardSearchBar = () => cy.get('[placeholder="Search by standards"]').should("be.visible");

  clickOnManageContent = () => {
    this.getManageContentButton().click();
  };

  clickOnKeyword = () => {
    this.getKeywords().click();
  };

  clickOnStandard = () => {
    this.getStandards().click();
  };
}

export default PlaylistCustom;
