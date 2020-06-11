import { attemptAssignment } from "./attemptAssignment";
import { getAssignments } from "./getAssignments";
import { loginUser } from "./login";
import { generateAttemptData } from "./util";

const { students } = require("../../../../fixtures/demo-students.json");
const TEST_META = require("../../../../fixtures/demo-metadata.json");

//https://v2.edulastic.com/author/tests/tab/review/id/5e60dc4fc490390008e7712c

const testsToAttempt = ["5ec4edec6cd8fb0008e7d4e5", "5ec4cfc7dd933400082dfa9e"];

const studentToAttempt = [
  "s8084@v2demo.com",
  "s8122@v2demo.com",
  "s8134@v2demo.com",
  "s8146@v2demo.com",
  "s8182@v2demo.com",
  "s8196@v2demo.com",
  "s8208@v2demo.com",
  "s8220@v2demo.com",
  "s8232@v2demo.com",
  "s8244@v2demo.com",
  "s8256@v2demo.com",
  "s8292@v2demo.com",
  "s8328@v2demo.com",
  "s8352@v2demo.com"
];

const password = "edulastic";

describe("attempt by students", () => {
  students.forEach((classes, ci) => {
    // if (ci > 601 && ci <= 800) {
    classes.forEach((student, stuIndex) => {
      if (studentToAttempt.includes(student.email)) {
        it(`attempt by-${student.email} - test1`, () => {
          const user = { password, ...student };
          loginUser(user).then(auth => {
            getAssignments(auth.token, user.groupId).then(assignments => {
              assignments.forEach(asgn => {
                cy.wait(1).then(() => {
                  if (testsToAttempt[0] === asgn.testId) {
                    console.log("attempt", asgn.testId);
                    const atttemptType = stuIndex === 0 ? "ALL_CORRECT" : stuIndex === 1 ? "ALL_INCORRECT" : "RANDOM";
                    const testItems = Cypress._.values(TEST_META[asgn.testId]);
                    attemptAssignment(auth, asgn, testItems, generateAttemptData(testItems, atttemptType));
                  }
                });
              });
            });
          });
        });

        it(`attempt by-${student.email} - test2`, () => {
          const user = { password, ...student };
          loginUser(user).then(auth => {
            getAssignments(auth.token, user.groupId).then(assignments => {
              assignments.forEach(asgn => {
                cy.wait(1).then(() => {
                  if (testsToAttempt[1] === asgn.testId) {
                    console.log("attempt", asgn.testId);
                    const atttemptType = stuIndex === 0 ? "ALL_CORRECT" : stuIndex === 1 ? "ALL_INCORRECT" : "RANDOM";
                    const testItems = Cypress._.values(TEST_META[asgn.testId]);
                    attemptAssignment(auth, asgn, testItems, generateAttemptData(testItems, atttemptType));
                  }
                });
              });
            });
          });
        });
      }
    });
    // }
  });
});
