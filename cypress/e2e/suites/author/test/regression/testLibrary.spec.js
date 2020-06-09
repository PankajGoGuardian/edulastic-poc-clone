import { subject, grades as GRADES, studentSide } from "../../../../framework/constants/assignmentStatus";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import LiveClassboardPage from "../../../../framework/author/assignments/LiveClassboardPage";
import StudentsReportCard from "../../../../framework/author/assignments/studentPdfReportCard";
import { COLLECTION } from "../../../../framework/constants/questionTypes";
import StudentTestPage from "../../../../framework/student/studentTestPage";
import FileHelper from "../../../../framework/util/fileHelper";

const questionData = require("../../../../../fixtures/questionAuthoring");

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> test library`, () => {
  const { _ } = Cypress;
  const testLibraryPage = new TestLibrary();
  const lcb = new LiveClassboardPage();
  const studentsReportCard = new StudentsReportCard();
  const studentTestPage = new StudentTestPage();

  const teacher = "teacher.testlibrary@snapwiz.com";
  const stuAttempt = [
    {
      stuName: "student",
      attempt: {
        Q1: "right",
        Q2: "right",
        Q3: "right"
      },
      status: studentSide.SUBMITTED
    }
  ];

  const allItems = [
    "ESSAY_RICH.default",
    "ESSAY_RICH.1",
    "ESSAY_RICH.2",
    "ESSAY_RICH.3",
    "ESSAY_RICH.4",
    "ESSAY_RICH.5"
  ];
  const allItemIds = [
    "5ede3e60a7e4ff000881085c",
    "5ede3e7ea7e4ff0008810860",
    "5ede3ea27a335a0007c75adc",
    "5ede3ecdae8fff000851885d",
    "5ede3f05ac561400070d51bd",
    "5ede3f417a335a0007c75ade"
  ];

  const alltags = ["test-tag-1", "test-tag-2", "test-tag-3", "test-tag-4", "test-tag-5"];

  const testData = {
    test_1: {
      subjects: ["ELA", "Mathematics"],
      grades: ["Grade 5", "Grade 6"],
      tags: ["test-tag-3", "test-tag-4"],
      items: ["ESSAY_RICH.default", "ESSAY_RICH.2", "ESSAY_RICH.5"],
      id: "5ede3f84ac561400070d51bf"
    },
    test_2: {
      subjects: ["ELA", "Mathematics"],
      grades: ["Grade 4", "Grade 6"],
      tags: ["test-tag-5", "test-tag-1"],
      items: ["ESSAY_RICH.1", "ESSAY_RICH.3", "ESSAY_RICH.5"],
      id: "5ede3fcdae8fff000851885f"
    },
    test_3: {
      subjects: ["ELA", "Mathematics"],
      grades: ["Grade 8", "Grade 12"],
      tags: ["test-tag-2", "test-tag-4"],
      items: ["ESSAY_RICH.default", "ESSAY_RICH.2", "ESSAY_RICH.3"],
      id: "5ede40183f636700071af2cd"
    },
    test_4: {
      subjects: ["ELA", "Mathematics"],
      grades: ["Grade 4", "Grade 5"],
      tags: ["test-tag-4", "test-tag-5"],
      items: ["ESSAY_RICH.2", "ESSAY_RICH.4", "ESSAY_RICH.1"],
      id: "5ede40657a335a0007c75ae1"
    },
    test_5: {
      subjects: ["ELA", "Mathematics"],
      grades: ["Grade 8", "Grade 4", "Grade 5", "Grade 6"],
      tags: ["test-tag-1", "test-tag-2", "test-tag-3", "test-tag-4", "test-tag-5"],
      items: ["ESSAY_RICH.default", "ESSAY_RICH.3", "ESSAY_RICH.1"],
      id: "5ede40c8a7e4ff0008810864"
    },
    test_6: {
      subjects: ["ELA", "Mathematics"],
      grades: ["Grade 10", "Kindergarten"],
      tags: ["test-tag-4", "test-tag-2"],
      items: ["ESSAY_RICH.1", "ESSAY_RICH.2", "ESSAY_RICH.3"],
      id: "5ede411f3f636700071af2d1"
    }
  };

  before("> create all items", () => {
    cy.login("Teacher", teacher);
    /*  allItems.forEach(item => {
      itemListPage.createItem(item).then(id => allItemIds.push(id));
    }); */
  });

  /*  before("> create the tests", () => {
    cy.getAllTestsAndDelete(teacher);
    _.entries(testData).forEach(entry => {
      testLibraryPage.createNewTestAndFillDetails({
        name: entry[0],
        grade: entry[1].grades,
        subject: entry[1].subjects,
        tags: entry[1].tags
      });
      testLibraryPage.header.clickOnAddItems();
      testLibraryPage.testAddItem.searchFilters.clearAll();

      cy.server();
      cy.route("POST", "**api/test").as("create-test");
      entry[1].items.forEach((item, ind) => {
        const itemToAdd = allItemIds[allItems.indexOf(item)];
        testLibraryPage.testAddItem.searchFilters.typeInSearchBox(itemToAdd);
        testLibraryPage.testAddItem.addItemById(itemToAdd);
        if (ind === 0)
          cy.wait("@create-test").then(xhr => {
            // testLibraryPage.saveTestId(xhr);
            testData[entry[0]].id = xhr.response.body.result._id;
          });
      });
      testLibraryPage.header.clickOnPublishButton();
    });
  });

  before("> write results", () => {
    testData.itms = allItemIds;
    cy.writeFile("tests.json", testData);
  }); */

  before("> get standards", () => {
    _.keys(testData).forEach(tests => {
      const questionTypeMap = {};
      lcb.getQuestionTypeMap(testData[tests].items, questionData, questionTypeMap);
      testData[tests].standardTableData = studentsReportCard.getStandardTableData({ stuAttempt, questionTypeMap });
    });
  });

  before("> filter mapping", () => {
    _.keys(testData).forEach(tests => {
      let testGrades = testData[tests].grades;
      let standardSet = [];
      let points = 0;
      testData[tests].items.forEach(item => {
        const [queType, index] = item.split(".");
        testGrades = _.union([questionData[queType][index].standards[0].grade], testGrades);
        standardSet = _.union([questionData[queType][index].standards[0].standardSet], standardSet);
        points += questionData[queType][index].setAns.points;
      });
      testData[tests].testGrades = testGrades;
      testData[tests].standardSet = standardSet;
      testData[tests].points = points;
    });
  });

  context("> test card in tile view", () => {
    before("> search and get test", () => {
      const { id } = testData.test_5;
      testLibraryPage.sidebar.clickOnTestLibrary();
      testLibraryPage.clickOnTileView();
      testLibraryPage.searchFilters.clearAll();
      testLibraryPage.searchFilters.typeInSearchBox(id);
    });
    it("> verify standards and collection", () => {
      const { id, standardTableData } = testData.test_5;
      testLibraryPage.verifyStandardsOnTestCardById(id, _.keys(standardTableData));
      testLibraryPage.verifyCollectionOnTestCardbyId(id, COLLECTION.private.split(" ")[0].toUpperCase());
    });
    it("> verify total items and teacher name", () => {
      const { id, items } = testData.test_5;
      testLibraryPage.verifyTotalItemCountByTestId(id, items.length);
      testLibraryPage.verifyAuthorNameOnTestCardById(id, "Teacher");
    });
    it("> verify id and status", () => {
      const { id } = testData.test_5;
      testLibraryPage.verifyStatusOnTestCardById(id, "published");
      testLibraryPage.verifyTestIdOnTestCardById(id);
    });
  });

  context("> test card in list view", () => {
    before("> search and get test", () => {
      const { id } = testData.test_5;
      testLibraryPage.clickOnListView();
      testLibraryPage.searchFilters.clearAll();
      testLibraryPage.searchFilters.typeInSearchBox(id);
    });

    it("> verify standards and tags", () => {
      const { id, standardTableData, tags } = testData.test_5;
      testLibraryPage.verifyStandardsOnTestCardById(id, _.keys(standardTableData));
      testLibraryPage.verifyTagsOnTestCardById(id, tags);
    });

    it("> verify teacher name,id and status", () => {
      const { id } = testData.test_5;
      testLibraryPage.verifyAuthorNameOnTestCardById(id, "Teacher");
      testLibraryPage.verifyStatusOnTestCardById(id, "published");
      testLibraryPage.verifyTestIdOnTestCardById(id);
    });

    it("> preview button", () => {
      const { items, id } = testData.test_5;
      testLibraryPage.clickPreviewOnTestCardById(id);
      studentTestPage.verifyNoOfQuestions(items.length);
      items.forEach(item => {
        studentTestPage.getQuestionText().should("contain", item);
        studentTestPage.clickOnNext(true);
      });
      cy.wait(1000);
    });
  });

  context("> test card in pop up view", () => {
    before("> search and get test", () => {
      studentTestPage.clickOnExitTest(true);
      const { id } = testData.test_5;
      testLibraryPage.clickOnTileView();
      testLibraryPage.searchFilters.clearAll();
      testLibraryPage.searchFilters.typeInSearchBox(id);
      testLibraryPage.clickOnTestCardById(id);
    });
    it("> verify test name and collection", () => {
      testLibraryPage.verifyTestNameOnTestCardPopUp("test_5");
      testLibraryPage.verifyTestCollectionOnTestCardPopUp(COLLECTION.private);
    });
    it("> verify grade and subject", () => {
      const { testGrades, subjects } = testData.test_5;
      testLibraryPage.verifyGradesOnTestCardPopUp(testGrades);
      testLibraryPage.verifySubjectsOnTestCardPopUp(subjects);
    });

    it("> verify total items and points", () => {
      const { items, points } = testData.test_5;
      testLibraryPage.verifyTotalPointsOnTestCardPopUp(points);
      testLibraryPage.verifyTotalItemsOnTestCardPopUp(items.length);
    });

    it("> verify standard table", () => {
      const { standardTableData } = testData.test_5;
      _.keys(standardTableData).forEach(standard => {
        const { max, questions } = standardTableData[standard];
        testLibraryPage.verifyStandardTableRowByStandard(standard, questions.length, max);
      });
    });

    it("> preview button", () => {
      const { items } = testData.test_5;
      testLibraryPage.clickPreviewOnTestCardPopUp();
      studentTestPage.verifyNoOfQuestions(items.length);
      items.forEach(item => {
        studentTestPage.getQuestionText().should("contain", item);
        studentTestPage.clickOnNext(true);
      });
      cy.wait(1000);
    });

    it("> assign button", () => {
      cy.deleteAllAssignments(undefined, teacher);
      studentTestPage.clickOnExitTest(true);
      testLibraryPage.clickAssignOnTestCardPopUp();
      testLibraryPage.assignPage.selectClass("Class");
      testLibraryPage.assignPage.clickOnAssign();
    });
  });

  context("> paginations", () => {
    before("> goto test library", () => {
      testLibraryPage.sidebar.clickOnDashboard();
      testLibraryPage.sidebar.clickOnTestLibrary();
    });
    beforeEach("> clear filters", () => {
      testLibraryPage.searchFilters.clearAll();
    });
    it("> jump to next 5 pages and previous 5 pages", () => {
      testLibraryPage.searchFilters.clickButtonInPaginationByPageNo("Next 5 Pages");
      testLibraryPage.searchFilters.verfifyActivePageIs(6);

      testLibraryPage.searchFilters.clickButtonInPaginationByPageNo("Next 5 Pages");
      testLibraryPage.searchFilters.verfifyActivePageIs(11);

      testLibraryPage.searchFilters.clickButtonInPaginationByPageNo("Previous 5 Pages");
      testLibraryPage.searchFilters.verfifyActivePageIs(6);
    });

    it("> go to random page", () => {
      testLibraryPage.searchFilters.clickButtonInPaginationByPageNo(5);
      testLibraryPage.searchFilters.verfifyActivePageIs(5);

      testLibraryPage.searchFilters.clickButtonInPaginationByPageNo(3);
      testLibraryPage.searchFilters.verfifyActivePageIs(3);
    });

    it("> go to next page and previous page", () => {
      testLibraryPage.searchFilters.clickButtonInPaginationByPageNo("Next Page");
      testLibraryPage.searchFilters.verfifyActivePageIs(2);

      testLibraryPage.searchFilters.clickButtonInPaginationByPageNo("Previous Page");
      testLibraryPage.searchFilters.verfifyActivePageIs(1);
    });

    it("> go to last page", () => {
      testLibraryPage.searchFilters.getTotalPagesInPagination().then(pages => {
        testLibraryPage.searchFilters.clickJumpToLastPage();
        testLibraryPage.searchFilters.verfifyActivePageIs(pages);
      });
    });
  });

  context("> filters", () => {
    beforeEach("> clear filters", () => {
      testLibraryPage.searchFilters.clearAll();
      testLibraryPage.searchFilters.getAuthoredByMe();
    });
    it("> grades", () => {
      const customFilter = { standards: { grades: [GRADES.GRADE_10, GRADES.KINDERGARTEN] } };
      const filteredTest = _.values(testData).filter(
        a => _.intersection(customFilter.standards.grades, a.testGrades).length > 0
      );

      testLibraryPage.searchFilters.setFilters(customFilter, false);
      filteredTest.forEach(test => testLibraryPage.getTestCardById(test.id));
      testLibraryPage.getAllTestCardsInCurrentPage().should("have.length", filteredTest.length);
    });

    it("> subjects", () => {
      const customFilter = { standards: { subject: subject.MATH } };
      const filteredTest = _.values(testData).filter(a => a.subjects.indexOf(customFilter.standards.subject) !== -1);

      testLibraryPage.searchFilters.setFilters(customFilter, false);
      filteredTest.forEach(test => testLibraryPage.getTestCardById(test.id));
      testLibraryPage.getAllTestCardsInCurrentPage().should("have.length", filteredTest.length);
    });

    it("> standard set", () => {
      const customFilter = { standards: { subject: subject.ELA, standardSet: "ELA - Common Core" } };
      const filteredTest = _.values(testData).filter(
        a => a.standardSet.indexOf(customFilter.standards.standardSet) !== -1
      );

      testLibraryPage.searchFilters.setFilters(customFilter, false);
      filteredTest.forEach(test => testLibraryPage.getTestCardById(test.id));
      testLibraryPage.getAllTestCardsInCurrentPage().should("have.length", filteredTest.length);
    });

    it("> standard", () => {
      const customFilter = {
        standards: { subject: subject.ELA, standardSet: "ELA - Common Core", standard: ["CCRA.L.1"] }
      };
      const filteredTest = _.values(testData).filter(
        a => _.intersection(_.keys(a.standardTableData), customFilter.standards.standard).length > 0
      );

      testLibraryPage.searchFilters.setFilters(customFilter, false);
      filteredTest.forEach(test => testLibraryPage.getTestCardById(test.id));
      testLibraryPage.getAllTestCardsInCurrentPage().should("have.length", filteredTest.length);
    });

    it("> collection", () => {
      const customFilter = { collection: COLLECTION.private };
      testLibraryPage.searchFilters.clearAll();
      testLibraryPage.searchFilters.setFilters(customFilter, false);
      _.values(testData).forEach(test => testLibraryPage.getTestCardById(test.id));
    });

    it("> tags", () => {
      const customFilter = { tags: [alltags[2], alltags[4]] };
      const filteredTest = _.values(testData).filter(a => _.intersection(a.tags, customFilter.tags).length > 0);

      testLibraryPage.searchFilters.setFilters(customFilter, false);
      filteredTest.forEach(test => testLibraryPage.getTestCardById(test.id));
      testLibraryPage.getAllTestCardsInCurrentPage().should("have.length", filteredTest.length);
    });

    it("> grades + subject", () => {
      const customFilter = { standards: { grades: [GRADES.GRADE_10], subject: subject.ELA } };
      const filteredTest = _.values(testData).filter(
        a =>
          _.intersection(customFilter.standards.grades, a.testGrades).length > 0 &&
          a.subjects.indexOf(customFilter.standards.subject) !== -1
      );

      testLibraryPage.searchFilters.setFilters(customFilter, false);
      filteredTest.forEach(test => testLibraryPage.getTestCardById(test.id));
      testLibraryPage.getAllTestCardsInCurrentPage().should("have.length", filteredTest.length);
    });

    it("> grades + standard set", () => {
      const customFilter = {
        standards: { grades: [GRADES.KINDERGARTEN], subject: subject.ELA, standardSet: "ELA - Common Core" }
      };
      const filteredTest = _.values(testData).filter(
        a =>
          _.intersection(customFilter.standards.grades, a.testGrades).length > 0 &&
          a.standardSet.indexOf(customFilter.standards.standardSet) !== -1
      );

      testLibraryPage.searchFilters.setFilters(customFilter, false);
      filteredTest.forEach(test => testLibraryPage.getTestCardById(test.id));
      testLibraryPage.getAllTestCardsInCurrentPage().should("have.length", filteredTest.length);
    });

    it("> grades + standards", () => {
      const customFilter = {
        standards: {
          grades: [GRADES.GRADE_4],
          subject: subject.MATH,
          standardSet: "Math - Common Core",
          standard: ["4.G.A.2", "4.G.A.1"]
        }
      };
      const filteredTest = _.values(testData).filter(
        a =>
          _.intersection(customFilter.standards.grades, a.testGrades).length > 0 &&
          _.intersection(customFilter.standards.standard, _.keys(a.standardTableData)).length > 0
      );

      testLibraryPage.searchFilters.setFilters(customFilter, false);
      filteredTest.forEach(test => testLibraryPage.getTestCardById(test.id));
      testLibraryPage.getAllTestCardsInCurrentPage().should("have.length", filteredTest.length);
    });

    it("> grades + collection", () => {
      const customFilter = {
        standards: {
          grades: [GRADES.KINDERGARTEN]
        },
        collection: COLLECTION.private
      };
      const filteredTest = _.values(testData).filter(
        a => _.intersection(customFilter.standards.grades, a.testGrades).length > 0
      );

      testLibraryPage.searchFilters.setFilters(customFilter, false);
      filteredTest.forEach(test => testLibraryPage.getTestCardById(test.id));
      testLibraryPage.getAllTestCardsInCurrentPage().should("have.length", filteredTest.length);
    });

    it("> grades + tags", () => {
      const customFilter = {
        standards: {
          grades: [GRADES.GRADE_5]
        },
        tags: [alltags[0], alltags[2]]
      };
      const filteredTest = _.values(testData).filter(
        a =>
          _.intersection(customFilter.standards.grades, a.testGrades).length > 0 &&
          _.intersection(customFilter.tags, a.tags).length > 0
      );

      testLibraryPage.searchFilters.setFilters(customFilter, false);
      filteredTest.forEach(test => testLibraryPage.getTestCardById(test.id));
      testLibraryPage.getAllTestCardsInCurrentPage().should("have.length", filteredTest.length);
    });
  });

  context("> assign, more, preview", () => {
    beforeEach("> search test", () => {
      const { id } = testData.test_3;
      testLibraryPage.sidebar.clickOnDashboard();
      testLibraryPage.sidebar.clickOnTestLibrary();
      testLibraryPage.clickOnTileView();
      testLibraryPage.searchFilters.clearAll();
      testLibraryPage.searchFilters.typeInSearchBox(id);
    });
    it("> 'assign' button", () => {
      cy.deleteAllAssignments(undefined, teacher);
      const { id } = testData.test_3;
      testLibraryPage.clickAssignOnTestCardById(id);
      testLibraryPage.assignPage.selectClass("Class");
      testLibraryPage.assignPage.clickOnAssign();
    });

    it("> 'preview' button", () => {
      const { id, items } = testData.test_3;
      testLibraryPage.clickPreviewOnTestCardById(id);
      studentTestPage.verifyNoOfQuestions(items.length);
      items.forEach(item => {
        studentTestPage.getQuestionText().should("contain", item);
        studentTestPage.clickOnNext(true);
      });
      cy.wait(1000);
    });
    it("> 'more' button", () => {
      const { id } = testData.test_3;
      studentTestPage.clickOnExitTest(true);
      testLibraryPage.clickMoreOnTestCardById(id);
      testLibraryPage.getAssignEdit().should("be.visible");
    });
  });
});
