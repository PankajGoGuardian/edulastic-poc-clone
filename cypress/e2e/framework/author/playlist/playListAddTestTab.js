export default class PlayListAddTest {
  // =========== ELEMENTS START ===========

  getTestCardById = id => cy.get(`[data-cy="${id}"]`);

  getAddButtonByTestId = id => this.getTestCardById(id).contains("ADD");

  getViewButtonByTestId = id => this.getTestCardById(id).contains("VIEW");

  getManageModuleButton = () => cy.get('[data-cy="ManageModules"]');

  getAddModule = () => cy.get('[data-cy="addModule"]');

  getModuleContainerByModule = mod => cy.get(`[data-cy="module-${mod}"]`);

  getModuleNameByModule = mod => this.getModuleContainerByModule(mod).find('[placeholder="Enter module name"]');

  getModuleSaveByModuleNo = mod => this.getModuleContainerByModule(mod).find('[data-cy="manageModuleApply"]');

  getEditByModuleNo = mod => this.getModuleContainerByModule(mod).contains("span", "EDIT");

  getDeleteByModule = mod => this.getModuleContainerByModule(mod).find('[data-cy="addModuleCancel"]');

  getDoneButton = () => cy.get('[data-cy="done-module"]');

  getModuleWhileAdding = mod => this.getModuleContainerByModule(mod);

  getActionsButton = () => cy.get('[data-cy="moduleActions"]');

  getBulkAdd = () => cy.get('[ data-cy="addToModule"]');

  getBulkRemove = () => cy.get('[data-cy="removeFromModule"]');

  getCheckBoxById = id =>
    this.getTestCardById(id)
      .find(".ant-checkbox")
      .find("input");

  getYesButtonWhileBulkRemove = () => cy.get('[data-cy="bulk-remove"]');

  getConfirmationBoxWhileBulkRemove = () => cy.get('[data-cy="remove-count"]');

  // =========== ELEMENTS END ===========
  // =========== ACTIONS START ===========

  clickOnManageModule = () => this.getManageModuleButton().click();

  clickOnAddModule = () => this.getAddModule().click();

  clickOnSaveByModule = mod => this.getModuleSaveByModuleNo(mod).click();

  clickOnEditByModule = mod => this.getEditByModuleNo(mod).click({ force: true });

  clickOnDeleteByModule = mod => this.getDeleteByModule(mod).click();

  selectModuleWhileAdding = mod => this.getModuleWhileAdding(mod).click();

  setModuleName = (mod, name) => this.getModuleNameByModule(mod).type(`{selectall}${name}`);

  clickOnActions = () => this.getActionsButton().click();

  clickOnBulkAdd = () => this.getBulkAdd().click();

  clickBulkRemove = () => this.getBulkRemove().click();

  clickYesWhileBulkRemove = () => this.getYesButtonWhileBulkRemove().click();
  checkTestById = id => this.getCheckBoxById(id).check({ force: true });

  clickOnViewTestById = id => {
    cy.server();
    cy.route("GET", "**/test/*").as("viewTest");
    this.getViewButtonByTestId(id).click();
    return cy.wait("@viewTest").then(xhr => xhr.response.body.result._id);
  };
  // =========== ACTIONS END - APPHELPER START ===========

  addTestByIdByModule = (testId, mod) => {
    this.getAddButtonByTestId(testId).click();
    this.selectModuleWhileAdding(mod);
    cy.wait(500);
  };

  clickOnDone = (newPlaylist = false) => {
    let plyaListId;

    cy.server();
    cy.route("POST", "**/playlists").as("saveNewPlayList");

    this.getDoneButton().click();
    if (newPlaylist === true) {
      cy.wait("@saveNewPlayList").then(xhr => {
        expect(xhr.status).to.eq(200);
        plyaListId = xhr.response.body.result._id;
        cy.saveplayListDetailToDelete(plyaListId);
      });
    }
    return cy.wait(1).then(() => plyaListId);
  };

  bulkAddByModule = (testId, mod) => {
    testId.forEach(id => {
      this.checkTestById(id);
    });
    this.clickOnActions();
    this.clickOnBulkAdd();
    cy.wait(200);
    this.selectModuleWhileAdding(mod);
  };

  verifyCountWhileBulkRemove = (mod, count) =>
    this.getConfirmationBoxWhileBulkRemove().should(
      "contain.text",
      `${count} of the selected test will be removed from module-${mod}`
    );

  verifyMessage = msg => cy.get(".ant-message").should("contain", msg);
  // =========== APPHELPER END ===========
}
