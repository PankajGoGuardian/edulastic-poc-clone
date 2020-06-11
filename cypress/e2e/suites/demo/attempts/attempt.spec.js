import { attemptAssignment } from "./attemptAssignment";
import { getAssignments } from "./getAssignments";
import { loginUser } from "./login";
import { generateAttemptData } from "./util";

const { students } = require("../../../../fixtures/demo-students.json");
const TEST_META = require("../../../../fixtures/demo-metadata.json");

//https://v2.edulastic.com/author/tests/tab/review/id/5e60dc4fc490390008e7712c

const testsToAttempt = ["5ec4edec6cd8fb0008e7d4e5", "5ec4cfc7dd933400082dfa9e"];

const password = "edulastic";

describe("attempt by students", () => {
  students.forEach((classes, ci) => {
    if (ci > 987) {
      classes.forEach((student, stuIndex) => {
        it(`attempt by-${student.email}`, () => {
          const user = { password, ...student };
          loginUser(user).then(auth => {
            getAssignments(auth.token, user.groupId).then(assignments => {
              assignments.forEach(asgn => {
                cy.wait(1).then(() => {
                  if (testsToAttempt.indexOf(asgn.testId) != -1) {
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
      });
    }
  });
});
