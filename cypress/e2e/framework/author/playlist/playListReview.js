import LiveClassboardPage from "../assignments/LiveClassboardPage";
import DndSimulatorDataTransfer from "../../../../support/misc/dndSimulator";
import { teacherSide } from "../../constants/assignmentStatus";

export default class PlayListReview {
  constructor() {
    this.lcb = new LiveClassboardPage();
  }

  // *** ELEMENTS START ***

  getModuleRowByModule = mod => cy.get(`[data-cy="row-module-${mod}"]`);

  getTestsInModuleByModule = mod => this.getModuleRowByModule(mod).find('[data-cy="moduleAssignment"]');

  getTestByTestByModule = (mod, test) => this.getTestsInModuleByModule(mod).eq(test - 1);

  getDeleteButtonByTestByModule = (mod, test) =>
    this.getTestByTestByModule(mod, test).find('[data-cy="assignmentDeleteOptionsIcon"]');

  getAssignButtonByTestByModule = (mod, test) => this.getTestByTestByModule(mod, test).find('[data-cy="assignButton"]');

  getAssignButtonByModule = mod => this.getModuleRowByModule(mod).find('[data-cy="AssignWholeModule"]');

  getViewTestByTestByModule = (mod, test) => this.getTestByTestByModule(mod, test).find('[data-cy="view-test"]');

  getModuleNameByModule = mod => this.getModuleRowByModule(mod).find('[data-cy="module-name"]');

  getStandardsContainerByTestbyModule = (mod, test) => this.getTestByTestByModule(mod, test).find('[class^="Tags_"]');

  getPresentationIconByTestByModule = (mod, test) =>
    this.getTestByTestByModule(mod, test)
      .next()
      .find('[ data-cy="PresentationIcon"]');

  getPlaylistSub = () => cy.get('[data-cy="playlist-sub"]');

  getPlaylistGrade = () => cy.get('[data-cy="playlist-grade"]');

  getModuleCompleteStatus = () => cy.get('[data-cy="module-complete"]');

  getHideModuleByModule = mod => this.getModuleRowByModule(mod).find('[data-cy="hide-module"]');

  getShowModuleByModule = mod => this.getModuleRowByModule(mod).find('[data-cy="show-module"]');

  getHideByTestByModule = (mod, test) => this.getTestByTestByModule(mod, test).find('[data-cy="make-hidden"]');

  getShowByTestByModule = (mod, test) => this.getTestByTestByModule(mod, test).find('[data-cy="make-visible"]');

  // *** ELEMENTS END ***

  clickLcbIconByTestByIndex = (mod, test, index) => {
    cy.server();
    cy.route("GET", "**/api/realtime/url").as("lcbLoad");
    this.getPresentationIconByTestByModule(mod, test)
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

  clickOnAssignByTestByModule = (mod, test) =>
    this.getAssignButtonByTestByModule(mod, test).then(button => {
      this.clickAssignmentButtonByButton(button);
    });

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

  clickOnViewTestByTestByModule = (mod, test) => {
    cy.server();
    cy.route("GET", "**/test/*").as("viewTest");
    this.getViewTestByTestByModule(mod, test).click();
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
    cy
      .get('[data-cy="moduleProgress"]')
      .trigger("mouseover", { force: true })
      .should("contain", `${completed}/${total}`);

  verifyPlalistGrade = grade => this.getPlaylistGrade().should("contain.text", grade);

  verifyPlalistSubject = sub => this.getPlaylistSub().should("contain.text", sub);

  verifyModuleCompleteText = () => this.getModuleCompleteStatus().should("have.text", "MODULE COMPLETED");

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

  moveTestBetweenModule = (sourcemodNumber, sourceTestNumber, targetModuleNumber) => {
    this.clickExpandByModule(sourcemodNumber);
    this.clickExpandByModule(targetModuleNumber);
    this.getTestByTestByModule(sourcemodNumber, sourceTestNumber).as("source-container");
    this.getModuleRowByModule(targetModuleNumber).as("target-container");
    this.routeSavePlaylist();
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
      this.waitForSave();
    });
  };

  routeSavePlaylist = () => {
    cy.server();
    cy.route("PUT", "**/playlists/*").as("save-playlist");
  };

  waitForSave = () => cy.wait("@save-playlist");

  // *** APPHELPERS END ***
}
