import FileHelper from "../../../../framework/util/fileHelper";
import SignupPage from "../../../../framework/common/signupPage";
import Helpers from "../../../../framework/util/Helpers";

const signupPage = new SignupPage();
const signupData = {
  name: "smoke signupstudent",
  email: "smoke.signupstudent@snapwiz.com",
  password: "snapwiz",
  classCode: "CKO8FR"
};

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Student Signup`, () => {
  beforeEach(() => {
    cy.clearToken();
    cy.server();
    cy.route("GET", "**/test-activity/**").as("testActivity");
    cy.visit("/");
  });

  it("> signup using existing class code", () => {
    const { name, email, password, classCode } = signupData;
    const random = Helpers.getRamdomString();
    signupPage.clickOnSignupLink();
    signupPage.clickOnStudent();
    signupPage.fillStudentSignupForm(classCode, name, `${random}.${email}`, password);
    cy.wait("@testActivity").then(() => cy.url().should("contain", "home/assignments"));

    // logout then login and verify
    cy.login("student", `${random}.${email}`, password);
    cy.url().should("contain", "home/assignments");
  });
});
