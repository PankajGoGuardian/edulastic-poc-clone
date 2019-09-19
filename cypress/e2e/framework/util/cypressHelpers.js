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

  static getDropDownList = () => {
    const options = [];
    return cy
      .get(".ant-select-dropdown-menu-item")
      .each(ele => {
        options.push(ele.text());
      })
      .then(() => options);
  };

  // datetime => new Date() instance
  static setDateInCalender = (dateTime, time = true) => {
    console.log("time here", dateTime);
    cy.wait(300);
    if (time) {
      const [date, time] = dateTime.toLocaleString().split(",");
      const formattedDate = date
        .split("/")
        .reverse()
        .join("-");
      const datetimeToSet = `${formattedDate}${time}`;
      cy.get(".ant-calendar-date-input-wrap")
        .find("input")
        .type(`${"{backspace}".repeat(datetimeToSet.substr(1).length)}${datetimeToSet.substr(1)}`);
      cy.get(".ant-calendar-ok-btn").click({ force: true });
    } else {
      const [day, mon, date, year] = dateTime.toDateString().split(" ");
      const formatDate = `${date} ${mon}, ${year}`;
      cy.get(".ant-calendar-date-input-wrap")
        .find("input")
        .clear()
        .type(formatDate)
        .type("{enter}");
    }

    cy.wait(300);
  };
}
