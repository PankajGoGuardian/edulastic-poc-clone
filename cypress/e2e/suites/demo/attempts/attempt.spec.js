import { attemptAssignment } from "./attemptAssignment";
import { getAssignments } from "./getAssignments";
import { loginUser } from "./login";
import { generateAttemptData } from "./util";

const { students } = require("../../../../fixtures/demo-students.json");
const TEST_META = require("../../../../fixtures/demo-metadata.json");

const TESTS = ["5e4bea087c603e00083d0b9f"];

describe("attempt by students", () => {
  students.forEach(classes => {
    classes.forEach((student, stuIndex) => {
      it(`attempt by-${student.email}`, () => {
        const user = { password: "edulastic", ...student };
        loginUser(user).then(auth => {
          getAssignments(auth.token, user.groupId).then(assignments => {
            assignments.forEach(asgn => {
              cy.wait(1).then(() => {
                if (TESTS.indexOf(asgn.testId) != -1) {
                  console.log("attempt", asgn.testId);
                  const atttemptType =
                    stuIndex === 0 ? "ALL_CORRECT" : stuIndex === 1 ? "ALL_INCORRECT" : "RANDOM";
                  const testItems = Cypress._.values(TEST_META[asgn.testId]);
                  attemptAssignment(
                    auth,
                    asgn,
                    testItems,
                    generateAttemptData(testItems, atttemptType)
                  );
                }
              });
            });
          });
        });
      });
    });
  });
});
