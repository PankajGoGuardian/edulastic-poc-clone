import TestAssignPage from "../tests/testDetail/testAssignPage";

class LCBtestSettings extends TestAssignPage {
  // GET ELEMENTS STARTS
  getShowTestLevelSettings = () => cy.get('[id="test-level-settings"]');

  getUpdateSetting = () => cy.get('[data-cy="lcb-setting-update"]');

  getOkOnPopUpWhileUpdateTimeSetting = () => {
    cy.contains("Changes made in Timed Assignment will impact all Students who are In Progress or Not Started.");

    return cy
      .get(".ant-modal-confirm-btns")
      .find("button")
      .contains("Proceed");
  };
  // GET ELEMENTS ENDS

  // ACTION STARt

  showTestLevelSettings = () => {
    if (Cypress.$('[data-cy="exit-allowed"]').length === 0) {
      this.getShowTestLevelSettings().click({ force: true });
    }
  };

  clickUpadeSettings = () => {
    cy.server();
    cy.route("PUT", "**/assignments/*/group/*/settings").as("update-settings");
    this.getUpdateSetting().click();
    cy.wait("@update-settings");
  };

  allowToUpdateTimeSetting = () => {
    /* this method will just click proceed on pop-up, will not update any settings */
    this.getAllowExit()
      .parent()
      .click({ force: true })
      .then($ele => {
        this.getOkOnPopUpWhileUpdateTimeSetting()
          .click({ force: true })
          .then(() => {
            if ($ele.hasClass("ant-checkbox-checked")) this.disableAllowExit();
            else this.enableAllowExit();
          });
      });
  };
}
export default LCBtestSettings;
