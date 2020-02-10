import SearchFilters from "../../../../framework/author/searchFiltersPage";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";
import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import PreviewItemPopup from "../../../../framework/author/itemList/itemPreview";
import FileHelper from "../../../../framework/util/fileHelper";

const quesData = require("../../../../../fixtures/questionAuthoring");

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >>Searching Items Using Ids and Standards`, () => {
  const searchFilters = new SearchFilters();
  const testLibrary = new TestLibrary();
  const itemListPage = new ItemListPage();
  const editItemPage = new EditItemPage();
  const itemPreview = new PreviewItemPopup();

  const EMAIL = "email";
  const PASS = "pass";
  let standardsOfItems;
  const itemsToCreate = ["MCQ_STD.1", "MCQ_STD.default", "MCQ_STD.default"];

  const Author = { email: "teacher1.item.search@snapwiz.com", pass: "snapwiz" };

  const standardToSearch = {};
  const item_ids = [];
  const queTexts = {};

  context("Searching Items in Both Draft and Published State", () => {
    before("Login As Author and Create Tests in Draft-State", () => {
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
    context("Searching In Published State", () => {
      context("Searching In Entire Library", () => {
        // Searched Published Tests should be visible in Entire Library
        it("Search By Standards-Published", () => {
          testLibrary.sidebar.clickOnItemBank();
          testLibrary.searchFilters.clearAll();
          Object.keys(standardToSearch).forEach(ele => {
            searchFilters.getSearchTextBox().clear({ force: true });
            searchFilters.typeInSearchBox(ele);
            standardToSearch[ele].forEach(id => {
              itemListPage.getViewItemById(id).should("be.visible");
            });
          });
        });

        it("Search By id-Published", () => {
          item_ids.forEach(id => {
            itemListPage.searchFilters.clearAll();
            itemListPage.searchFilters.getSearchTextBox().clear({ force: true });
            itemListPage.searchFilters.typeInSearchBox(id);
            itemListPage.getViewItemById(id, queTexts[id]).should("be.visible");
          });
        });
      });
      context("Searching In Authored By Me", () => {
        // Searched Draft Tests should Be visible in Authored By Me
        it("Search By standards in Published-State", () => {
          itemListPage.searchFilters.clearAll();
          itemListPage.searchFilters.getAuthoredByMe();
          Object.keys(standardToSearch).forEach(ele => {
            itemListPage.searchFilters.getSearchTextBox().clear({ force: true });
            itemListPage.searchFilters.typeInSearchBox(ele);
            standardToSearch[ele].forEach(id => {
              itemListPage.getViewItemById(id, queTexts[id]).should("be.visible");
            });
          });
        });

        it("Search By id in Published-State", () => {
          itemListPage.searchFilters.clearAll();
          itemListPage.searchFilters.getAuthoredByMe();
          item_ids.forEach(id => {
            itemListPage.searchFilters.getSearchTextBox().clear({ force: true });
            itemListPage.searchFilters.typeInSearchBox(id);
            itemListPage.getViewItemById(id, queTexts[id]).should("be.visible");
          });
        });
      });
    });
    context("Searching In Draft State", () => {
      before("Convert Each Item To Draft", () => {
        itemListPage.searchFilters.clearAll();
        item_ids.forEach(ele => {
          itemListPage.searchFilters.getSearchTextBox().clear({ force: true });
          itemListPage.searchFilters.typeInSearchBox(ele);
          itemListPage.clickOnViewItemById(ele, queTexts[ele]);
          itemPreview.clickEditOnPreview();
          editItemPage.header.save(true);
          editItemPage.sideBar.clickOnItemBank();
          itemListPage.searchFilters.clearAll();
        });
      });
      context("Searching In Authored By Me", () => {
        // Searched Draft Tests should Be visible in Authored By Me
        it("Search By standards in Draft-State", () => {
          itemListPage.searchFilters.getAuthoredByMe();
          Object.keys(standardToSearch).forEach(ele => {
            searchFilters.getSearchTextBox().clear({ force: true });
            searchFilters.typeInSearchBox(ele);
            standardToSearch[ele].forEach(id => {
              itemListPage.getViewItemById(id, queTexts[id]).should("be.visible");
            });
          });
        });
        it("Search By id in Draft-State", () => {
          searchFilters.clearAll();
          searchFilters.getAuthoredByMe();
          item_ids.forEach(id => {
            searchFilters.getSearchTextBox().clear({ force: true });
            searchFilters.typeInSearchBox(id);
            itemListPage.getViewItemById(id, queTexts[id]).should("be.visible");
          });
        });
      });
      context("Searching In Entire Library", () => {
        // Searched Draft Items should Not Be visible in Entire Library
        it("Search By standards in Draft-State", () => {
          searchFilters.clearAll();
          Object.keys(standardToSearch).forEach(ele => {
            searchFilters.getSearchTextBox().clear({ force: true });
            searchFilters.typeInSearchBox(ele);
            standardToSearch[ele].forEach(id => {
              itemListPage.getViewItemById(id, queTexts[id]).should("not.exist");
            });
          });
        });
        it("Search By id in Draft-State", () => {
          item_ids.forEach(id => {
            searchFilters.clearAll();
            searchFilters.getSearchTextBox().clear({ force: true });
            searchFilters.typeInSearchBox(id);
            itemListPage.getViewItemById(id, queTexts[id]).should("not.exist");
          });
        });
      });
    });
  });
});
