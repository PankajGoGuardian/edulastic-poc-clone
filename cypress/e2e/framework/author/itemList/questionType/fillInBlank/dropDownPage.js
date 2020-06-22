import LabelImageStandardPage from "./labelImageStandardPage";

class DropDownPage extends LabelImageStandardPage {
  verifyFillColorInPreviewContainer = (resIndex, value) => {
    cy.get(`[data-cy="dropdown-res-${resIndex}"]`)
      .parent()
      .should("have.css", "background", value);
  };
}

export default DropDownPage;
