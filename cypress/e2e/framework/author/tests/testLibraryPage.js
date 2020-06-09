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
import TestSettings from "./testDetail/testSettingsPage";

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
    this.testSettings = new TestSettings();
  }

  // *** ELEMENTS START ***

  getTestCardById = testId => cy.get(`[data-cy="${testId}"]`).as("testcard");

  getShortId = testId => testId.substr(testId.length - 5);

  getNameList = () => cy.get('[data-cy="name-button-pop"]');

  getPermissionButton = () => cy.get('[data-cy="permission-button-pop"]');

  getShareButtonPop = () => cy.get('[data-cy="share-button-pop"]');

  getEditButton = () => cy.get('[data-cy="edit"]');

  getVersionedTestID = () => cy.url().then(url => url.split("/").reverse()[2]);

  getAssignEdit = () => cy.get('[data-cy="edit/assign-button"]');

  getProceedButton = () => cy.get('[data-cy="PROCEED"]');

  getDuplicateButtonInReview = () => cy.get('[data-cy="duplicate"]');

  getCreateNewTestButton = () => cy.get('[data-cy="createNew"]');

  getTileViewButton = () => cy.get('[data-cy="tileView"]');

  getListViewButton = () => cy.get('[data-cy="listView"]');

  getPreviewByTestId = id => this.getTestCardById(id).find('[data-cy="view"]');

  getTestIdOnCardByTestId = id => this.getTestCardById(id).find('[data-cy="test-id"]');

  getAuthorNameByTestId = id => this.getTestCardById(id).find('[data-cy="test-author-name"]');

  getCollectionByTestId = id => this.getTestCardById(id).find('[data-cy="test-collection"]');

  getTotalItemCountBtTestId = id => this.getTestCardById(id).find('[data-cy="test-item-count"]');

  getStandardsByTestId = id => this.getTestCardById(id).find('[data-cy="test-standards"]');

  getTestTagsByTestId = id => this.getTestCardById(id).find('[data-cy="test-tags"]');

  getTestStatusByTestId = id => this.getTestCardById(id).find('[data-cy="test-status"]');

  getGradesOnTestCardPopUp = () => cy.get('[data-cy="testcard-grades"]');

  getTestNameOnTestCardPopUp = () => cy.get('[data-cy="testcard-name"]');

  getTestSubjectsOnTestCardPopUp = () => cy.get('[data-cy="testcard-subject"]');

  getTestTagsOnTestCardPopUp = () => cy.get('[data-cy="testcard-tags"]');

  getTestCollectionOnTestCardPopUp = () => cy.get('[data-cy="testcard-collection"]');

  getTestTotalItemsOnTestCardPopUp = () => cy.get('[data-cy="testcard-total-items"]');

  getTestTotalPointsOnTestCardPopUp = () => cy.get('[data-cy="testcard-total-points"]');

  getStandardRowByStandardOnTestCardPopUp = standard => cy.get(`[data-cy="${standard}"]`);

  getPreviewButtonOnTestCardPopUp = () => cy.get('[data-cy="preview-button"]');

  getAssignButtonOnTestCardById = id =>
    this.showButtonsOnTestCardById(id).then(() =>
      this.getTestCardById(id)
        .find("button")
        .contains("Assign")
    );

  getPreviewButtonOnTestCardById = id =>
    this.showButtonsOnTestCardById(id).then(() =>
      this.getTestCardById(id)
        .find("button")
        .contains("Preview")
    );

  getMoreButtonOnTestCardById = id =>
    this.showButtonsOnTestCardById(id).then(() =>
      this.getTestCardById(id)
        .find("button")
        .contains("More")
    );

  getAllTestCardsInCurrentPage = () => cy.get('[data-cy="test-id"]');

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  clickOnTileView = () => {
    this.getTileViewButton()
      .click()
      .should("have.css", "color", "rgb(185, 185, 185)");
  };

  clickOnListView = () => {
    this.getListViewButton()
      .click()
      .should("have.css", "color", "rgb(185, 185, 185)");
  };

  clickOnPreviewByTestId = id => {
    this.getPreviewByTestId(id).click();
  };

  showButtonsOnTestCardById = id =>
    this.getTestCardById(id)
      .find(".ant-card-head-title")
      .trigger("mouseover");

  clickAssignOnTestCardById = id => {
    cy.server();
    cy.route("POST", "**/group/search").as("load-classes");
    this.getAssignButtonOnTestCardById(id).click({ force: true });
    cy.wait("@load-classes");
  };

  clickMoreOnTestCardById = id => this.getMoreButtonOnTestCardById(id).click({ force: true });

  clickPreviewOnTestCardById = id => this.getPreviewButtonOnTestCardById(id).click({ force: true });

  clickPreviewOnTestCardPopUp = () => this.getPreviewButtonOnTestCardPopUp().click();

  clickAssignOnTestCardPopUp = () => {
    cy.server();
    cy.route("POST", "**/group/search").as("load-classes");
    this.getAssignEdit().click();
    cy.wait("@load-classes");
  };

  clickOnAuthorTest = (fromAssignmentsPage = false) => {
    this.getCreateNewTestButton()
      .click()
      .then(() => {
        if (fromAssignmentsPage)
          cy.get("a")
            .contains(" Or Author a Test >>")
            .click({ force: true });
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
          testSummary.selectSubject(subject, true);
        });
      }

      if (test.collections) {
        testSummary.selectCollection(test.collections, true);
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
      if (publish) return testSummary.header.clickOnPublishButton();
      else return cy.url().then(url => url.split("/").reverse()[0]);
    });
  };

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
    cy.route("GET", "**/test/*/assignments").as("getTest");
    cy.contains("CLONE").click({ force: true });
    cy.wait("@duplicateTest").then(xhr => this.saveTestId(xhr));
    // cy.wait("@getTest");
  };

  clickOnTestCardById = testId => {
    this.getTestCardById(testId)
      // .contains("TOTAL ITEMS")
      // .click({ force: true })
      .click();
  };

  clickOnDetailsOfCard = () => {
    cy.server();
    cy.route("GET", "**/regrade-assignments").as("assignment");
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
        cy.wait("@users").then(() => {
          if (validuser) {
            cy.get(".ant-select-dropdown-menu-item")
              .contains(name)
              .click();
          } else {
            cy.wrap(ele).type("{downarrow}{enter}");
          }
        });

        // TODO: Verify Search results
      });
    this.clickSharePop();
  };

  clickSharePop = (validEmail = true, email) => {
    cy.server();
    cy.route("POST", "**/content-sharing/**").as("testload");
    cy.route("GET", "**/content-sharing/**").as("testload1");
    this.getShareButtonPop()
      .click({ force: true })
      .then(() => {
        if (validEmail) {
          cy.wait("@testload").then(xhr => assert(xhr.status === 200, "verify share request"));
          cy.wait("@testload1");
        } else {
          cy.wait("@testload").then(xhr => assert(xhr.status === 404, "Cancel share request"));
          cy.contains(`Invalid mails found (${email})`);
        }
      });
  };

  shareOption = option => {
    this.getPermissionButton().click({ force: true });
    this.getShareButtonPop()
      .parent()
      .parent()
      .contains(option)
      .click({ force: true });
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

  publishedToDraft = () => {
    cy.server();
    cy.route("POST", "**/test/**").as("duplicateTest");
    cy.route("PUT", "**/test/**").as("testdrafted");
    this.getEditButton()
      .should("exist")
      .click()
      .then(() => {
        // pop up that comes up when we try to edit a published test
        this.getProceedButton().click();
        cy.wait("@testdrafted").then(xhr => assert(xhr.status === 200, "Test drafted"));
      });
    cy.wait(5000);
  };

  duplicateTestInReview = () => {
    cy.server();
    cy.route("POST", "**/test/**").as("duplicateTest");
    this.getDuplicateButtonInReview()
      .should("be.visible")
      .click();
    cy.wait("@duplicateTest").then(xhr => this.saveTestId(xhr));
  };

  // *** ACTIONS END ***

  // *** APPHELPERS START ***

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

  assertTestPublishedNoEdit = oldTestId => {
    // Test_id should change after editing test
    this.getAssignEdit().should("contain", "ASSIGN");
    this.clickOnDetailsOfCard();
    this.getEditButton().should("not.exist");
    this.duplicateTestInReview();
    cy.wait(3000);
    this.verifyAbsenceOfIdInUrl(oldTestId);
  };

  verifyAbsenceOfIdInUrl = id => {
    cy.url()
      .then(url => url.split("/").reverse()[0])
      .should("not.eq", id);
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
      .then(url => url.split("/").reverse()[1])
      .should("be.eq", testId);
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

  // *** APPHELPERS END ***

  removeShare = () => {
    cy.server();
    cy.route("DELETE", "**/content-sharing/**").as("removeshare");
    cy.wait(1).then(() => {
      if (Cypress.$('[data-cy="share-button-close"]').length) {
        cy.get('[data-cy="share-button-close"]').each(shareClose => {
          cy.wrap(shareClose).click({ force: true });
          cy.wait("@removeshare");
        });
      }
    });
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
    cy.get(".ant-modal-close-x").click({ force: true });
  };

  getSchoolRadio = () => cy.get('[value="SCHOOL"]');

  getDistrictRadio = () => cy.get('[value="DISTRICT"]');

  getPublicRadio = () => cy.get('[value="PUBLIC"]');

  assertUrl = testId => {
    cy.url()
      .then(url => url.split("/").reverse()[1])
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
        // pop up that comes up when we try to edit a published test
        this.getProceedButton().click();
        cy.wait("@newVersion").then(() => {
          cy.wait("@testdrafted").then(xhr => {
            assert(xhr.status === 200, "Test versioned");
          });
        });
      });
    return cy
      .url()
      .should("contain", "/old/")
      .then(() => cy.get('[data-cy-item-index="0"]'))
      .then(() => {
        this.getVersionedTestID().then(id => cy.saveTestDetailToDelete(id));
      });
  };

  createNewTestAndFillDetails = testData => {
    const { grade, name, subject, collections, tags } = testData;
    this.sidebar.clickOnTestLibrary();
    this.clickOnAuthorTest();
    this.testSummary.setName(name);
    if (grade) {
      this.testSummary.clearGrades();
      if (Array.isArray(grade)) grade.forEach(gra => this.testSummary.selectGrade(gra));
      else this.testSummary.selectGrade(grade);
    }
    if (subject) {
      this.testSummary.clearSubjects();
      if (Array.isArray(subject)) subject.forEach(sub => this.testSummary.selectSubject(sub));
      else this.testSummary.selectSubject(subject);
    }
    if (collections) this.testSummary.selectCollection(collections);

    if (tags) this.testSummary.addTags(tags);
  };

  seachTestAndGotoReviewById = id => {
    this.searchAndClickTestCardById(id);
    this.clickOnDetailsOfCard();
  };

  searchAndClickTestCardById = id => {
    this.sidebar.clickOnTestLibrary();
    this.searchFilters.clearAll();
    this.searchFilters.getAuthoredByMe();
    this.clickOnTestCardById(id);
  };

  visitTestById = id => {
    cy.server();
    cy.route("GET", "**/test/*/regrade-assignments").as("load-test-review");
    cy.visit(`/author/tests/tab/review/id/${id}`);
    cy.wait("@load-test-review");
  };

  searchByCollection = collection => {
    this.sidebar.clickOnTestLibrary();
    this.searchFilters.clearAll();
    this.searchFilters.setCollection(collection);
  };

  verifyLayoutByViewById = (id, isListView = false) => {
    this.getAuthorNameByTestId(id);
    if (!isListView) this.getPreviewByTestId(id).should("not.exist");
    else this.getPreviewByTestId(id).should("exist");
  };

  verifyTestIdOnTestCardById = id => this.getTestIdOnCardByTestId(id).should("contain", this.getShortId(id));

  verifyAuthorNameOnTestCardById = (id, author) => this.getAuthorNameByTestId(id).should("contain", author);

  verifyCollectionOnTestCardbyId = (id, collection) => this.getCollectionByTestId(id).should("contain", collection);

  verifyTotalItemCountByTestId = (id, count) => this.getTotalItemCountBtTestId(id).should("contain", count);

  verifyStatusOnTestCardById = (id, status) => this.getTestStatusByTestId(id).should("contain", status);

  verifyStandardsOnTestCardById = (id, standards) => {
    this.getStandardsByTestId(id).then($ele => {
      if ($ele.find(".ant-dropdown-trigger").length > 0)
        cy.wrap($ele)
          .find(".ant-dropdown-trigger")
          .last()
          .trigger("mouseover")
          .then(() => cy.wait(500));
    });
    standards.forEach(sta =>
      this.getStandardsByTestId(id)
        .find("span")
        .contains(sta)
    );
  };

  verifyTagsOnTestCardById = (id, tags) => {
    this.getStandardsByTestId(id).then($ele => {
      if ($ele.find(".ant-dropdown-trigger").length > 0)
        cy.wrap($ele)
          .find(".ant-dropdown-trigger")
          .first()
          .trigger("mouseover")
          .then(() => cy.wait(500));
    });
    tags.forEach(sta =>
      this.getStandardsByTestId(id)
        .find("span")
        .contains(sta)
    );
  };

  verifyGradesOnTestCardPopUp = grades => {
    this.getGradesOnTestCardPopUp().then($ele => {
      if ($ele.find(".ant-dropdown-trigger").length > 0)
        cy.wrap($ele)
          .find(".ant-dropdown-trigger")
          .trigger("mouseover")
          .then(() => cy.wait(500));
    });
    grades.forEach(grade => {
      this.getGradesOnTestCardPopUp()
        .find("span")
        .contains(grade);
    });
  };

  verifySubjectsOnTestCardPopUp = subjects =>
    this.getTestSubjectsOnTestCardPopUp().then($ele => {
      if ($ele.find(".ant-dropdown-trigger").length > 0)
        cy.wrap($ele)
          .find(".ant-dropdown-trigger")
          .trigger("mouseover")
          .then(() => cy.wait(500));

      subjects.forEach(sub => {
        this.getTestSubjectsOnTestCardPopUp()
          .find("span")
          .contains(sub);
      });
    });

  verifyTestNameOnTestCardPopUp = name => this.getTestNameOnTestCardPopUp().should("contain", name);

  verifyTestCollectionOnTestCardPopUp = collection =>
    this.getTestCollectionOnTestCardPopUp().should("have.text", collection);

  verifyTotalItemsOnTestCardPopUp = count =>
    this.getTestTotalItemsOnTestCardPopUp().should("have.text", `${count}Items`);

  verifyTotalPointsOnTestCardPopUp = points =>
    this.getTestTotalPointsOnTestCardPopUp().should("have.text", `${points}Points`);

  verifyStandardTableRowByStandard = (standard, questCount, points) => {
    this.getStandardRowByStandardOnTestCardPopUp(standard)
      .children()
      .then($ele => {
        cy.wrap($ele)
          .eq(0)
          .should("have.text", standard);

        cy.wrap($ele)
          .eq(1)
          .should("have.text", `${questCount}`);

        cy.wrap($ele)
          .eq(2)
          .should("have.text", `${points}`);
      });
  };
}
