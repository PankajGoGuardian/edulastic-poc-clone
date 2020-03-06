import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import FileHelper from "../../../../framework/util/fileHelper";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";
import TestSummayTab from "../../../../framework/author/tests/testDetail/testSummaryTab";
import TestReviewTab from "../../../../framework/author/tests/testDetail/testReviewTab";
import TestAddItemTab from "../../../../framework/author/tests/testDetail/testAddItemTab";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Test authoring flows`, () => {
  const testLibraryPage = new TestLibrary();
  const testSummayTab = new TestSummayTab();
  const testReviewTab = new TestReviewTab();
  const testAddItemTab = new TestAddItemTab();
  const item = new ItemListPage();
  const newItemKey = "MCQ_STD.default";
  let testId;
  let newItemId;

  const testData = {
    edit1: { testname: "editedTest", grade: "Grade 8", subject: "ELA" },
    edit2: { testname: "editedTest", grade: "Grade 7" },
    edit3: { point: "2", question: "2" },
    edit4: { point: "1", question: "1" },
    edit5: { point: "1", question: "1" }
  };
  const Teacher = {
    email: "teacher.test.edit.before.use@snapwiz.com",
    pass: "snapwiz"
  };

  before("login and create new items and test", () => {
    cy.deleteAllAssignments("", Teacher.email);
    cy.login("teacher", Teacher.email, Teacher.pass);
    testLibraryPage.createTest("EDIT_1").then(id => {
      testId = id;
    });
  });

  it(" > edit the name , grade , subject and verify", () => {
    const { testname, grade, subject } = testData.edit1;
    // Get the  test and convert it to draft
    testLibraryPage.seachTestAndGotoReviewById(testId);
    testLibraryPage.publishedToDraft();
    testLibraryPage.header.clickOnDescription();
    // update the test in Description
    testSummayTab.setName(testname);
    testSummayTab.selectGrade(grade);
    testSummayTab.selectSubject(subject);
    // Save the Test
    testSummayTab.header.clickOnSaveButton(true);
    testLibraryPage.seachTestAndGotoReviewById(testId);
    // Verify the test In Review
    testReviewTab.testheader.verifyNameInTitle(testname);
    testReviewTab.verifyGradeSubject(grade, subject);
    // Publish The test
    testReviewTab.testheader.clickOnPublishButton();
    testLibraryPage.assertUrl(testId);
  });

  it(" > verify logout , login and edit test", () => {
    const { grade } = testData.edit2;
    // Login Again and Edit the Test
    cy.login("teacher", Teacher.email, Teacher.pass);
    testLibraryPage.seachTestAndGotoReviewById(testId);
    testLibraryPage.publishedToDraft();
    // update the test review and save
    testReviewTab.selectGrade(grade);
    testReviewTab.testheader.clickOnSaveButton(true);
    // Get Test Card
    testLibraryPage.seachTestAndGotoReviewById(testId);
    //verify in summary and Publish
    testSummayTab.header.clickOnDescription();
    testSummayTab.verifyGrade(grade);
    testSummayTab.header.clickOnPublishButton();
    testLibraryPage.assertUrl(testId);
  });

  it(" > remove one question from review tab and verify test", () => {
    const [item1, item2] = testLibraryPage.items;
    const { point, question } = testData.edit4;
    // Get and Convert To Draft
    testLibraryPage.seachTestAndGotoReviewById(testId);
    testLibraryPage.publishedToDraft();
    // Remove 1 item From Review Tab
    testReviewTab.testheader.clickOnReview();
    testReviewTab.clickOnCheckBoxByItemId(item2);
    testReviewTab.clickOnRemoveSelected();
    // verify review tab before save
    testReviewTab.getQueCardByItemIdInCollapsed(item2).should("have.length", 0);
    testReviewTab.verifySummary(question, point);
    // save
    testReviewTab.testheader.clickOnSaveButton(true);
    // Publish
    testReviewTab.testheader.clickOnPublishButton();
    testLibraryPage.assertUrl(testId);
    testLibraryPage.seachTestAndGotoReviewById(testId);
    //Verify In Review
    testReviewTab.getQueCardByItemIdInCollapsed(item2).should("have.length", 0);
    testReviewTab.verifySummary(question, point);
  });

  it(" > add a precreated item and verify test", () => {
    const { point, question } = testData.edit3;
    //Create A New Item
    item.createItem(newItemKey, false, true).then(id => {
      newItemId = id;
      //Get Test and Draft It
      testLibraryPage.seachTestAndGotoReviewById(testId);
      testLibraryPage.publishedToDraft();
      // Add created Item using add item tab
      testReviewTab.testheader.clickOnAddItems();
      testAddItemTab.searchFilters.clearAll();
      testAddItemTab.searchFilters.getAuthoredByMe();
      testAddItemTab.addItemById(newItemId);
      testAddItemTab.header.clickOnReview();

      // verify review tab before publish
      testReviewTab.getQueCardByItemIdInCollapsed(newItemId).should("have.length", 1);
      testReviewTab.verifySummary(question, point);

      // Publish
      testSummayTab.header.clickOnPublishButton();
      testLibraryPage.assertUrl(testId);
      //verify
      testLibraryPage.seachTestAndGotoReviewById(testId);
      testSummayTab.header.clickOnReview();
      testReviewTab.getQueCardByItemIdInCollapsed(newItemId).should("have.length", 1);
      testReviewTab.verifySummary(question, point);
    });
  });

  it(" > remove one question from add item tab and verify test", () => {
    const [item1, item2] = testLibraryPage.items;
    const { point, question } = testData.edit5;
    //Get Test Card and Draft It
    testLibraryPage.seachTestAndGotoReviewById(testId);
    testLibraryPage.publishedToDraft();
    testReviewTab.testheader.clickOnAddItems();
    // remove 1 item
    item.searchFilters.clearAll();
    item.searchFilters.getAuthoredByMe();
    item.searchFilters.getSearchTextBox(item1);
    testAddItemTab.removeItemById(item1);
    // Publish
    testReviewTab.testheader.clickOnPublishButton();
    testLibraryPage.assertUrl(testId);
    testLibraryPage.seachTestAndGotoReviewById(testId);
    // verify review tab and Summary
    testSummayTab.header.clickOnReview();
    testReviewTab.getQueCardByItemIdInCollapsed(item1).should("have.length", 0);
    testReviewTab.verifySummary(question, point);
  });
});
