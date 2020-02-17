/* eslint-disable no-shadow */
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";
import GroupItemsPage from "../../../../framework/author/tests/testDetail/groupItemsPage";
import FileHelper from "../../../../framework/util/fileHelper";
import PreviewItemPopup from "../../../../framework/author/itemList/itemPreview";
import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import MetadataPage from "../../../../framework/author/itemList/itemDetail/metadataPage";
import { DIFFICULTY, DOK } from "../../../../framework/constants/questionAuthoring";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> item groups filters`, () => {
  const testLibraryPage = new TestLibrary();
  const groupItemsPage = new GroupItemsPage();
  const item = new ItemListPage();
  const itemPreview = new PreviewItemPopup();
  const editItemPage = new EditItemPage();
  const metadataPage = new MetadataPage();

  const commomonCollection = "auto collection 2";

  const testData = {
    name: "Test Item Group",
    grade: "Kindergarten",
    subject: "Math",
    collections: "auto collection 1"
  };

  const commonStandardForAutoselect_1 = {
    subject: "Mathematics",
    standardSet: "Math - Common Core",
    grade: ["Kindergarten"],
    standardsToSelect: ["K.CC.A.1"]
  };
  const commonStandardForAutoselect_2 = {
    subject: "Mathematics",
    standardSet: "Math - Common Core",
    grade: ["Kindergarten"],
    standardsToSelect: ["K.CC.A.2"]
  };
  const commonStandardForAutoselect_3 = {
    subject: "Mathematics",
    standardSet: "Math - Common Core",
    grade: ["Kindergarten"],
    standardsToSelect: ["K.CC.A.3"]
  };

  const filterForAutoselect_1 = [
    {
      standard: commonStandardForAutoselect_1,
      collection: commomonCollection,
      dok: DOK.Recall,
      tags: "ABC",
      difficulty: DIFFICULTY.Easy,
      deliveryCount: 1
    },
    {
      standard: commonStandardForAutoselect_2,
      collection: commomonCollection,
      dok: DOK.SkillConcept,
      tags: "PQR",
      difficulty: DIFFICULTY.Medium,
      deliveryCount: 1
    },
    {
      standard: commonStandardForAutoselect_3,
      collection: commomonCollection,
      dok: DOK.ExtendedThinking,
      tags: "XYZ",
      difficulty: DIFFICULTY.Hard,
      deliveryCount: 1
    }
  ];
  const filterForAutoselect_2 = [
    {
      standard: commonStandardForAutoselect_1,
      collection: commomonCollection,
      dok: DOK.Recall,
      deliveryCount: 1
    },
    {
      standard: commonStandardForAutoselect_2,
      collection: commomonCollection,
      dok: DOK.SkillConcept,
      deliveryCount: 1
    },
    {
      standard: commonStandardForAutoselect_3,
      collection: commomonCollection,
      dok: DOK.ExtendedThinking,
      deliveryCount: 1
    }
  ];
  const filterForAutoselect_3 = [
    {
      standard: commonStandardForAutoselect_1,
      collection: commomonCollection,
      difficulty: DIFFICULTY.Easy,
      deliveryCount: 1
    },
    {
      standard: commonStandardForAutoselect_2,
      collection: commomonCollection,
      difficulty: DIFFICULTY.Medium,
      deliveryCount: 1
    },
    {
      standard: commonStandardForAutoselect_3,
      collection: commomonCollection,
      difficulty: DIFFICULTY.Hard,
      deliveryCount: 1
    }
  ];
  const filterForAutoselect_4 = [
    {
      standard: commonStandardForAutoselect_1,
      collection: commomonCollection,
      tags: "ABC",
      deliveryCount: 1
    },
    {
      standard: commonStandardForAutoselect_2,
      collection: commomonCollection,
      tags: "PQR",
      deliveryCount: 1
    },
    {
      standard: commonStandardForAutoselect_3,
      collection: commomonCollection,
      tags: "XYZ",
      deliveryCount: 1
    }
  ];

  const contEditor = {
    email: "content.editor.1@snapwiz.com",
    pass: "snapwiz"
  };
  const Teacher = {
    email: "teacher2.for.dynamic.test@snapwiz.com",
    pass: "snapwiz"
  };

  const groups = {
    1: { items: [] },
    2: { items: [] },
    3: { items: [] }
  };

  const itemsToCreate = ["MCQ_TF.7", "MCQ_TF.8", "MCQ_TF.9"];
  const itemIds = [];

  before("Login and create new items", () => {
    cy.getAllTestsAndDelete(contEditor.email);
    cy.getAllItemsAndDelete(contEditor.email);
    cy.login("publisher", contEditor.email, contEditor.pass);
    itemsToCreate.forEach((itemToCreate, index) => {
      item.createItem(itemToCreate, index).then(id => {
        itemIds.push(id);
      });
    });
    cy.wait(1).then(() => {
      groups[1].items[0] = itemIds[0];
      groups[2].items[0] = itemIds[1];
      groups[3].items[0] = itemIds[2];
    });
  });
  before("add tags", () => {
    item.searchFilters.clearAll();
    item.searchFilters.getAuthoredByMe();
    itemIds.forEach((itemId, index) => {
      item.clickOnViewItemById(itemId);
      itemPreview.clickEditOnPreview();
      editItemPage.header.metadata();
      metadataPage.setTag(filterForAutoselect_1[index].tags);
      metadataPage.setDOK(filterForAutoselect_1[index].dok);
      metadataPage.setDifficulty(filterForAutoselect_1[index].difficulty);
      metadataPage.header.save(true);
      metadataPage.header.clickOnPublishItem();
    });
  });

  context(">autoselect- filters", () => {
    context(">dok + tags + difficulty", () => {
      before("login", () => {
        cy.deleteTests(contEditor.email);
      });
      before("create test", () => {
        testLibraryPage.createNewTestAndFillDetails(testData);
        testLibraryPage.testSummary.header.clickOnAddItems();
        testLibraryPage.testAddItem.clickOnGroupItem();
      });
      itemsToCreate.forEach((itemId, index) => {
        it(`>create dynamic group-${index + 1}`, () => {
          groupItemsPage
            .createDynamicTest(index + 1, filterForAutoselect_1[index])
            .then(itemsObj => {
              expect(itemsObj[0]._id).to.eq(groups[`${index + 1}`].items[0]);
            });
          if (!(index === Cypress._.keys(groups).length - 1)) groupItemsPage.clickOnAddGroup();
          else {
            cy.server();
            cy.route("POST", "**api/test").as("createTest");
            testLibraryPage.testAddItem.header.clickOnReview();
            cy.wait("@createTest").then(xhr => testLibraryPage.saveTestId(xhr));
          }
        });
      });
    });
    context(">dok", () => {
      before("login", () => {
        cy.deleteAllAssignments("", Teacher.email);
        cy.login("publisher", contEditor.email, contEditor.pass);
      });
      before("create test", () => {
        testLibraryPage.createNewTestAndFillDetails(testData);
        testLibraryPage.testSummary.header.clickOnAddItems();
        testLibraryPage.testAddItem.clickOnGroupItem();
      });
      itemsToCreate.forEach((itemId, index) => {
        it(`>create dynamic group-${index + 1}`, () => {
          groupItemsPage
            .createDynamicTest(index + 1, filterForAutoselect_2[index])
            .then(itemsObj => {
              expect(itemsObj[0]._id).to.eq(groups[`${index + 1}`].items[0]);
            });
          if (!(index === Cypress._.keys(groups).length - 1)) groupItemsPage.clickOnAddGroup();
          else {
            cy.server();
            cy.route("POST", "**api/test").as("createTest");
            testLibraryPage.testAddItem.header.clickOnReview();
            cy.wait("@createTest").then(xhr => testLibraryPage.saveTestId(xhr));
          }
        });
      });
    });
    context(">difficulty", () => {
      before("login", () => {
        cy.deleteAllAssignments("", Teacher.email);
        cy.login("publisher", contEditor.email, contEditor.pass);
      });
      before("create test", () => {
        testLibraryPage.createNewTestAndFillDetails(testData);
        testLibraryPage.testSummary.header.clickOnAddItems();
        testLibraryPage.testAddItem.clickOnGroupItem();
      });
      itemsToCreate.forEach((itemId, index) => {
        it(`>create dynamic group-${index + 1}`, () => {
          groupItemsPage
            .createDynamicTest(index + 1, filterForAutoselect_3[index])
            .then(itemsObj => {
              expect(itemsObj[0]._id).to.eq(groups[`${index + 1}`].items[0]);
            });
          if (!(index === Cypress._.keys(groups).length - 1)) groupItemsPage.clickOnAddGroup();
          else {
            cy.server();
            cy.route("POST", "**api/test").as("createTest");
            testLibraryPage.testAddItem.header.clickOnReview();
            cy.wait("@createTest").then(xhr => testLibraryPage.saveTestId(xhr));
          }
        });
      });
    });
    context(">tags", () => {
      before("login", () => {
        cy.deleteAllAssignments("", Teacher.email);
        cy.login("publisher", contEditor.email, contEditor.pass);
      });
      before("create test", () => {
        testLibraryPage.createNewTestAndFillDetails(testData);
        testLibraryPage.testSummary.header.clickOnAddItems();
        testLibraryPage.testAddItem.clickOnGroupItem();
      });
      itemsToCreate.forEach((itemId, index) => {
        it(`>create dynamic group-${index + 1}`, () => {
          groupItemsPage
            .createDynamicTest(index + 1, filterForAutoselect_4[index])
            .then(itemsObj => {
              expect(itemsObj[0]._id).to.eq(groups[`${index + 1}`].items[0]);
            });
          if (!(index === Cypress._.keys(groups).length - 1)) groupItemsPage.clickOnAddGroup();
          else {
            cy.server();
            cy.route("POST", "**api/test").as("createTest");
            testLibraryPage.testAddItem.header.clickOnReview();
            cy.wait("@createTest").then(xhr => testLibraryPage.saveTestId(xhr));
          }
        });
      });
    });
  });
});
