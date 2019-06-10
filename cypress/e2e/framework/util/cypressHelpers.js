export class CypressHelper {
  static selectDropDownByAttribute = (dataCYAttributeValue, textToSelect) => {
    cy.get(`[data-cy="${dataCYAttributeValue}"]`).click();

    cy.get(".ant-select-dropdown-menu-item")
      .contains(textToSelect)
      .click();

    cy.focused().blur();
  };

  static verifySelectedDropDownByAttribute = (dataCYAttributeValue, selectedItem) => {
    cy.get(`[data-cy="${dataCYAttributeValue}"]`)
      .find("li.ant-select-selection__choice")
      .should("contain", selectedItem);
  };
}
