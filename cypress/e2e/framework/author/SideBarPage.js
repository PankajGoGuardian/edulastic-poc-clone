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
      .get('[data-cy="Skill Report"]')
      // .click({ force: true })
      .click({ force: true });

  clickOnManageClass = () => {
    cy.server();
    cy.route("GET", "**/group/mygroups").as("getGroups");
    cy.get('[data-cy="Manage Class"]')
      .click({ force: true })
      .click({ force: true });
    cy.wait("@getGroups");
    // cy.wait(2000); // UI renders slow
  };

  clickOnItemBank = () => {
    cy.server();
    cy.route("POST", "**/search/items").as("itemSearch");
    cy.route("POST", "**browse-standards").as("search-standards");

    cy.get('[data-cy="Item Bank"]').click({ force: true });
    // .click({ force: true });
    this.clickOnConfirmPopUp();
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

  clickOnRecentUsedPlayList = (isLoading = true) => {
    cy.server();
    cy.route("GET", "**/playlists/**").as("loadPlayContent");
    cy.get(`[data-cy="My Playlist"]`).dblclick({ force: true });
    if (isLoading) cy.wait("@loadPlayContent");
  };

  clickOnConfirmPopUp = () => {
    cy.get("body").then($body => {
      if ($body.find(".ant-modal-confirm-btns").length > 0) {   
        cy.get(".ant-modal-confirm-btns > button").contains('Yes, Continue').click({ force: true })
      }
    })
  };

  clickOnUser = () => {
    cy.get(`.userinfoBtn`)
      .click({ force: true })
      .find('.anticon')
      .click({ force: true })
  }

  clickMyProfile = () => {
    this.clickOnUser()
    cy.contains("My Profile")
      .click({ force: true });
    cy.get("[title='My Profile']")
  }

  clickOnManageDistrict = () => {
    cy.get('[data-cy="Manage District').dblclick({ force: true });
    cy.get("[title='Manage District']")
  };
  // *** ACTIONS END ***

  // *** APPHELPERS START ***
  // *** APPHELPERS END ***
}
