export default class CypressHelper {
  static selectDropDownByAttribute = (dataCYAttributeValue, textToSelect) => {
    cy.get(`[data-cy="${dataCYAttributeValue}"]`).click({ force: true });
    // this.clickOnDropDownOptionByText(textToSelect);
    cy.wait(300); // allow list to expand
    cy.get(".ant-select-dropdown-menu-item").then($ele => {
      cy.wrap(
        $ele
          // eslint-disable-next-line func-names
          .filter(function() {
            return Cypress.$(this).text() === textToSelect;
          })
      ).click({ force: true });
    });
  };

  static selectMultipleSelectionDropDown = (attribute, option) => {
    cy.get(`[data-cy=${attribute}]`).click();
    cy.wait(300); // allow list to expand

    cy.get(".ant-select-dropdown-menu-item").then($ele => {
      cy.wrap(
        $ele
          // eslint-disable-next-line func-names
          .filter(function() {
            return Cypress.$(this).text() === option;
          })
      ).click({ force: true });
    });

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
      .should("not.contain", "No Data")
      .each(ele => {
        options.push(ele.text());
      })
      .then(() => options);
  };

  static verifySelectedOptionInDropDownByAttr = (attr, value, isMultipleSelectionAllowed = false) => {
    const clas = isMultipleSelectionAllowed ? ".ant-select-selection__choice" : ".ant-select-selection-selected-value";
    return cy
      .get(`[data-cy="${attr}"]`)
      .find(`${clas}`)
      .then($ele => cy.wrap($ele.filter((i, ele) => Cypress.$(ele).text() === value)).should("have.length", 1));
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
        .clear()
        .type(`${datetimeToSet}`);
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

  static getShortId = item => item.slice(item.length - 5);

  static checkObjectEquality = (obj1, obj2, message = "Equal") => {
    expect(obj1, `${obj1} ${message} ${obj2}`).to.deep.eq(obj2);
  };

  static checkObjectInEquality = (obj1, obj2, message = "Not Equal") => {
    expect(obj1, `${obj1} ${message} ${obj2}`).not.to.deep.eq(obj2);
  };

  static minutesToMiliSeconds = minutes => minutes * 60000;

  static hoursToSeconds = hours =>
    parseInt(hours.split(":")[0].trim()) * 60 * 60 +
    parseInt(hours.split(":")[1].trim()) * 60 +
    parseInt(hours.split(":")[2].trim());

  static verifyAntMesssage = msg =>
    cy
      .get(".ant-notification-notice-message")
      .should("contain", msg)
      .then($ele => {
        $ele.detach();
      });
}
