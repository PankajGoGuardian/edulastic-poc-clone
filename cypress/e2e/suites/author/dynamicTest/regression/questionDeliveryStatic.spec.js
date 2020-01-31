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
import TestSettings from "../../../../framework/author/tests/testDetail/testSetting";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> item groups`, () => {
  const testLibraryPage = new TestLibrary();
  const addItemTab = new TestAddItemTab();
  const groupItemsPage = new GroupItemsPage();
  const testReviewTab = new TestReviewTab();
  const assignPage = new TestAssignPage();
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
    { name: "Student1", email: "student1.group.question.delivery@snapwiz.com", pass: "snapwiz" },
    { name: "Student2", email: "student2.group.question.delivery@snapwiz.com", pass: "snapwiz" }
  ];

  const deliveredArray = [[], []];
  const redirected = [[], []];
  let testID = "5e32f16ac892340007772d75";
  const itemIds = [];
  const message = [
    "-Expected to items be delivered same for  both students-",
    "-Expected to items be delivered different for  both students-"
  ];
  const GROUPS = {
    GROUP1: [],
    GROUP2: []
  };

  before("Login and create new items", () => {
    cy.login("publisher", contEditor.email, contEditor.pass);
    items.forEach((itemToCreate, index) => {
      item.createItem(itemToCreate, index).then(id => {
        itemIds.push(id);
      });
    });
  });

  context(">static", () => {
    context(">deliver all", () => {
      before("create test", () => {
        GROUPS.GROUP1 = itemIds;
        cy.login("publisher", contEditor.email, contEditor.pass);
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
      it(">verify review", () => {
        // TODO: Add count by group verification
        testReviewTab.verifyItemCoutInPreview(itemIds.length);
        testReviewTab.getAllquestionInReview().each((questions, index) => {
          testReviewTab.getItemIdIdByIndex(index).then(val => {
            expect(val).to.be.oneOf(itemIds);
          });
        });
      });
      it(">assign", () => {
        testReviewTab.testheader.clickOnAssign();
        assignPage.selectClass("class");
        assignPage.clickOnAssign();
      });
      it(">login as student and verify", () => {
        students.forEach((student, index) => {
          cy.login("student", student.email, student.pass);
          // Response Verification
          studentAssignment.clickOnAssigmentByTestId(testID).then(groupArray => {
            deliveredArray[index] = groupItemsPage.getItemDeliverySeq(groupArray, GROUPS, "ALL", itemIds.length);
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

      it(">login as teacher verify in LCB", () => {
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
    context(">deliver all + deliver by count", () => {
      before("login", () => {
        GROUPS.GROUP1 = itemIds.slice(0, 4);
        GROUPS.GROUP2 = itemIds.slice(4);
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
      it(">verify review", () => {
        // TODO: Add count by group verification
        testReviewTab.verifyItemCoutInPreview(itemIds.length);
        testReviewTab.getAllquestionInReview().each((questions, index) => {
          testReviewTab.getItemIdIdByIndex(index).then(val => {
            expect(val).to.be.oneOf(itemIds);
          });
        });
      });
      it(">assign", () => {
        testReviewTab.testheader.clickOnAssign();
        assignPage.selectClass("class");
        assignPage.clickOnAssign();
      });
      it(">login as student and verify", () => {
        students.forEach((student, index) => {
          cy.login("student", student.email, student.pass);
          // Response Verification
          studentAssignment.clickOnAssigmentByTestId(testID).then(groupArray => {
            deliveredArray[index] = groupItemsPage.getItemDeliverySeq(groupArray, GROUPS, deliverType.LIM_RANDOM, 6);
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
            lcb.questionResponsePage.getQuestionContainer(ind).should("contain", `Q${queNum}${quesText}`);
          });
        });

        lcb.getQuestionsTab().should("have.attr", "disabled", `disabled`);
        lcb.header.getExpressGraderTab().should("have.attr", "disabled", `disabled`);

        lcb.header.clickOnStandardBasedReportTab();
        sbr.getTableHeaderElements().should("have.length", 4);
      });
    });
    context(">deliver all- shuffle(test settings)", () => {
      before("create test", () => {
        GROUPS.GROUP1 = itemIds;
        cy.login("publisher", contEditor.email, contEditor.pass);
        cy.deleteAllAssignments("", Teacher.email);
        testLibraryPage.createNewTestAndFillDetails(testData);
      });
      it(">create static group-'deliver all'(shuffle)", () => {
        groupItemsPage.addItemsToGroup(itemIds).then(id => {
          testID = id;
        });
        addItemTab.header.clickOnSettings();
        testSetting.clickOnShuffleQuestions();
        testSetting.header.clickOnPublishButton();
      });
      it(">login as teacher find test", () => {
        cy.login("teacher", Teacher.email, Teacher.pass);
        testLibraryPage.sidebar.clickOnTestLibrary();
        testLibraryPage.searchFilters.clearAll();
        testLibraryPage.searchFilters.setCollection(testData.collections);
        testLibraryPage.clickOnTestCardById(testID);
        testLibraryPage.clickOnDetailsOfCard();
      });
      it(">verify review", () => {
        // TODO: Add count by group verification
        testReviewTab.verifyItemCoutInPreview(itemIds.length);
        testReviewTab.getAllquestionInReview().each((questions, index) => {
          testReviewTab.getItemIdIdByIndex(index).then(val => {
            expect(val).to.be.oneOf(itemIds);
          });
        });
      });
      it(">assign", () => {
        testReviewTab.testheader.clickOnAssign();
        assignPage.selectClass("class");
        assignPage.clickOnAssign();
      });
      it(">login as student and verify", () => {
        students.forEach((student, index) => {
          cy.login("student", student.email, student.pass);
          // Response Verification
          studentAssignment.clickOnAssigmentByTestId(testID).then(groupArray => {
            deliveredArray[index] = groupItemsPage.getItemDeliverySeq(
              groupArray,
              GROUPS,
              deliverType.ALL_SHUF,
              itemIds.length
            );
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

      it(">login as teacher verify in LCB", () => {
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
        students.forEach((student, index) => {
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
    context(">deliver by count", () => {
      before("login", () => {
        GROUPS.GROUP1 = itemIds;
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
      });
      it(">assign", () => {
        testReviewTab.testheader.clickOnAssign();
        assignPage.selectClass("class");
        assignPage.clickOnAssign();
      });
      it(">login as student and verify", () => {
        students.forEach((student, index) => {
          cy.login("student", student.email, student.pass);
          // Response Verification
          studentAssignment.clickOnAssigmentByTestId(testID).then(groupArray => {
            deliveredArray[index] = groupItemsPage.getItemDeliverySeq(groupArray, GROUPS, deliverType.LIM_RANDOM, 3);
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
            lcb.questionResponsePage.getQuestionContainer(ind).should("contain", `Q${queNum}${quesText}`);
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
                redirected[index] = groupItemsPage.getItemDeliverySeq(groupArray, GROUPS, deliverType.LIM_RANDOM, 3);
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
            //  CypressHelper.checkObjectInEquality(redirected[0], redirected[1], message[1]);
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
