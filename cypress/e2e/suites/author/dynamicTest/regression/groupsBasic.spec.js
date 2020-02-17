import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import TestReviewTab from "../../../../framework/author/tests/testDetail/testReviewTab";
import TestAddItemTab from "../../../../framework/author/tests/testDetail/testAddItemTab";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";
import GroupItemsPage from "../../../../framework/author/tests/testDetail/groupItemsPage";
import FileHelper from "../../../../framework/util/fileHelper";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> item groups`, () => {
  const testLibraryPage = new TestLibrary();
  const addItemTab = new TestAddItemTab();
  const groupItemsPage = new GroupItemsPage();
  const testReviewTab = new TestReviewTab();
  const item = new ItemListPage();
  const testData = {
    name: "Test Item Group",
    grade: "Kindergarten",
    subject: "Math",
    collections: "auto collection 3"
  };
  const contEditor = {
    email: "content.editor.1@snapwiz.com",
    pass: "snapwiz"
  };
  const items = ["MCQ_TF.3", "MCQ_TF.3", "MCQ_TF.3", "MCQ_TF.3"];
  let itemIds = [];
  let itemCount;

  const filterForAutoselect = {
    standard: {
      subject: "Mathematics",
      standardSet: "Math - Common Core",
      grade: ["Kindergarten"],
      standardsToSelect: ["K.CC.A.2"]
    },
    collection: "auto collection 3",
    deliveryCount: 2
  };

  const GROUPS = {
    GROUP1: [],
    GROUP2: []
  };

  before("Login and create new items", () => {
    cy.getAllTestsAndDelete(contEditor.email);
    cy.getAllItemsAndDelete(contEditor.email);
    cy.login("publisher", contEditor.email, contEditor.pass);
    items.forEach((itemToCreate, index) => {
      item.createItem(itemToCreate, index).then(id => {
        itemIds.push(id);
        let group = Object.keys(GROUPS)[index % 2];
        GROUPS[group].push(id);
      });
    });
  });

  context(">create item groups- static", () => {
    context(">default group", () => {
      context(">add item to default group from 'add item' tab", () => {
        before("create new test", () => {
          testLibraryPage.createNewTestAndFillDetails(testData);
        });
        it(">add items", () => {
          cy.server();
          cy.route("POST", "**api/test").as("createTest");
          GROUPS.GROUP1.forEach((item, index) => {
            testReviewTab.testheader.clickOnAddItems();
            addItemTab.searchFilters.clearAll();
            addItemTab.searchFilters.getAuthoredByMe();

            addItemTab.addItemById(item);
            if (index === 0) {
              cy.wait("@createTest").then(xhr => {
                testLibraryPage.saveTestId(xhr);
              });
              cy.wait(500);
            }
            addItemTab.clickOnGroupItem();
            groupItemsPage.verifyPresentItemInContainer(1, item);
          });
        });
        it(">verify items group page", () => {
          groupItemsPage.verifyNoOfGroups(1);
          groupItemsPage.getCountOfItemsInGroup(1).should("have.length", GROUPS.GROUP1.length);
        });
        it(">verify review tab", () => {
          addItemTab.header.clickOnReview();
          testReviewTab.verifyNoOfItemsInGroupByNo(1, GROUPS.GROUP1.length);
          testReviewTab.verifyItemCoutInPreview(GROUPS.GROUP1.length);
        });
        it(">remove items and verify group page", () => {
          itemCount = GROUPS.GROUP1.length;
          GROUPS.GROUP1.forEach(item => {
            testReviewTab.testheader.clickOnAddItems();
            addItemTab.searchFilters.clearAll();
            addItemTab.removeGroupItemById(item);
            addItemTab.clickOnGroupItem();
            groupItemsPage.verifyNoItemInContainer(1, item);
            groupItemsPage.getCountOfItemsInGroup(1).should("have.length", --itemCount);
          });
        });
        it(">verify review tab", () => {
          addItemTab.header.clickOnReview();
          testReviewTab.testheader.clickOnSaveButton(true);
          testReviewTab.verifyNoOfItemsInGroupByNo(1, itemCount);
          testReviewTab.verifyItemCoutInPreview(itemCount);
        });
      });
      context(">add item to default group from 'itemgroup' page", () => {
        before("create new test", () => {
          testLibraryPage.createNewTestAndFillDetails(testData);
          testLibraryPage.testSummary.header.clickOnAddItems();
          addItemTab.clickOnGroupItem();
        });
        it(">add items", () => {
          cy.server();
          cy.route("POST", "**api/test").as("createTest");
          GROUPS.GROUP2.forEach((item, index) => {
            groupItemsPage.clickSelectItemsForGroupByNo(1);
            addItemTab.searchFilters.clearAll();
            addItemTab.searchFilters.getAuthoredByMe();

            addItemTab.addItemById(item);
            if (index === 0) {
              cy.wait("@createTest").then(xhr => {
                testLibraryPage.saveTestId(xhr);
              });
              cy.wait(500);
            }
            addItemTab.clickOnGroupItem();
            groupItemsPage.verifyPresentItemInContainer(1, item);
          });
        });
        it(">verify items group page", () => {
          groupItemsPage.verifyNoOfGroups(1);
          groupItemsPage.getCountOfItemsInGroup(1).should("have.length", GROUPS.GROUP2.length);
        });
        it(">verify review tab", () => {
          addItemTab.header.clickOnReview();
          testReviewTab.verifyNoOfItemsInGroupByNo(1, GROUPS.GROUP1.length);
          testReviewTab.verifyItemCoutInPreview(GROUPS.GROUP1.length);
        });
        it(">remove items and verify group page", () => {
          itemCount = GROUPS.GROUP2.length;
          GROUPS.GROUP2.forEach(item => {
            testReviewTab.testheader.clickOnAddItems();
            addItemTab.searchFilters.clearAll();
            addItemTab.removeGroupItemById(item);
            addItemTab.clickOnGroupItem();
            groupItemsPage.verifyNoItemInContainer(1, item);
            groupItemsPage.getCountOfItemsInGroup(1).should("have.length", --itemCount);
          });
        });
        it(">verify review tab", () => {
          addItemTab.header.clickOnReview();
          testReviewTab.verifyNoOfItemsInGroupByNo(1, itemCount);
          testReviewTab.verifyItemCoutInPreview(itemCount);
        });
      });
    });
    context(">new group", () => {
      context(">add item to group from 'add item' tab", () => {
        before("create test", () => {
          testLibraryPage.createNewTestAndFillDetails(testData);
          testReviewTab.testheader.clickOnAddItems();
        });
        it(">add new group", () => {
          addItemTab.clickOnGroupItem();
          groupItemsPage.clickOnAddGroup();
        });
        it(">add items from 'add item tab' ", () => {
          cy.server();
          cy.route("POST", "**api/test").as("createTest");
          GROUPS.GROUP1.forEach((item, index) => {
            testReviewTab.testheader.clickOnAddItems();
            addItemTab.searchFilters.clearAll();
            addItemTab.searchFilters.getAuthoredByMe();
            addItemTab.addItemByIdByGroup(2, item);
            if (index === 0) {
              cy.wait("@createTest").then(xhr => {
                testLibraryPage.saveTestId(xhr);
              });
              cy.wait(500);
            }
            addItemTab.verifyGroupOfItemInList(2, item);
            addItemTab.clickOnGroupItem();
            groupItemsPage.verifyPresentItemInContainer(2, item);
          });
        });
        it(">verify items group page", () => {
          groupItemsPage.verifyNoOfGroups(2);
          groupItemsPage.getCountOfItemsInGroup(2).should("have.length", GROUPS.GROUP1.length);
        });
        it(">verify review tab", () => {
          addItemTab.header.clickOnReview();
          testReviewTab.verifyNoOfItemsInGroupByNo(2, GROUPS.GROUP2.length);
          testReviewTab.verifyItemCoutInPreview(GROUPS.GROUP2.length);
        });
      });
      context(">add item to group from 'items group page'", () => {
        before("goto item group page", () => {
          testReviewTab.testheader.clickOnAddItems();
          addItemTab.clickOnGroupItem();
        });
        // TODO: Adding from item group should not open group list pop-up, Change below once it is  fixed
        it(">add items from 'items groups page' ", () => {
          GROUPS.GROUP2.forEach((item, index) => {
            groupItemsPage.clickSelectItemsForGroupByNo(2);
            addItemTab.searchFilters.clearAll();
            addItemTab.searchFilters.getAuthoredByMe();
            addItemTab.addItemByIdByGroup(2, item); //
            addItemTab.verifyGroupOfItemInList(2, item);
            addItemTab.clickOnGroupItem();
            groupItemsPage.verifyPresentItemInContainer(2, item);
          });
        });
        it(">verify items group page", () => {
          groupItemsPage.verifyNoOfGroups(2);
          groupItemsPage
            .getCountOfItemsInGroup(2)
            .should("have.length", GROUPS.GROUP1.length + GROUPS.GROUP2.length);
        });
        it(">verify review tab", () => {
          addItemTab.header.clickOnReview();
          testReviewTab.verifyNoOfItemsInGroupByNo(2, GROUPS.GROUP2.length + GROUPS.GROUP1.length);
          testReviewTab.verifyItemCoutInPreview(GROUPS.GROUP2.length + GROUPS.GROUP1.length);
        });
      });
      context(">remove items", () => {
        it(">remove", () => {
          itemCount = GROUPS.GROUP2.length + GROUPS.GROUP2.length;
          [...GROUPS.GROUP2, ...GROUPS.GROUP1].forEach(item => {
            testReviewTab.testheader.clickOnAddItems();
            addItemTab.searchFilters.clearAll();
            addItemTab.removeGroupItemById(item);
            addItemTab.clickOnGroupItem();
            groupItemsPage.verifyNoItemInContainer(2, item);
            groupItemsPage.getCountOfItemsInGroup(2).should("have.length", --itemCount);
          });
        });
        it(">verify review tab", () => {
          addItemTab.header.clickOnReview();
          testReviewTab.verifyNoOfItemsInGroupByNo(2, itemCount);
          testReviewTab.verifyItemCoutInPreview(itemCount);
        });
      });
    });
    context(">multiple group", () => {
      before("create test", () => {
        testLibraryPage.createNewTestAndFillDetails(testData);
        testReviewTab.testheader.clickOnAddItems();
        addItemTab.clickOnGroupItem();
        groupItemsPage.clickOnAddGroup();
      });
      it(">adding items 2 groups simultaneously from add item tab", () => {
        cy.server();
        cy.route("POST", "**api/test").as("createTest");
        [...GROUPS.GROUP1, ...GROUPS.GROUP2].forEach((item, index) => {
          testReviewTab.testheader.clickOnAddItems();
          addItemTab.searchFilters.clearAll();
          addItemTab.searchFilters.getAuthoredByMe();
          addItemTab.addItemByIdByGroup((index % 2) + 1, item);
          if (index === 0) {
            cy.wait("@createTest").then(xhr => {
              testLibraryPage.saveTestId(xhr);
            });
            cy.wait(500);
          }
          addItemTab.verifyGroupOfItemInList((index % 2) + 1, item);
          addItemTab.clickOnGroupItem();
          groupItemsPage.verifyPresentItemInContainer((index % 2) + 1, item);
        });
      });
      it(">verify item count", () => {
        groupItemsPage.getCountOfItemsInGroup(1).should("have.length", GROUPS.GROUP1.length);
        groupItemsPage.getCountOfItemsInGroup(1).should("have.length", GROUPS.GROUP2.length);
      });
      it(">verify review tab", () => {
        addItemTab.header.clickOnReview();
        testReviewTab.verifyNoOfItemsInGroupByNo(2, GROUPS.GROUP2.length);
        testReviewTab.verifyNoOfItemsInGroupByNo(1, GROUPS.GROUP1.length);
        testReviewTab.verifyItemCoutInPreview(GROUPS.GROUP2.length + GROUPS.GROUP1.length);
      });
      it(">remove item and verify review tab", () => {
        itemCount = GROUPS.GROUP2.length + GROUPS.GROUP2.length;
        let itemCount1 = GROUPS.GROUP2.length;
        let itemCount2 = GROUPS.GROUP2.length;

        [...GROUPS.GROUP2, ...GROUPS.GROUP1].forEach((item, index) => {
          itemCount = index % 2 === 0 ? --itemCount1 : --itemCount2;
          testReviewTab.testheader.clickOnAddItems();
          addItemTab.searchFilters.clearAll();
          addItemTab.removeGroupItemById(item);
          addItemTab.clickOnGroupItem();
          groupItemsPage.verifyNoItemInContainer((index % 2) + 1, item);
          groupItemsPage.getCountOfItemsInGroup(1).should("have.length", itemCount1);
          groupItemsPage.getCountOfItemsInGroup(2).should("have.length", itemCount2);
          addItemTab.header.clickOnReview();
          testReviewTab.verifyNoOfItemsInGroupByNo(1, itemCount1);
          testReviewTab.verifyNoOfItemsInGroupByNo(2, itemCount2);
          testReviewTab.verifyItemCoutInPreview(itemCount1 + itemCount2);
        });
      });
    });
    context(">edit group", () => {
      context(">delivery count", () => {
        before("create test", () => {
          testLibraryPage.createNewTestAndFillDetails(testData);
        });
        it("add items to groups", () => {
          testReviewTab.testheader.clickOnAddItems();
          cy.server();
          cy.route("POST", "**api/test").as("createTest");
          [...GROUPS.GROUP1, ...GROUPS.GROUP2].forEach((item, index) => {
            addItemTab.searchFilters.clearAll();
            addItemTab.searchFilters.getAuthoredByMe();
            addItemTab.addItemById(item);
            if (index === 0) {
              cy.wait("@createTest").then(xhr => {
                testLibraryPage.saveTestId(xhr);
              });
              cy.wait(500);
            }
          });
          // TODO : Remove this static wait and verify once you get 2 or 3 results
          cy.wait(3000);
        });
        it(">edit group- deliver specific count", () => {
          addItemTab.clickOnGroupItem();
          groupItemsPage.clickOnEditByGroup(1);
          groupItemsPage.checkDeliverCountForGroup(1);
          groupItemsPage.setItemCountForDeliveryByGroup(1, 2);
          groupItemsPage.clickOnSaveByGroup(1);
        });
        it(">verify review tab", () => {
          addItemTab.header.clickOnReview();
          testReviewTab.verifyNoOfItemsInGroupByNo(1, 2);
          testReviewTab.verifyItemCoutInPreview(GROUPS.GROUP2.length + GROUPS.GROUP1.length);
        });
      });
      context(">auto select", () => {
        before("create test", () => {
          testLibraryPage.createNewTestAndFillDetails(testData);
        });
        it(">create dynamic group", () => {
          testLibraryPage.testSummary.header.clickOnAddItems();
          addItemTab.clickOnGroupItem();
          groupItemsPage.createDynamicTest(1, filterForAutoselect);
          // TODO : Remove this static wait and verify once you get 2 or 3 results
        });
        it(">verify review tab", () => {
          cy.server();
          cy.route("POST", "**api/test").as("createTest");
          addItemTab.header.clickOnReview();
          cy.wait("@createTest").then(xhr => {
            testLibraryPage.saveTestId(xhr);
          });
          testLibraryPage.header.clickOnReview(); /* current behaviour */
          testReviewTab.verifyNoOfItemsInGroupByNo(1, 2);
          testReviewTab.verifyItemCoutInPreview(2);
        });
        it(">edit dynamic group", () => {
          testLibraryPage.testSummary.header.clickOnAddItems();
          addItemTab.clickOnGroupItem();
          groupItemsPage.clickOnEditByGroup(1);
          groupItemsPage.selectCollectionByGroupAndCollection(1, "auto collection 2");
          groupItemsPage.clickOnSaveByGroup(1, true, 0);
          groupItemsPage.assertNoItemsFoundWarning();
          groupItemsPage.selectCollectionByGroupAndCollection(1, testData.collections);
          groupItemsPage.setItemCountForDeliveryByGroup(1, 3);
          groupItemsPage.clickOnSaveByGroup(1, true);
        });
        it(">verify review tab", () => {
          addItemTab.header.clickOnReview();
          testReviewTab.verifyNoOfItemsInGroupByNo(1, 3);
          testReviewTab.verifyItemCoutInPreview(3);
        });
      });
      context(">manual to auto select", () => {
        before("create test", () => {
          testLibraryPage.createNewTestAndFillDetails(testData);
        });
        it("add items to groups", () => {
          testReviewTab.testheader.clickOnAddItems();
          cy.server();
          cy.route("POST", "**api/test").as("createTest");
          GROUPS.GROUP1.forEach((item, index) => {
            addItemTab.searchFilters.clearAll();
            addItemTab.searchFilters.getAuthoredByMe();
            addItemTab.addItemById(item);
            if (index === 0) {
              cy.wait("@createTest").then(xhr => {
                testLibraryPage.saveTestId(xhr);
              });
              cy.wait(500);
            }
          });
        });
        it(">verify items group page", () => {
          addItemTab.clickOnGroupItem();
          groupItemsPage.verifyNoOfGroups(1);
          groupItemsPage.getCountOfItemsInGroup(1).should("have.length", GROUPS.GROUP1.length);
        });
        it(">verify review tab", () => {
          addItemTab.header.clickOnReview();
          testReviewTab.verifyNoOfItemsInGroupByNo(1, GROUPS.GROUP1.length);
          testReviewTab.verifyItemCoutInPreview(GROUPS.GROUP1.length);
        });
        it(">edit group", () => {
          testReviewTab.testheader.clickOnAddItems();
          addItemTab.clickOnGroupItem();
          groupItemsPage.createDynamicTest(1, filterForAutoselect, true);
        });
        it(">verify review tab", () => {
          addItemTab.header.clickOnReview();
          testReviewTab.verifyNoOfItemsInGroupByNo(1, 2);
          testReviewTab.verifyItemCoutInPreview(2);
        });
      });
    });
  });
});
