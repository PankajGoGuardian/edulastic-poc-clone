import { attemptAssignment } from "./attemptAssignment";
import { getAssignments } from "./getAssignments";
import { loginUser } from "./login";
import { generateAttemptData } from "./util";

const { students } = require("../../../../fixtures/demo-students.json");
const TEST_META = require("../../../../fixtures/demo-metadata.json");

const testsToAttempt = ["5e57b5ac245a62000856de7c", "5e57b998a7c44300082e6872"];
const password = "snapwiz";

describe("attempt by students", () => {
  students.forEach(classes => {
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
  });
});
