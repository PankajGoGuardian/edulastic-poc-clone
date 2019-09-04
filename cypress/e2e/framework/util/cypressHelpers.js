export default class CypressHelper {
  static selectDropDownByAttribute = (dataCYAttributeValue, textToSelect) => {
    cy.get(`[data-cy="${dataCYAttributeValue}"]`).click({ force: true });
    cy.get(".ant-select-dropdown-menu-item")
      .contains(textToSelect)
      .click({ force: true });

    cy.focused().blur();
  };

  static verifySelectedDropDownByAttribute = (dataCYAttributeValue, selectedItem) => {
    cy.get(`[data-cy="${dataCYAttributeValue}"]`)
      .find("li.ant-select-selection__choice")
      .should("contain", selectedItem);
  };
}
