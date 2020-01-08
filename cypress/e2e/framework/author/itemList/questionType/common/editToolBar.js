class EditToolBar {
  frToolbar = () => cy.get(".fr-toolbar");

  clickOnBold = () =>
    this.frToolbar()
      .find('[data-cmd="bold"]')
      .click();

  clickOnItalic = () =>
    this.frToolbar()
      .find('[data-cmd="italic"]')
      .click();

  selectFontSize = fontSize => {
    this.frToolbar()
      .find('[data-cmd="fontSize"]')
      .click();

    cy.xpath(`//a[contains(text(),'${fontSize}')]`).click();
  };

  clickOnIndent = () =>
    this.frToolbar()
      .find('[data-cmd="indent"]')
      .click();

  clickOnOutdent = () =>
    this.frToolbar()
      .find('[data-cmd="outdent"]')
      .click();

  clickOnFormat = () =>
    this.frToolbar()
      .find('[data-cmd="paragraphFormat"]')
      .click();

  clickOnTable = () =>
    this.frToolbar()
      .find('[data-cmd="insertTable"]')
      .click();

  clickOnMath = () =>
    this.frToolbar()
      .find('[data-cmd="math"]')
      .click();

  clickOnInserImage = () =>
    this.frToolbar()
      .find('[data-cmd="insertImage"]')
      .click();

  clickOnMore = () =>
    this.frToolbar()
      .find('[data-cmd="moreText"]')
      .click();

  clickOnInserImage = () =>
    this.frToolbar()
      .find('[data-cmd="insertImage"]')
      .click();

  clickOnInserImage = () =>
    this.frToolbar()
      .find('[data-cmd="insertImage"]')
      .click();

  textDropDown = () => this.frToolbar().find('[data-cmd="textdropdown"]');

  textInput = () => this.frToolbar().find('[data-cmd="textinput"]');

  linkButton = () => this.frToolbar().find('[data-cmd="insertLink"]');

  // Response boxes

  clickonResponseBox = () =>
    this.frToolbar()
      .find(".custom-toolbar-btn")
      .click({ force: true });

  // mathinpit

  clickOnMathInput = () => {
    this.clickonResponseBox();
    cy.get('[data-param1="mathinput"]').click({ force: true });
  };

  linkURL = () =>
    this.frToolbar()
      .first()
      .find(".fr-link-attr")
      .eq(0);

  linkText = () =>
    this.frToolbar()
      .find(".fr-link-attr")
      .eq(1);
  insertLinkButton = () => this.frToolbar().find('[data-cmd="linkInsert"]');

  //
}

export default EditToolBar;
