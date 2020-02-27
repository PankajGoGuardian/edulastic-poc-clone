export default class TeacherSideBar {
  menuItems = () => cy.get(".scrollbar-container").find("li.ant-menu-item");

  clickOnDashboard = () =>
    cy
      .get('[data-cy="Dashboard"]')
      .click({ force: true })
      .click({ force: true });

  clickOnPlayListLibrary = () => {
    cy.server();
    cy.route("POST", "**/playlists/search/").as("playListSearch");
    cy.get('[data-cy="PlayList Library"]').dblclick({ force: true });
    cy.wait("@playListSearch");
  };

  clickOnAssignment = () => {
    cy.server();
    cy.route("GET", /assignments/).as("assignment");
    cy.get('[data-cy="Assignments"]')
      .click({ force: true })
      .click({ force: true });
    cy.wait("@assignment");
  };

  clickOnReport = () =>
    cy
      .get('[data-cy="Reports"]')
      .click({ force: true })
      .click({ force: true });

  clickOnManageClass = () => {
    cy.get('[data-cy="Manage Class"]')
      .click({ force: true })
      .click({ force: true });
    cy.wait(2000); // UI renders slow
  };

  clickOnItemBank = () => {
    cy.server();
    cy.route("POST", "**/search/**").as("itemSearch");

    cy.get('[data-cy="Item Bank"]').dblclick({ force: true });
    // .click({ force: true });
    cy.wait("@itemSearch");
  };

  clickOnTestLibrary = () => {
    cy.server();
    cy.route("POST", "**/tests").as("searchTest");
    cy.wait(5000); // waiting for mongo to elastic search sync delay
    cy.get('[data-cy="Test Library"]').dblclick({ force: true });
    cy.wait("@searchTest");
  };

  clickOnPlayListByName = name => {
    cy.get(`[data-cy="${name}"]`).dblclick({ force: true });
  };
}
