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

  getDropDownInHeader = () => cy.get('[data-cy="headerDropDown"]');

  getEditClassInDropDown = () => cy.get("li").contains("Edit Class");

  getArchiveClassInDropDown = () => cy.get("li").contains("Archive Class");


  getSchoolDropDown = () => cy.get(`#institutionId`)

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  clickHeaderDropDown = () =>
    this.getDropDownInHeader()
      .click({ force: true })
      .then(() => cy.wait(500));

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

  clickOnEditClass = () => {
    this.clickHeaderDropDown();
    this.getEditClassInDropDown().click({ force: true });
  };

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
      .should("not.contain", "No Data")
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

  verifyIfSchoolPresent = (schoolName) => {
    this.getSchoolDropDown().click()
    cy.get("li").contains(schoolName).should('be.visible')
    this.getSchoolDropDown().click()
  }

  selectSchool = (schoolName) => {
    this.getSchoolDropDown().click()
    cy.get("li").contains(schoolName).click();
  }

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

  clickOnAddStudentsButton = (saveUserToDelete = true) => {
    cy.get("[data-cy='addStudents']").click();
    cy.wait("@newenrollment").then(xhr => expect(xhr.status).to.eq(200));
    return cy.wait("@enrollment").then(xhr => {
      expect(xhr.status).to.eq(200);
      if (saveUserToDelete) {
        const res = xhr.responseBody;
        const _id = [];
        res.result.students.forEach(stu => {
          const { _id: stuId } = stu;
          _id.push(stuId);
        });
        cy.saveUserDetailToDelete({ role: "student", _id });
      }
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
    this.clickHeaderDropDown();
    this.getArchiveClassInDropDown().click({ force: true });
    cy.get(".ant-col > input").type("ARCHIVE");
    cy.contains("Yes, Archive").click();
    cy.wait("@archieveClass")
      .its("status")
      .should("be.eq", 200);
  };

  gotoLastPage = () =>
    cy
      .get('[title = "Next Page"]')
      .prev()
      .click();

  unarchiveButtonNotVisible = () => this.getunArchiveButton().should("not.be.visible");

  UnarchiveClass = (className, oldSchool = "false") => {
    cy.server();
    cy.route("POST", "**/group/**").as("unarchieveClass");
    this.getClassDetailsByName(className);
    this.getunArchiveButton().click();
    this.getUnarchiveButtonInPopup().click({ force: true });
    if (oldSchool == true) {
      this.getUnarchiveNotification().should(
        "contains.text",
        "Class is not part of the current school.",
        "Please join the school form My Profile for unarchiving a class."
      );
    } else {
      cy.wait("@unarchieveClass")
        .its("status")
        .should("be.eq", 200);
    }
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

  getDateInFormate = datetime => Cypress.moment(datetime).format("DD MMM, YYYY");

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

    this.clickOnAddStudentsButton(false);
    this.clickOnDone();
  }

  verifyClassRowVisibleByName = className => this.getClassRowByName(className).should("be.visible");

  verifyNoClassRowByName = className =>
    cy
      .get("table")
      .contains("span", className)
      .should("not.exist");

  unArchieveClassByName(className,success = true) {
    cy.route("POST", "**/search/users").as("searchUser");
    this.clickOnClassRowByName(className)
    cy.wait("@searchUser")
    this.clickUnArchive(success)
  }

  clickUnArchive(success = true){
    cy.route("POST", "**/unarchive").as("unarchive");
    cy.contains("span", "UNARCHIVE").click({ force: true })
    cy.get(`.ant-modal-body >`).contains("span", "Unarchive").click({ force: true })
    if(success){
      cy.wait("@unarchive").then((xhr) => {
        expect(xhr.status).to.eq(200)
      })
    }else{
      cy.wait("@unarchive").then((xhr) => {
          expect(xhr.status,"Expected to join the school before unarchiving class").to.eq(403)
          expect(xhr.responseBody.message).to.have.string("Class is not part of the current school.")
        })              
    }
  }

  goToLastPage(){
    cy.get("body").then($body => {
      if ($body.find(".ant-table-pagination > li").length > 0) {   
        cy.get('[title="Next Page"]').prev().click()
      }
    })
  }
  // *** APPHELPERS END ***
}
