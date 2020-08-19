/* eslint-disable func-names */
import CypressHelper from "../util/cypressHelpers";

class SignupPage {
  // *** ELEMENTS START ***

  getSchoolSearch = () => cy.get('[data-cy="Search by Zip, Name or City"]');

  getHomeSchool = () => cy.contains(" I WANT TO HOMESCHOOL »");

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  clickOnSignupLink = () => {
    cy.contains("SIGN UP")
      .should("be.visible")
      .click();
    cy.url().should("include", "/getStarted");
  };

  clickOnStudent = () =>
    cy
      .get("[data-cy=student]")
      .should("be.visible")
      .click();

  clickOnTeacher = () =>
    cy
      .get("[data-cy=teacher]")
      .should("be.visible")
      .click();

  clickOnAdmin = () =>
    cy
      .get("[data-cy=admin]")
      .should("be.visible")
      .click();

  setCode = code =>
    cy
      .get(`[data-cy=classCode]`)
      .clear()
      .type(code);

  setName = name =>
    cy
      .get(`[data-cy=name]`)
      .clear()
      .type(name);

  setEmail = email =>
    cy
      .get(`[data-cy=email]`)
      .clear()
      .type(email);

  setPassword = password =>
    cy
      .get(`[data-cy=password]`)
      .clear()
      .type(password);

  clickOnSignupButton = () => {
    cy.route("POST", "**/signup").as("signup");
    cy.get(`[data-cy=signup]`).click();
    cy.wait("@signup").then(xhr => {
      const { _id, role, email } = xhr.response.body.result;
      console.log("user created with _id : ", _id);
      cy.saveUserDetailToDelete({ role, email, _id });
    });
  };

  fillStudentSignupForm(code, name, email, password) {
    this.setCode(code);
    this.setName(name);
    this.setEmail(email);
    this.setPassword(password);
    this.clickOnSignupButton();
  }

  fillTeacherSignupForm = (name, email, password) => {
    this.setName(name);
    this.setEmail(email);
    this.setPassword(password);
    this.clickOnSignupButton();
    cy.wait("@schoolSearch");
  };

  clickOnProceed = () => cy.contains("Proceed").click();

  clickOnGetStarted = () => {
    cy.get('[data-cy="getStarted"]').click({ force: true });
    cy.wait("@user").then(xhr => expect(xhr.status).to.eq(200));
  };

  // grade subject preference

  selectGrade = grade => CypressHelper.selectMultipleSelectionDropDown("grade", grade);

  selectSubject = subject => CypressHelper.selectMultipleSelectionDropDown("subject", subject);

  selectStandardSet = standard => CypressHelper.selectMultipleSelectionDropDown("standardSet", standard);

  setPreference = (grade, subject, standardSet) => {
    this.selectGrade(grade);
    this.selectSubject(subject);
    this.selectStandardSet(standardSet);
  };

  onClickUserInfo = () => {
    cy.get("[data-cy=userInfo]").click();
    cy.contains("SIGN OUT").click();
  };

  clickOnHomeSchool = () => this.getHomeSchool().click();

  // new school

  clickOnReqNewSchool = () => {
    cy.get(`.ant-modal-footer`)
      .find('[data-cy="reqNewSchoolBtn"]')
      .click();
    cy.wait("@user").then(xhr => expect(xhr.status).to.eq(200));
  };

  clickOnRequestNewSchoolLink = () => cy.contains("REQUEST A NEW SCHOOL").click();

  setSchoolName = school =>
    cy
      .get('[data-cy="school"]')
      .clear()
      .type(school);

  setaddress = address =>
    cy
      .get('[data-cy="address"]')
      .clear()
      .type(address);

  setcity = city =>
    cy
      .get('[data-cy="city"]')
      .clear()
      .type(city);

  setzip = zip =>
    cy
      .get('[data-cy="zip"]')
      .clear()
      .type(zip);

  setState = state =>
    cy
      .get('[data-cy="state"]')
      .clear()
      .type(state);

  setDistrict = district => {
    cy.get('[data-cy="Enter your school district name"]')
      .click({ force: true })
      .type(district);

    cy.wait("@district");
    cy.get(".ant-select-dropdown-menu-item")
      .contains(district)
      .click({ force: true });
  };

  setCountry = country => {
    cy.get(`[data-cy=country]`).click();
    cy.get(".ant-select-dropdown-menu-item").then($ele => {
      $ele
        .filter(function() {
          return Cypress.$(this).text() === country;
        })
        .click();
    });
  };

  fillSchoolDetails(schoolName, districtName, address, zip, city, state, country) {
    this.setSchoolName(schoolName);
    this.setDistrict(districtName);
    this.setaddress(address);
    this.setzip(zip);
    this.setcity(city);
    this.setCountry(country);
    this.setState(state);
  }

  removeSelected = () => {
    if (Cypress.$('[data-cy="removeSelected"]').length > 0) {
      cy.get('[data-cy="removeSelected"]').click({ force: true });
    }
  };

  searchAndSelectSchool = school => {
    this.getSchoolSearch().type(school);
    cy.wait("@schoolSearch");
    cy.get(".ant-select-dropdown-menu-item")
      .contains(school)
      .click({ force: true });
    return cy.wait("@userSearch");
  };

  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  verifyDistrict = dist => cy.get('[data-cy="districtName"]').should("contain.text", dist);

  // *** APPHELPERS END ***
}

export default SignupPage;
