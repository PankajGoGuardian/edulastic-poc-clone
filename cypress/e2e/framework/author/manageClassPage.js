import CypressHelper from "../util/cypressHelpers";
import TeacherSideBar from "./SideBarPage";

export default class TeacherManageClassPage {
  constructor() {
    this.sideBar = new TeacherSideBar();
  }

  // *** ELEMENTS START ***

  getClassName = () => cy.get("#name");

  getGradeSelect = () => cy.get("#grades");

  getSubjectSelect = () => cy.get("#subject");

  getStandardSets = () => cy.get("#standardSets");

  getStartDate = () => cy.get("[data-cy=startDate]");

  getEndDate = () => cy.get("[data-cy=endDate]");

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

  getStudentTextArea = () => cy.get("#students");

  getStudentRowByEmail = email => cy.get(`[data-row-key="${email}"]`);

  removeStudentButton = () => cy.get(".ant-dropdown-menu-item").contains("Remove Student");

  getStudentSearchInput = () => cy.get('[placeholder="Type student name or email"]');

  getAllStudentSearchResult = () => cy.get('[data-cy="all-students"]');

  getToEnrollStudents = () => cy.get('[data-cy="students-to-enroll"]');

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  clickOnActionButton = () => {
    cy.get('[data-cy="actions"]').click();
  };

  clickOnActionAddToGroup = () => {
    this.clickOnActionButton();
    cy.contains("Add To Group").click();
  };

  clickOnClassRowByName = className => this.getClassRowByName(className).click();

  selectStudentCheckBoxByEmail = email =>
    this.getStudentRowByEmail(email)
      .find("input")
      .click({ force: true });

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

  clickonRemoveStudentButton = () => this.removeStudentButton().click({ force: true });

  clickOnRemoveStudentPopupTextbox = () => cy.get('[class *= "ant-input styled"]').click();

  clickOnRemoveButtonInPopUp = () => cy.contains("span", "Yes, Remove Student(s)").click({ force: true });

  setName(name) {
    this.getClassName()
      .clear()
      .type(name);
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

  selectSubject = subject => {
    this.getSubjectSelect().click();
    return this.selectOption(subject);
  };

  selectStandardSets = standardSets => {
    this.getStandardSets()
      .as("selector")
      .click();
    this.clearSelections("standardSets");
    this.selectOption(standardSets);
  };

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

  uploadClassImag = () => {
    cy.uploadFile("testImages/sample.jpg", "input.ql-image[type=file]").then(() => cy.wait(10000));
  };

  clickOnSaveClass = (isGroup = false) => {
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
      if (!isGroup) cy.url().should("contain", _id);
    });
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
  // class list
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

  clickOnSearchTab = () => {
    cy.get('[data-cy="searchStudent"]').click();
  };

  clickOnAddMultipleTab = () => {
    cy.get('[data-cy="addMultipleStudent"]').click();
  };

  clickOnClassStatusDropdown = () => cy.get('[data-cy="class-status"]').click();

  selectActiveClass = () => {
    this.clickOnClassStatusDropdown();
    cy.contains("li", "Active Classes").click();
  };

  selectArchieveClass = () => {
    this.clickOnClassStatusDropdown();
    cy.contains("li", "Archived Classes").click();
  };

  archieveClass = () => {
    cy.server();
    cy.route("DELETE", "**/group/**").as("archieveClass");
    cy.get('[data-cy="archive-class"]').click();
    cy.get("input").type("ARCHIVE");
    cy.contains("Yes, Archive").click();
    cy.wait("@archieveClass")
      .its("status")
      .should("be.eq", 200);
  };

  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  verifyName(name) {
    this.getClassName().then($ele => {
      expect($ele.val()).to.eq(name);
    });
  }

  verifyGrade = grade => {
    this.getGradeSelect()
      .find(".ant-select-selection__choice__content")
      .should("have.text", grade);
  };

  verifySubject = subject => {
    this.getSubjectSelect()
      .find(".ant-select-selection-selected-value")
      .should("have.text", subject);
  };

  verifyStandardSets = standardSets => {
    this.getStandardSets()
      .find(".ant-select-selection__choice__content")
      .should("have.text", standardSets);
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
    const [mon, date, year] = datetime.toDateString().split(" ");
    return `${date} ${mon}, ${year}`;
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

  selectStudentsAndRemove = email => {
    this.selectStudentCheckBoxByEmail(email);
    this.clickOnActionButton();
    this.clickonRemoveStudentButton();
    this.clickOnRemoveStudentPopupTextbox().type("REMOVE");
    this.clickOnRemoveButtonInPopUp();
  };

  searchStudentAndAdd(username) {
    cy.route("POST", "**/class-students").as("newenrollment");
    cy.route("GET", "**/enrollment/**").as("enrollment");
    cy.route("POST", "**/search/users").as("searchUser");
    this.clickOnSearchTab();
    this.getStudentSearchInput().type(username);
    this.getAllStudentSearchResult()
      .should("contains.text", username)
      .contains(username)
      .click();

    this.getToEnrollStudents()
      .contains(username)
      .should("be.visible");
    this.clickOnAddStudentsButton();
    this.clickOnDone();
  }

  verifyClassRowVisibleByName = className => this.getClassRowByName(className).should("be.visible");

  verifyNoClassRowByName = className =>
    cy
      .get("table")
      .contains("span", className)
      .should("not.exist");

  // *** APPHELPERS END ***
}
