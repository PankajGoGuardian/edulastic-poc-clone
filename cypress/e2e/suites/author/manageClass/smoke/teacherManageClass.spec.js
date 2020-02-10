/* eslint-disable cypress/no-unnecessary-waiting */
import FileHelper from "../../../../framework/util/fileHelper";
import Helpers from "../../../../framework/util/Helpers";
import TeacherSideBar from "../../../../framework/author/SideBarPage";
import TeacherManageClassPage from "../../../../framework/author/manageClassPage";
import { grades, subject as allSubjects } from "../../../../framework/constants/assignmentStatus";
import CypressHelper from "../../../../framework/util/cypressHelpers";

const { _ } = Cypress;
const posibleGrades = _.values(grades);
const posibleSubjects = _.values(allSubjects);
const sideBar = new TeacherSideBar();
const manageClass = new TeacherManageClassPage();

const random = Helpers.getRamdomString();
const userType = {
  GOOGLE: "Google Usernames",
  MSO: "Office 365 Usernames",
  FL_NAME: "First Name and Last Name",
  LF_NAME: "Last Name and First Name"
};
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
const subjectStdMap = {
  Mathematics: "Math - Common Core",
  ELA: "ELA - Common Core",
  Science: "Science - NGSS",
  "Social Studies": "Social Studies",
  "Other Subjects": "ACARA Dance"
};

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Manage Class`, () => {
  before(() => {
    cy.clearToken();
    cy.login("teacher", user.email, user.password);
  });

  beforeEach(() => {
    cy.server();
    cy.route("GET", "**mygroups?active**").as("mygroups");
  });

  context("> create new class", () => {
    const { className, grade, subject, standardSet } = testData.create;
    const startDate = new Date();
    const endDate = new Date(new Date().setDate(startDate.getDate() + 30));

    before(() => {
      sideBar.clickOnManageClass();
    });

    it("> verify grade dropdown list", () => {
      manageClass.clickOnCreateClass();
      manageClass
        .getGradeSelect()
        .click()
        .then(() => {
          CypressHelper.getDropDownList().then(list => expect(list).to.eql(posibleGrades));
        });
    });

    it("> verify subject dropdown lists", () => {
      manageClass.clickOnCancel();
      manageClass.clickOnCreateClass();
      manageClass
        .getSubjectSelect()
        .click()
        .then(() => {
          CypressHelper.getDropDownList().then(list => expect(list).to.eql(posibleSubjects));
        });
    });

    it("> verify subject-standard mapping", () => {
      manageClass.clickOnCancel();
      manageClass.clickOnCreateClass();
      Object.keys(subjectStdMap).forEach(sub => {
        manageClass.selectSubject(sub).then(() => {
          cy.wait(500);
          manageClass
            .getStandardSets()
            .click()
            .then(() => {
              CypressHelper.getDropDownList().then(list =>
                expect(list, `verify standards${JSON.stringify(list)},are as per subject ${sub}`).to.include.members([
                  subjectStdMap[sub]
                ])
              );
            })
            .wait(500)
            .focused()
            .blur();
        });
      });
    });

    it("> create class", () => {
      manageClass.clickOnCancel();
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
  });

  context("> add students", () => {
    beforeEach(() => {
      sideBar.clickOnManageClass();
    });

    it("> add one student", () => {
      const username = Helpers.getRamdomEmail();
      const name = `smokeaddstudent ${random}`;
      manageClass.getClassDetailsByName(testData.create.className);
      manageClass.clickOnAddStudent();
      manageClass.fillStudentDetails(username, name, user.password);
      manageClass.clickOnAddUserButton().then(() => {
        sideBar.clickOnManageClass();
        cy.wait("@mygroups");
        manageClass.getClassRowDetails(testData.create.className).then(cls => {
          expect(cls.students).to.eq("1");
        });
      });
    });

    _.keys(userType).forEach(uType => {
      it(`> add multiple students by - ${userType[uType]}`, () => {
        const users = [];
        switch (uType) {
          case "GOOGLE":
            users.push(Helpers.getRamdomEmail("gmail.com"));
            users.push(Helpers.getRamdomEmail("gmail.com"));
            break;

          case "MSO":
            users.push(Helpers.getRamdomEmail("outlook.com"));
            users.push(Helpers.getRamdomEmail("outlook.com"));
            break;

          case "FL_NAME":
            users.push(`smokeaddstudent1 ${random}`);
            users.push(`smokeaddstudent2 ${random}`);
            break;

          case "LF_NAME":
            users.push(`${random} smokeaddstudent1`);
            users.push(`${random} smokeaddstudent2`);
            break;

          default:
            break;
        }

        manageClass.getClassRowDetails(testData.create.className).then(cls => {
          const previousCount = parseInt(cls.students, 10);
          manageClass.getClassDetailsByName(testData.create.className);
          manageClass.clickOnAddStudents();
          manageClass.addMultipleStudent(users, userType[uType]).then(() => {
            sideBar.clickOnManageClass();
            cy.wait("@mygroups");
            manageClass.getClassRowDetails(testData.create.className).then(c => {
              expect(c.students).to.eq(`${previousCount + 2}`);
            });
          });
        });
      });
    });
  });

  context("> edit class", () => {
    const { className, grade, subject, standardSet } = testData.edit;
    const startDate = new Date();
    const endDate = new Date(new Date().setDate(startDate.getDate() + 30));

    beforeEach(() => {
      sideBar.clickOnManageClass();
    });

    it("> edit the class", () => {
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
        // expect(cls.students).to.eq("0");
        expect(cls.assignments).to.eq("0");
      });
    });

    it("> edit existing class", () => {
      const randomGrade = posibleGrades[_.floor(Math.random() * posibleGrades.length)];
      manageClass.getClassDetailsByName(classNameEdit);
      manageClass.clickOnEditClass();
      manageClass.fillClassDetails(undefined, undefined, undefined, randomGrade, subject, standardSet, true);
      manageClass.clickOnUpdateClass();
      sideBar.clickOnManageClass();
      cy.wait("@mygroups");
      manageClass.getClassRowDetails(classNameEdit).then(cls => {
        expect(cls.name).to.eq(classNameEdit);
        expect(cls.grades).to.contain(randomGrade);
        expect(cls.classCode).to.have.length(6);
        expect(cls.subject).to.eq(subject);
        expect(cls.students).to.eq("0");
        expect(cls.assignments).to.eq("0");
      });
    });
  });
});
