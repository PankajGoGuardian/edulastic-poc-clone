export default class TeacherSideBar {
  menuItems = () => cy.get(".scrollbar-container").find("li.ant-menu-item");

  clickOnDashboard = () =>
    this.menuItems()
      .get('[data-cy="Dashboard"]')
      .click({ force: true })
      .click({ force: true });

  clickOnPlayList = () =>
    this.menuItems()
      .get('[data-cy="PlayList Library"]')
      .click({ force: true })
      .click({ force: true });

  clickOnAssignment = () => {
    this.menuItems()
      .get('[data-cy="Assignments"]')
      .click({ force: true })
      .click({ force: true });
    cy.wait("@assignment");
  };

  clickOnReport = () =>
    this.menuItems()
      .get('[data-cy="Reports"]')
      .click({ force: true })
      .click({ force: true });

  clickOnManageClass = () => {
    this.menuItems()
      .get('[data-cy="Manage Class"]')
      .click({ force: true })
      .click({ force: true });
    cy.wait(2000); // UI renders slow
  };

  clickOnItemBank = () => {
    cy.server();
    cy.route("POST", "**/search/**").as("itemSearch");

    this.menuItems()
      .get('[data-cy="Item Bank"]')
      .click({ force: true })
      .click({ force: true });
    cy.wait("@itemSearch");
  };
  clickOnTestLibrary = () => {
    cy.server();
    cy.route("POST", "**/search/tests").as("searchTest");
    cy.wait(5000); // waiting for mongo to elastic search sync delay
    this.menuItems()
      .get('[data-cy="Test Library"]')
      .click({ force: true })
      .click({ force: true });
    cy.wait("@searchTest");
  };
}
