class LoginPage {
  // *** ELEMENTS START ***

  getEmail = () => cy.get(`[data-cy=email]`);

  getPassword = () => cy.get(`[data-cy=password]`);

  getLoginButton = () => cy.get(`[data-cy=login]`);

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  fillLoginForm = (email, password) => {
    this.getEmail()
      .clear()
      .type(email);
    this.getPassword()
      .clear()
      .type(password);
  };

  clickOnSignin = () =>
    this.getLoginButton()
      .should("be.visible")
      .click();

  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  emailErrormssg = () => cy.contains("Invalid username or password").should("be.visible");

  assertTeacherLogin = () => {
    cy.url().should("include", "author/dashboard", "verify teacher is redirected to dashboard url");
    cy.contains("Dashboard").should("exist", "verify teacher is landed to dashboard page");
  };

  // *** APPHELPERS END ***
}

export default LoginPage;
