export default class CypressHelper {
  static selectDropDownByAttribute = (dataCYAttributeValue, textToSelect) => {
    cy.get(`[data-cy="${dataCYAttributeValue}"]`).click({ force: true });
    cy.get(".ant-select-dropdown-menu-item")
      .contains(textToSelect)
      .click({ force: true });

    cy.focused().blur();
  };

  static selectMultipleSelectionDropDown = (attribute, option) => {
    cy.get(`[data-cy=${attribute}]`).click();
    cy.wait(300); // allow list to expand

    cy.get(".ant-select-dropdown-menu-item")
      .contains(option)
      .click({ force: true });

    cy.get(`[data-cy=${attribute}]`)
      .find(".ant-select-arrow")
      .click();

    cy.wait(300); // allow list to collapse
  };

  static verifySelectedDropDownByAttribute = (dataCYAttributeValue, selectedItem) => {
    cy.get(`[data-cy="${dataCYAttributeValue}"]`)
      .find("li.ant-select-selection__choice")
      .should("contain", selectedItem);
  };
}
