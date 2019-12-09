class LoginPage {
  fillLoginForm = (email, password) => {
    cy.get(`[data-cy=email]`)
      .clear()
      .type(email);
    cy.get(`[data-cy=password]`)
      .clear()
      .type(password);
  };

  clickOnSignin = () =>
    cy
      .get(`[data-cy=login]`)
      .should("be.visible")
      .click();

  emailErrormssg = () => cy.contains("Invalid username or password").should("be.visible");

  assertTeacherLogin = () => {
    cy.url().should("include", "author/dashboard", "verify teacher is redirected to dashboard url");
    cy.contains("Dashboard").should("exist", "verify teacher is landed to dashboard page");
  };
}

export default LoginPage;
