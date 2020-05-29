import ItemListPage from "../../../../framework/author/itemList/itemListPage";
import FileHelper from "../../../../framework/util/fileHelper";
import { subject, grades } from "../../../../framework/constants/assignmentStatus";
import { DOK, DIFFICULTY } from "../../../../framework/constants/questionAuthoring";
import { COLLECTION } from "../../../../framework/constants/questionTypes";

describe(`${FileHelper.getSpecName(Cypress.spec.name)}> item bank`, () => {
  const itemlist = new ItemListPage();
  const itemKeys = ["ESSAY_RICH.1", "ESSAY_RICH.2", "ESSAY_RICH.3", "ESSAY_RICH.4", "ESSAY_RICH.5", "MCQ_MULTI.6"];
  const user = "teacher.item.filters@snapwiz.com";
  const mathCommonCore = "Math - Common Core";
  const filters = [
    {
      standards: {
        subject: "Mathematics",
        standardSet: "Math - Common Core",
        standard: ["4.G.A.2", "4.G.A.1"],
        grade: ["Grade 4"]
      },
      dok: "Skill/Concept",
      difficulty: "Easy",
      tags: ["item tag 3"],
      id: "5ecfd4523a814400077da2ad",
      queType: "Essay Rich Text"
    },
    {
      standards: {
        subject: "Mathematics",
        standardSet: "Math - Common Core",
        standard: ["4.G.A.2", "4.G.A.1"],
        grade: ["Grade 4"]
      },
      dok: "Extended Thinking",
      difficulty: "Hard",
      tags: ["item tag 1"],
      id: "5ecfd478a9222f0007a11915",
      queType: "Essay Rich Text"
    },
    {
      standards: {
        subject: "ELA",
        standardSet: "ELA - Common Core",
        standard: ["CCRA.L.2"],
        grade: ["Grade 2"]
      },
      dok: "Strategic Thinking",
      difficulty: "Easy",
      tags: ["item tag 1"],
      id: "5ecfd4a63a814400077da2af",
      queType: "Essay Rich Text"
    },
    {
      standards: {
        subject: "ELA",
        standardSet: "ELA - Common Core",
        standard: ["CCRA.L.1", "CCRA.L.2"],
        grade: ["Grade 2"]
      },
      dok: "Skill/Concept",
      difficulty: "Easy",
      tags: ["item tag 2"],
      id: "5ecfd4e33a814400077da2b1",
      queType: "Essay Rich Text"
    },
    {
      standards: {
        subject: "Mathematics",
        standardSet: "Math - Common Core",
        standard: ["4.G.A.2", "4.G.A.1"],
        grade: ["Grade 4"]
      },
      dok: "Skill/Concept",
      difficulty: "Hard",
      tags: ["item tag 1"],
      id: "5ecfd529e880fb00083c5cf6",
      queType: "Essay Rich Text"
    },
    {
      standards: {
        subject: "ELA",
        standardSet: "ELA - Common Core",
        standard: ["CCRA.L.1", "CCRA.L.2"],
        grade: ["Grade 2"]
      },
      dok: "Skill/Concept",
      difficulty: "Easy",
      tags: ["item tag 2"],
      id: "5ecfd585d4924b0007478ad1",
      queType: "Multiple Choice"
    }
  ];

  before("> create items", () => {
    cy.login("teacher", user);
    // cy.getAllTestsAndDelete(user);
    // cy.getAllItemsAndDelete(user);
    // filters = [];
    // itemKeys.forEach((item, index) => {
    //   itemlist.createItem(item, index + 1).then(id => {
    //     const filtersObj = {};
    //     cy.fixture("questionAuthoring").then(questionData => {
    //       const itemProps = questionData[`${item.split(".")[0]}`][`${item.split(".")[1]}`];

    //       filtersObj.standards = {};
    //       filtersObj.standards.subject = itemProps.standards[0].subject;
    //       filtersObj.standards.standardSet = itemProps.standards[0].standardSet;
    //       filtersObj.standards.standard = itemProps.standards[0].standard;
    //       filtersObj.standards.grade = [itemProps.standards[0].grade];
    //       if (itemProps.meta) {
    //         if (itemProps.meta.dok) filtersObj.dok = itemProps.meta.dok;
    //         if (itemProps.meta.difficulty) filtersObj.difficulty = itemProps.meta.difficulty;
    //         if (itemProps.meta.tags) filtersObj.tags = itemProps.meta.tags;
    //       }
    //       filtersObj.id = id;
    //       filtersObj.queType = item.split(".")[0] === "MCQ_MULTI" ? "Multiple Choice" : "Essay Rich Text";
    //       filters.push(filtersObj);
    //     });
    //   });
    // });
  });

  // before(">", () => {
  //   cy.writeFile("temp.json", filters);
  // });

  context("> total questions, search, pagination", () => {
    it("> total questions in authored by me", () => {
      itemlist.sidebar.clickOnDashboard();
      itemlist.sidebar.clickOnItemBank();
      itemlist.searchFilters.clearAll();
      itemlist.searchFilters.getAuthoredByMe();
      itemlist.verifyNoOfQuestionsInUI(itemKeys.length);
      itemlist.verifyNoOfItemsInContainer(itemKeys.length);
    });
    it("> total questions in entire library vs total page count", () => {
      itemlist.searchFilters.clearAll();
      itemlist.verifyTotalPagesAndTotalQuestions();
    });

    it("> expand and collapse filters", () => {
      itemlist.searchFilters.collapseFilters();
      cy.wait(1000);
      itemlist.searchFilters.expandFilters();
    });
  });

  context("> paginations", () => {
    beforeEach("> clear filters", () => {
      itemlist.searchFilters.clearAll();
    });
    it("> jump to next 5 pages and previous 5 pages", () => {
      itemlist.searchFilters.clickButtonInPaginationByPageNo("Next 5 Pages");
      itemlist.searchFilters.verfifyActivePageIs(6);

      itemlist.searchFilters.clickButtonInPaginationByPageNo("Next 5 Pages");
      itemlist.searchFilters.verfifyActivePageIs(11);

      itemlist.searchFilters.clickButtonInPaginationByPageNo("Previous 5 Pages");
      itemlist.searchFilters.verfifyActivePageIs(6);
    });

    it("> go to random page", () => {
      itemlist.searchFilters.clickButtonInPaginationByPageNo(5);
      itemlist.searchFilters.verfifyActivePageIs(5);

      itemlist.searchFilters.clickButtonInPaginationByPageNo(3);
      itemlist.searchFilters.verfifyActivePageIs(3);
    });

    it("> go to next page and previous page", () => {
      itemlist.searchFilters.clickButtonInPaginationByPageNo("Next Page");
      itemlist.searchFilters.verfifyActivePageIs(2);

      itemlist.searchFilters.clickButtonInPaginationByPageNo("Previous Page");
      itemlist.searchFilters.verfifyActivePageIs(1);
    });

    it("> go to last page", () => {
      itemlist.searchFilters.getTotalPagesInPagination().then(pages => {
        itemlist.searchFilters.clickJumpToLastPage();
        itemlist.searchFilters.verfifyActivePageIs(pages);
      });
    });
  });

  context("> ques type, standards, author and item id", () => {
    before("> set filter", () => {
      itemlist.searchFilters.setFilters(filters[1]);
    });
    it("> quetype, author and item id", () => {
      itemlist.verifyQuestionTypeById(filters[1].id, "Essay with rich text");
      itemlist.verifyAuthorById(filters[1].id, "Teacher");
      itemlist.verifyItemIdById(filters[1].id);
    });

    it("> standards and dok", () => {
      filters[1].standards.standard.forEach((std, ind) => {
        if (ind > 0) itemlist.getHiddenStandards(filters[1].id);
        itemlist.verifyContentById(filters[1].id, std);
      });
      itemlist.verifydokByItemId(filters[1].id, filters[1].dok);
    });
  });

  context("> filters", () => {
    it("> grades", () => {
      const customFilter = { standards: { grade: [grades.GRADE_2] } };
      const expectedItem = filters.filter(item => item.standards.grade.indexOf(grades.GRADE_2) !== -1);

      itemlist.searchFilters.clearAll();
      itemlist.searchFilters.getAuthoredByMe();
      itemlist.searchFilters.setFilters(customFilter);
      itemlist.verifyNoOfQuestionsInUI(expectedItem.length);
      expectedItem.forEach(item => {
        itemlist.getItemContainerInlistById(item.id);
      });
    });

    it("> subject", () => {
      const customFilter = { standards: { subject: subject.ELA } };
      const expectedItem = filters.filter(item => item.standards.subject === subject.ELA);

      itemlist.searchFilters.clearAll();
      itemlist.searchFilters.getAuthoredByMe();
      itemlist.searchFilters.setFilters(customFilter);
      itemlist.verifyNoOfQuestionsInUI(expectedItem.length);
      expectedItem.forEach(item => {
        itemlist.getItemContainerInlistById(item.id);
      });
    });

    it("> standard set", () => {
      const customFilter = {
        standards: { subject: subject.MATH, grade: [grades.GRADE_4], standardSet: mathCommonCore }
      };
      const expectedItem = filters.filter(item => item.standards.standardSet === mathCommonCore);

      itemlist.searchFilters.clearAll();
      itemlist.searchFilters.getAuthoredByMe();
      itemlist.searchFilters.setFilters(customFilter);
      itemlist.verifyNoOfQuestionsInUI(expectedItem.length);
      expectedItem.forEach(item => {
        itemlist.getItemContainerInlistById(item.id);
      });
    });

    it("> question type", () => {
      const customFilter = { queType: "Essay Rich Text" };
      const expectedItem = filters.filter(item => item.queType === "Essay Rich Text");

      itemlist.searchFilters.clearAll();
      itemlist.searchFilters.getAuthoredByMe();
      itemlist.searchFilters.setFilters(customFilter);
      itemlist.verifyNoOfQuestionsInUI(expectedItem.length);
      expectedItem.forEach(item => {
        itemlist.getItemContainerInlistById(item.id);
      });
    });

    it("> standards", () => {
      const customFilter = {
        standards: {
          subject: subject.MATH,
          grade: [grades.GRADE_4],
          standardSet: mathCommonCore,
          standard: ["4.G.A.2"]
        }
      };
      const expectedItem = filters.filter(item => item.standards.standard.indexOf("4.G.A.2") !== -1);

      itemlist.searchFilters.clearAll();
      itemlist.searchFilters.getAuthoredByMe();
      itemlist.searchFilters.setFilters(customFilter);
      itemlist.verifyNoOfQuestionsInUI(expectedItem.length);
      expectedItem.forEach(item => {
        itemlist.getItemContainerInlistById(item.id);
      });
    });

    it("> tags", () => {
      const customFilter = { tags: ["item tag 1"] };
      const expectedItem = filters.filter(item => item.tags.indexOf("item tag 1") !== -1);

      itemlist.searchFilters.clearAll();
      itemlist.searchFilters.getAuthoredByMe();
      itemlist.searchFilters.setFilters(customFilter);
      itemlist.verifyNoOfQuestionsInUI(expectedItem.length);
      expectedItem.forEach(item => {
        itemlist.getItemContainerInlistById(item.id);
      });
    });

    it("> dok", () => {
      const customFilter = { dok: DOK.StrategicThinking };
      const expectedItem = filters.filter(item => item.dok === DOK.StrategicThinking);

      itemlist.searchFilters.clearAll();
      itemlist.searchFilters.getAuthoredByMe();
      itemlist.searchFilters.setFilters(customFilter);
      itemlist.verifyNoOfQuestionsInUI(expectedItem.length);
      expectedItem.forEach(item => {
        itemlist.getItemContainerInlistById(item.id);
      });
    });

    it("> difficulty", () => {
      const customFilter = { difficulty: DIFFICULTY.Easy };
      const expectedItem = filters.filter(item => item.difficulty === DIFFICULTY.Easy);

      itemlist.searchFilters.clearAll();
      itemlist.searchFilters.getAuthoredByMe();
      itemlist.searchFilters.setFilters(customFilter);
      itemlist.verifyNoOfQuestionsInUI(expectedItem.length);
      expectedItem.forEach(item => {
        itemlist.getItemContainerInlistById(item.id);
      });
    });

    it("> collection 'Private Library'", () => {
      const customFilter = { collection: COLLECTION.private };

      itemlist.searchFilters.clearAll();
      itemlist.searchFilters.setFilters(customFilter);
      itemlist.verifyNoOfQuestionsInUI(filters.length);
      filters.forEach(item => {
        itemlist.getItemContainerInlistById(item.id);
      });
      // TODO : do with custom collection
    });

    it("> status", () => {
      let customFilter = { status: "Published" };
      itemlist.searchFilters.clearAll();
      itemlist.searchFilters.getAuthoredByMe();
      itemlist.searchFilters.setFilters(customFilter);
      itemlist.verifyNoOfQuestionsInUI(filters.length);

      customFilter = { status: "Draft" };
      itemlist.searchFilters.setFilters(customFilter);
      itemlist.verifyNoOfQuestionsInUI(0);
    });

    it("> grades + subject", () => {
      const customFilter = { standards: { grade: [grades.GRADE_4], subject: subject.MATH } };
      const expectedItem = filters.filter(
        item => item.standards.grade.indexOf(grades.GRADE_4) !== -1 && item.standards.subject === subject.MATH
      );

      itemlist.searchFilters.clearAll();
      itemlist.searchFilters.getAuthoredByMe();
      itemlist.searchFilters.setFilters(customFilter);
      itemlist.verifyNoOfQuestionsInUI(expectedItem.length);
      expectedItem.forEach(item => {
        itemlist.getItemContainerInlistById(item.id);
      });
    });

    it("> grades + standardset", () => {
      const customFilter = {
        standards: { grade: [grades.GRADE_4], subject: subject.MATH, standardSet: mathCommonCore }
      };
      const expectedItem = filters.filter(
        item => item.standards.grade.indexOf(grades.GRADE_4) !== -1 && item.standards.standardSet === mathCommonCore
      );

      itemlist.searchFilters.clearAll();
      itemlist.searchFilters.getAuthoredByMe();
      itemlist.searchFilters.setFilters(customFilter);
      itemlist.verifyNoOfQuestionsInUI(expectedItem.length);
      expectedItem.forEach(item => {
        itemlist.getItemContainerInlistById(item.id);
      });
    });

    it("> grades + standard", () => {
      const customFilter = {
        standards: {
          grade: [grades.GRADE_4],
          subject: subject.MATH,
          standardSet: mathCommonCore,
          standard: ["4.G.A.2"]
        }
      };
      const expectedItem = filters.filter(
        item => item.standards.grade.indexOf(grades.GRADE_4) !== -1 && item.standards.standard.indexOf("4.G.A.2") !== -1
      );

      itemlist.searchFilters.clearAll();
      itemlist.searchFilters.getAuthoredByMe();
      itemlist.searchFilters.setFilters(customFilter);
      itemlist.verifyNoOfQuestionsInUI(expectedItem.length);
      expectedItem.forEach(item => {
        itemlist.getItemContainerInlistById(item.id);
      });
    });

    it("> grades + question type", () => {
      const customFilter = { standards: { grade: [grades.GRADE_4] }, queType: "Multiple Choice" };
      const expectedItem = filters.filter(
        item => item.standards.grade.indexOf(grades.GRADE_4) !== -1 && item.queType === "Multiple Choice"
      );

      itemlist.searchFilters.clearAll();
      itemlist.searchFilters.getAuthoredByMe();
      itemlist.searchFilters.setFilters(customFilter);
      itemlist.verifyNoOfQuestionsInUI(expectedItem.length);
      expectedItem.forEach(item => {
        itemlist.getItemContainerInlistById(item.id);
      });
    });

    it("> grades + tags", () => {
      const customFilter = { standards: { grade: [grades.GRADE_4] }, tags: ["item tag 1"] };
      const expectedItem = filters.filter(
        item => item.standards.grade.indexOf(grades.GRADE_4) !== -1 && item.tags.indexOf("item tag 1") !== -1
      );

      itemlist.searchFilters.clearAll();
      itemlist.searchFilters.getAuthoredByMe();
      itemlist.searchFilters.setFilters(customFilter);
      itemlist.verifyNoOfQuestionsInUI(expectedItem.length);
      expectedItem.forEach(item => {
        itemlist.getItemContainerInlistById(item.id);
      });
    });

    it("> difficulty + dok", () => {
      const customFilter = { difficulty: DIFFICULTY.Easy, dok: DOK.ExtendedThinking };
      const expectedItem = filters.filter(
        item => item.difficulty === DIFFICULTY.Easy && item.dok === DOK.ExtendedThinking
      );

      itemlist.searchFilters.clearAll();
      itemlist.searchFilters.getAuthoredByMe();
      itemlist.searchFilters.setFilters(customFilter);
      itemlist.verifyNoOfQuestionsInUI(expectedItem.length);
      expectedItem.forEach(item => {
        itemlist.getItemContainerInlistById(item.id);
      });
    });
  });
});
