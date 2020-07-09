import LabelImageStandardPage from "./labelImageStandardPage";

class DropDownPage extends LabelImageStandardPage {
  verifyFillColorInPreviewContainer = (resIndex, value) => {
    cy.get(`[data-cy="dropdown-res-${resIndex}"]`)
      .should("have.css", "background-color", value);
  };
}

export default DropDownPage;
