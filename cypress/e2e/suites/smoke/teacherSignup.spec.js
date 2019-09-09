import FileHelper from "../../framework/util/fileHelper";
import SignupPage from "../../framework/common/signupPage";
import LoginPage from "../../framework/student/loginPage";
import Helpers from "../../framework/util/Helpers";

const signupPage = new SignupPage();
const loginPage = new LoginPage();
const signupData = {
  name: "smoke signupteacher",
  email: "smoke.signupteacher@snapwiz.com",
  password: "snapwiz",
  school: "Automation School - Smoke Suite",
  grade: "Grade 5",
  subject: "Mathematics",
  standardSet: "Math - Common Core",
  newSchool: {
    schoolName: "smoke sigup school",
    district: "Automation District",
    address: "Snapwiz IDC",
    zip: "555555",
    city: "Bangalore",
    state: "KA",
    country: "India"
  },
  newDistrict: "smoke signup district"
};

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Teacher Signup`, () => {
  beforeEach(() => {
    cy.clearToken();
    cy.server();
    cy.route("POST", "**/schools").as("schoolSearch");
    cy.route("POST", "**/school/").as("schoolCreate");
    cy.route("POST", "**courses").as("courses");
    cy.route("POST", "**districts").as("district");
    cy.route("GET", "**curriculum").as("curriculam");
    cy.route("PUT", "**/user/**").as("user");
    cy.visit("/");
  });

  it("> signup using existing school", () => {
    const { name, email, password, school, grade, standardSet, subject } = signupData;
    signupPage.clickOnSignupLink();
    signupPage.clickOnTeacher();
    signupPage.fillTeacherSignupForm(name, `${Helpers.getRamdomString()}.${email}`, password);
    signupPage.searchAndSelectSchool(school);
    signupPage.clickOnProceed();
    cy.wait("@user").then(xhr => expect(xhr.status).to.eq(200));
    cy.wait("@curriculam");
    signupPage.selectGrade(grade);
    signupPage.selectSubject(subject);
    signupPage.selectStandardSet(standardSet);
    signupPage.clickOnGetStarted();
    cy.wait("@courses").then(() => cy.url().should("contain", "author/dashboard"));
  });

  it("> signup using new school and existing district", () => {
    const { name, email, password, grade, standardSet, subject, newSchool } = signupData;
    const { schoolName, district, zip, city, country, address, state } = newSchool;
    const random = Helpers.getRamdomString();
    signupPage.clickOnSignupLink();
    signupPage.clickOnTeacher();
    signupPage.fillTeacherSignupForm(name, `${Helpers.getRamdomString()}.${email}`, password);
    // request new school
    signupPage.clickOnRequestNewSchoolLink();
    signupPage.fillSchoolDetails(`${schoolName}-${random}`, district, address, zip, city, state, country);
    signupPage.clickOnReqNewSchool();
    cy.wait("@schoolCreate").then(xhr => expect(xhr.status).to.eq(200));
    cy.wait("@curriculam");
    signupPage.selectGrade(grade);
    signupPage.selectSubject(subject);
    signupPage.selectStandardSet(standardSet);
    signupPage.clickOnGetStarted();
    cy.wait("@courses").then(() => cy.url().should("contain", "author/dashboard"));
  });

  it("> signup using new district and new school", () => {
    const { name, email, password, grade, standardSet, subject, newSchool, newDistrict } = signupData;
    const { schoolName, zip, city, country, address, state } = newSchool;
    const random = Helpers.getRamdomString(Helpers.stringTypes().ALPHA, 8);
    signupPage.clickOnSignupLink();
    signupPage.clickOnTeacher();
    signupPage.fillTeacherSignupForm(
      name,
      `${Helpers.getRamdomString(Helpers.stringTypes().ALPHA, 8)}.${email}`,
      password
    );
    // request new school and district

    signupPage.clickOnRequestNewSchoolLink();
    signupPage.fillSchoolDetails(
      `${schoolName}-${random}`,
      `${newDistrict}-${random}`,
      address,
      zip,
      city,
      state,
      country
    );

    signupPage.clickOnReqNewSchool();
    cy.wait("@schoolCreate").then(xhr => expect(xhr.status).to.eq(200));
    cy.wait("@curriculam");
    signupPage.selectGrade(grade);
    signupPage.selectSubject(subject);
    signupPage.selectStandardSet(standardSet);
    signupPage.clickOnGetStarted();
    cy.wait("@courses").then(() => cy.url().should("contain", "author/dashboard"));
  });
});
