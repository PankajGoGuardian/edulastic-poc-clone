export default class TeacherSideBar {
  // *** ELEMENTS START ***

  menuItems = () => cy.get(".scrollbar-container").find("li.ant-menu-item");

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  clickOnDashboard = () => {
    cy.server();
    cy.route("POST", "**/search/courses").as("searchCourse");
    cy.get('[data-cy="Dashboard"]').click({ force: true });
    //  cy.wait("@searchCourse");
  };

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
      // .click({ force: true })
      .click({ force: true });

  clickOnManageClass = () => {
    cy.get('[data-cy="Manage Class"]')
      .click({ force: true })
      .click({ force: true });
    cy.wait(2000); // UI renders slow
  };

  clickOnItemBank = () => {
    cy.server();
    cy.route("POST", "**/search/items").as("itemSearch");
    cy.route("POST", "**browse-standards").as("search-standards");

    cy.get('[data-cy="Item Bank"]').dblclick({ force: true });
    // .click({ force: true });
    cy.wait("@itemSearch");
  };

  clickOnTestLibrary = () => {
    cy.server();
    cy.route("POST", "**/tests").as("searchTest");
    // TODO: below is temp fix and wait is not added- look for this while fixing
    cy.route("POST", "**browse-standards").as("search-standards");
    cy.wait(5000); // waiting for mongo to elastic search sync delay
    cy.get('[data-cy="Test Library"]').dblclick({ force: true });
    cy.wait("@searchTest");
  };

  clickOnRecentUsedPlayList = name => {
    cy.server();
    cy.route("GET", "**/content-sharing/**").as("loadPlayContent");
    cy.get(`[data-cy="My Playlist"]`).dblclick({ force: true });
    if (name) cy.get('[data-cy="title"]').should("contain.text", name);
    cy.wait("@loadPlayContent");
  };

  // *** ACTIONS END ***

  // *** APPHELPERS START ***
  // *** APPHELPERS END ***
}
