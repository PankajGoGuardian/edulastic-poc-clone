import LiveClassboardPage from "../../framework/author/assignments/LiveClassboardPage";
import ItemListPage from "../../framework/author/itemList/itemListPage";
import TestAddItemTab from "../../framework/author/tests/testDetail/testAddItemTab";
import TestSummayTab from "../../framework/author/tests/testDetail/testSummaryTab";
import TestLibrary from "../../framework/author/tests/testLibraryPage";
import { studentSide } from "../../framework/constants/assignmentStatus";
import { attemptTypes, questionTypeKey } from "../../framework/constants/questionTypes";
import StudentTestPage from "../../framework/student/studentTestPage";
import { getUsers } from "../../framework/testdata/users";
import FileHelper from "../../framework/util/fileHelper";

const questionData = require("../../../fixtures/questionAuthoring");

const BASE_URL = Cypress.config("API_URL");
const itemsToInclude = ["MCQ_STD.2", "MCQ_MULTI.1", "MCQ_TF.1"];
const NUM_OF_QUESTIONS = 20;
const NUM_OF_STUDENTS = 25;
const CLASS_CODE = "SW790U";
const testLibrary = new TestLibrary();
const testSummary = new TestSummayTab();
const testAddItem = new TestAddItemTab();
const itemListPage = new ItemListPage();

function signUpStudent(user) {
  cy.request({
    url: `${BASE_URL}/auth/signup`,
    method: "POST",
    body: user
  }).then(({ status }) => {
    expect(status).to.eq(200);
    console.log(`creating user ${user.email}`);
  });
}

function getItemArray(numberOfQuestion) {
  const items = [];
  for (let q = 0; q < numberOfQuestion; q++) {
    items.push(itemsToInclude[Math.floor(Math.random() * itemsToInclude.length)]);
  }
  return items;
}

function generateAttemptData(itemKeys, atttemptType) {
  const attempt = {};
  itemKeys.forEach((item, itemIndex) => {
    const [queType, queKey] = item.split(".");
    const questionNumber = `Q${itemIndex + 1}`;
    if (atttemptType === "ALL_CORRECT") {
      attempt[questionNumber] = attemptTypes.RIGHT;
    } else if (atttemptType === "ALL_INCORRECT") {
      attempt[questionNumber] = attemptTypes.WRONG;
    } else {
      attempt[questionNumber] =
        queType === questionTypeKey.MULTIPLE_CHOICE_MULTIPLE
          ? [attemptTypes.WRONG, attemptTypes.RIGHT, attemptTypes.SKIP, attemptTypes.PARTIAL_CORRECT][
              Math.floor(Math.random() * 4)
            ]
          : [attemptTypes.WRONG, attemptTypes.RIGHT, attemptTypes.SKIP][Math.floor(Math.random() * 3)];
    }
  });
  return attempt;
}

const testData = {
  name: "LCB Test Assessment 01",
  grade: ["Kindergarten"],
  subject: ["Math"],
  itemKeys: getItemArray(NUM_OF_QUESTIONS)
};

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Teacher Assignment LCB page`, () => {
  const attemptsData = getUsers(NUM_OF_STUDENTS).map((student, i) => {
    const aData = { ...student };
    const atttemptType = i === 0 ? "ALL_CORRECT" : i === 1 ? "ALL_INCORRECT" : "RANDOM";
    const studentNumber = i + 1;
    aData.attempt = generateAttemptData(testData.itemKeys, atttemptType);
    aData.status =
      studentNumber % 9 === 0
        ? studentSide.IN_PROGRESS
        : studentNumber % 25 === 0
        ? studentSide.NOT_STARTED
        : studentSide.SUBMITTED;
    return aData;
  });

  console.log("attemptsData", JSON.stringify(attemptsData));

  const className = "testing new class";
  const teacher = "testing.demo@snawpiz.com";

  const questionTypeMap = {};
  const statsMap = {};

  const studentTestPage = new StudentTestPage();
  const lcb = new LiveClassboardPage();
  before(" > create new assessment and assign", () => {
    const { itemKeys } = testData;
    itemKeys.forEach((queKey, index) => {
      const [queType, questionKey] = queKey.split(".");
      const { attemptData, standards } = questionData[queType][questionKey];
      const { points } = questionData[queType][questionKey].setAns;
      const queMap = { queKey, points, attemptData, standards };
      questionTypeMap[`Q${index + 1}`] = queMap;
    });

    //  signing up all the students
    attemptsData.forEach(stuAttemp => {
      const { email, fName, lName, password } = stuAttemp;
      signUpStudent({
        password,
        email,
        firstName: fName,
        lastName: lName,
        role: "student",
        code: CLASS_CODE
      });
    });

    cy.deleteAllAssignments(attemptsData[0].email, teacher);
    cy.login("teacher", teacher);

    testData.itemKeys.forEach(async (itemKey, index) => {
      // const _id = await promisify(itemListPage.createItem(itemKey, index));
      itemListPage.createItem(itemKey, index).then(_id => testLibrary.items.push(_id));
    });

    // create new test
    testLibrary.sidebar.clickOnTestLibrary();
    testLibrary.clickOnAuthorTest();

    // test description
    if (testData.name) testSummary.setName(testData.name);
    if (testData.grade) {
      testData.grade.forEach(grade => {
        testSummary.selectGrade(grade);
      });
    }
    if (testData.subject) {
      testData.subject.forEach(subject => {
        testSummary.selectSubject(subject);
      });
    }

    // add items
    testSummary.header.clickOnAddItems();
    testLibrary.searchFilters.clearAll();
    cy.route("POST", "**api/test").as("createTest");
    testAddItem.authoredByMe().then(() => {
      testLibrary.items.forEach((itemKey, index) => {
        testAddItem.addItemById(itemKey);
        if (index === 0) cy.wait("@createTest").then(xhr => testLibrary.saveTestId(xhr));
        cy.wait(500);
      });
    });

    // store gets updated with some delay, if no wait then published test doesn't consist all selected questions
    cy.wait(1000);
    // review
    testSummary.header.clickOnReview();
    // save
    cy.wait(2000);
    testSummary.header.clickOnSaveButton(true);
    // publish
    testSummary.header.clickOnPublishButton();

    testLibrary.clickOnAssign();
    testLibrary.assignPage.selectClass(className);
    testLibrary.assignPage.clickOnAssign();
  });

  context(" > attempt by all students", () => {
    attemptsData.forEach(attempts => {
      it(`attempt by ${attempts.email}`, () => {
        const { attempt, email, stuName, status } = attempts;
        /* statsMap[stuName] = lcb.getScoreAndPerformance(attempt, questionTypeMap);
        statsMap[stuName].attempt = attempt;
        statsMap[stuName].status = status; */
        studentTestPage.attemptAssignment(email, status, attempt, questionTypeMap);
      });
    });
  });
});
