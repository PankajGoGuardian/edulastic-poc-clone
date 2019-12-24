import FileHelper from "../../../../framework/util/fileHelper";
import SidebarPage from "../../../../framework/student/sidebarPage";
import ManagePage from "../../../../framework/student/managePage";

const sideBarPage = new SidebarPage();
const student = { email: "student3@automation.com", password: "automation" };
const teacher = { email: "teacher2@automation.com", password: "automation" };
const manageClass = new ManagePage();
const invalidClassCode = "V3A9O6";
const validClasscode = "69SSKK";
const alreadyExistingClassCode = "Z9VTUK";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Manage Class`, () => {
  before(() => {
    cy.clearToken();
    cy.login("student", student.email, student.password);
    sideBarPage.clickOnManageClass();
  });

  context(">Test - Manage Class - Active and Archived Classes", () => {
    before(() => {});

    it(">TC01 verify Active Classes", () => {
      manageClass.selectClassType("ACTIVE");
      manageClass.verifyShowActiveClass();
      manageClass.validateclassName("Automation_class");
      manageClass.validateclassName("automation_class2");
      manageClass.validateclassName("New_automation_Class");
    });

    it(">TC02 verify Archived Classes", () => {
      manageClass.selectClassType("ARCHIVE");
      manageClass.verifyShowArchiveClass();
      manageClass.validateclassName("automation_class3");
      manageClass.selectClassType("ACTIVE");
    });
  });

  context(">Test - Join Class Behaviour", () => {
    before(() => {});

    it(">TC01 verify invalid class code", () => {
      manageClass.clickonJoinClass();
      manageClass.clickonEnterClassCode();
      manageClass.typeClassCode(invalidClassCode);
      manageClass.clickonJoinButton("INVALID");
      manageClass.validateAPImsg("Invalid Class Code");
    });

    it(">TC02 verify already existing class code", () => {
      manageClass.clickonJoinClass();
      manageClass.clickonEnterClassCode();
      manageClass.typeClassCode(alreadyExistingClassCode);
      manageClass.clickonJoinButton("INVALID");
      manageClass.validateAPImsg("User already exists in class.");
    });

    it(">TC03 verify blank class code and cancel button", () => {
      manageClass.clickonJoinClass();
      manageClass.clickonEnterClassCode();
      manageClass.clickonJoinButton();
      manageClass.validateEnterClassCodeMsg();
      manageClass.clickonCancelButton();
      cy.contains("Manage Class").should("be.visible");
    });

    it(">TC04 verify New valid class code", () => {
      manageClass.clickonJoinClass();
      manageClass.clickonEnterClassCode();
      manageClass.typeClassCode(validClasscode);
      manageClass.clickonJoinButton("VALID");
      manageClass.validateAPImsg("You joined class successfully.");
      manageClass.validateclassName("New_automation_Class");
    });
  });
});
