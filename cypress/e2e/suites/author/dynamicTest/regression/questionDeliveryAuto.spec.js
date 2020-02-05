/* eslint-disable no-shadow */
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";
import GroupItemsPage from "../../../../framework/author/tests/testDetail/groupItemsPage";
import FileHelper from "../../../../framework/util/fileHelper";
import AuthorAssignmentPage from "../../../../framework/author/assignments/AuthorAssignmentPage";
import LiveClassboardPage from "../../../../framework/author/assignments/LiveClassboardPage";
import AssignmentsPage from "../../../../framework/student/assignmentsPage";
import StudentTestPage from "../../../../framework/student/studentTestPage";
import { attemptTypes, deliverType as DELIVERY_TYPE } from "../../../../framework/constants/questionTypes";
import CypressHelper from "../../../../framework/util/cypressHelpers";
import StandardBasedReportPage from "../../../../framework/author/assignments/standardBasedReportPage";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> item groups`, () => {
  const testLibraryPage = new TestLibrary();
  const groupItemsPage = new GroupItemsPage();
  const item = new ItemListPage();
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

  const deliveredArray = [[], []];
  const redirected = [[], []];
  const message = [
    "-Expected to items be delivered same for  both students-",
    "-Expected to items be delivered different for  both students-"
  ];
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
    { name: "Student1", email: "student1.group.question.delivery@snapwiz.com", pass: "snapwiz" },
    { name: "Student2", email: "student2.group.question.delivery@snapwiz.com", pass: "snapwiz" }
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

  let groups = {};

  const items = ["MCQ_TF.5", "MCQ_TF.5", "MCQ_TF.5", "MCQ_TF.5", "MCQ_TF.6", "MCQ_TF.6", "MCQ_TF.6", "MCQ_TF.6"];
  const itemIds = [];
  let testID;

  before("Login and create new items", () => {
    cy.login("publisher", contEditor.email, contEditor.pass);
    items.forEach((itemToCreate, index) => {
      item.createItem(itemToCreate, index).then(id => {
        itemIds.push(id);
      });
    });
  });

  context(">autoselect", () => {
    context(">deliver by count", () => {
      before("login", () => {
        groups = { 1: {}, 2: {} };
        groups[1].items = itemIds.slice(0, 4);
        groups[1].deliveryCount = filterForAutoselect1.deliveryCount;
        groups[1].deliverType = DELIVERY_TYPE.ALL_RANDOM;
        groups[2].items = itemIds.slice(4);
        groups[2].deliveryCount = filterForAutoselect2.deliveryCount;
        groups[2].deliverType = DELIVERY_TYPE.ALL_RANDOM;
        cy.deleteAllAssignments("", Teacher.email);
        cy.login("publisher", contEditor.email, contEditor.pass);
      });
      before("create test", () => {
        testLibraryPage.createNewTestAndFillDetails(testData);
      });
      it(">create dynamic group-1", () => {
        testLibraryPage.testSummary.header.clickOnAddItems();
        testLibraryPage.testAddItem.clickOnGroupItem();
        groupItemsPage.createDynamicTest(1, filterForAutoselect1);
      });
      it(">create dynamic group-2", () => {
        groupItemsPage.clickOnAddGroup();
        groupItemsPage.createDynamicTest(2, filterForAutoselect2);
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
        // TODO: Add count by group verification
        // TODO: Need to clarify this
        testLibraryPage.review.verifyItemCoutInPreview(5);
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
        cy.wait(1).then(() => CypressHelper.checkObjectInEquality(deliveredArray[0], deliveredArray[1], message[1]));
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
            lcb.questionResponsePage.getQuestionContainer(ind).should("contain", `Q${queNum}${queText}`);
          });
        });

        lcb.getQuestionsTab().should("have.attr", "disabled", `disabled`);
        lcb.header.getExpressGraderTab().should("have.attr", "disabled", `disabled`);

        lcb.header.clickOnStandardBasedReportTab();
        sbr.getTableHeaderElements().should("have.length", 4);
      });
      context(">redirect", () => {
        it(">redirect the test", () => {
          sbr.header.clickOnLCBTab();
          lcb.clickOnCardViewTab();
          lcb.checkSelectAllCheckboxOfStudent();
          lcb.clickOnRedirect();
          lcb.clickOnRedirectSubmit();
        });
        it(">login as student and verify", () => {
          students.forEach((student, index) => {
            if (index === 0) {
              cy.login("student", student.email, student.pass);
              // Response Verification
              studentAssignment.clickOnAssigmentByTestId(testID).then(groupArray => {
                redirected[index] = groupItemsPage.getItemDeliverySeq(groupArray, groups);
                // UI Verification
                redirected[index].forEach(item => {
                  queNum = itemIds.indexOf(item) + 1;
                  studentTestPage.getQuestionText().should("contain", `Q${queNum}${queText}`);
                  studentTestPage.attemptQuestion(quesType, attemptByQuestion[queNum], attempData);
                  studentTestPage.clickOnNext();
                });
                studentTestPage.submitTest();
              });
            }
          });
          cy.wait(1).then(() => {
            CypressHelper.checkObjectEquality(redirected[0], deliveredArray[0], students[0].name);
            //  CypressHelper.checkObjectEquality(redirected[1], deliveredArray[1], students[1].name);
          });
        });
        it(">login as teacher verify in LCB", () => {
          cy.login("teacher", Teacher.email, Teacher.pass);
          testLibraryPage.sidebar.clickOnAssignment();
          authorAssignPage.clcikOnPresenatationIconByIndex(0);
          lcb.clickOnStudentsTab();
          // UI Verification
          students.forEach((student, index) => {
            if (index === 0) {
              lcb.questionResponsePage.selectStudent(student.name);
              for (let i = 1; i <= 2; i++) {
                lcb.questionResponsePage.selectAttempt(i);
                // eslint-disable-next-line no-loop-func
                deliveredArray[index].forEach((item, ind) => {
                  queNum = itemIds.indexOf(item) + 1;
                  lcb.questionResponsePage.getQuestionContainer(ind).should("contain", `Q${queNum}${queText}`);
                });
              }
            }
          });
          lcb.getQuestionsTab().should("have.attr", "disabled", `disabled`);
          lcb.header.getExpressGraderTab().should("have.attr", "disabled", `disabled`);

          lcb.header.clickOnStandardBasedReportTab();
          sbr.getTableHeaderElements().should("have.length", 4);
        });
      });
    });
    context(">auto select + static", () => {
      before("login", () => {
        groups = { 1: {}, 2: {} };
        groups[1].items = itemIds.slice(0, 4);
        groups[1].deliveryCount = groups[1].items.length;
        groups[1].deliverType = DELIVERY_TYPE.ALL;
        groups[2].items = itemIds.slice(4);
        groups[2].deliveryCount = filterForAutoselect2.deliveryCount;
        groups[2].deliverType = DELIVERY_TYPE.ALL_RANDOM;
        cy.deleteAllAssignments("", Teacher.email);
        cy.login("publisher", contEditor.email, contEditor.pass);
      });
      before("create test", () => {
        testLibraryPage.createNewTestAndFillDetails(testData);
      });
      it(">create static group", () => {
        groupItemsPage.addItemsToGroup(groups[1].items).then(id => {
          testID = id;
        });
        testLibraryPage.testAddItem.clickOnGroupItem();
        groupItemsPage.clickOnEditByGroup(1);
        groupItemsPage.checkDeliverAllItemForGroup(1);
        groupItemsPage.clickOnSaveByGroup(1);
      });
      it(">create dynamic group", () => {
        groupItemsPage.clickOnAddGroup();
        groupItemsPage.createDynamicTest(2, filterForAutoselect2);
        testLibraryPage.testAddItem.header.clickOnReview();
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
        // TODO: Add count by group verification
        // TODO: Need to clarify this as no of appearing on review is inconsistent
        testLibraryPage.review.verifyItemCoutInPreview(4);
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
        cy.wait(1).then(() => {
          CypressHelper.checkObjectInEquality(deliveredArray[0], deliveredArray[1], message[1]);
          CypressHelper.checkObjectEquality(
            deliveredArray[0].slice(0, groups[1].items.length + 1),
            deliveredArray[1].slice(0, groups[1].items.length + 1),
            message[0]
          );
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
            lcb.questionResponsePage.getQuestionContainer(ind).should("contain", `Q${queNum}${queText}`);
          });
        });

        lcb.getQuestionsTab().should("have.attr", "disabled", `disabled`);
        lcb.header.getExpressGraderTab().should("have.attr", "disabled", `disabled`);

        lcb.header.clickOnStandardBasedReportTab();
        sbr.getTableHeaderElements().should("have.length", 4);
      });
    });
  });
});
