export default class TestAssignPage {
  selectClass = className => {
    cy.get('[data-cy="selectClass"]').click();
    cy.get(".ant-select-dropdown-menu-item")
      .contains(className)
      .click();
    cy.focused().blur();
  };

  selectStudent = student => {
    cy.get('[data-cy="selectStudent"]').click();
    cy.get(".ant-select-dropdown-menu-item")
      .contains(student)
      .click();
    cy.focused().blur();
  };

  clickOnEntireClass = () => cy.get('[data-cy="radioEntireClass"]').click();

  clickOnSpecificStudent = () => cy.get('[data-cy="radioSpecificStudent"]').click();

  getCalenderOk = () => cy.get(".ant-calendar-ok-btn");

  setDateInCalender = dateTime => {
    console.log("time here", dateTime);
    cy.wait(300);
    const [date, time] = dateTime.toLocaleString().split(",");
    const formattedDate = date
      .split("/")
      .reverse()
      .join("-");
    const datetimeToSet = `${formattedDate}${time}`;
    cy.get(".ant-calendar-date-input-wrap")
      .find("input")
      .type(`${"{backspace}".repeat(datetimeToSet.substr(1).length)}${datetimeToSet.substr(1)}`);

    this.getCalenderOk().click({ force: true });
    cy.wait(300);
  };

  // start , end => new Date() instance
  setStartAndCloseDate = (start, end) => {
    cy.get('[data-cy="startDate"]').click({ force: true });
    this.setDateInCalender(start);
    // cy.get('[data-cy="closeDate"]').click({ force: true });
    this.setDateInCalender(end);
  };

  clickOnAssign = () => {
    cy.server();
    cy.route("POST", "**/assignments").as("assigned");
    cy.contains("ASSIGN").click();
    cy.wait("@assigned").then(xhr => expect(xhr.status).to.eq(200));
  };
}
