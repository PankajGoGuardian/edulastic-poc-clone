/* eslint-disable cypress/no-unnecessary-waiting */
import promisify from "cypress-promise";
import ItemListPage from "../itemList/itemListPage";
import TeacherSideBar from "../SideBarPage";
import TestSummary from "./testDetail/testSummaryTab";
import TestAddItem from "./testDetail/testAddItemTab";
import SearchFilters from "../searchFiltersPage";
import TestHeader from "./testDetail/header";
import TestAssignPage from "./testDetail/testAssignPage";
import TestReviewTab from "./testDetail/testReviewTab";

export default class TestLibrary {
  constructor() {
    this.sidebar = new TeacherSideBar();
    this.items = [];
    this.searchFilters = new SearchFilters();
    this.header = new TestHeader();
    this.assignPage = new TestAssignPage();
    this.testSummary = new TestSummary();
    this.testAddItem = new TestAddItem();
    this.review = new TestReviewTab();
  }

  clickOnTileView = () => {
    cy.get('[data-cy="tileView"]').click();
  };

  clickOnListView = () => {
    cy.get('[data-cy="listView"]').click();
  };

  clickOnAuthorTest = () => {
    cy.get("button")
      .contains("Author Test")
      .click()
      .then(() => {
        cy.contains("button", "CREATE TEST").click();
      });
  };

  createTest = (key = "default", publish = true) => {
    const testSummary = new TestSummary();
    const testAddItem = new TestAddItem();
    const itemListPage = new ItemListPage();

    return cy.fixture("testAuthoring").then(testData => {
      const test = testData[key];
      this.items = [];
      test.itemKeys.forEach(async (itemKey, index) => {
        const _id = await promisify(itemListPage.createItem(itemKey, index));
        // .then(_id => {
        // const itemId = await promisify(cy.url().then(url => url.split("/").reverse()[1]));
        this.items.push(_id);

        // });
      });

      // create new test
      this.sidebar.clickOnTestLibrary();
      this.clickOnAuthorTest();

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
      this.searchFilters.clearAll();
      cy.route("POST", "**api/test").as("createTest");
      testAddItem.authoredByMe().then(() => {
        this.items.forEach((itemKey, index) => {
          testAddItem.addItemById(itemKey);
          if (index === 0) cy.wait("@createTest").then(xhr => this.saveTestId(xhr));
          cy.wait(500);
        });
      });

      // store gets updated with some delay, if no wait then published test doesn't consist all selected questions
      cy.wait(1000);
      // review
      testSummary.header.clickOnReview();
      // save
      cy.wait(2000);
      // testSummary.header.clickOnSaveButton(true);
      // publish
      if (publish) testSummary.header.clickOnPublishButton();

      return cy.url().then(url => url.split("/").reverse()[0]);
    });
  };

  getTestCardById = testId => cy.get(`[data-cy="${testId}"]`).as("testcard");

  getShortId = testId => testId.substr(testId.length - 5);

  clickOnEditTestById = testId => {
    cy.server();
    cy.route("GET", "**/content-sharing/**").as("testload");
    this.getTestCardById(testId);
    cy.get("@testcard")
      .find(".showHover")
      .invoke("show")
      .contains("button", "Edit")
      .click({ force: true })
      .then(() => {
        cy.wait("@testload");
        cy.wait("@testload");
      });
  };

  clickOnAssign = () => {
    cy.server();
    cy.route("POST", "**/group/search").as("groups");
    cy.contains("ASSIGN").click({ force: true });
    cy.wait("@groups");
    cy.wait(1000);
  };

  clickOnDuplicate = () => {
    cy.route("POST", "**/test/**").as("duplicateTest");
    cy.route("GET", "**/test/**").as("getTest");
    cy.contains("CLONE").click({ force: true });
    cy.wait("@duplicateTest").then(xhr => this.saveTestId(xhr));
    cy.wait("@getTest");
  };

  verifyVersionedURL = (oldTestId, newTestId) =>
    // URL changes after ~4 sec after API response, could not watch this event, hence wait
    cy.wait(5000).then(() =>
      cy.url().then(newUrl => {
        expect(newUrl).to.include(`/${newTestId}/old/${oldTestId}`);
      })
    );

  saveTestId = xhr => {
    assert(xhr.status === 200, "saving test");
    const testId = xhr.response.body.result._id;
    console.log("test created with _id : ", testId);
    cy.saveTestDetailToDelete(testId);
  };

  clickOnTestCardById = testId => {
    this.getTestCardById(testId)
      .contains("TOTAL ITEMS")
      //.click({ force: true })
      .click({ force: true });
  };

  clickOnDetailsOfCard = () => {
    cy.server();
    cy.route("GET", "**/assignments").as("assignment");
    cy.get('[data-cy="details-button"]')
      .click({ force: true })
      .then(() => {
        cy.wait(500);
        cy.wait("@assignment");
        cy.wait(3000);
      });
  };

  share = (name, option, validuser) => {
    this.shareOption(option);
    cy.server();
    cy.route("POST", "**/user/search").as("users");
    this.getNameList()
      .type(name)
      .then(ele => {
        cy.wait("@users");
        cy.wrap(ele).type("{downarrow}{enter}");
      });
    this.clickSharePop(name, validuser);
  };

  getNameList = () => cy.get('[data-cy="name-button-pop"]');

  getPermissionButton = () => cy.get('[data-cy="permission-button-pop"]');

  getShareButtonPop = () => cy.get('[data-cy="share-button-pop"]');

  clickSharePop = (name, validuser) => {
    cy.server();
    cy.route("POST", "**/content-sharing/**").as("testload");
    cy.route("GET", "**/content-sharing/**").as("testload1");
    this.getShareButtonPop()
      .click({ force: true })
      .then(() => {
        if (validuser) {
          cy.wait("@testload").then(xhr => expect(xhr.status === 200, "verify share request"));
          cy.wait("@testload1");
        } else {
          cy.wait("@testload").then(xhr => expect(xhr.status === 404, "Cancel share request"));
          cy.contains(`Invalid mails found (${name})`);
        }
      });
  };

  shareOption = option => {
    this.getPermissionButton().click({ force: true });
    this.getShareButtonPop()
      .parent()
      .parent()
      .contains(option)
      .click();
  };
  selectPeopletoshare = (email, edit = false, validuser = true) => {
    // Valid User: Teacher from the same district
    if (edit) {
      this.share(email, "Can Edit, Add/Remove Items", validuser);
    } else {
      this.share(email, "Can View & Duplicate", validuser);
    }

    cy.wait(2000);
  };

  getEditButton = () => cy.get('[data-cy="edit"]');

  assertTestPublishedNoEdit = testId => {
    // Test_id should change after editing test
    this.getAssignEdit().should("contain", "ASSIGN");
    this.clickOnDetailsOfCard();
    this.publishedToDraft(true);
    cy.wait(3000);
    this.verifyNewTestIdInUrl(testId);
  };

  verifyNewTestIdInUrl = id => {
    cy.url()
      .then(url => url.split("/").reverse()[0])
      .should("eq", id);
    cy.saveTestDetailToDelete(id);
  };

  assertTestPublishedEdit = testId => {
    // Test_id should not change after editing test
    this.getAssignEdit()
      .should("contain", "ASSIGN")
      .should("exist");
    this.clickOnDetailsOfCard();
    this.publishedToDraft();
    cy.url()
      .then(url => url.split("/").reverse()[0])
      .should("be.eq", testId);
    this.header.clickOnPublishButton();
    cy.url()
      .then(url => url.split("/").reverse()[0])
      .should("be.eq", testId);
  };

  publishedToDraft = (duplicate = false) => {
    cy.server();
    cy.route("POST", "**/test/**").as("duplicateTest");
    cy.route("PUT", "**/test/**").as("testdrafted");
    this.getEditButton()
      .should("exist")
      .click()
      .then(() => {
        if (duplicate) {
          cy.wait("@duplicateTest").then(xhr => this.saveTestId(xhr));
        } else {
          //pop up that comes up when we try to edit a published test
          cy.contains("You are about to edit a test that has already been published")
            .parent()
            .contains("span", "PROCEED")
            .click({ force: true });
          cy.wait("@testdrafted").then(xhr => assert(xhr.status === 200, "Test drafted"));
        }
      });
    cy.wait(5000);
  };

  assertTestDraftNoEdit = () => this.getAssignEdit().should("not.be.exist");

  assertTestDraftEdit = testId => {
    this.getAssignEdit()
      .should("contain", "EDIT")
      .click({ force: true });
    cy.wait("@assignment");
    cy.url()
      .then(url => url.split("/").reverse()[0])
      .should("be.eq", testId);
  };

  checkforNonExistanceOfTest = testId => cy.get("body").should("not.have.descendants", `[data-cy="${testId}"]`);

  getAssignEdit = () => cy.get('[data-cy="edit/assign-button"]');

  removeShare = name => {
    cy.server();
    cy.route("DELETE", "**/content-sharing/**").as("removeshare");
    cy.route("GET", "**/content-sharing/**").as("removeshare1");

    cy.contains(name)
      .parent()
      .find("a")
      .click({ force: true });
    cy.wait("@removeshare");
    cy.wait("@removeshare1");
  };

  editsharing = () => cy.contains("span", "Edit").click({ force: true });

  sharingDisabled = () => {
    this.getSchoolRadio().should("not.be.enabled");
    this.getDistrictRadio().should("not.be.enabled");
    this.getPublicRadio().should("not.be.enabled");
  };

  sharingEnabled = () => {
    this.getSchoolRadio().should("be.enabled");
    this.getDistrictRadio().should("be.enabled");
    this.getPublicRadio().should("be.enabled");
  };
  sharingEnabledPublic = () => this.getPublicRadio().should("be.enabled");

  closeSharing = () => {
    cy.contains("Share with others")
      .parent()
      .next()
      .find("path")
      .click({ force: true });
  };
  getSchoolRadio = () => cy.get('[value="SCHOOL"]');
  getDistrictRadio = () => cy.get('[value="DISTRICT"]');
  getPublicRadio = () => cy.get('[value="PUBLIC"]');

  verifySharedTest = (email, test_id) => {
    cy.login("teacher", email, "snapwiz");
    this.sidebar.clickOnTestLibrary();
    this.searchFilters.clearAll();
    this.searchFilters.sharedWithMe();
    this.clickOnTestCardById(test_id);
    this.assertTestPublishedNoEdit(test_id);
  };
  verifyRemovedShareTest = (email, test_id) => {
    cy.login("teacher", email, "snapwiz");
    this.sidebar.clickOnTestLibrary();
    this.searchFilters.clearAll();
    this.searchFilters.sharedWithMe();
    this.checkforNonExistanceOfTest(test_id);
  };
  verifySharedTestPublic = (email, test_id) => {
    cy.login("teacher", email, "snapwiz");
    this.sidebar.clickOnTestLibrary();
    this.searchFilters.clearAll();
    this.clickOnTestCardById(test_id);
    this.assertTestPublishedNoEdit(test_id);
  };

  verifyRemovedsharedTestPublic = (email, test_id) => {
    cy.login("teacher", email, "snapwiz");
    this.sidebar.clickOnTestLibrary();
    this.searchFilters.clearAll();
    this.checkforNonExistanceOfTest(test_id);
  };

  assertUrl = testId => {
    cy.url()
      .then(url => url.split("/").reverse()[0])
      .should("be.eq", testId);
  };

  publishedToDraftAssigned = () => {
    cy.server();
    cy.route("PUT", "**/test/**").as("newVersion");
    cy.route("GET", "**/api/test/**").as("testdrafted");
    this.getEditButton()
      .should("exist")
      .click()
      .then(() => {
        //pop up that comes up when we try to edit a published test
        cy.contains("This test is already assigned to students.")
          .parent()
          .contains("span", "PROCEED")
          .click({ force: true });
        cy.wait("@newVersion").then(xhr => cy.saveTestDetailToDelete(xhr.response.body.result._id));
        cy.wait("@testdrafted").then(xhr => {
          assert(xhr.status === 200, "Test versioned");
        });
      });
    cy.wait(5000);
    //return cy.url().then(url => url.split("/").reverse()[2]);
  };

  getVersionedTestID = () => cy.url().then(url => url.split("/").reverse()[2]);
}
