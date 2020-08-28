import PlaylistCustom from "../../../../framework/author/playlist/playListCustomizationPage";
// import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import TeacherSideBar from "../../../../framework/author/SideBarPage";
import { grades, subject } from "../../../../framework/constants/assignmentStatus";
import { COLLECTION } from "../../../../framework/constants/questionTypes";
import Helpers from "../../../../framework/util/Helpers";
import PlayListHeader from "../../../../framework/author/playlist/playListHeader";

describe("Playlist customization", () => {
  const teacher1 = {
    email: "ts3@yopmail.com",
    pass: "snapwiz"
  };

  const playListCustomization = new PlaylistCustom();
  const sidebar = new TeacherSideBar();
  const playlistHeader = new PlayListHeader();
  // const testToCreate = ["search_1", "search_2"];
  const testName = "test search 1 ";
  const testId = {
    testId1: "5e70b870c513dc0008b25fde",
    testId2: "5e70b89ac513dc0008b25fe0",
    testId3: "5e832816702a3600074b2edc",
    testId4: "5e7c920bc76d000007405675",
    testId5: "5e831ac97c24fd0007a20255",
    testId6: "5e832912591abd0008e5d9c7",
    testId7: "5e832d59252e620008b24039",
    testId8: "5e8478a6fd94480008873f85"
  };
  const collection = {
    col1: COLLECTION.school,
    col2: COLLECTION.district,
    col3: COLLECTION.public,
    col4: COLLECTION.private
  };
  const testStandard = {
    standard1: "8.G.C.9",
    standard2: "7.EE.A.1"
  };
  const testTag = {
    tag1: "test tag 1 ",
    tag2: "wrong tag"
  };
  const resources = ["Website URL", "Youtube"];
  const urls = ["www.someweb.com", "www.youtube.com"];

  const newResourceId = [];
  const oldresourceId = ["5f48d548275b4d0008fef456", "5f48d59fb44c55000801cea1"];
  const randomString = Helpers.getRamdomString(5, Helpers.stringTypes().ALPHA_NUM);
  /*   before(">create test", () => {
          cy.login("teacher", teacher1.email, teacher1.pass);
          testToCreate.forEach((test, i) => {
              testLibrary.createTest(test).then(id => {
                  originalTestIds[i] = id;
                  cy.contains("Share With Others");
              });
          });
      }); */
  context(">Content managment toggle button", () => {
    /*   before(">Create new playlist", () => {
              cy.deleteAllAssignments("", teacher1.email);
              playListLibrary.createPlayList(playListData).then(id => {
                  playListId = id;
              })
  
          });
  
          before(">Add Test to module", () => {
              playListLibrary.searchFilter.clearAll();
              playListLibrary.searchFilter.getAuthoredByMe();
              originalTestIds.forEach(id => {
                  playListLibrary.addTestTab.addTestByIdByModule(id, 1);
              });
              playListLibrary.header.clickOnReview();
              playListLibrary.header.clickOnPublish();
              playListLibrary.header.clickOnUseThis();
          }); */

    before("Log in as tecaher", () => {
      cy.login("teacher", "playschooltecaher@snapwiz.com", "snapwiz");
      sidebar.clickOnRecentUsedPlayList("Test Search Playlist");
    });
    it("ManageContent toggle", () => {
      cy.contains("Summary").should("be.visible");
      playListCustomization.clickOnManageContent();
      playListCustomization.searchContainer.getKeywordsSearchBar();
      playListCustomization.searchContainer.closeCustomizationTab();
      cy.contains("Summary").should("be.visible");
    });
  });

  context("Search from search bar", () => {
    before("Go to Resource Container", () => {
      playListCustomization.clickOnManageContent();
      playListCustomization.searchContainer.setFilters({ authoredByme: true });
    });
    it("search By Name", () => {
      playListCustomization.searchContainer.typeInSearchBar(`${testName}`);
      playListCustomization.searchContainer.getTestInSearchResultsById(testId.testId1).should("contain", `${testName}`);
    });
    it("Search by Id", () => {
      playListCustomization.searchContainer.typeInSearchBar(`${testId.testId2}`);
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId2}`);
    });
    it("Search By standard", () => {
      playListCustomization.searchContainer.typeInSearchBar(`${testStandard.standard1}`);
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId1}`);
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId2}`);

      playListCustomization.searchContainer.typeInSearchBar(`${testStandard.standard2}`, false);
      playListCustomization.searchContainer.getSearchContainer().should("contain", "test search 2 ");
    });
    it("Search by Tag", () => {
      playListCustomization.searchContainer.typeInSearchBar(`${testTag.tag1}`);
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId1}`);

      playListCustomization.searchContainer.typeInSearchBar(`${testTag.tag2}`);
      playListCustomization.searchContainer.getSearchContainer().should("contain", "No Data");
    });
  });

  context("search from Authored by me folder", () => {
    it("Verifiy grade,subject and status filter", () => {
      playListCustomization.searchContainer.setFilters({ authoredByme: true });
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId1}`);

      playListCustomization.searchContainer.setFilters({ grade: grades.GRADE_4 });
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId1}`);
      playListCustomization.searchContainer.VerififySearchResultNotVisible(`${testId.testId8}`);

      playListCustomization.searchContainer.setFilters({ status: "Draft" });
      playListCustomization.searchContainer.VerififySearchResultNotVisible(`${testId.testId8}`);
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId4}`);

      playListCustomization.searchContainer.setFilters({ status: "Published", subject: subject.MATH });
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId2}`);
      playListCustomization.searchContainer.VerififySearchResultNotVisible(`${testId.testId8}`);
    });
    it("Verify collection dropdwon", () => {
      playListCustomization.searchContainer.setFilters({ collection: collection.col1 });
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId1}`);
      playListCustomization.searchContainer.VerififySearchResultNotVisible(`${testId.testId2}`);

      playListCustomization.searchContainer.setFilters({ collection: collection.col2 });
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId2}`);
      playListCustomization.searchContainer.VerififySearchResultNotVisible(`${testId.testId3}`);

      playListCustomization.searchContainer.setFilters({ collection: collection.col3 });
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId3}`);
      playListCustomization.searchContainer.VerififySearchResultNotVisible(`${testId.testId2}`);

      playListCustomization.searchContainer.setFilters({ collection: collection.col4 });
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId3}`);
      playListCustomization.searchContainer.VerififySearchResultNotVisible(`${testId.testId6}`);
    });
  });

  context("search from Entire Library folder", () => {
    it("Verify collection dropdwon", () => {
      playListCustomization.searchContainer.setFilters({ collection: collection.col1 });
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId1}`);
      playListCustomization.searchContainer.VerififySearchResultNotVisible(`${testId.testId2}`);

      playListCustomization.searchContainer.setFilters({ collection: collection.col2 });
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId2}`);
      playListCustomization.searchContainer.VerififySearchResultNotVisible(`${testId.testId3}`);

      playListCustomization.searchContainer.setFilters({ collection: collection.col3 });
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId3}`);
      playListCustomization.searchContainer.VerififySearchResultNotVisible(`${testId.testId2}`);

      playListCustomization.searchContainer.setFilters({ collection: collection.col4 });
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId3}`);
      playListCustomization.searchContainer.VerififySearchResultNotVisible(`${testId.testId6}`);
    });
    it("Verify grade, subject", () => {
      playListCustomization.searchContainer.setFilters({ entireLibrary: true, status: "All" });
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId3}`);
      playListCustomization.searchContainer.VerififySearchResultNotVisible(`${testId.testId4}`);

      playListCustomization.searchContainer.setFilters({ grade: grades.GRADE_8 });
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId3}`);
      playListCustomization.searchContainer.VerififySearchResultNotVisible(`${testId.testId8}`);
      playListCustomization.searchContainer.setFilters({ subject: subject.MATH });

      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId5}`);
      playListCustomization.searchContainer.VerififySearchResultNotVisible(`${testId.testId8}`);
    });
  });

  context("search from Shared with me folder", () => {
    it("Shared with Me", () => {
      playListCustomization.clickOnManageContent();

      playListCustomization.searchContainer.setFilters({ SharedWithMe: true, grade: grades.GRADE_8 });
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId6}`);

      playListCustomization.searchContainer.setFilters({ SharedWithMe: true, subject: subject.ELA });
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId7}`);
    });
  });

  context("add / search resources", () => {
    /* before{
      deleting sub resources(if any are present);
    } 
    test{
      1. create new resource(YouTube and Web site link)
      2. Search new resources using titles
      3. Search old resources using titles
      4. Add new/old resources as sub resources to the tests in modules
      5. save and navigate and verify
    }
     */
    before("> delete sub resources", () => {
      playListCustomization.clickExpandByModule(1);
      playListCustomization.deleteAllSubResourceRows(1);
      playListCustomization.getAllSubResourceRowsByMod(1).should("not.have.descendants");

      playListCustomization.clickExpandByModule(2);
      playListCustomization.deleteAllSubResourceRows(2);
      playListCustomization.getAllSubResourceRowsByMod(2).should("not.have.descendants");
    });
    beforeEach("> click on resource tab", () => {
      playListCustomization.clickOnManageContent();
      playListCustomization.searchContainer.clickOnResourceTab();
    });
    resources.forEach((resource, i) => {
      it(`> add resource '${resource}'`, () => {
        const details = {
          title: `${resource}-${randomString.slice(0, 3)}`,
          desc: resource,
          url: `${urls[i]}/${randomString}`
        };
        playListCustomization.searchContainer.clickAddResourceButton();
        playListCustomization.searchContainer.clickOptionInDropDownByText(resource);
        playListCustomization.searchContainer.setInformationInAddResourcePopUp(details);
        playListCustomization.searchContainer.clickAddResourceInPopUp().then(id => {
          newResourceId.push(id);
        });
      });
    });
    it("> search new resource", () => {
      resources.forEach((resource, i) => {
        playListCustomization.searchContainer.typeInSearchBar(`${resource}-${randomString.slice(0, 3)}`);
        playListCustomization.searchContainer.getTestInSearchResultsById(newResourceId[i]).should("be.visible");
      });
    });
    it("> search existing resource", () => {
      resources.forEach((resource, i) => {
        playListCustomization.searchContainer.typeInSearchBar(`${resource}-existing`);
        playListCustomization.searchContainer.getTestInSearchResultsById(newResourceId[i]).should("be.visible");
      });
    });

    it("> add resources to test as sub-resource", () => {
      [oldresourceId[0], newResourceId[1]].forEach((resource, i) => {
        playListCustomization.searchContainer.typeInSearchBar(resource);
        playListCustomization.dragResourceFromSearchToModule(i + 1, 1, resource);
      });
      playlistHeader.clickOnSave();
    });

    it("> verify resources after navigations", () => {
      sidebar.clickOnItemBank();
      sidebar.clickOnRecentUsedPlayList();

      [oldresourceId[0], newResourceId[1]].forEach((resource, i) => {
        playListCustomization.clickExpandByModule(i + 1);
        playListCustomization.getSubResourceByTestByMod(i + 1, 1, resource);
      });
    });
  });
});
