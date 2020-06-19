/* eslint-disable no-prototype-builtins */
import SearchFilters from "../../../../framework/author/searchFiltersPage";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";
import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import PreviewItemPopup from "../../../../framework/author/itemList/itemPreview";
import FileHelper from "../../../../framework/util/fileHelper";

const quesData = require("../../../../../fixtures/questionAuthoring");

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >>searching items`, () => {
  const searchFilters = new SearchFilters();
  const testLibrary = new TestLibrary();
  const itemListPage = new ItemListPage();
  const editItemPage = new EditItemPage();
  const itemPreview = new PreviewItemPopup();

  const EMAIL = "email";
  const PASS = "pass";
  let standardsOfItems;
  const itemsToCreate = ["MCQ_STD.default", "MCQ_STD.1", "MCQ_STD.2"];
  const searchkeys = ["unique-keyword-1", "unique-keyword-2"];

  const Author = { email: "teacher1.item.search@snapwiz.com", pass: "snapwiz" };

  const standardToSearch = {};
  const item_ids = [];
  const queTexts = {};

  context(">searching items in 'draft' and 'published' state", () => {
    before("login as author and create tests items", () => {
      cy.getAllTestsAndDelete(Author[EMAIL]);
      cy.getAllItemsAndDelete(Author[EMAIL]);
      cy.login("teacher", Author[EMAIL], Author[PASS]);
      itemsToCreate.forEach((item, i) => {
        itemListPage.createItem(item, 0, true).then(id => {
          item_ids[i] = id;
          const [queType, queKey] = item.split(".");
          // queTexts.push(quesData[queType][queKey].quetext)
          queTexts[id] = quesData[queType][queKey].quetext;
          if (quesData[queType][queKey].standards) {
            standardsOfItems = quesData[queType][queKey].standards[0].standard;
            standardsOfItems.forEach(standardOfTest => {
              if (!standardToSearch.hasOwnProperty(standardOfTest)) {
                standardToSearch[standardOfTest] = [];
              }
              standardToSearch[standardOfTest].push(id);
            });
          }
        });
      });
    });
    context(">searching in 'published' state", () => {
      context(">searching in 'entire library'", () => {
        // Searched Published Tests should be visible in Entire Library
        it(">search by standards", () => {
          //  testLibrary.sidebar.clickOnItemBank();
          testLibrary.searchFilters.clearAll();
          Cypress._.keys(standardToSearch).forEach(ele => {
            searchFilters.typeInSearchBox(ele);
            standardToSearch[ele].forEach(id => {
              itemListPage.getViewItemById(id).should("be.visible");
            });
          });
        });

        it(">search by id", () => {
          item_ids.forEach(id => {
            itemListPage.searchFilters.clearAll();
            itemListPage.searchFilters.typeInSearchBox(id);
            itemListPage.getItemContainerInlistById(id).should("be.visible");
          });
        });

        it(">search by content", () => {
          itemListPage.searchFilters.clearAll();
          itemListPage.searchFilters.typeInSearchBox(searchkeys[0]);
          itemListPage.getItemContainerInlistById(item_ids[0]).should("be.visible");
          itemListPage.getItemContainerInlistById(item_ids[2]).should("be.visible");
          itemListPage.verifyNoOfItemsInContainer(2);

          itemListPage.searchFilters.clearAll();
          itemListPage.searchFilters.typeInSearchBox(searchkeys[1]);
          itemListPage.getItemContainerInlistById(item_ids[1]).should("be.visible");
          itemListPage.getItemContainerInlistById(item_ids[2]).should("be.visible");
          itemListPage.verifyNoOfItemsInContainer(2);

          itemListPage.searchFilters.clearAll();
          itemListPage.searchFilters.typeInSearchBox(searchkeys.join(" "));
          itemListPage.getItemContainerInlistById(item_ids[2]).should("be.visible");
          itemListPage.getItemContainerInlistById(item_ids[0]).should("not.exist");
          itemListPage.getItemContainerInlistById(item_ids[1]).should("not.exist");
          itemListPage.verifyNoOfItemsInContainer(1);
        });
      });
      context(">searching in 'authored by me'", () => {
        // Searched Draft Tests should Be visible in Authored By Me
        it(">search by standards", () => {
          Cypress._.keys(standardToSearch).forEach(ele => {
            itemListPage.searchFilters.clearAll();
            itemListPage.searchFilters.getAuthoredByMe();
            itemListPage.searchFilters.getSearchTextBox().clear({ force: true });
            itemListPage.searchFilters.typeInSearchBox(ele);
            standardToSearch[ele].forEach(id => {
              itemListPage.getViewItemById(id, queTexts[id]).should("be.visible");
            });
          });
        });

        it(">search by id", () => {
          item_ids.forEach(id => {
            itemListPage.searchFilters.clearAll();
            itemListPage.searchFilters.getAuthoredByMe();
            itemListPage.searchFilters.getSearchTextBox().clear({ force: true });
            itemListPage.searchFilters.typeInSearchBox(id);
            itemListPage.getViewItemById(id, queTexts[id]).should("be.visible");
          });
        });

        it(">search by content", () => {
          itemListPage.searchFilters.clearAll();
          itemListPage.searchFilters.getAuthoredByMe();
          itemListPage.searchFilters.typeInSearchBox(searchkeys[0]);
          itemListPage.getItemContainerInlistById(item_ids[0]).should("be.visible");
          itemListPage.getItemContainerInlistById(item_ids[2]).should("be.visible");
          itemListPage.verifyNoOfItemsInContainer(2);

          itemListPage.searchFilters.clearAll();
          itemListPage.searchFilters.getAuthoredByMe();
          itemListPage.searchFilters.typeInSearchBox(searchkeys[1]);
          itemListPage.getItemContainerInlistById(item_ids[2]).should("be.visible");
          itemListPage.getItemContainerInlistById(item_ids[1]).should("be.visible");
          itemListPage.verifyNoOfItemsInContainer(2);

          itemListPage.searchFilters.clearAll();
          itemListPage.searchFilters.getAuthoredByMe();
          itemListPage.searchFilters.typeInSearchBox(searchkeys.join(" "));
          itemListPage.getItemContainerInlistById(item_ids[2]).should("be.visible");
          itemListPage.getItemContainerInlistById(item_ids[0]).should("not.exist");
          itemListPage.getItemContainerInlistById(item_ids[1]).should("not.exist");
          itemListPage.verifyNoOfItemsInContainer(1);
        });
      });
    });
    context(">searching in 'draft' state", () => {
      before(">convert each item to draft", () => {
        item_ids.forEach(ele => {
          itemListPage.searchFilters.clearAll();
          itemListPage.searchFilters.getAuthoredByMe();
          itemListPage.searchFilters.typeInSearchBox(ele);
          itemListPage.clickOnViewItemById(ele, queTexts[ele]);
          itemPreview.clickEditOnPreview();
          editItemPage.header.save(true);
          editItemPage.sideBar.clickOnItemBank();
          itemListPage.searchFilters.clearAll();
        });
      });
      context(">searching in 'authored by me'", () => {
        // Searched Draft Tests should Be visible in Authored By Me
        it(">search by standards", () => {
          Cypress._.keys(standardToSearch).forEach(ele => {
            itemListPage.searchFilters.clearAll();
            itemListPage.searchFilters.getAuthoredByMe();
            searchFilters.typeInSearchBox(ele);
            standardToSearch[ele].forEach(id => {
              itemListPage.getViewItemById(id, queTexts[id]).should("be.visible");
            });
          });
        });
        it(">search by id", () => {
          item_ids.forEach(id => {
            searchFilters.clearAll();
            searchFilters.getAuthoredByMe();
            searchFilters.typeInSearchBox(id);
            itemListPage.getViewItemById(id, queTexts[id]).should("be.visible");
          });
        });

        it(">search by content", () => {
          itemListPage.searchFilters.clearAll();
          itemListPage.searchFilters.getAuthoredByMe();
          itemListPage.searchFilters.typeInSearchBox(searchkeys[0]);
          itemListPage.getItemContainerInlistById(item_ids[0]).should("be.visible");
          itemListPage.getItemContainerInlistById(item_ids[2]).should("be.visible");
          itemListPage.verifyNoOfItemsInContainer(2);

          itemListPage.searchFilters.clearAll();
          itemListPage.searchFilters.getAuthoredByMe();
          itemListPage.searchFilters.typeInSearchBox(searchkeys[1]);
          itemListPage.getItemContainerInlistById(item_ids[2]).should("be.visible");
          itemListPage.getItemContainerInlistById(item_ids[1]).should("be.visible");
          itemListPage.verifyNoOfItemsInContainer(2);

          itemListPage.searchFilters.clearAll();
          itemListPage.searchFilters.getAuthoredByMe();
          itemListPage.searchFilters.typeInSearchBox(searchkeys.join(" "));
          itemListPage.getItemContainerInlistById(item_ids[2]).should("be.visible");
          itemListPage.getItemContainerInlistById(item_ids[0]).should("not.exist");
          itemListPage.getItemContainerInlistById(item_ids[1]).should("not.exist");
          itemListPage.verifyNoOfItemsInContainer(1);
        });
      });
      context(">searching in 'entire library'", () => {
        // Searched Draft Items should Not Be visible in Entire Library
        it(">search by standards", () => {
          searchFilters.clearAll();
          Cypress._.keys(standardToSearch).forEach(ele => {
            searchFilters.typeInSearchBox(ele);
            standardToSearch[ele].forEach(id => {
              itemListPage.getViewItemById(id, queTexts[id]).should("not.exist");
            });
          });
        });
        it(">search by id", () => {
          item_ids.forEach(id => {
            searchFilters.clearAll();
            searchFilters.typeInSearchBox(id);
            itemListPage.getViewItemById(id, queTexts[id]).should("not.exist");
          });
        });
        it(">search by content", () => {
          itemListPage.searchFilters.clearAll();

          itemListPage.searchFilters.typeInSearchBox(searchkeys[0]);
          cy.contains("Items Not Available");

          itemListPage.searchFilters.typeInSearchBox(searchkeys[1]);
          cy.contains("Items Not Available");

          itemListPage.searchFilters.typeInSearchBox(searchkeys.join(" "));
          cy.contains("Items Not Available");
        });
      });
    });
  });
});
