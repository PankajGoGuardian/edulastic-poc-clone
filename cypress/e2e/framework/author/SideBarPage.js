export default class TeacherSideBar {
  menuItems = () => cy.get(".scrollbar-container").find("li.ant-menu-item");

  clickOnDashboard = () =>
    this.menuItems()
      .eq(0)
      .click({ force: true })
      .click({ force: true });

  clickOnPlayList = () =>
    this.menuItems()
      .eq(2)
      .click({ force: true })
      .click({ force: true });

  clickOnAssignment = () =>
    this.menuItems()
      .eq(1)
      .click({ force: true })
      .click({ force: true });

  clickOnReport = () =>
    this.menuItems()
      .eq(5)
      .click({ force: true })
      .click({ force: true });

  clickOnManageClass = () => {
    this.menuItems()
      .eq(6)
      .click({ force: true })
      .click({ force: true });
    cy.wait(2000); // UI renders slow
  };

  clickOnItemLibrary = () =>
    this.menuItems()
      .eq(4)
      .click({ force: true })
      .click({ force: true });

  clickOnTestLibrary = () => {
    cy.server();
    cy.route("POST", "**/search/tests").as("searchTest");
    cy.wait(5000); // waiting for mongo to elastic search sync delay
    this.menuItems()
      .eq(3)
      .click({ force: true })
      .click({ force: true });
    cy.wait("@searchTest");
  };
}
