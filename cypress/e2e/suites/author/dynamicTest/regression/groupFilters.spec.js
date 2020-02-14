/* eslint-disable no-shadow */
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";
import GroupItemsPage from "../../../../framework/author/tests/testDetail/groupItemsPage";
import FileHelper from "../../../../framework/util/fileHelper";
import AuthorAssignmentPage from "../../../../framework/author/assignments/AuthorAssignmentPage";
import LiveClassboardPage from "../../../../framework/author/assignments/LiveClassboardPage";
import AssignmentsPage from "../../../../framework/student/assignmentsPage";
import StudentTestPage from "../../../../framework/student/studentTestPage";
import {
  attemptTypes,
  deliverType as DELIVERY_TYPE
} from "../../../../framework/constants/questionTypes";
import StandardBasedReportPage from "../../../../framework/author/assignments/standardBasedReportPage";
import PreviewItemPopup from "../../../../framework/author/itemList/itemPreview";
import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import MetadataPage from "../../../../framework/author/itemList/itemDetail/metadataPage";
import { DIFFICULTY, DOK } from "../../../../framework/constants/questionAuthoring";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> item groups filters`, () => {
  const testLibraryPage = new TestLibrary();
  const groupItemsPage = new GroupItemsPage();
  const item = new ItemListPage();
  const authorAssignPage = new AuthorAssignmentPage();
  const lcb = new LiveClassboardPage();
  const studentAssignment = new AssignmentsPage();
  const studentTestPage = new StudentTestPage();
  const sbr = new StandardBasedReportPage();
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
  const deliveredArray = [[], []];

  const queText = " - This is MCQ_TF";
  const quesType = "MCQ_TF";
  let queNum;

  const contEditor = {
    email: "content.editor.1@snapwiz.com",
    pass: "snapwiz"
  };
  const Teacher = {
    email: "teacher2.for.dynamic.test@snapwiz.com",
    pass: "snapwiz"
  };
  const students = [
    {
      name: "Student1",
      email: "student1.group.question.delivery@snapwiz.com",
      pass: "snapwiz"
    }
  ];

  const attemptByQuestion = {
    1: attemptTypes.RIGHT,
    2: attemptTypes.WRONG,
    3: attemptTypes.RIGHT,
    4: attemptTypes.WRONG,
    5: attemptTypes.RIGHT,
    6: attemptTypes.WRONG,
    7: attemptTypes.WRONG,
    8: attemptTypes.RIGHT
  };
  const attempData = { right: "right", wrong: "wrong" };

  const groups = {
    1: { items: [] },
    2: { items: [] },
    3: { items: [] }
  };

  const itemsToCreate = ["MCQ_TF.7", "MCQ_TF.8", "MCQ_TF.9"];
  const itemIds = [];
  let testID;

  before("Login and create new items", () => {
    cy.login("publisher", contEditor.email, contEditor.pass);
    itemsToCreate.forEach((itemToCreate, index) => {
      item.createItem(itemToCreate, index).then(id => {
        itemIds.push(id);
      });
    });
    cy.wait(1).then(() => {
      groups[1].items[0] = itemIds[0];
      groups[1].deliveryCount = 1;
      groups[1].deliverType = DELIVERY_TYPE.ALL_RANDOM;
      groups[2].items[0] = itemIds[1];
      groups[2].deliveryCount = 1;
      groups[2].deliverType = DELIVERY_TYPE.ALL_RANDOM;
      groups[3].items[0] = itemIds[2];
      groups[3].deliveryCount = 1;
      groups[3].deliverType = DELIVERY_TYPE.ALL_RANDOM;
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
        cy.deleteAllAssignments("", Teacher.email);
      });
      before("create test", () => {
        testLibraryPage.createNewTestAndFillDetails(testData);
        testLibraryPage.testSummary.header.clickOnAddItems();
        testLibraryPage.testAddItem.clickOnGroupItem();
      });
      itemsToCreate.forEach((itemId, index) => {
        it(`>create dynamic group-${index + 1}`, () => {
          groupItemsPage.createDynamicTest(index + 1, filterForAutoselect_1[index]);
          if (!(index === Cypress._.keys(groups).length - 1)) groupItemsPage.clickOnAddGroup();
        });
      });
      it(">publish and get test id", () => {
        cy.server();
        cy.route("POST", "**api/test").as("createTest");
        testLibraryPage.testAddItem.header.clickOnReview();
        cy.wait("@createTest").then(xhr => {
          testLibraryPage.saveTestId(xhr);
          testID = xhr.response.body.result._id;
        });
        testLibraryPage.review.testheader.clickOnPublishButton();
      });
      it(">login as teacher and find test", () => {
        cy.login("teacher", Teacher.email, Teacher.pass);
        testLibraryPage.sidebar.clickOnTestLibrary();
        testLibraryPage.searchFilters.clearAll();
        testLibraryPage.searchFilters.setCollection(testData.collections);
        testLibraryPage.clickOnTestCardById(testID);
        testLibraryPage.clickOnDetailsOfCard();
      });
      it(">verify review", () => {
        // TODO: Need to clarify this
        testLibraryPage.review.verifyItemCoutInPreview(3);
        testLibraryPage.review.getAllquestionInReview().each((questions, index) => {
          testLibraryPage.review.getItemIdIdByIndex(index).then(val => {
            expect(val).to.be.oneOf(itemIds);
          });
        });
      });
      it(">assign test", () => {
        testLibraryPage.review.testheader.clickOnAssign();
        testLibraryPage.assignPage.selectClass("class");
        testLibraryPage.assignPage.clickOnAssign();
      });
      it(">login as student and verify", () => {
        students.forEach((student, index) => {
          cy.login("student", student.email, student.pass);
          // Response Verification
          studentAssignment.clickOnAssigmentByTestId(testID).then(groupArray => {
            deliveredArray[index] = groupItemsPage.getItemDeliverySeq(groupArray, groups);
            // UI Verification
            deliveredArray[index].forEach(item => {
              queNum = itemIds.indexOf(item) + 1;
              studentTestPage.getQuestionText().should("contain", `Q${queNum}${queText}`);
              studentTestPage.attemptQuestion(quesType, attemptByQuestion[queNum], attempData);
              studentTestPage.clickOnNext();
            });
            studentTestPage.submitTest();
          });
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
          groupItemsPage.createDynamicTest(index + 1, filterForAutoselect_2[index]);
          if (!(index === Cypress._.keys(groups).length - 1)) groupItemsPage.clickOnAddGroup();
        });
      });

      it(">publish and get test id", () => {
        cy.server();
        cy.route("POST", "**api/test").as("createTest");
        testLibraryPage.testAddItem.header.clickOnReview();
        cy.wait("@createTest").then(xhr => {
          testLibraryPage.saveTestId(xhr);
          testID = xhr.response.body.result._id;
        });
        testLibraryPage.review.testheader.clickOnPublishButton();
      });
      it(">login as teacher and find test", () => {
        cy.login("teacher", Teacher.email, Teacher.pass);
        testLibraryPage.sidebar.clickOnTestLibrary();
        testLibraryPage.searchFilters.clearAll();
        testLibraryPage.searchFilters.setCollection(testData.collections);
        testLibraryPage.clickOnTestCardById(testID);
        testLibraryPage.clickOnDetailsOfCard();
      });
      it(">verify review", () => {
        // TODO: Need to clarify this
        testLibraryPage.review.verifyItemCoutInPreview(3);
        testLibraryPage.review.getAllquestionInReview().each((questions, index) => {
          testLibraryPage.review.getItemIdIdByIndex(index).then(val => {
            expect(val).to.be.oneOf(itemIds);
          });
        });
      });
      it(">assign test", () => {
        testLibraryPage.review.testheader.clickOnAssign();
        testLibraryPage.assignPage.selectClass("class");
        testLibraryPage.assignPage.clickOnAssign();
      });
      it(">login as student and verify", () => {
        students.forEach((student, index) => {
          cy.login("student", student.email, student.pass);
          // Response Verification
          studentAssignment.clickOnAssigmentByTestId(testID).then(groupArray => {
            deliveredArray[index] = groupItemsPage.getItemDeliverySeq(groupArray, groups);
            // UI Verification
            deliveredArray[index].forEach(item => {
              queNum = itemIds.indexOf(item) + 1;
              studentTestPage.getQuestionText().should("contain", `Q${queNum}${queText}`);
              studentTestPage.attemptQuestion(quesType, attemptByQuestion[queNum], attempData);
              studentTestPage.clickOnNext();
            });
            studentTestPage.submitTest();
          });
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
          groupItemsPage.createDynamicTest(index + 1, filterForAutoselect_3[index]);
          if (!(index === Cypress._.keys(groups).length - 1)) groupItemsPage.clickOnAddGroup();
        });
      });

      it(">publish and get test id", () => {
        cy.server();
        cy.route("POST", "**api/test").as("createTest");
        testLibraryPage.testAddItem.header.clickOnReview();
        cy.wait("@createTest").then(xhr => {
          testLibraryPage.saveTestId(xhr);
          testID = xhr.response.body.result._id;
        });
        testLibraryPage.review.testheader.clickOnPublishButton();
      });
      it(">login as teacher and find test", () => {
        cy.login("teacher", Teacher.email, Teacher.pass);
        testLibraryPage.sidebar.clickOnTestLibrary();
        testLibraryPage.searchFilters.clearAll();
        testLibraryPage.searchFilters.setCollection(testData.collections);
        testLibraryPage.clickOnTestCardById(testID);
        testLibraryPage.clickOnDetailsOfCard();
      });
      it(">verify review", () => {
        // TODO: Need to clarify this
        testLibraryPage.review.verifyItemCoutInPreview(3);
        testLibraryPage.review.getAllquestionInReview().each((questions, index) => {
          testLibraryPage.review.getItemIdIdByIndex(index).then(val => {
            expect(val).to.be.oneOf(itemIds);
          });
        });
      });
      it(">assign test", () => {
        testLibraryPage.review.testheader.clickOnAssign();
        testLibraryPage.assignPage.selectClass("class");
        testLibraryPage.assignPage.clickOnAssign();
      });
      it(">login as student and verify", () => {
        students.forEach((student, index) => {
          cy.login("student", student.email, student.pass);
          // Response Verification
          studentAssignment.clickOnAssigmentByTestId(testID).then(groupArray => {
            deliveredArray[index] = groupItemsPage.getItemDeliverySeq(groupArray, groups);
            // UI Verification
            deliveredArray[index].forEach(item => {
              queNum = itemIds.indexOf(item) + 1;
              studentTestPage.getQuestionText().should("contain", `Q${queNum}${queText}`);
              studentTestPage.attemptQuestion(quesType, attemptByQuestion[queNum], attempData);
              studentTestPage.clickOnNext();
            });
            studentTestPage.submitTest();
          });
        });
      });
      it(">login as teacher verify in LCB", () => {
        cy.login("teacher", Teacher.email, Teacher.pass);
        testLibraryPage.sidebar.clickOnAssignment();
        authorAssignPage.clcikOnPresenatationIconByIndex(0);
        lcb.clickOnStudentsTab();
        // UI Verification
        students.forEach((student, index) => {
          lcb.questionResponsePage.selectStudent(student.name);
          deliveredArray[index].forEach((item, ind) => {
            queNum = itemIds.indexOf(item) + 1;
            lcb.questionResponsePage
              .getQuestionContainer(ind)
              .should("contain", `Q${queNum}${queText}`);
          });
        });

        lcb.getQuestionsTab().should("have.attr", "disabled", `disabled`);
        lcb.header.getExpressGraderTab().should("have.attr", "disabled", `disabled`);

        lcb.header.clickOnStandardBasedReportTab();
        sbr.getTableHeaderElements().should("have.length", 4);
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
          groupItemsPage.createDynamicTest(index + 1, filterForAutoselect_4[index]);
          if (!(index === Cypress._.keys(groups).length - 1)) groupItemsPage.clickOnAddGroup();
        });
      });

      it(">publish and get test id", () => {
        cy.server();
        cy.route("POST", "**api/test").as("createTest");
        testLibraryPage.testAddItem.header.clickOnReview();
        cy.wait("@createTest").then(xhr => {
          testLibraryPage.saveTestId(xhr);
          testID = xhr.response.body.result._id;
        });
        testLibraryPage.review.testheader.clickOnPublishButton();
      });
      it(">login as teacher and find test", () => {
        cy.login("teacher", Teacher.email, Teacher.pass);
        testLibraryPage.sidebar.clickOnTestLibrary();
        testLibraryPage.searchFilters.clearAll();
        testLibraryPage.searchFilters.setCollection(testData.collections);
        testLibraryPage.clickOnTestCardById(testID);
        testLibraryPage.clickOnDetailsOfCard();
      });
      it(">verify review", () => {
        testLibraryPage.review.verifyItemCoutInPreview(3);
        testLibraryPage.review.getAllquestionInReview().each((questions, index) => {
          testLibraryPage.review.getItemIdIdByIndex(index).then(val => {
            expect(val).to.be.oneOf(itemIds);
          });
        });
      });
      it(">assign test", () => {
        testLibraryPage.review.testheader.clickOnAssign();
        testLibraryPage.assignPage.selectClass("class");
        testLibraryPage.assignPage.clickOnAssign();
      });
      it(">login as student and verify", () => {
        students.forEach((student, index) => {
          cy.login("student", student.email, student.pass);
          // Response Verification
          studentAssignment.clickOnAssigmentByTestId(testID).then(groupArray => {
            deliveredArray[index] = groupItemsPage.getItemDeliverySeq(groupArray, groups);
            // UI Verification
            deliveredArray[index].forEach(item => {
              queNum = itemIds.indexOf(item) + 1;
              studentTestPage.getQuestionText().should("contain", `Q${queNum}${queText}`);
              studentTestPage.attemptQuestion(quesType, attemptByQuestion[queNum], attempData);
              studentTestPage.clickOnNext();
            });
            studentTestPage.submitTest();
          });
        });
      });
    });
  });
});
