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
import CypressHelper from "../../../../framework/util/cypressHelpers";
import StandardBasedReportPage from "../../../../framework/author/assignments/standardBasedReportPage";

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
  const sbr = new StandardBasedReportPage();

  const testData = {
    name: "Test Item Group",
    grade: "Kindergarten",
    subject: "Math",
    collections: "auto collection 1"
  };
  const quesType = "MCQ_TF";

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

  const items = ["MCQ_TF.3", "MCQ_TF.3", "MCQ_TF.3", "MCQ_TF.4", "MCQ_TF.4", "MCQ_TF.4"];

  let testID;
  let deliveredIdsAtStudentSide = [[], []];
  let deliveredIdsAtLCB = [[], []];
  let deliveredItemIndex = [[], []];
  let itemIds = [];
  let marks = {
    student1: {
      total: 0,
      achieved: 0
    },
    student2: {
      total: 0,
      achieved: 0
    }
  };
  const GROUPS = {
    GROUP1: [],
    GROUP2: []
  };
  let group;

  before("Login and create new items", () => {
    cy.login("publisher", contEditor.email, contEditor.pass);
    items.forEach((itemToCreate, index) => {
      item.createItem(itemToCreate, index).then(id => {
        itemIds.push(id);
        if (index < 3) group = "GROUP1";
        else group = "GROUP2";
        GROUPS[group].push(id);
      });
    });
  });

  context(">static", () => {
    context(">deliver all", () => {
      before("create test", () => {
        cy.deleteAllAssignments("", Teacher.email);
        testLibraryPage.createNewTestAndFillDetails(testData);
      });
      it(">create static group-'deliver all'", () => {
        groupItemsPage.addItemsToGroup(itemIds).then(id => {
          testID = id;
        });
        addItemTab.header.clickOnReview();
        testReviewTab.testheader.clickOnPublishButton();
      });
      it(">login as teacher find test", () => {
        cy.login("teacher", Teacher.email, Teacher.pass);
        testLibraryPage.sidebar.clickOnTestLibrary();
        testLibraryPage.searchFilters.clearAll();
        testLibraryPage.searchFilters.setCollection(testData.collections);
        testLibraryPage.clickOnTestCardById(testID);
        testLibraryPage.clickOnDetailsOfCard();
      });
      it(">verify review and assign", () => {
        // TODO: Add count by group verification
        testReviewTab.verifyItemCoutInPreview(itemIds.length);
        testReviewTab.getAllquestionInReview().each((questions, index) => {
          testReviewTab.getItemIdIdByIndex(index).then(val => {
            expect(val).to.be.oneOf(itemIds);
          });
        });
        testReviewTab.testheader.clickOnAssign();
        assignPage.selectClass("class");
        assignPage.clickOnAssign();
      });
      it(">login as student and verify", () => {
        students.forEach((student, index) => {
          cy.login("student", student.email, student.pass);
          // Response Verification
          studentAssignment.clickOnAssigmentByTestId(testID).then(groupArray => {
            expect(groupArray[0].deliveryType, `Expected delivery type for Group -1 is ${deliverType.ALL}`).to.be.eq(
              deliverType.ALL
            );
            groupArray[0].items.forEach(itemObj => {
              deliveredIdsAtStudentSide[index].push(itemObj._id);
            });
            expect(
              deliveredIdsAtStudentSide[index],
              `Expected all items-[${itemIds}] to be delivered but-[${deliveredIdsAtStudentSide[index]}] are delivered`
            ).to.deep.eq(itemIds);
          });
          // UI Verification
          itemIds.forEach((item, ind) => {
            studentTestPage.getQuestionText().should("contain", `Q${ind + 1} - This is MCQ_TF`);
            marks[`student${index + 1}`].total += 2;
            if (attemptByQuestion[item + 1] === attemptTypes.RIGHT) marks[`student${ind + 1}`].achieved += 2;
            studentTestPage.attemptQuestion(quesType, attemptByQuestion[ind + 1], attempData);
            studentTestPage.clickOnNext();
          });
          studentTestPage.submitTest();
        });
      });
      it(">login as teacher verify in LCB", () => {
        deliveredIdsAtLCB = [[], []];
        cy.login("teacher", Teacher.email, Teacher.pass);
        testLibraryPage.sidebar.clickOnAssignment();
        authorAssignPage.clcikOnPresenatationIconByIndex(0);

        // Response verification
        lcb.clickonQuestionsTab().then(item => {
          // deliveredIdsAtLCB[0].push(item);
          lcb.questionResponsePage.getDropDown().click({ force: true });
          CypressHelper.getDropDownList().then(questions => {
            expect(questions, `Expected no of questions is ${itemIds.length}`).to.have.lengthOf(itemIds.length);
          });
          // for (let i = 1; i < itemIds.length; i++) {
          //   lcb.questionResponsePage.selectQuestion(`Q${i + 1}`).then(id => deliveredIdsAtLCB[0].push(id));
          // }
        });
        // cy.wait(1).then(() => expect(deliveredIdsAtLCB[0]).to.deep.eq(itemIds));

        // UI Verification
        lcb.clickOnStudentsTab();
        students.forEach((student, index) => {
          lcb.questionResponsePage.selectStudent(student.name);
          itemIds.forEach((val, queNo) => {
            lcb.questionResponsePage.getQuestionContainer(queNo).should("contain", `Q${queNo + 1} - This is MCQ_TF`);
          });
        });
      });
    });
    context(">deliver by count", () => {
      before("login", () => {
        cy.deleteAllAssignments("", Teacher.email);
        cy.login("publisher", contEditor.email, contEditor.pass);
      });
      before("create test", () => {
        testLibraryPage.createNewTestAndFillDetails(testData);
      });
      it(">create static group", () => {
        groupItemsPage.addItemsToGroup(itemIds).then(id => {
          testID = id;
        });
        addItemTab.clickOnGroupItem();
        groupItemsPage.clickOnEditByGroup(1);
        groupItemsPage.checkDeliverCountForGroup(1);
        groupItemsPage.setItemCountForDeliveryByGroup(1, 3);
        groupItemsPage.clickOnSaveByGroup(1);
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
      it(">verify review and assign test", () => {
        // TODO: Add count by group verification
        testReviewTab.verifyItemCoutInPreview(itemIds.length);
        testReviewTab.getAllquestionInReview().each((questions, index) => {
          testReviewTab.getItemIdIdByIndex(index).then(val => {
            expect(val).to.be.oneOf(itemIds);
          });
        });
        testReviewTab.testheader.clickOnAssign();
        assignPage.selectClass("class");
        assignPage.clickOnAssign();
      });
      it(">login as student and verify", () => {
        deliveredIdsAtStudentSide = [[], []];
        students.forEach((student, index) => {
          cy.login("student", student.email, student.pass);
          studentAssignment.clickOnAssigmentByTestId(testID).then(groupArray => {
            // Response verification
            deliveredItemIndex[index] = [];
            expect(
              groupArray[0].deliveryType,
              `Expected delivery type for Group -1 is ${deliverType.LIMITED_RANDOM}`
            ).to.be.eq(deliverType.LIMITED_RANDOM);
            groupArray[0].items.forEach(itemObj => {
              deliveredIdsAtStudentSide[index].push(itemObj._id);
              expect(itemObj._id).to.be.oneOf(itemIds);
              deliveredItemIndex[index].push(itemIds.indexOf(itemObj._id));
            });
            expect(deliveredIdsAtStudentSide[index].length, `Expected item delivery count is 3`).to.eq(3);
            // UI verification
            deliveredItemIndex[index].forEach(item => {
              studentTestPage.getQuestionText().should("contain", `Q${item + 1} - This is MCQ_TF`);
              marks[`student${index + 1}`].total += 2;
              if (attemptByQuestion[item + 1] === attemptTypes.RIGHT) marks[`student${index + 1}`].achieved += 2;
              studentTestPage.attemptQuestion(quesType, attemptByQuestion[item + 1], attempData);
              studentTestPage.clickOnNext();
            });
            studentTestPage.submitTest();
          });
        });
        cy.wait(1).then(() =>
          expect(
            deliveredIdsAtStudentSide[0],
            `Expected items delivered at student-1-${
              deliveredIdsAtStudentSide[0]
            } not to be same as items delivered at student-2-${deliveredIdsAtStudentSide[1]}`
          ).not.to.deep.eq(deliveredIdsAtStudentSide[1])
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
          deliveredItemIndex[index].forEach((queNo, ind) => {
            lcb.questionResponsePage.getQuestionContainer(ind).should("contain", `Q${queNo + 1} - This is MCQ_TF`);
          });
        });
        lcb.getQuestionsTab().should("have.attr", "disabled", `disabled`);
        lcb.header.getExpressGraderTab().should("have.attr", "disabled", `disabled`);
        lcb.header.clickOnStandardBasedReportTab();
      });
    });
    context(">deliver all + deliver by count", () => {
      before("login", () => {
        cy.deleteAllAssignments("", Teacher.email);
        cy.login("publisher", contEditor.email, contEditor.pass);
      });
      before("create test", () => {
        testLibraryPage.createNewTestAndFillDetails(testData);
      });
      it(">create static two groups", () => {
        groupItemsPage.addItemsToGroup(GROUPS.GROUP1).then(id => {
          testID = id;
        });

        addItemTab.clickOnGroupItem();
        // Setting to deliver all
        groupItemsPage.clickOnAddGroup();
        groupItemsPage.clickOnEditByGroup(1);
        groupItemsPage.checkDeliverAllItemForGroup(1);
        groupItemsPage.clickOnSaveByGroup(1);

        groupItemsPage.addItemsToGroup(GROUPS.GROUP2, false, 2);
        addItemTab.clickOnGroupItem();
        // Setting to deliver 2 count
        groupItemsPage.clickOnEditByGroup(2);
        groupItemsPage.checkDeliverCountForGroup(2);
        groupItemsPage.setItemCountForDeliveryByGroup(2, 2);
        groupItemsPage.clickOnSaveByGroup(2);

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
      it(">verify review and assign test", () => {
        // TODO: Add count by group verification
        testReviewTab.verifyItemCoutInPreview(itemIds.length);
        testReviewTab.getAllquestionInReview().each((questions, index) => {
          testReviewTab.getItemIdIdByIndex(index).then(val => {
            expect(val).to.be.oneOf(itemIds);
          });
        });
        testReviewTab.testheader.clickOnAssign();
        assignPage.selectClass("class");
        assignPage.clickOnAssign();
      });
      it(">login as student and verify", () => {
        deliveredIdsAtStudentSide = [[], []];
        students.forEach((student, index) => {
          cy.login("student", student.email, student.pass);
          studentAssignment.clickOnAssigmentByTestId(testID).then(groupArray => {
            // Response verification
            groupArray.forEach((gArray, ind) => {
              if (ind === 0)
                expect(
                  gArray.deliveryType,
                  `Expected Delivery Type For Gruop-${ind + 1} to be "${deliverType.ALL}"`
                ).to.be.eq(deliverType.ALL);
              // Group-1 - All
              else
                expect(
                  gArray.deliveryType,
                  `Expected Delivery Type For Gruop-${ind + 1} to be "${deliverType.LIMITED_RANDOM}"`
                ).to.be.eq(deliverType.LIMITED_RANDOM); // Group 2- Count
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
              `Expected delivery count is 5`
            ).to.eq(5);
            // UI verification
            [
              ...deliveredItemsByGroupByIndex[`Student${index + 1}`].index1,
              ...deliveredItemsByGroupByIndex[`Student${index + 1}`].index2
            ].forEach(item => {
              studentTestPage.getQuestionText().should("contain", `Q${item + 1}`);
              studentTestPage.attemptQuestion(quesType, attemptByQuestion[item + 1], attempData);
              studentTestPage.clickOnNext();
            });
            studentTestPage.submitTest();
          });
        });
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
            lcb.questionResponsePage.getQuestionContainer(ind).should("contain", `Q${queNo + 1} - This is MCQ_TF`);
          });
        });
        lcb.getQuestionsTab().should("have.attr", "disabled", `disabled`);
        lcb.header.getExpressGraderTab().should("have.attr", "disabled", `disabled`);
      });
    });
  });
});
