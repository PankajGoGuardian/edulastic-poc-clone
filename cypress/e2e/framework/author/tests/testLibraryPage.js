import promisify from "cypress-promise";
import ItemListPage from "../itemList/itemListPage";
import TeacherSideBar from "../SideBarPage";
import TestSummary from "./testDetail/testSummaryTab";
import TestAddItem from "./testDetail/testAddItemTab";

export default class TestLibrary {
  constructor() {
    this.sidebar = new TeacherSideBar();
    this.items = [];
  }

  clickOnNewAssignment = () => {
    cy.get("button")
      .contains("Author Test")
      .click();
  };

  createTest = (key = "default") => {
    const testSummary = new TestSummary();
    const testAddItem = new TestAddItem();
    const itemListPage = new ItemListPage();

    cy.fixture("testAuthoring").then(testData => {
      const test = testData[key];
      test.itemKeys.forEach(async (itemKey, index) => {
        itemListPage.createItem(itemKey, index);
        const itemId = await promisify(cy.url().then(url => url.split("/").reverse()[1]));
        this.items.push(itemId);
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
      testAddItem.authoredByMe().then(() => {
        this.items.forEach(itemKey => {
          cy.get(`[data-row-key="${itemKey}"]`)
            .contains("ADD")
            .click({ force: true });
        });
      });

      // save
      testSummary.header.clickOnSaveButton();
      // publish
      testSummary.header.clickOnPublishButton();
    });
  };
}
