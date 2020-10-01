import CypressHelper from '../util/cypressHelpers'

const { dom, $ } = Cypress
export class FolderPage {
  // Elements start

  getButtonByAttr = (attr) => cy.get(`[data-cy="${attr}"]`)

  getAddNewFolderButton = () => this.getButtonByAttr('addFolderButton')

  getNewFolderNameInput = () => cy.get('[placeholder="Name this folder"]')

  getSubmitButtonInPopUp = () => this.getButtonByAttr('submit')

  getFolderByName = (name) => this.getButtonByAttr(name)

  getFolderOptionsByName = (name) =>
    this.getFolderByName(name).find('[data-cy="folder-option"]')

  getRenameFolderButton = () =>
    this.getButtonByAttr('rename').filter((i, ele) => dom.isVisible(ele))

  getDeleteFolderButton = () =>
    this.getButtonByAttr('delete').filter((i, ele) => dom.isVisible(ele))

  getActionButtonInHeader = () => this.getButtonByAttr('assignmentActions')

  getAddToFolderInDropDown = () => this.getButtonByAttr('add-to-folder')

  getRemoverFromFolderInDropDown = () =>
    this.getButtonByAttr('remove-from-folder')

  getFolderInPopUpByName = (name) =>
    cy.get('.ant-modal-body').find(`[data-cy="${name}"]`)

  getUpdateFolderButton = () =>
    this.getSubmitButtonInPopUp().contains('Update Folder')

  getDeleteButtonInPopUp = () =>
    this.getSubmitButtonInPopUp().contains('PROCEED')

  getRemoveButtonInPopUp = () =>
    this.getSubmitButtonInPopUp().contains('Remove')

  getCancelButtonInPopUp = () => this.getButtonByAttr('cancel')

  getAddButtonInPopUp = () => this.getSubmitButtonInPopUp().contains('Add')

  getCreateNewFolderButton = () =>
    this.getSubmitButtonInPopUp().contains('Create New Folder')

  getAllAssignment = () => cy.contains('span', 'All Assignments')

  // Elements end

  // Actions Start

  clickOnAllAssignment = () => this.getAllAssignment().click()

  clickFolderButton = () => this.getButtonByAttr('FOLDERS').click()

  clickAddNewFolderButton = () => this.getAddNewFolderButton().click()

  setNewFolderName = (name) => this.getNewFolderNameInput().type(name)

  clickCreateNewFolderBuuton = (name) => {
    cy.server()
    cy.route('POST', '**/user-folder').as('add-new-item-folder')
    this.getCreateNewFolderButton().click({ force: true })
    cy.wait('@add-new-item-folder').then(({ status }) =>
      expect(status, `adding neww item foled`).to.eq(200)
    )
    CypressHelper.verifyAntMesssage(`${name} created successfully`)
    this.verifyFolderVisible(name)
  }

  clickOnMoreOptionsByFolderName = (name) =>
    this.getFolderOptionsByName(name).click()

  clickRenameFolder = () => this.getRenameFolderButton().click()

  clickDeleteFolderInDropDown = () => this.getDeleteFolderButton().click()

  clickUpdateFolder = (newName, valid = true) => {
    CypressHelper.removeAllAntMessages()
    cy.server()
    cy.route('PUT', '**/user-folder/*').as('update-folder-name')
    this.getUpdateFolderButton().click({ force: true })
    if (valid) {
      cy.wait('@update-folder-name').then(({ status }) =>
        expect(
          status,
          `updating folder name ${status === 200 ? 'success' : 'failed'}`
        ).to.eq(200)
      )
      CypressHelper.verifyAntMesssage(
        `Folder name successfully updated to "${newName}"`
      )
    } else {
      CypressHelper.verifyAntMesssage('The folder name is already used.')
      this.getCancelButtonInPopUp().click()
      this.verifyFolderVisible(newName)
    }
  }

  clickDeleteFolder = (folderName) => {
    cy.server()
    cy.route('DELETE', '**/user-folder/*').as('delete-folder')
    CypressHelper.removeAllAntMessages()
    this.getDeleteButtonInPopUp().click({ force: true })
    cy.wait('@delete-folder').then(({ status }) =>
      expect(
        status,
        `deleting folder ${status === 200 ? 'success' : 'failed'}`
      ).to.eq(200)
    )
    if (folderName) {
      CypressHelper.verifyAntMesssage(`${folderName} deleted successfully`)
      this.verifyFolderNotVisible(folderName)
    }
  }

  clickOnFolderByName = (name) => {
    cy.server()
    cy.route('POST', '**/search/**').as('search')
    this.clickFolderButton()
    this.getFolderByName(name).click()
    cy.get('[data-cy="title"]').then((ele) => {
      if (ele.text() !== 'Assignments') cy.wait('@search')
    })
  }

  showActionDropDownInHeader = () =>
    this.getActionButtonInHeader().should('be.visible').click()

  clickAddToFolderInDropDown = () => {
    this.showActionDropDownInHeader()
    this.getAddToFolderInDropDown().should('be.visible').click({ force: true })
  }

  clickRemoveFromFolderInDropDown = () => {
    this.showActionDropDownInHeader()
    this.getRemoverFromFolderInDropDown()
      .should('be.visible')
      .click({ force: true })
  }

  clickCancelButtonInPopUp = () =>
    this.getCancelButtonInPopUp().click({ force: true })

  selectFolderByNameInPopUp = (name) =>
    this.getFolderInPopUpByName(name).click()

  addToFolderByFolderName = (folderName) => {
    cy.server()
    cy.route('PUT', '**/user-folder/*/content').as('add-item-to-folder')
    CypressHelper.removeAllAntMessages()

    this.selectFolderByNameInPopUp(folderName)
    this.getAddButtonInPopUp().click({ force: true })

    cy.wait('@add-item-to-folder').then(({ status }) =>
      expect(
        status,
        `adding to folder ${status === 200 ? 'success' : 'failed'}`
      ).to.eq(200)
    )
  }

  removeFromFolderByFolderName = (folderName) => {
    cy.server()
    cy.route('PUT', '**/user-folder/*/content-delete').as(
      'remove-item-from-folder'
    )
    CypressHelper.removeAllAntMessages()

    this.selectFolderByNameInPopUp(folderName)
    this.getRemoveButtonInPopUp().click({ force: true })

    cy.wait('@remove-item-from-folder').then(({ status }) =>
      expect(
        status,
        `removing item from folder ${status === 200 ? 'success' : 'failed'}`
      ).to.eq(200)
    )
  }

  // Actions End

  // App Helpers

  verifyFolderVisible = (folderName) =>
    this.getFolderByName(folderName).should('be.visible')

  verifyFolderNotVisible = (folderName) =>
    this.getFolderByName(folderName).should('not.be.visible')

  deleteAllFolders = () => {
    this.clickFolderButton()
    cy.get('body').then(() => {
      if ($('[data-cy="folder-option"]').length > 0)
        for (let i = 0; i < $('[data-cy="folder-option"]').length; i++) {
          cy.get('[data-cy="folder-option"]')
            .first()
            .should(($ele) => expect(dom.isAttached($ele)).to.be.true)
            .click({ force: true })
          this.clickDeleteFolderInDropDown()
          this.clickDeleteFolder()
        }
    })
  }
}
