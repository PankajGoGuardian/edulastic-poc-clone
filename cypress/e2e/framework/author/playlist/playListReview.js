import LiveClassboardPage from "../assignments/LiveClassboardPage";
import PlayListSearchContainer from "./searchConatinerPage";
import CypressHelper from "../../util/cypressHelpers";

export default class PlayListReview {
  constructor() {
    this.lcb = new LiveClassboardPage();
    this.searchContainer = new PlayListSearchContainer();
  }

  // *** ELEMENTS START ***

  getModuleRowByModule = mod => cy.get(`[data-cy="row-module-${mod}"]`);

  getTestsInModuleByModule = mod => this.getModuleRowByModule(mod).find('[data-cy="moduleAssignment"]');

  getTestByTestByModule = (mod, test) => this.getTestsInModuleByModule(mod).eq(test - 1);

  getDeleteButtonByTestByModule = (mod, test) =>
    this.getTestByTestByModule(mod, test).find('[data-cy="assignmentDeleteOptionsIcon"]');

  getAssignButtonByTestByModule = (mod, test) => this.getTestByTestByModule(mod, test).find('[data-cy="assignButton"]');

  getAssignButtonByModule = mod => this.getModuleRowByModule(mod).find('[data-cy="AssignWholeModule"]');

  getViewTestByTestByModule = (mod, test) => this.getTestByTestByModule(mod, test).contains("span", "Preview");

  getModuleNameByModule = mod => this.getModuleRowByModule(mod).find('[data-cy="module-name"]');

  getStandardsContainerByTestbyModule = (mod, test) => this.getTestByTestByModule(mod, test).find('[class^="Tags_"]');

  getPresentationIconByTestByModule = (mod, test, rowIndex = 0) =>
    this.getAllAssignmentsRowsByTestByModule(mod, test)
      .eq(rowIndex)
      .find('[ data-cy="PresentationIcon"]');

  getPlaylistSub = () => cy.get('[data-cy="playlist-sub"]');

  getPlaylistGrade = () => cy.get('[data-cy="playlist-grade"]');

  getModuleCompleteStatusByModule = mod => this.getModuleRowByModule(mod).find('[data-cy="module-complete"]');

  getHideModuleByModule = mod => this.getModuleRowByModule(mod).find('[data-cy="hide-module"]');

  getShowModuleByModule = mod => this.getModuleRowByModule(mod).find('[data-cy="show-module"]');

  getHideByTestByModule = (mod, test) => this.getTestByTestByModule(mod, test).find('[data-cy="make-hidden"]');

  getShowByTestByModule = (mod, test) => this.getTestByTestByModule(mod, test).find('[data-cy="make-visible"]');

  getShowAssignmentsByTestByMod = (mod, test) =>
    this.getTestByTestByModule(mod, test).find('[data-cy="show-assignment"]');

  getModuleTittle = () => cy.get(".ant-modal-content").find('[data-cy="module-group-name"]');

  getModuleName = () => cy.get(".ant-modal-content").find('[data-cy="module-name"]');

  getUnitId = () => cy.get(".ant-modal-content").find('[data-cy="module-id"]');

  getModuleDescription = () =>
    cy
      .get("#froalaToolbarContainer-module-description")
      .next()
      .find('[contenteditable="true"]');

  getAddModule = () => cy.get("button").contains("span", "ADD");

  getAddNewModule = () => cy.contains("span", "Add Module");

  getManageModuleDropDown = mod => this.getModuleRowByModule(mod).find(".ant-dropdown-trigger");

  getDropDownItem = () => cy.get(".ant-dropdown-menu-item").filter((i, $ele) => Cypress.dom.isVisible($ele));

  getEditModule = () => this.getDropDownItem().contains("Edit Module");

  getDeleteModule = () => this.getDropDownItem().contains("Delete Module");

  getUpdateModule = () => cy.get("button").contains("span", "UPDATE");

  getConfirmDeleteModule = () => cy.get('[data-cy="done-module"]');

  getCustomizationButton = () => cy.get("button").contains("span", "Customize Content");

  getPlaylistTitle = () => cy.get('[data-cy="title"]');

  getModuleIdByMod = mod => this.getModuleRowByModule(mod).find('[data-cy="module-id"]');

  getModuleDescriptionByMod = mod => this.getModuleRowByModule(mod).find('[data-cy="styled-wrapped-component"]');

  getAllAssignmentsRowsByTestByModule = (mod, test) =>
    this.getTestByTestByModule(mod, test)
      .next()
      .find("tbody")
      .find("tr");

  getManageTestDropDownByTestByModule = (mod, test) =>
    this.getTestByTestByModule(mod, test).find(".ant-dropdown-trigger");

  getAssignTestInDropDown = () => this.getDropDownItem().contains("Assign Test");

  getSubResourceDropContainerByTestByMod = () => cy.get('[data-cy="supporting-resource"]');

  getSubResourceByTestByMod = (mod, test, resource) =>
    this.getTestByTestByModule(mod, test)
      .next()
      .find(`[data-cy="${resource}"]`);

  getAllSubResourceRowsByMod = mod => this.getModuleRowByModule(mod).find('[data-cy="subResourceView"]');

  getOpenDroppedPlaylist = () => cy.get('[data-cy="open-dropped-playlist"]');

  getPlaylistCardById = id => cy.get(`[data-cy="playlist-${id}"]`);

  getPreviewViewTestInDropDown = () => this.getDropDownItem().contains("Preview Test");

  getAssignInDropDown = () => this.getDropDownItem().contains("Assign Test");

  getViewTestDetailsInDropDown = () => this.getDropDownItem().contains("View Test Details");

  getUnAssignInDropDown = () => this.getDropDownItem().contains("Unassign");

  getBacktoPlaylistButtonInTestReview = () => cy.get('[data-cy="back-to-playlist"]');

  // *** ELEMENTS END ***

  clickLcbIconByTestByIndex = (mod, test, index, rowIndex = 0) => {
    cy.server();
    cy.route("GET", "**/api/realtime/url").as("lcbLoad");
    this.getPresentationIconByTestByModule(mod, test, rowIndex)
      .children()
      .eq(index)
      .click();
    cy.wait("@lcbLoad");
  };

  clickExpandByModule = mod =>
    this.getModuleRowByModule(mod).then($container => {
      cy.wait(300);
      if ($container.children().length === 1) this.getModuleNameByModule(mod).click();
    });

  clickCollapseByModule = mod =>
    this.getModuleRowByModule(mod).then($container => {
      cy.wait(300);
      if ($container.children().length > 1) this.getModuleNameByModule(mod).click();
    });

  clickOnAssignByTestByModule = (mod, test, alreadyAssigned = false) => {
    if (alreadyAssigned) {
      this.clickManageTestDropDownByTestByModule(mod, test);
      this.getAssignTestInDropDown().then(button => {
        this.clickAssignmentButtonByButton(button);
      });
    } else
      this.getAssignButtonByTestByModule(mod, test).then(button => {
        this.clickAssignmentButtonByButton(button);
      });
  };

  clickOnAssignButtonByModule = mod =>
    this.getAssignButtonByModule(mod).then(button => {
      this.clickAssignmentButtonByButton(button);
    });

  clickAssignmentButtonByButton = button => {
    cy.server();
    cy.route("POST", "**/group/search").as("classLoad");
    cy.wrap(button).click();
    cy.wait("@classLoad");
  };

  clickOnDeleteByTestByModule = (mod, test) => this.getDeleteButtonByTestByModule(mod, test).click();

  clickOnViewTestByTestByModule = (mod, test, usingDropDown = false) => {
    cy.server();
    cy.route("GET", "**/test/*").as("viewTest");
    if (usingDropDown) {
      this.clickManageTestDropDownByTestByModule(mod, test);
      this.getPreviewViewTestInDropDown().click({ force: true });
    } else this.getViewTestByTestByModule(mod, test).click({ force: true });

    return cy.wait("@viewTest").then(xhr => xhr.response.body.result._id);
  };

  clickHideModuleByModule = mod => {
    this.routeSavePlaylist();
    this.getHideModuleByModule(mod).click();
    this.waitForSave();
    this.getAssignButtonByModule(mod).should("have.css", "opacity", "0.5");
  };

  clickShowModuleByModule = mod => {
    this.routeSavePlaylist();
    this.getShowModuleByModule(mod).click();
    this.waitForSave();
    this.getAssignButtonByModule(mod).should("have.css", "opacity", "1");
  };

  clickHideTestByModule = (mod, test) => {
    this.routeSavePlaylist();
    this.getHideByTestByModule(mod, test).click();
    this.waitForSave();
    this.getAssignButtonByTestByModule(mod, test).should("have.css", "opacity", "0.5");
  };

  clickShowTestByModule = (mod, test) => {
    this.routeSavePlaylist();
    this.getShowByTestByModule(mod, test).click(mod, test);
    this.waitForSave();
    this.getAssignButtonByTestByModule(mod, test).should("have.css", "opacity", "1");
  };

  clickShowAssignmentByTestByModule = (mod, test) => this.getShowAssignmentsByTestByMod(mod, test).click();

  clickAddNewModule = () => this.getAddNewModule().click();

  setModuleTitle = title =>
    this.getModuleTittle()
      .clear()
      .type(title);

  setModuleName = name =>
    this.getModuleName()
      .clear()
      .type(name);

  setModuleId = id =>
    this.getUnitId()
      .clear()
      .type(id);

  setModuleDescription = desc => this.getModuleDescription().type(desc);

  setModuleDetails = (name, id, title, description) => {
    this.setModuleTitle(title);
    this.setModuleName(name);
    this.setModuleId(id);
    if (description) this.setModuleDescription(description);
  };

  addModule = (newPlaylist = false) => {
    let playlistId;
    cy.server();
    cy.route("POST", "**/playlists").as("saveNewPlayList");
    this.getAddModule().click({ force: true });
    if (newPlaylist)
      cy.wait("@saveNewPlayList").then(xhr => {
        expect(xhr.status).to.eq(200);
        playlistId = xhr.response.body.result._id;
        cy.saveplayListDetailToDelete(playlistId);
      });
    return cy.wait(1).then(() => playlistId);
  };

  clickManageModuleByModule = mod => this.getManageModuleDropDown(mod).click({ force: true });

  clickEditModule = () => this.getEditModule().click({ force: true });

  clickDeleteModule = () => {
    this.getDeleteModule().click({ force: true });
    this.getConfirmDeleteModule().click({ force: true });
  };

  clickUpdateModule = () => this.getUpdateModule().click({ force: true });

  clickOpenCustomizationTab = () => {
    cy.get("body").then(() => {
      if (Cypress.$('[data-cy="test-filter"]').length === 0) {
        this.getCustomizationButton().click({ force: true });
        this.searchContainer.getKeywordsSearchBar();
      }
    });
  };

  clickManageTestDropDownByTestByModule = (mod, test) =>
    this.getManageTestDropDownByTestByModule(mod, test).click({ force: true });

  deleteAllSubResourceRows = mod =>
    this.getAllSubResourceRowsByMod(mod).then($ele => {
      if ($ele.children().length > 0)
        cy.wrap($ele)
          .find('[data-cy="delete-resource"]')
          .click({ multiple: true, force: true });
    });

  clickOpenDroppedPlaylist = () => this.getOpenDroppedPlaylist().click();

  clickOnViewPlaylistById = id => {
    cy.server();
    cy.route("POST", "**/playlists/*/use-this").as("change-my-playlist-using-switch");
    cy.route("GET", "**/user-context?name=LAST_ACCESSED_PLAYLIST").as("get-my-playlist-using-switch");
    this.getPlaylistCardById(id).click({ force: true });
    cy.wait("@change-my-playlist-using-switch").then(xhr => expect(xhr.status).to.eq(200));
    cy.wait("@get-my-playlist-using-switch");
    cy.contains("PROFICIENCY");
  };

  clickOnViewDetailsInDropDownByTestByMod = (mod, test) => {
    cy.server();
    cy.route("GET", "**/test/*").as("test-details");
    this.clickManageTestDropDownByTestByModule(mod, test);
    this.getViewTestDetailsInDropDown().click({ force: true });
    cy.wait("@test-details");
  };

  clickBackToPlaylistInTestReview = () => this.getBacktoPlaylistButtonInTestReview().click({ force: true });

  clickOnUnAssignInDropDownByTestByModule = (mod, test) => {
    this.clickManageTestDropDownByTestByModule(mod, test);
    this.getUnAssignInDropDown().click({ force: true });
    CypressHelper.unassignCommonActions();
  };

  closeSwitchPlaylistWindow = () =>
    cy
      .get('[tabindex="-1"]')
      .last()
      .type("{esc}");

  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  verifyAssignedByTestByModule = (mod, test) =>
    this.getAssignButtonByTestByModule(mod, test).then(button => {
      this.verifyAssigned(button);
    });

  verifyUnAssignedByTestByModule = (mod, test) =>
    this.getAssignButtonByTestByModule(mod, test).then(button => {
      this.verifyUnAssigned(button);
    });

  verifyAssignedByModule = mod =>
    this.getAssignButtonByModule(mod).then(button => {
      this.verifyAssigned(button);
    });

  verifyAssigned = button => cy.wrap(button).should("contain", "ASSIGNED");

  verifyUnAssigned = button => cy.wrap(button).should("not.contain", "ASSIGNED");

  verifyStandardsByTestByModule = (mod, test, std) =>
    this.getStandardsContainerByTestbyModule(mod, test).should("contain", std);

  verifyNoOfTestByModule = (mod, count) => this.getTestsInModuleByModule(mod).should("have.length", count);

  verifyModuleProgress = (completed, total) =>
    cy.get('[data-cy="module-pogress"]').should("have.text", `${completed}/${total}Assigned`);

  verifyPlalistGrade = grade => this.getPlaylistGrade().should("contain", grade);

  verifyGradeWhenMultipleGrades = grade =>
    this.getPlaylistGrade()
      .invoke("text")
      .then(gradesInUI => {
        const mappedGrades = gradesInUI
          .split("Grade ")[1]
          .split(",")
          .map(ele => ele.toString().trim());
        grade = grade === "Kindergarten" ? "K" : grade.split(" ")[1];
        expect(mappedGrades, `verifying grade in playlist review`).to.include(grade);
      });

  verifyPlalistSubject = sub => this.getPlaylistSub().should("contain", sub);

  verifyModuleCompleteTextByModule = mod =>
    this.getModuleCompleteStatusByModule(mod).should("have.text", "MODULE COMPLETED");

  verifyPlaylistTitle = title => this.getPlaylistTitle().should("have.text", title);

  verifyModuleNameByMod = (mod, name) => {
    this.getModuleNameByModule(mod)
      .should("contain", name)
      .trigger("mouseover")
      .then(() => {
        cy.wait(500);
        cy.get(".ant-tooltip-inner")
          .filter((i, $ele) => Cypress.$($ele).text() === name)
          .should("be.visible");
      });
  };

  verifyModuleIdByMod = (mod, id) => this.getModuleIdByMod(mod).should("have.text", id);

  verifyModuleDescriptionByMod = (mod, desc) => this.getModuleDescriptionByMod(mod).should("have.text", desc);

  verifyModuleDetailsByModule = (mod, name, id, desc) => {
    this.verifyModuleIdByMod(mod, id);
    this.verifyModuleDescriptionByMod(mod, desc);
    this.verifyModuleNameByMod(mod, name);
  };

  verifyAssignmentRowByTestByMod = (
    mod,
    test,
    { className, type, teacher, status, submitted, graded },
    rowIndex = 0
  ) => {
    this.getAllAssignmentsRowsByTestByModule(mod, test)
      .eq(rowIndex)
      .find("td")
      .as("current-assignment-row");

    if (className)
      cy.get("@current-assignment-row")
        .eq(0)
        .should("have.text", className);
    if (type)
      cy.get("@current-assignment-row")
        .eq(1)
        .should("have.text", type);
    if (teacher)
      cy.get("@current-assignment-row")
        .eq(2)
        .should("have.text", teacher);
    if (status)
      cy.get("@current-assignment-row")
        .eq(3)
        .should("have.text", status);
    if (submitted)
      cy.get("@current-assignment-row")
        .eq(4)
        .should("have.text", submitted);
    if (graded)
      cy.get("@current-assignment-row")
        .eq(5)
        .should("have.text", graded);
  };

  /*  shuffleTestByIndexByModule = (mod, sourceTest, targetTest) => {
    this.getDragHandlerByTestByModule(mod, sourceTest).as("source-container");
    this.getDragHandlerByTestByModule(mod, targetTest).as("target-container");

    const opts = {
      offsetX: 0,
      offsetY: 0
    };

    cy.get("@target-container").then($el => {
      const { x, y } = $el.get(0).getBoundingClientRect();
      cy.wrap($el.get(0)).as("target");
      cy.get("@source-container")
        .trigger("dragstart")
        .trigger("drag");
      cy.get("@source-container").trigger("dragover");
      cy.get("@source-container").trigger("drop", {
        clientX: x + opts.offsetX,
        clientY: y + opts.offsetY
      });
    });
  };

  shuffleModuleByIndex = (source, target) => {
    this.getDragHandlerByModule(source).as("source-container");
    this.getModuleRowByModule(target)
      .parent()
      .as("target-container");

    const opts = {
      offsetX: 0,
      offsetY: 0,
      ...(options || {})
    };

    cy.get("@source-container")
      .trigger("dragstart", {})
      .trigger("drag", {});

    cy.get("@target-container").then($el => {
      const { x, y } = $el.get(0).getBoundingClientRect();
      cy.wrap($el.get(0)).as("target");

      cy.get("@target").trigger("dragover", {
        clientX: x,
        clientY: y
      });

      cy.get("@target").trigger("drop", {
        clientX: x + opts.offsetX,
        clientY: y + opts.offsetY
      });
    });
  }; */

  moveTestBetweenModule = (sourcemodNumber, sourceTestNumber, targetModuleNumber, testid) => {
    this.clickExpandByModule(sourcemodNumber);
    this.clickExpandByModule(targetModuleNumber);
    this.getTestByTestByModule(sourcemodNumber, sourceTestNumber).as("source-container");
    this.getModuleRowByModule(targetModuleNumber).as("target-container");
    const opts = {
      offsetX: 0,
      offsetY: 0
    };

    cy.get("@source-container")
      .trigger("dragstart")
      .trigger("drag");

    cy.get("@target-container").then($el => {
      const { x, y } = $el.get(0).getBoundingClientRect();
      cy.wrap($el.get(0)).as("target");
      cy.get("@target").trigger("dragover");
      cy.get("@target").trigger("drop", {
        which: 1,
        clientX: x + opts.offsetX,
        clientY: y + opts.offsetY
      });
    });
    this.getTestsInModuleByModule(targetModuleNumber)
      .last()
      .should("have.attr", "data-test", testid.toString());
  };

  dragTestFromSearchToModule = (targetmod, test) => {
    this.clickExpandByModule(targetmod);
    this.getModuleNameByModule(targetmod).as("target-container");
    this.searchContainer
      .getTestInSearchResultsById(test)
      .first()
      .as("source-container");

    const opts = {
      offsetX: 0,
      offsetY: 0
    };

    cy.get("@source-container")
      .trigger("dragstart")
      .trigger("drag");

    cy.get("@target-container").then($el => {
      const { x, y } = $el.get(0).getBoundingClientRect();
      cy.wrap($el.get(0)).as("target");
      cy.get("@target").trigger("dragover");
      cy.get("@target").trigger("drop", {
        clientX: x + opts.offsetX,
        clientY: y + opts.offsetY
      });
    });

    this.getTestsInModuleByModule(targetmod)
      .last()
      .should("have.attr", "data-test", test.toString());
  };

  dragResourceFromSearchToModule = (targetmod, targetTest, resource) => {
    this.clickExpandByModule(targetmod);
    this.searchContainer
      .getTestInSearchResultsById(resource)
      .first()
      .trigger("dragstart")
      .trigger("drag");

    this.getTestByTestByModule(targetmod, targetTest).trigger("dragover");
    this.getSubResourceDropContainerByTestByMod(targetmod, targetTest).trigger("drop");
    this.getSubResourceByTestByMod(targetmod, targetTest, resource);
  };

  routeSavePlaylist = () => {
    cy.server();
    cy.route("PUT", "**/playlists/*").as("save-playlist");
  };

  waitForSave = () => cy.wait("@save-playlist");

  verifyTestIdByTestByMod = (mod, test, id) =>
    this.getTestByTestByModule(mod, test).should("have.attr", "data-test", id.toString());

  // *** APPHELPERS END ***
}
