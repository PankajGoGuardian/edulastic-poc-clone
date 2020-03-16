import PlayListReview from "./playListReview";
import PlayListSearchContainer from "./searchConatinerPage";

class PlaylistCustom extends PlayListReview {
  constructor() {
    this.searchContainer = new PlayListSearchContainer();
  }
  /* GET ELEMENTS */
  getManageContentButton = () => cy.get('[data-cy="manage-content"]');

  clickOnManageContent = () => {
    this.searchContainer.routeTestSearch();
    this.getManageContentButton().click();
    this.searchContainer.waitForTestSearch();
  };

  /* APP HELPERS */
  dragTestFromSearchToModule = (sourcemod, test) => {
    this.clickExpandByModule(sourcemod);
    this.getModuleRowByModule(sourcemod).as("target-container");
    this.searchContainer.getTestInSearchResultsById(test).as("source-container");

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
}

export default PlaylistCustom;
