import ItemListPage from "../itemList/itemListPage";
import TeacherSideBar from "../SideBarPage";
import TestSummary from "./testDetail/testSummaryTab";
import TestAddItem from "./testDetail/testAddItemTab";

export default class TestLibrary {
  constructor() {
    this.sidebar = new TeacherSideBar();
  }

  clickOnNewAssignment = () => {
    cy.get("button")
      .contains("New Assignment")
      .click();
  };

  createTest = (key = "default") => {
    const testSummary = new TestSummary();
    const testAddItem = new TestAddItem();
    const itemListPage = new ItemListPage();

    cy.fixture("testAuthoring").then(testData => {
      const test = testData[key];
      test.itemKeys.forEach(itemKey => {
        itemListPage.createItem(itemKey);
      });

      // create new test
      this.sidebar.clickOnTestLibrary();
      this.clickOnNewAssignment();

      // test description
      if (test.name) testSummary.setName(test.name);
      if (test.grade) {
        test.grade.forEach(grade => {
          testSummary.selectGrade(grade);
        });
      }
      if (test.subject) {
        test.subject.forEach(subject => {
          testSummary.selectSubject(subject);
        });
      }

      // add items
      testSummary.header.clickOnAddItems();
      testAddItem.authoredByMe();
      test.itemKeys.forEach(itemKey => {
        cy.contains(itemKey)
          .first()
          .closest("tr")
          .find("button")
          .contains("ADD")
          .click({ force: true });
      });

      // save
      testSummary.header.clickOnSaveButton();

      // publish
      testSummary.header.clickOnPublishButton();
    });
  };
}
