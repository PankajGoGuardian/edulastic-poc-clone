import promisify from "cypress-promise";
import TestLibrary from "../../../framework/author/tests/testLibraryPage";
import FileHelper from "../../../framework/util/fileHelper";
import ItemListPage from "../../../framework/author/itemList/itemListPage";
import TestSummayTab from "../../../framework/author/tests/testDetail/testSummaryTab";
import TestReviewTab from "../../../framework/author/tests/testDetail/testReviewTab";
import TestAddItemTab from "../../../framework/author/tests/testDetail/testAddItemTab";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Test authoring flows`, () => {
  const testLibraryPage = new TestLibrary();
  const testSummayTab = new TestSummayTab();
  const testReviewTab = new TestReviewTab();
  const testAddItemTab = new TestAddItemTab();
  const item = new ItemListPage();
  const newItemKey = "MCQ_STD.default";

  // context(" > verify test versoning/edit flows", () => {
  let testId;
  let newTestId;
  let newItemId;

  const testData = {
    edit1: { testname: "editedTest", grade: "Kindergarten", subject: "ELA" },
    edit2: { point: "3", question: "3" },
    edit3: { point: "2", question: "2" }
  };

  before("login and create new items and test", () => {
    cy.login();
    testLibraryPage.createTest("EDIT_1").then(id => {
      testId = id;
    });
  });

  it(" > edit the name , grade , subject and verify", () => {
    const { testname, grade, subject } = testData.edit1;

    testLibraryPage.sidebar.clickOnTestLibrary();
    testLibraryPage.clickOnEditTestById(testId);
    // update the test summary
    testSummayTab.setName(testname);
    testSummayTab.selectGrade(grade);
    testSummayTab.selectSubject(subject);

    // save , publish and verify
    testSummayTab.header.clickOnSaveButton(true).then(id => {
      newTestId = id;
      testLibraryPage.verifyVersionedURL(testId, newTestId);
      testSummayTab.header.clickOnPublishButton();
      testLibraryPage.sidebar.clickOnTestLibrary();
      testLibraryPage.clickOnEditTestById(newTestId);
      testSummayTab.verifyName(testname);
      testSummayTab.verifyGrade(grade);
      testSummayTab.verifySubject(subject);
      testId = newTestId;
    });
  });

  it(" > add a precreated item and verify test", () => {
    const { point, question } = testData.edit2;

    // author a new item
    item.createItem(newItemKey);

    item.getItemIdByURL().then(id => {
      newItemId = id;

      testLibraryPage.sidebar.clickOnTestLibrary();

      testLibraryPage.clickOnEditTestById(testId);
      testSummayTab.header.clickOnAddItems();
      testLibraryPage.searchFilters.getAuthoredByMe();
      testAddItemTab.addItemById(newItemId);
      testSummayTab.header.clickOnReview();

      // verify review tab before save
      testReviewTab.getQueCardByItemId(newItemId).should("have.length", 1);
      testReviewTab.verifySummary(question, point);

      // save , publish and verify
      testSummayTab.header.clickOnSaveButton(true).then(testid => {
        newTestId = testid;

        testLibraryPage.verifyVersionedURL(testId, newTestId);

        testSummayTab.header.clickOnPublishButton();
        testLibraryPage.sidebar.clickOnTestLibrary();

        testLibraryPage.clickOnEditTestById(newTestId);
        testSummayTab.header.clickOnReview();

        testReviewTab.getQueCardByItemId(newItemId).should("have.length", 1);
        testReviewTab.verifySummary(question, point);

        testId = newTestId;
      });
    });
  });

  it(" > remove one question from add item tab and verify test", () => {
    const [item1, item2] = testLibraryPage.items;
    const { point, question } = testData.edit3;

    testLibraryPage.sidebar.clickOnTestLibrary();
    testLibraryPage.clickOnEditTestById(testId);
    testSummayTab.header.clickOnAddItems();

    // remove 1 item
    testAddItemTab.removeItemById(item1);

    // verify review tab before save
    testSummayTab.header.clickOnReview();
    testReviewTab.getQueCardByItemId(item1).should("have.length", 0);
    testReviewTab.verifySummary(question, point);

    // save , publish and verify
    testSummayTab.header.clickOnSaveButton(true).then(id => {
      newTestId = id;
      testLibraryPage.verifyVersionedURL(testId, newTestId);
      testSummayTab.header.clickOnPublishButton();
      testLibraryPage.sidebar.clickOnTestLibrary();
      testLibraryPage.clickOnEditTestById(newTestId);
      testSummayTab.header.clickOnReview();
      testReviewTab.getQueCardByItemId(item1).should("have.length", 0);
      testReviewTab.verifySummary(question, point);
      testId = newTestId;
    });
  });

  it(" > remove one question from review tab and verify test", () => {
    const [item1, item2] = testLibraryPage.items;
    const { point, question } = testData.edit4;

    testLibraryPage.sidebar.clickOnTestLibrary();
    testLibraryPage.clickOnEditTestById(testId);
    testSummayTab.header.clickOnReview();

    // remove 1 item
    testReviewTab.clickOnCheckBoxByItemId(item2);
    testReviewTab.clickOnRemoveSelected();

    // verify review tab before save
    testReviewTab.getQueCardByItemId(item2).should("have.length", 0);
    testReviewTab.verifySummary(question, point);

    // save , publish and verify
    testSummayTab.header.clickOnSaveButton(true).then(id => {
      newTestId = id;
      testLibraryPage.verifyVersionedURL(testId, newTestId);
      testSummayTab.header.clickOnPublishButton();
      testLibraryPage.sidebar.clickOnTestLibrary();
      testLibraryPage.clickOnEditTestById(newTestId);
      testSummayTab.header.clickOnReview();
      testReviewTab.getQueCardByItemId(item2).should("have.length", 0);
      testReviewTab.verifySummary(question, point);

      testId = newTestId;
    });
  });

  /*  TODO: add test for create new item while authinng test, 
    and edit points/standard for existing item once app these gets flow implemmented
     */
  // });
});
