import FileHelper from "../../framework/util/fileHelper";
import Helpers from "../../framework/util/Helpers";
import TeacherSideBar from "../../framework/author/SideBarPage";
import TeacherManageClassPage from "../../framework/author/manageClassPage";
import { grades } from "../../framework/constants/assignmentStatus";

const posibleGrades = Cypress._.values(grades);
const sideBar = new TeacherSideBar();
const manageClass = new TeacherManageClassPage();

const random = Helpers.getRamdomString();
const user = { email: "teacher1.smoke.automation@snapwiz.com", password: "automation" };
const classNameEdit = "Smoke Automation Class - Edit";
const testData = {
  create: {
    className: `smoke create new class-${random}`,
    grade: grades.GRADE_10,
    subject: "Mathematics",
    standardSet: "Math - Common Core"
  },
  edit: {
    className: `smoke edit new class-${random}`,
    grade: grades.GRADE_5,
    subject: "ELA",
    standardSet: "ELA - Common Core"
  }
};

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Manage Class`, () => {
  before(() => {
    cy.clearToken();
    cy.login("teacher", user.email, user.password);
  });

  beforeEach(() => {
    cy.server();
    cy.route("GET", "**mygroups?active**").as("mygroups");
    sideBar.clickOnManageClass();
  });

  it("> create new class", () => {
    const { className, grade, subject, standardSet } = testData.create;
    const startDate = new Date();
    const endDate = new Date(new Date().setDate(startDate.getDate() + 5));

    manageClass.clickOnCreateClass();
    manageClass.fillClassDetails(className, startDate, endDate, grade, subject, standardSet);
    manageClass.clickOnSaveClass();
    sideBar.clickOnManageClass();
    cy.wait("@mygroups");
    manageClass.getClassRowDetails(className).then(cls => {
      expect(cls.name).to.eq(className);
      expect(cls.grades).to.contain(grade);
      expect(cls.classCode).to.have.length(6);
      expect(cls.subject).to.eq(subject);
      expect(cls.students).to.eq("0");
      expect(cls.assignments).to.eq("0");
    });
  });

  it("> edit the class", () => {
    const { className, grade, subject, standardSet } = testData.edit;
    const startDate = new Date();
    const endDate = new Date(new Date().setDate(startDate.getDate() + 10));

    manageClass.getClassDetailsByName(testData.create.className);
    manageClass.clickOnEditClass();
    manageClass.fillClassDetails(className, startDate, endDate, grade, subject, standardSet, true);
    manageClass.clickOnUpdateClass();
    sideBar.clickOnManageClass();
    cy.wait("@mygroups");

    manageClass.getClassRowDetails(className).then(cls => {
      expect(cls.name).to.eq(className);
      expect(cls.grades).to.contain(grade);
      expect(cls.classCode).to.have.length(6);
      expect(cls.subject).to.eq(subject);
      expect(cls.students).to.eq("0");
      expect(cls.assignments).to.eq("0");
    });
  });

  it("> edit existing class", () => {
    const grade = posibleGrades[Cypress._.floor(Math.random() * posibleGrades.length) - 1];
    const { subject, standardSet } = testData.edit;

    manageClass.getClassDetailsByName(classNameEdit);
    manageClass.clickOnEditClass();
    manageClass.fillClassDetails(undefined, undefined, undefined, grade, subject, standardSet, true);
    manageClass.clickOnUpdateClass();
    sideBar.clickOnManageClass();
    cy.wait("@mygroups");
    manageClass.getClassRowDetails(classNameEdit).then(cls => {
      expect(cls.name).to.eq(classNameEdit);
      expect(cls.grades).to.contain(grade);
      expect(cls.classCode).to.have.length(6);
      expect(cls.subject).to.eq(subject);
      expect(cls.students).to.eq("0");
      expect(cls.assignments).to.eq("0");
    });
  });

  context("> add students", () => {
    it("> add one student", () => {
      const username = Helpers.getRamdomEmail();
      const name = `smokeaddstudent ${random}`;
      manageClass.getClassDetailsByName(testData.edit.className);
      manageClass.clickOnAddStudent();
      manageClass.fillStudentDetails(username, name, user.password);
      manageClass.clickOnAddUserButton().then(() => {
        sideBar.clickOnManageClass();
        cy.wait("@mygroups");
        manageClass.getClassRowDetails(testData.edit.className).then(cls => {
          expect(cls.students).to.eq("1");
        });
      });
    });

    it("> add multiple students by firstname and lastname", () => {
      const username = Helpers.getRamdomEmail();
      const users = [];
      users.push(`smokeaddstudent1 ${random}`);
      users.push(`smokeaddstudent2 ${random}`);
      const name = `smokeaddstudent ${random}`;
      manageClass.getClassRowDetails(testData.edit.className).then(cls => {
        const previousCount = parseInt(cls.students);
        manageClass.getClassDetailsByName(testData.edit.className);
        manageClass.clickOnAddStudents();
        manageClass.addStudentByFirstNameLastName(users).then(() => {
          sideBar.clickOnManageClass();
          cy.wait("@mygroups");
          manageClass.getClassRowDetails(testData.edit.className).then(cls => {
            expect(cls.students).to.eq(`${previousCount + 2}`);
          });
        });
      });
    });
  });
});
