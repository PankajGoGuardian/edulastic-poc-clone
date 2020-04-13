/* eslint-disable cypress/no-unnecessary-waiting */
import AuthorAssignmentPage from "../../../../framework/author/assignments/AuthorAssignmentPage";
import LiveClassboardPage from "../../../../framework/author/assignments/LiveClassboardPage";
import TeacherManageClassPage from "../../../../framework/author/manageClassPage";
import ManageGroupPage from "../../../../framework/author/groups/manageGroupPage";
import TeacherSideBar from "../../../../framework/author/SideBarPage";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import AssignmentsPage from "../../../../framework/student/assignmentsPage";
import FileHelper from "../../../../framework/util/fileHelper";
import PerformanceByStudentReport from "../../report/performanceByStudentPage";
import GroupPopup from "../../../../framework/author/groups/groupPopup";

const { _ } = Cypress;

const sideBar = new TeacherSideBar();
const manageClass = new TeacherManageClassPage();
const manageGroup = new ManageGroupPage();
const groupPopup = new GroupPopup();
const authorAssignmentPage = new AuthorAssignmentPage();
const testLibrary = new TestLibrary();
const lcb = new LiveClassboardPage();
const pbsReport = new PerformanceByStudentReport();

const studentAssignment = new AssignmentsPage();

const students = {
  1: {
    email: "student.1.studentgroup@automation.com",
    studentName: "studentGroup, student.1"
  },
  2: {
    email: "student.2.studentgroup@automation.com",
    studentName: "studentGroup, student.2"
  },
  3: {
    email: "student.3.studentgroup@automation.com",
    studentName: "studentGroup, student.3"
  },
  4: {
    email: "student.4.studentgroup@automation.com",
    studentName: "studentGroup, student.4"
  },
  5: {
    email: "student.5.studentgroup@automation.com",
    studentName: "studentGroup, student.5"
  }
};

const groups = {
  1: {
    name: "Group1",
    description: "This is custom group 1"
  },
  2: {
    name: "Group2",
    description: "This is custom group 2"
  }
};

const teacher = "teacher.1.studentgroup@automation.com";
const password = "snapwiz";
const classNameEdit = "Automation Class - studentGroup teacher.1";
const testIdForReport = "5e8af25af51ccb00082a12a6";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Student Groups`, () => {
  let testId = "5e942daf982cda000755938e";

  const studentGroup1 = [students[1], students[2]];
  const studentGroup1Edit = [students[3], students[4]];
  const studentGroup2 = [students[3], students[4]];
  const studentGroup2Edit = [students[5]];

  before(() => {
    cy.deleteAllAssignments(undefined, teacher, password, [testIdForReport]);
    cy.login("teacher", teacher, password);
    /*  testLibrary.createTest().then(_id => {
       testId = _id
     }) */
  });

  context("> create new group from report", () => {
    before("get report", () => {
      sideBar.clickOnReport();
      pbsReport.clickOnReportLink();
    });

    it("> select student from report and create group", () => {
      //selecting student 1 and 2 and creating new group
      pbsReport.selectStudentByName(students[1].studentName);
      pbsReport.selectStudentByName(students[2].studentName);
      pbsReport.clickOnActionAddToGroup();
      groupPopup.clickOnAddNewButton();
      // TODO: add group creation part
      manageGroup.fillGroupDetail({ ...groups[1] });
      manageGroup.clickOnSaveGroup();
    });

    it("> verify group details on group pop up", () => {
      //selecting student 1 and 2 and creatin new group
      pbsReport.clickOnActionAddToGroup();
      groupPopup.selectGroup(groups[1].name);
      studentGroup1.forEach(student => groupPopup.verifyStudentInAddedList(student.studentName));
    });

    it("> verify group details on manage group", () => {
      sideBar.clickOnManageClass();
      manageGroup.clickOnGroupTab();
      manageGroup.verifyGroupRowDetails(groups[1].name, studentGroup1.length, 0);
    });

    it("> use groups to assign a test and verify teacher assignemnt/lcb", () => {
      testLibrary.assignPage.visitAssignPageById(testId);
      testLibrary.assignPage.selectClass(groups[1].name);
      testLibrary.assignPage.clickOnAssign();

      // verify on assignment page
      sideBar.clickOnAssignment();
      authorAssignmentPage.verifyAssignmentRowByTestId(testId, groups[1].name, 0, 2);
      // verify on lcb
      authorAssignmentPage.clickOnLCBbyTestId(testId);
      authorAssignmentPage
        .getAllStudentCard()
        .should("have.length", studentGroup1.length)
        .each(($ele, i) => {
          expect($ele.text()).to.eq(studentGroup1[i].studentName);
        });
    });

    it("> verify group details after assign on manage group", () => {
      sideBar.clickOnManageClass();
      manageGroup.clickOnGroupTab();
      // assignment count on manange group page can not be verifed immediatly after assigning as it takes 8~10 mins to sync up from redshift.
      manageGroup.verifyGroupRowDetails(groups[1].name, studentGroup1.length);
    });
  });

  context("> edit group from report page", () => {
    context("add students", () => {
      before("get report", () => {
        sideBar.clickOnReport();
        pbsReport.clickOnReportLink();
      });

      it("> adding new student to existing group", () => {
        // adding student3 and student4
        studentGroup1Edit.forEach(student => pbsReport.selectStudentByName(student.studentName));
        pbsReport.clickOnActionAddToGroup();
        groupPopup.selectGroup(groups[1].name);
        studentGroup1Edit.forEach(student => groupPopup.verifyStudentInToAddList(student.studentName));
        groupPopup.clickOnUpdate();
      });

      it("> verify verify added students in group pop up", () => {
        pbsReport.clickOnActionAddToGroup();
        // groupPopup.selectGroup(groups[1].name);
        [...studentGroup1, ...studentGroup1Edit].forEach(student =>
          groupPopup.verifyStudentInAddedList(student.studentName)
        );
      });

      it("> verify group details on manage group", () => {
        sideBar.clickOnManageClass();
        manageGroup.clickOnGroupTab();
        // assignment count on manange group page can not be verifed as it takes 8~10 mins to sync up from redshift.
        manageGroup.verifyGroupRowDetails(groups[1].name, 4);
        manageGroup.clickOnGroupRowByName(groups[1].name);
        [...studentGroup1, ...studentGroup1Edit].forEach(student =>
          manageGroup.getStudentRow(student.email).should("be.exist")
        );

        it("> verify added students on teacher assignemnt/lcb", () => {
          sideBar.clickOnAssignment();
          authorAssignmentPage.verifyAssignmentRowByTestId(testId, groups[1].name, 0, 4);
          // lcb
          authorAssignmentPage.clickOnLCBbyTestId(testId);
          authorAssignmentPage
            .getAllStudentCard()
            .should("have.length", 4)
            .each(($ele, i) => {
              expect($ele.text()).to.eq([...studentGroup1, ...studentGroup1Edit][i].studentName);
            });
        });
      });
    });

    context("remove student", () => {
      const studentToRemove = studentGroup1[1];

      before("get report", () => {
        sideBar.clickOnReport();
        pbsReport.clickOnReportLink();
      });

      it("> removing a student from existing group", () => {
        // removing student2
        pbsReport.selectStudentByName(studentToRemove.studentName);
        pbsReport.clickOnActionAddToGroup();
        groupPopup.selectGroup(groups[1].name);
        groupPopup.verifyStudentInAddedList(studentToRemove.studentName);
        groupPopup.clickOnAddedStudentByName(studentToRemove.studentName);
        groupPopup.clickOnUpdate();
      });

      it("> verify removed students in group pop up", () => {
        pbsReport.clickOnActionAddToGroup();
        // groupPopup.selectGroup(groups[1].name);
        groupPopup.getGroupStudentByName(studentToRemove.studentName).should("not.exist");
      });

      it("> verify group details on manage group", () => {
        sideBar.clickOnManageClass();
        manageGroup.clickOnGroupTab();
        // assignment count on manange group page can not be verifed as it takes 8~10 mins to sync up from redshift.
        manageGroup.verifyGroupRowDetails(groups[1].name, 3);
        manageGroup.clickOnGroupRowByName(groups[1].name);
        manageGroup.getStudentRow(studentToRemove.email).should("not.exist");
      });

      it("> verify remove students on teacher assignemnt/lcb", () => {
        // EXPECTED: after removing a student from assingned group, test should still be assigned to that student
        // lcb page
        sideBar.clickOnAssignment();
        authorAssignmentPage.verifyAssignmentRowByTestId(testId, groups[1].name, 0, 4);

        // lcb
        authorAssignmentPage.clickOnLCBbyTestId(testId);
        authorAssignmentPage
          .getAllStudentCard()
          .should("have.length", 4)
          .and("contain.text", studentToRemove.studentName);
      });
    });
  });

  context("> create new group from manage group", () => {
    before("get report", () => {
      cy.deleteAllAssignments(undefined, teacher, password, [testIdForReport]);
    });

    it("> create new group and add students", () => {
      sideBar.clickOnManageClass();
      manageGroup.clickOnGroupTab();
      manageGroup.clickOnCreateClass();
      manageGroup.fillGroupDetail({ ...groups[2] });
      manageGroup.clickOnSaveGroup();

      // add students 3 & 4 from manage class
      sideBar.clickOnManageClass();
      manageClass.clickOnClassRowByName(classNameEdit);
      studentGroup2.forEach(student => manageClass.selectStudentCheckBoxByEmail(student.email));
      manageGroup.clickOnActionAddToGroup();
      groupPopup.selectGroup(groups[2].name);
      studentGroup2.forEach(student => groupPopup.verifyStudentInToAddList(student.studentName));
      groupPopup.clickOnUpdate();
    });

    it("> verify group details on manage group", () => {
      sideBar.clickOnManageClass();
      manageGroup.clickOnGroupTab();
      manageGroup.verifyGroupRowDetails(groups[2].name, studentGroup2.length, 0);
    });

    it("> use groups to assign a test and verify teacher assignemnt/lcb", () => {
      testLibrary.assignPage.visitAssignPageById(testId);
      testLibrary.assignPage.selectClass(groups[2].name);
      testLibrary.assignPage.clickOnAssign();

      // verify on assignment page
      sideBar.clickOnAssignment();
      authorAssignmentPage.verifyAssignmentRowByTestId(testId, groups[2].name, 0, 2);
      // verify on lcb
      authorAssignmentPage.clickOnLCBbyTestId(testId);
      authorAssignmentPage
        .getAllStudentCard()
        .should("have.length", studentGroup2.length)
        .each(($ele, i) => {
          expect($ele.text()).to.eq(studentGroup2[i].studentName);
        });
    });

    it("> verify group details after assign on manage group", () => {
      sideBar.clickOnManageClass();
      manageGroup.clickOnGroupTab();
      // assignment count on manange group page can not be verifed as it takes 8~10 mins to sync up from redshift.
      manageGroup.verifyGroupRowDetails(groups[2].name, studentGroup2.length);
    });
  });

  context("> edit group from manage group", () => {
    // remove student
    context("> student removal from manage group", () => {
      const studentToRemove = studentGroup2[1];
      it("Remove student from Group", () => {
        sideBar.clickOnAssignment();
        sideBar.clickOnManageClass();
        manageGroup.clickOnGroupTab();
        manageGroup.clickOnGroupRowByName(groups[2].name);
        manageGroup.clickOnActionButton(studentToRemove.email);
        manageGroup.clickonRemoveStudentButton();
        manageGroup.clickOnRemoveStudentPopupTextbox().type("REMOVE");
        manageGroup.clickOnRemoveButtonInPopUp();
      });

      it("verify removal in LCB and student group", () => {
        // EXPECTED: after removing a student from assingned group, test should still be assigned to that student
        sideBar.clickOnAssignment();
        authorAssignmentPage.clickOnLCBbyTestId(testId);
        authorAssignmentPage
          .getAllStudentCard()
          .should("have.length", 2)
          .and("contain.text", studentToRemove.studentName);

        sideBar.clickOnManageClass();
        manageGroup.clickOnGroupTab();
        // assignment count on manange group page can not be verifed as it takes 8~10 mins to sync up from redshift.
        manageGroup.verifyGroupRowDetails(groups[2].name, 1);
        manageGroup.clickOnGroupRowByName(groups[2].name);
        manageGroup.getStudentRow(`${studentToRemove.email}`).should("not.exist");
      });
    });

    // add student
    context("> add student from manage class", () => {
      const studentToAdd = studentGroup2[1];
      it("add student ", () => {
        sideBar.clickOnManageClass();
        manageClass.clickOnClassRowByName(classNameEdit);
        manageClass.selectStudentCheckBoxByEmail(studentToAdd.email);
        manageGroup.clickOnActionAddToGroup();
        groupPopup.selectGroup(groups[2].name);
        groupPopup.verifyStudentInToAddList(studentToAdd.studentName);
        groupPopup.clickOnUpdate();
      });

      it("verify adding of student in assignment page and LCB", () => {
        // verify on assignment page
        sideBar.clickOnAssignment();
        authorAssignmentPage.verifyAssignmentRowByTestId(testId, groups[2].name, 0, 3);
        // verify on lcb
        authorAssignmentPage.clickOnLCBbyTestId(testId);
        authorAssignmentPage
          .getAllStudentCard()
          .contains(studentToAdd.studentName)
          .should("have.length", 1);
      });

      it("> verify group details on manage group", () => {
        sideBar.clickOnManageClass();
        manageGroup.clickOnGroupTab();
        // assignment count on manange group page can not be verifed as it takes 8~10 mins to sync up from redshift.
        manageGroup.verifyGroupRowDetails(groups[2].name, 2);
        manageGroup.clickOnGroupRowByName(groups[2].name);
        manageGroup.getStudentRow(`${studentToAdd.email}`).should("be.exist");
      });
    });
    // TODO: edit group name/details and verify
  });
  // TODO: write tests to cover common student scenario
});
