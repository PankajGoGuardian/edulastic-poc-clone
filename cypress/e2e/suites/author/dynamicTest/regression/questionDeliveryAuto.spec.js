/* eslint-disable no-shadow */
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import TestReviewTab from "../../../../framework/author/tests/testDetail/testReviewTab";
import TestAddItemTab from "../../../../framework/author/tests/testDetail/testAddItemTab";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";
import GroupItemsPage from "../../../../framework/author/tests/testDetail/groupItemsPage";
import FileHelper from "../../../../framework/util/fileHelper";
import TestAssignPage from "../../../../framework/author/tests/testDetail/testAssignPage";
import AuthorAssignmentPage from "../../../../framework/author/assignments/AuthorAssignmentPage";
import LiveClassboardPage from "../../../../framework/author/assignments/LiveClassboardPage";
import AssignmentsPage from "../../../../framework/student/assignmentsPage";
import StudentTestPage from "../../../../framework/student/studentTestPage";
import { attemptTypes, deliverType } from "../../../../framework/constants/questionTypes";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> item groups`, () => {
  const testLibraryPage = new TestLibrary();
  const addItemTab = new TestAddItemTab();
  const groupItemsPage = new GroupItemsPage();
  const testReviewTab = new TestReviewTab();
  const item = new ItemListPage();
  const assignPage = new TestAssignPage();
  const authorAssignPage = new AuthorAssignmentPage();
  const lcb = new LiveClassboardPage();
  const studentAssignment = new AssignmentsPage();
  const studentTestPage = new StudentTestPage();

  const testData = {
    name: "Test Item Group",
    grade: "Kindergarten",
    subject: "Math",
    collections: "auto collection 1"
  };

  const filterForAutoselect1 = {
    standard: {
      subject: "Mathematics",
      standardSet: "Math - Common Core",
      grade: ["Kindergarten"],
      standardsToSelect: ["K.CC.A.1"]
    },
    collection: "auto collection 1",
    deliveryCount: 2
  };
  const filterForAutoselect2 = {
    standard: {
      subject: "Mathematics",
      standardSet: "Math - Common Core",
      grade: ["Kindergarten"],
      standardsToSelect: ["K.CC.A.2"]
    },
    collection: "auto collection 1",
    deliveryCount: 3
  };

  const quesType = "MCQ_TF";

  let testID = "5e30a00611bc880008342989";

  let deliveredItemsByGroupByIndex = {
    Student1: {
      group1: [],
      group2: [],
      index1: [],
      index2: []
    },
    Student2: {
      group1: [],
      group2: [],
      index1: [],
      index2: []
    }
  };

  const contEditor = {
    email: "content.editor.1@snapwiz.com",
    pass: "snapwiz"
  };

  const Teacher = {
    email: "teacher2.for.dynamic.test@snapwiz.com",
    pass: "snapwiz"
  };
  const students = [
    { name: "Student1", email: "student1.group.question.delivery@snapwiz.com", pass: "snapwiz" },
    { name: "Student2", email: "student2.group.question.delivery@snapwiz.com", pass: "snapwiz" }
  ];

  const questionText = " - This is MCQ_TF";

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
  const GROUPS = {
    GROUP1: [],
    GROUP2: []
  };
  const items = ["MCQ_TF.5", "MCQ_TF.5", "MCQ_TF.5", "MCQ_TF.5", "MCQ_TF.6", "MCQ_TF.6", "MCQ_TF.6", "MCQ_TF.6"];
  let itemIds = [];
  let group;
  before("Login and create new items", () => {
    cy.login("publisher", contEditor.email, contEditor.pass);
    items.forEach((itemToCreate, index) => {
      item.createItem(itemToCreate, index).then(id => {
        itemIds.push(id);
        if (index < 4) group = "GROUP1";
        else group = "GROUP2";
        GROUPS[group].push(id);
      });
    });
  });

  context(">autoselect", () => {
    context(">deliver by count", () => {
      before("login", () => {
        cy.deleteAllAssignments("", Teacher.email);
        cy.login("publisher", contEditor.email, contEditor.pass);
      });
      before("create test", () => {
        testLibraryPage.createNewTestAndFillDetails(testData);
      });
      it(">create dynamic group-1", () => {
        testLibraryPage.testSummary.header.clickOnAddItems();
        addItemTab.clickOnGroupItem();
        groupItemsPage.createDynamicTest(1, filterForAutoselect1);
      });
      it(">create dynamic group-2", () => {
        groupItemsPage.clickOnAddGroup();
        groupItemsPage.createDynamicTest(2, filterForAutoselect2);
        cy.server();
        cy.route("POST", "**api/test").as("createTest");
        addItemTab.header.clickOnReview();
        cy.wait("@createTest").then(xhr => {
          testLibraryPage.saveTestId(xhr);
          testID = xhr.response.body.result._id;
        });
        testReviewTab.testheader.clickOnPublishButton();
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
        // TODO: Add count by group verification
        // TODO: Need to clarify this
        testReviewTab.verifyItemCoutInPreview(5);
        testReviewTab.getAllquestionInReview().each((questions, index) => {
          testReviewTab.getItemIdIdByIndex(index).then(val => {
            expect(val).to.be.oneOf(itemIds);
          });
        });
      });
      it(">assign test", () => {
        testReviewTab.testheader.clickOnAssign();
        assignPage.selectClass("class");
        assignPage.clickOnAssign();
      });
      it(">login as student and verify", () => {
        students.forEach((student, index) => {
          cy.login("student", student.email, student.pass);
          studentAssignment.clickOnAssigmentByTestId(testID).then(groupArray => {
            // Response verification
            groupArray.forEach((gArray, ind) => {
              expect(
                gArray.deliveryType,
                `Expected Delivery Type For Gruop-${ind + 1} to be${deliverType.ALL_RANDOM}`
              ).to.be.eq(deliverType.ALL_RANDOM);
              gArray.items.forEach(itemObj => {
                deliveredItemsByGroupByIndex[`Student${index + 1}`][`group${ind + 1}`].push(itemObj._id);
                expect(
                  itemObj._id,
                  `Expected item-${itemObj._id} should be part of group-${ind + 1}-[${
                    GROUPS[`GROUP${ind + 1}`]
                  }] for Student${index + 1}`
                ).to.be.oneOf(GROUPS[`GROUP${ind + 1}`]);
                deliveredItemsByGroupByIndex[`Student${index + 1}`][`index${ind + 1}`].push(
                  itemIds.indexOf(itemObj._id)
                );
              });
            });
            expect(
              [
                ...deliveredItemsByGroupByIndex[`Student${index + 1}`].group1,
                ...deliveredItemsByGroupByIndex[`Student${index + 1}`].group2
              ].length,
              `Expected delivery count-${
                [
                  ...deliveredItemsByGroupByIndex[`Student${index + 1}`].group1,
                  ...deliveredItemsByGroupByIndex[`Student${index + 1}`].group2
                ].length
              } to be 4`
            ).to.eq(filterForAutoselect1.deliveryCount + filterForAutoselect2.deliveryCount);
            // UI verification
            [
              ...deliveredItemsByGroupByIndex[`Student${index + 1}`].index1,
              ...deliveredItemsByGroupByIndex[`Student${index + 1}`].index2
            ].forEach(item => {
              studentTestPage.getQuestionText().should("contain", `Q${item + 1}${questionText}`);
              studentTestPage.attemptQuestion(quesType, attemptByQuestion[item + 1], attempData);
              studentTestPage.clickOnNext();
            });
            studentTestPage.submitTest();
          });
        });
        // TODO: Clarify below whether to be equal or not
        cy.wait(1).then(() =>
          assert.notDeepEqual(
            [...deliveredItemsByGroupByIndex.Student1.group1, ...deliveredItemsByGroupByIndex.Student1.group2],
            [...deliveredItemsByGroupByIndex.Student2.group1, ...deliveredItemsByGroupByIndex.Student2.group2],
            `Expected items delivered to Student1-[
            ${[
              ...deliveredItemsByGroupByIndex.Student1.group1,
              ...deliveredItemsByGroupByIndex.Student1.group2
            ]}] not be Same as Items delivered to Student2-[
            ${[...deliveredItemsByGroupByIndex.Student2.group1, ...deliveredItemsByGroupByIndex.Student2.group2]}]`
          )
        );
      });
      it(">login as teacher verify in LCB", () => {
        cy.login("teacher", Teacher.email, Teacher.pass);
        testLibraryPage.sidebar.clickOnAssignment();
        authorAssignPage.clcikOnPresenatationIconByIndex(0);
        lcb.clickOnStudentsTab();
        // UI Verification
        students.forEach((student, index) => {
          lcb.questionResponsePage.selectStudent(student.name);
          [
            ...deliveredItemsByGroupByIndex[`Student${index + 1}`].index1,
            ...deliveredItemsByGroupByIndex[`Student${index + 1}`].index2
          ].forEach((queNo, ind) => {
            lcb.questionResponsePage.getQuestionContainer(ind).should("contain", `Q${queNo + 1}${questionText}`);
          });
        });
        lcb.getQuestionsTab().should("have.attr", "disabled", `disabled`);
        lcb.header.getExpressGraderTab().should("have.attr", "disabled", `disabled`);
      });
    });
    context(">auto select + static", () => {
      before("login", () => {
        deliveredItemsByGroupByIndex = {
          Student1: {
            group1: [],
            group2: [],
            index1: [],
            index2: []
          },
          Student2: {
            group1: [],
            group2: [],
            index1: [],
            index2: []
          }
        };
        cy.deleteAllAssignments("", Teacher.email);
        cy.login("publisher", contEditor.email, contEditor.pass);
      });
      before("create test", () => {
        testLibraryPage.createNewTestAndFillDetails(testData);
      });
      it(">create static group", () => {
        groupItemsPage.addItemsToGroup(GROUPS.GROUP1).then(id => {
          testID = id;
        });
        addItemTab.clickOnGroupItem();
        groupItemsPage.clickOnEditByGroup(1);
        groupItemsPage.checkDeliverAllItemForGroup(1);
        groupItemsPage.clickOnSaveByGroup(1);
      });
      it(">create dynamic group", () => {
        groupItemsPage.clickOnAddGroup();
        groupItemsPage.createDynamicTest(2, filterForAutoselect2);
        addItemTab.header.clickOnReview();
        testReviewTab.testheader.clickOnPublishButton();
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
        // TODO: Add count by group verification
        // TODO: Need to clarify this as no of appearing on review is in consistent
        testReviewTab.verifyItemCoutInPreview(4);
        testReviewTab.getAllquestionInReview().each((questions, index) => {
          testReviewTab.getItemIdIdByIndex(index).then(val => {
            expect(val).to.be.oneOf(itemIds);
          });
        });
      });
      it(">assign test", () => {
        testReviewTab.testheader.clickOnAssign();
        assignPage.selectClass("class");
        assignPage.clickOnAssign();
      });
      it(">login as student and verify", () => {
        students.forEach((student, index) => {
          cy.login("student", student.email, student.pass);
          studentAssignment.clickOnAssigmentByTestId(testID).then(groupArray => {
            // Response verification
            groupArray.forEach((gArray, ind) => {
              if (ind === 0)
                expect(
                  gArray.deliveryType,
                  `Expected Delivery Type For Gruop-${ind + 1} to be${deliverType.ALL}`
                ).to.be.eq(deliverType.ALL);
              else
                expect(
                  gArray.deliveryType,
                  `Expected Delivery Type For Gruop-${ind + 1} to be${deliverType.ALL_RANDOM}`
                ).to.be.eq(deliverType.ALL_RANDOM);
              gArray.items.forEach(itemObj => {
                deliveredItemsByGroupByIndex[`Student${index + 1}`][`group${ind + 1}`].push(itemObj._id);
                expect(
                  itemObj._id,
                  `Expected item-${itemObj._id} should be part of group-${ind + 1}-[${
                    GROUPS[`GROUP${ind + 1}`]
                  }] for Student${index + 1}`
                ).to.be.oneOf(GROUPS[`GROUP${ind + 1}`]);
                deliveredItemsByGroupByIndex[`Student${index + 1}`][`index${ind + 1}`].push(
                  itemIds.indexOf(itemObj._id)
                );
              });
            });
            expect(
              [
                ...deliveredItemsByGroupByIndex[`Student${index + 1}`].group1,
                ...deliveredItemsByGroupByIndex[`Student${index + 1}`].group2
              ].length,
              `Expected delivery count-${
                [
                  ...deliveredItemsByGroupByIndex[`Student${index + 1}`].group1,
                  ...deliveredItemsByGroupByIndex[`Student${index + 1}`].group2
                ].length
              } to be ${GROUPS.GROUP1.length + filterForAutoselect2.deliveryCount}`
            ).to.eq(GROUPS.GROUP1.length + filterForAutoselect2.deliveryCount);
            // UI verification
            [
              ...deliveredItemsByGroupByIndex[`Student${index + 1}`].index1,
              ...deliveredItemsByGroupByIndex[`Student${index + 1}`].index2
            ].forEach(item => {
              studentTestPage.getQuestionText().should("contain", `Q${item + 1}${questionText}`);
              studentTestPage.attemptQuestion(quesType, attemptByQuestion[item + 1], attempData);
              studentTestPage.clickOnNext();
            });
            studentTestPage.submitTest();
          });
        });
        // TODO: Clarify below whether to be equal or not
        cy.wait(1).then(() =>
          assert.notDeepEqual(
            [...deliveredItemsByGroupByIndex.Student1.group1, ...deliveredItemsByGroupByIndex.Student1.group2],
            [...deliveredItemsByGroupByIndex.Student2.group1, ...deliveredItemsByGroupByIndex.Student2.group2],
            `Expected items delivered to Student1-[
            ${[
              ...deliveredItemsByGroupByIndex.Student1.group1,
              ...deliveredItemsByGroupByIndex.Student1.group2
            ]}] not be Same as Items delivered to Student2-[
            ${[...deliveredItemsByGroupByIndex.Student2.group1, ...deliveredItemsByGroupByIndex.Student2.group2]}]`
          )
        );
      });
      it(">login as teacher verify in LCB", () => {
        cy.login("teacher", Teacher.email, Teacher.pass);
        testLibraryPage.sidebar.clickOnAssignment();
        authorAssignPage.clcikOnPresenatationIconByIndex(0);
        lcb.clickOnStudentsTab();
        // UI Verification
        students.forEach((student, index) => {
          lcb.questionResponsePage.selectStudent(student.name);
          [
            ...deliveredItemsByGroupByIndex[`Student${index + 1}`].index1,
            ...deliveredItemsByGroupByIndex[`Student${index + 1}`].index2
          ].forEach((queNo, ind) => {
            lcb.questionResponsePage.getQuestionContainer(ind).should("contain", `Q${queNo + 1}${questionText}`);
          });
        });
        lcb.getQuestionsTab().should("have.attr", "disabled", `disabled`);
        lcb.header.getExpressGraderTab().should("have.attr", "disabled", `disabled`);
      });
    });
  });
});
