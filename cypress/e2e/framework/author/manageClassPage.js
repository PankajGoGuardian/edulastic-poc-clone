import CypressHelper from "../util/cypressHelpers";
import TeacherSideBar from "./SideBarPage";

export default class TeacherManageClassPage {
  constructor() {
    this.sideBar = new TeacherSideBar();
  }

  clickOnCreateClass = () => cy.get('[data-cy="createClass"]').click({});

  clickOnEditClass = () => cy.get("[data-cy='editClass']").click();

  clickOnUpdateClass = () => {
    cy.server();
    cy.route("PUT", "**/group/**").as("updateClass");
    cy.get('[data-cy="updateClass"]').click();
    cy.wait("@updateClass").then(xhr => {
      expect(xhr.status).to.eq(200);
    });
  };

  clickOnCancel = () => cy.get("[data-cy=cancel]").click();

  getClassName = () => cy.get("#name");

  getGradeSelect = () => cy.get("#grades");

  getSubjectSelect = () => cy.get("#subject");

  getStandardSets = () => cy.get("#standardSets");

  setName(name) {
    this.getClassName()
      .clear()
      .type(name);
  }

  verifyName(name) {
    this.getClassName().then($ele => {
      expect($ele.val()).to.eq(name);
    });
  }

  selectOption = option => {
    cy.get(".ant-select-dropdown-menu-item")
      .contains(option)
      .click({ force: true });
    return cy.focused().blur();
  };

  clearSelections = id => {
    cy.get("@selector").then($ele => {
      if (Cypress.$($ele).find(".ant-select-selection__choice__content").length > 0) {
        cy.wrap($ele)
          .find(".ant-select-selection__choice__content")
          .its("length")
          .then(len => {
            cy.xpath(`//input[@id='${id}']`).type("{backspace}".repeat(len));
          });
      }
    });
  };

  selectGrade = grade => {
    this.getGradeSelect()
      .as("selector")
      .click();
    this.clearSelections("grades");
    this.selectOption(grade);
  };

  verifyGrade = grade => {
    this.getGradeSelect()
      .find(".ant-select-selection__choice__content")
      .should("have.text", grade);
  };

  selectSubject = subject => {
    this.getSubjectSelect().click();
    return this.selectOption(subject);
  };

  verifySubject = subject => {
    this.getSubjectSelect()
      .find(".ant-select-selection-selected-value")
      .should("have.text", subject);
  };

  selectStandardSets = standardSets => {
    this.getStandardSets()
      .as("selector")
      .click();
    this.clearSelections("standardSets");
    this.selectOption(standardSets);
  };

  verifyStandardSets = standardSets => {
    this.getStandardSets()
      .find(".ant-select-selection__choice__content")
      .should("have.text", standardSets);
  };

  getStartDate = () => cy.get("[data-cy=startDate]");

  getEndDate = () => cy.get("[data-cy=endDate]");

  setStartDate = (datetime, isEdit) => {
    if (!isEdit) {
      this.getStartDate().click();
      CypressHelper.setDateInCalender(datetime, false);
    }
  };

  setEndDate = datetime => {
    this.getEndDate().click();
    CypressHelper.setDateInCalender(datetime, false);
  };

  verifyStartDate = date => {
    this.getStartDate().then($d => {
      expect($d.val()).to.eq(this.getDateInFormate(date));
    });
  };

  verifyEndDate = date => {
    this.getEndDate().then($d => {
      expect($d.val()).to.eq(this.getDateInFormate(date));
    });
  };

  getDateInFormate = datetime => {
    const [day, mon, date, year] = datetime.toDateString().split(" ");
    return `${date} ${mon}, ${year}`;
  };

  uploadClassImag = () => {
    cy.uploadFile("testImages/sample.jpg", "input.ql-image[type=file]").then(() => cy.wait(10000));
  };

  fillClassDetails(name, startDate, endDate, grade, subject, standardSet, isEdit = false) {
    if (name) {
      this.setName(name);
      this.getClassName().should("have.value", name);
    }
    if (startDate) {
      this.setStartDate(startDate, isEdit);
      this.verifyStartDate(startDate);
    }
    if (endDate) {
      this.setEndDate(endDate);
      this.verifyEndDate(endDate);
    }
    this.selectGrade(grade);
    this.verifyGrade(grade);
    this.selectSubject(subject);
    this.verifySubject(subject);
    this.selectStandardSets(standardSet);
    this.verifyStandardSets(standardSet);
  }

  clickOnSaveClass = () => {
    cy.server();
    cy.route("POST", "**/group").as("createClass");
    cy.get('[data-cy="saveClass"]').click();
    cy.wait("@createClass").then(xhr => {
      expect(xhr.status).to.eq(200);
      const { _id, institutionId, districtId } = xhr.responseBody.result;
      const clazz = { districtId };
      clazz.groupIds = [_id];
      clazz.institutionIds = [institutionId];
      console.log("new class created with _id - ", _id);
      cy.saveClassDetailToDelete(clazz);
      cy.url().should("contain", _id);
    });
  };

  // class list

  getClassRowByName = className =>
    cy
      .get("table")
      .contains("span", className)
      .closest("tr");

  getClassDetailsByName = className => {
    cy.server();
    cy.route("POST", "**/users").as("searchUser");
    cy.route("GET", "**/enrollment/**").as("enrollment");
    this.getClassRowByName(className).click();
    cy.wait("@enrollment");
    cy.wait("@searchUser");
  };

  getClassRowDetails = className =>
    this.getClassRowByName(className)
      .find("td")
      .then($ele => {
        const name = $ele.eq(0).text();
        const classCode = $ele.eq(1).text();
        const grades = $ele.eq(2).text();
        const subject = $ele.eq(3).text();
        const students = $ele.eq(5).text();
        const assignments = $ele.eq(6).text();
        return { name, classCode, grades, subject, students, assignments };
      });

  // adding students

  clickOnAddStudents = () => cy.get('[data-cy="addMultiStu"]').click();

  clickOnAddStudent = () => cy.get('[data-cy="addStudent"]').click();

  clickOnAddUserButton = () => {
    cy.route("POST", "**/enrollment/**").as("newenrollment");
    cy.get('[data-cy="addButton"]').click();
    return cy.wait("@newenrollment").then(xhr => {
      expect(xhr.status).to.eq(200);
      const { role, userId } = xhr.responseBody.result;
      cy.saveUserDetailToDelete({ role, _id: userId });
    });
  };

  setUsername = username =>
    cy
      .get('[data-cy="username"]')
      .clear()
      .type(username);

  setFullName = fullName =>
    cy
      .get('[data-cy="fullName"]')
      .clear()
      .type(fullName);

  setPassword = pw =>
    cy
      .get('[data-cy="password"]')
      .clear()
      .type(pw);

  setConfirmPassword = pw =>
    cy
      .get('[data-cy="confirmPassword"]')
      .clear()
      .type(pw);

  fillStudentDetails = (username, name, password) => {
    this.setUsername(username);
    this.setFullName(name);
    this.setPassword(password);
    this.setConfirmPassword(password);
  };

  // add multiple

  selectStudenttype = type => {
    cy.get('[data-cy="studentType"]').click();
    this.selectOption(type);
  };

  clickOnDone = () => cy.get("[data-cy='done']").click();

  clickOnAddStudentsButton = () => {
    cy.get("[data-cy='addStudents']").click();
    cy.wait("@newenrollment").then(xhr => expect(xhr.status).to.eq(200));
    return cy.wait("@enrollment").then(xhr => {
      expect(xhr.status).to.eq(200);
      const res = xhr.responseBody;
      const _id = [];
      res.result.students.forEach(stu => {
        const { _id: stuId } = stu;
        _id.push(stuId);
      });
      cy.saveUserDetailToDelete({ role: "student", _id });
    });
  };

  getStudentTextArea = () => cy.get("#students");

  clickOnSearchTab = () => {
    cy.get('[data-cy="searchStudent"]').click();
  };

  clickOnAddMultipleTab = () => {
    cy.get('[data-cy="addMultipleStudent"]').click();
  };

  addMultipleStudent(users, uType) {
    cy.route("POST", "**/enrollment/**").as("newenrollment");
    cy.route("GET", "**/enrollment/**").as("enrollment");
    this.clickOnAddMultipleTab();
    this.selectStudenttype(uType);
    return this.getStudentTextArea().then($area => {
      cy.wrap($area).as("studentlist");
      users.forEach(student => cy.get("@studentlist").type(`${student}{enter}`));
      this.clickOnAddStudentsButton();
      return this.clickOnDone();
    });
  }
}
