import LabelImageStandardPage from "./labelImageStandardPage";

class DragAndDropPage extends LabelImageStandardPage {
  verifyFillColorInPreviewContainer = (resIndex, value) => {
    cy.get(`#drop-container-${resIndex}`).should("have.css", "background-color", value);
  };
}

export default DragAndDropPage;
