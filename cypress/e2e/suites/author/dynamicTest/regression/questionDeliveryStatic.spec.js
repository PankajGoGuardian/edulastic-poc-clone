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
import TestSettings from "../../../../framework/author/tests/testDetail/testSettingsPage";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> item groups`, () => {
  const testLibraryPage = new TestLibrary();
  const groupItemsPage = new GroupItemsPage();
  const authorAssignPage = new AuthorAssignmentPage();
  const lcb = new LiveClassboardPage();
  const studentAssignment = new AssignmentsPage();
  const studentTestPage = new StudentTestPage();
  const item = new ItemListPage();
  const sbr = new StandardBasedReportPage();
  const testSetting = new TestSettings();

  const testData = {
    name: "Test Item Group",
    grade: "Kindergarten",
    subject: "Math",
    collections: "auto collection 1"
  };
  const quesType = "MCQ_TF";
  const quesText = " - This is MCQ_TF";
  const items = ["MCQ_TF.3", "MCQ_TF.3", "MCQ_TF.3", "MCQ_TF.3", "MCQ_TF.4", "MCQ_TF.4", "MCQ_TF.4", "MCQ_TF.4"];
  let queNum;
  const attempData = { right: "right", wrong: "wrong" };
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
    },
    {
      name: "Student2",
      email: "student2.group.question.delivery@snapwiz.com",
      pass: "snapwiz"
    }
  ];

  const deliveredArray = [[], []];
  const redirected = [[], []];
  let testID;
  const itemIds = [];
  const message = [
    "-Expected items to be delivered in same order for  both students-",
    "-Expected items to be delivered in different order for  both students-"
  ];
  let groups = {};

  before("> login and create new items", () => {
    cy.getAllTestsAndDelete(contEditor.email);
    cy.getAllItemsAndDelete(contEditor.email);
    cy.login("publisher", contEditor.email, contEditor.pass);
    items.forEach((itemToCreate, index) => {
      item.createItem(itemToCreate, index).then(id => {
        itemIds.push(id);
      });
    });
  });

  context("> dynamic tests having,", () => {
    context("> one static group with delivering all items", () => {
      before("> login as CE", () => {
        testID = undefined;
        groups = { 1: {} };
        groups[1].items = itemIds;
        groups[1].deliveryCount = itemIds.length;
        groups[1].deliverType = DELIVERY_TYPE.ALL;
        cy.login("publisher", contEditor.email, contEditor.pass);
        cy.deleteAllAssignments("", Teacher.email);
      });
      before("> create test fill details and associate collection", () => {
        testLibraryPage.createNewTestAndFillDetails(testData);
      });
      it("> create test having one static group with 'deliver all'", () => {
        groupItemsPage.addItemsToGroup(groups[1].items).then(id => {
          testID = id;
        });
        testLibraryPage.testAddItem.header.clickOnReview();
        testLibraryPage.review.testheader.clickOnPublishButton();
      });
      it(`> login as teacher find test using ${testData.collections}`, () => {
        cy.login("teacher", Teacher.email, Teacher.pass);
        testLibraryPage.sidebar.clickOnTestLibrary();
        testLibraryPage.searchFilters.clearAll();
        testLibraryPage.searchFilters.setCollection(testData.collections);
        testLibraryPage.clickOnTestCardById(testID);
        testLibraryPage.clickOnDetailsOfCard();
      });
      it("> verify test review at teacher side", () => {
        testLibraryPage.review.verifyItemCoutInPreview(itemIds.length);
        testLibraryPage.review.getAllquestionInReview().each((questions, index) => {
          testLibraryPage.review.getItemIdIdByIndex(index).then(val => {
            expect(val).to.be.oneOf(itemIds);
          });
        });
      });
      it("> assign the test", () => {
        testLibraryPage.assignPage.visitAssignPageById(testID);
        testLibraryPage.assignPage.selectClass("class");
        testLibraryPage.assignPage.clickOnAssign();
      });
      it("> login as each student attempt and verify item delivered sequence", () => {
        students.forEach((student, index) => {
          cy.login("student", student.email, student.pass);
          // Response Verification
          studentAssignment.clickOnAssigmentByTestId(testID).then(groupArray => {
            deliveredArray[index] = groupItemsPage.getItemDeliverySeq(groupArray, groups);
            // UI Verification
            deliveredArray[index].forEach(item => {
              queNum = itemIds.indexOf(item) + 1;
              studentTestPage.getQuestionText().should("contain", `Q${queNum}${quesText}`);
              studentTestPage.attemptQuestion(quesType, attemptByQuestion[queNum], attempData);
              studentTestPage.clickOnNext();
            });
            studentTestPage.submitTest();
          });
        });
        cy.wait(1).then(() => CypressHelper.checkObjectEquality(deliveredArray[0], deliveredArray[1], message[0]));
      });

      it("> login as teacher verify item sequence for each student in lcb", () => {
        cy.login("teacher", Teacher.email, Teacher.pass);
        testLibraryPage.sidebar.clickOnAssignment();
        authorAssignPage.clcikOnPresenatationIconByIndex(0);

        // Response verification
        lcb.clickonQuestionsTab().then(() => {
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
          deliveredArray[index].forEach((item, ind) => {
            queNum = itemIds.indexOf(item) + 1;
            lcb.questionResponsePage.getQuestionContainer(ind).should("contain", `Q${queNum}${quesText}`);
          });
        });

        lcb.header.clickOnStandardBasedReportTab();
        sbr.getTableHeaderElements().should("have.length", 5);
      });
    });
    context("> two static groups with, deliver all from group1 + deliver by count from group2", () => {
      before("> login as CE", () => {
        testID = undefined;
        groups = {
          1: {},
          2: {}
        };
        groups[1].items = itemIds.slice(0, 4);
        groups[1].deliveryCount = groups[1].items.length;
        groups[1].deliverType = DELIVERY_TYPE.ALL;
        groups[2].items = itemIds.slice(4);
        groups[2].deliveryCount = 2;
        groups[2].deliverType = DELIVERY_TYPE.LIMITED_RANDOM;
        cy.deleteAllAssignments("", Teacher.email);
        cy.login("publisher", contEditor.email, contEditor.pass);
      });
      before("> create test fill details and associate collection", () => {
        testLibraryPage.createNewTestAndFillDetails(testData);
      });
      it("> create test having two static groups with 'deliver all' and 'deliver by count'", () => {
        groupItemsPage.addItemsToGroup(groups[1].items).then(id => {
          testID = id;
        });

        testLibraryPage.testAddItem.clickOnGroupItem();
        // Setting to deliver all
        groupItemsPage.clickOnAddGroup();
        groupItemsPage.clickOnEditByGroup(1);
        groupItemsPage.checkDeliverAllItemForGroup(1);
        groupItemsPage.clickOnSaveByGroup(1);

        groupItemsPage.addItemsToGroup(groups[2].items, false, 2);
        testLibraryPage.testAddItem.clickOnGroupItem();
        // Setting to deliver 2 count
        groupItemsPage.clickOnEditByGroup(2);
        groupItemsPage.checkDeliverCountForGroup(2);
        groupItemsPage.setItemCountForDeliveryByGroup(2, groups[2].deliveryCount);
        groupItemsPage.clickOnSaveByGroup(2);

        testLibraryPage.testAddItem.header.clickOnReview();
        testLibraryPage.review.testheader.clickOnPublishButton();
      });
      it(`> login as teacher find test using ${testData.collections}`, () => {
        cy.login("teacher", Teacher.email, Teacher.pass);
        testLibraryPage.sidebar.clickOnTestLibrary();
        testLibraryPage.searchFilters.clearAll();
        testLibraryPage.searchFilters.setCollection(testData.collections);
        testLibraryPage.clickOnTestCardById(testID);
        testLibraryPage.clickOnDetailsOfCard();
      });
      it("> verify test review at teacher side", () => {
        testLibraryPage.review.verifyItemCoutByGroupInPublisherPreview(
          groups[1].items.length,
          1,
          groups[1].deliveryCount
        );
        testLibraryPage.review.verifyItemCoutByGroupInPublisherPreview(
          groups[2].items.length,
          2,
          groups[2].deliveryCount
        );
        testLibraryPage.review.verifyItemIdsByGroupIndex(groups[1].items, 1);
        testLibraryPage.review.verifyItemIdsByGroupIndex(groups[2].items, 2);
      });
      it("> assign the test", () => {
        testLibraryPage.assignPage.visitAssignPageById(testID);
        testLibraryPage.assignPage.selectClass("class");
        testLibraryPage.assignPage.clickOnAssign();
      });
      it("> login as each student attempt and verify item delivered sequence", () => {
        students.forEach((student, index) => {
          cy.login("student", student.email, student.pass);
          // Response Verification
          studentAssignment.clickOnAssigmentByTestId(testID).then(groupArray => {
            deliveredArray[index] = groupItemsPage.getItemDeliverySeq(groupArray, groups);
            // UI Verification
            deliveredArray[index].forEach(item => {
              queNum = itemIds.indexOf(item) + 1;
              studentTestPage.getQuestionText().should("contain", `Q${queNum}${quesText}`);
              studentTestPage.attemptQuestion(quesType, attemptByQuestion[queNum], attempData);
              studentTestPage.clickOnNext();
            });
            studentTestPage.submitTest();
          });
        });
        cy.wait(1).then(() => CypressHelper.checkObjectInEquality(deliveredArray[0], deliveredArray[1], message[1]));
      });

      it("> login as teacher verify item sequence for each student in lcb", () => {
        cy.login("teacher", Teacher.email, Teacher.pass);
        testLibraryPage.sidebar.clickOnAssignment();
        authorAssignPage.clcikOnPresenatationIconByIndex(0);

        lcb.clickOnStudentsTab();
        // UI Verification
        students.forEach((student, index) => {
          lcb.questionResponsePage.selectStudent(student.name);
          deliveredArray[index].forEach((item, ind) => {
            queNum = itemIds.indexOf(item) + 1;
            lcb.questionResponsePage.getQuestionContainer(ind).should("contain", `Q${queNum}${quesText}`);
          });
        });

        lcb.getQuestionsTab().should("have.attr", "disabled", `disabled`);
        lcb.header.getExpressGraderTab().should("have.attr", "disabled", `disabled`);

        lcb.header.clickOnStandardBasedReportTab();
        sbr.getTableHeaderElements().should("have.length", 4);
      });
    });
    context("> one static group with deliver all and shuffle(test settings)", () => {
      before("> login as CE", () => {
        testID = undefined;
        groups = { 1: {} };
        groups[1].items = itemIds;
        groups[1].deliveryCount = itemIds.length;
        groups[1].deliverType = DELIVERY_TYPE.ALL;
        cy.login("publisher", contEditor.email, contEditor.pass);
        cy.deleteAllAssignments("", Teacher.email);
      });
      before("> create test fill details and associate collection", () => {
        testLibraryPage.createNewTestAndFillDetails(testData);
      });
      it("> create test having one static group with 'deliver all' and select shuffle(test settings)", () => {
        groupItemsPage.addItemsToGroup(groups[1].items).then(id => {
          testID = id;
        });
        testLibraryPage.testAddItem.header.clickOnSettings();
        testSetting.clickOnShuffleQuestions();
        testSetting.header.clickOnPublishButton();
      });
      it(`> login as teacher find test using ${testData.collections}`, () => {
        cy.login("teacher", Teacher.email, Teacher.pass);
        testLibraryPage.sidebar.clickOnTestLibrary();
        testLibraryPage.searchFilters.clearAll();
        testLibraryPage.searchFilters.setCollection(testData.collections);
        testLibraryPage.clickOnTestCardById(testID);
        testLibraryPage.clickOnDetailsOfCard();
      });
      it("> verify test review at teacher side", () => {
        testLibraryPage.review.verifyItemCoutInPreview(itemIds.length);
        testLibraryPage.review.getAllquestionInReview().each((questions, index) => {
          testLibraryPage.review.getItemIdIdByIndex(index).then(val => {
            expect(val).to.be.oneOf(itemIds);
          });
        });
      });
      it("> assign the test", () => {
        testLibraryPage.assignPage.visitAssignPageById(testID);
        testLibraryPage.assignPage.selectClass("class");
        testLibraryPage.assignPage.clickOnAssign();
      });
      it("> login as each student attempt and verify item delivered sequence", () => {
        students.forEach((student, index) => {
          cy.login("student", student.email, student.pass);
          // Response Verification
          studentAssignment.clickOnAssigmentByTestId(testID).then(groupArray => {
            deliveredArray[index] = groupItemsPage.getItemDeliverySeq(groupArray, groups, true);
            // UI Verification
            deliveredArray[index].forEach(item => {
              queNum = itemIds.indexOf(item) + 1;
              studentTestPage.getQuestionText().should("contain", `Q${queNum}${quesText}`);
              studentTestPage.attemptQuestion(quesType, attemptByQuestion[queNum], attempData);
              studentTestPage.clickOnNext();
            });
            studentTestPage.submitTest();
          });
        });
        cy.wait(1).then(() => CypressHelper.checkObjectInEquality(deliveredArray[0], deliveredArray[1], message[1]));
      });

      it("> login as teacher verify item sequence for each student in lcb", () => {
        cy.login("teacher", Teacher.email, Teacher.pass);
        testLibraryPage.sidebar.clickOnAssignment();
        authorAssignPage.clcikOnPresenatationIconByIndex(0);

        lcb.clickonQuestionsTab().then(() => {
          lcb.questionResponsePage.getDropDown().click({ force: true });
          CypressHelper.getDropDownList().then(questions => {
            expect(questions, `Expected no of questions is ${itemIds.length}`).to.have.lengthOf(itemIds.length);
          });
        });

        lcb.clickOnStudentsTab();
        students.forEach(student => {
          lcb.questionResponsePage.selectStudent(student.name);
          itemIds.forEach((item, ind) => {
            queNum = ind + 1;
            lcb.questionResponsePage.getQuestionContainer(ind).should("contain", `Q${queNum}${quesText}`);
          });
        });

        lcb.header.clickOnStandardBasedReportTab();
        sbr.getTableHeaderElements().should("have.length", 5);
      });
    });
    context("> one static group with deliver by count", () => {
      before("> login as CE", () => {
        testID = undefined;
        groups = { 1: {} };
        groups[1].items = itemIds;
        groups[1].deliveryCount = 3;
        groups[1].deliverType = DELIVERY_TYPE.LIMITED_RANDOM;
        cy.deleteAllAssignments("", Teacher.email);
        cy.login("publisher", contEditor.email, contEditor.pass);
      });
      before("> create test fill details and associate collection", () => {
        testLibraryPage.createNewTestAndFillDetails(testData);
      });
      it("> create test having one static group with 'deliver by count'", () => {
        groupItemsPage.addItemsToGroup(groups[1].items).then(id => {
          testID = id;
        });
        testLibraryPage.testAddItem.clickOnGroupItem();
        groupItemsPage.clickOnEditByGroup(1);
        groupItemsPage.checkDeliverCountForGroup(1);
        groupItemsPage.setItemCountForDeliveryByGroup(1, groups[1].deliveryCount);
        groupItemsPage.clickOnSaveByGroup(1);
        testLibraryPage.testAddItem.header.clickOnReview();
        testLibraryPage.review.testheader.clickOnPublishButton();
      });
      it(`> login as teacher find test using ${testData.collections}`, () => {
        cy.login("teacher", Teacher.email, Teacher.pass);
        testLibraryPage.sidebar.clickOnTestLibrary();
        testLibraryPage.searchFilters.clearAll();
        testLibraryPage.searchFilters.setCollection(testData.collections);
        testLibraryPage.clickOnTestCardById(testID);
        testLibraryPage.clickOnDetailsOfCard();
      });
      it("> verify test review at teacher side", () => {
        testLibraryPage.review.verifyItemCoutInPreview(groups[1].items.length);
        testLibraryPage.review.verifyItemCoutByGroupInPublisherPreview(
          groups[1].items.length,
          1,
          groups[1].deliveryCount
        );
      });
      it("> assign the test", () => {
        testLibraryPage.assignPage.visitAssignPageById(testID);
        testLibraryPage.assignPage.selectClass("class");
        testLibraryPage.assignPage.clickOnAssign();
      });
      it("> login as each student attempt and verify item delivered sequence", () => {
        students.forEach((student, index) => {
          cy.login("student", student.email, student.pass);
          // Response Verification
          studentAssignment.clickOnAssigmentByTestId(testID).then(groupArray => {
            deliveredArray[index] = groupItemsPage.getItemDeliverySeq(groupArray, groups);
            // UI Verification
            deliveredArray[index].forEach(item => {
              queNum = itemIds.indexOf(item) + 1;
              studentTestPage.getQuestionText().should("contain", `Q${queNum}${quesText}`);
              studentTestPage.attemptQuestion(quesType, attemptByQuestion[queNum], attempData);
              studentTestPage.clickOnNext();
            });
            studentTestPage.submitTest();
          });
        });
        cy.wait(1).then(() => CypressHelper.checkObjectInEquality(deliveredArray[0], deliveredArray[1], message[1]));
      });

      it("> login as teacher verify item sequence for each student in lcb", () => {
        cy.login("teacher", Teacher.email, Teacher.pass);
        testLibraryPage.sidebar.clickOnAssignment();
        authorAssignPage.clcikOnPresenatationIconByIndex(0);
        lcb.clickOnStudentsTab();
        // UI Verification
        students.forEach((student, index) => {
          lcb.questionResponsePage.selectStudent(student.name);
          deliveredArray[index].forEach((item, ind) => {
            queNum = itemIds.indexOf(item) + 1;
            lcb.questionResponsePage.getQuestionContainer(ind).should("contain", `Q${queNum}${quesText}`);
          });
        });
        lcb.getQuestionsTab().should("have.attr", "disabled", `disabled`);
        lcb.header.getExpressGraderTab().should("have.attr", "disabled", `disabled`);

        lcb.header.clickOnStandardBasedReportTab();
        sbr.getTableHeaderElements().should("have.length", 4);
      });
      context("> redirecting  and verifications ", () => {
        it(">redirect the test", () => {
          sbr.header.clickOnLCBTab();
          lcb.clickOnCardViewTab();
          lcb.checkSelectAllCheckboxOfStudent();
          lcb.clickOnRedirect();
          lcb.clickOnRedirectSubmit();
        });
        it("> login as each student attempt and verify item delivered sequence for redirected test", () => {
          students.forEach((student, index) => {
            if (index === 0) {
              cy.login("student", student.email, student.pass);
              // Response Verification
              studentAssignment.clickOnAssigmentByTestId(testID, { isFirstAttempt: false }).then(groupArray => {
                redirected[index] = groupItemsPage.getItemDeliverySeq(groupArray, groups);
                // UI Verification
                redirected[index].forEach(item => {
                  queNum = itemIds.indexOf(item) + 1;
                  studentTestPage.getQuestionText().should("contain", `Q${queNum}${quesText}`);
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
        it("> login as teacher verify item sequence for each student in lcb for redirected test", () => {
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
                  lcb.questionResponsePage.getQuestionContainer(ind).should("contain", `Q${queNum}${quesText}`);
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
  });
});
