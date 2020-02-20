import { getStudents } from "./getStudents";
import { getTestData } from "./getTestData";
import { loginUser } from "./login";

const users = ["t001@v2demodata3.com"];
const TESTS = ["5e4d3897895c6b0008ab497b"];
const metafile = "cypress/fixtures/demo-metadata.json";
const userFile = "cypress/fixtures/demo-students.json";

describe("create demo data", () => {
  before("createResetFle", () => {
    cy.writeFile(metafile, {});
    cy.writeFile(userFile, {});
  });

  it("get metadata for attempts", () => {
    loginUser({ password: "edulastic", email: users[0] }).then(({ _id, token }) => {
      for (let testId of TESTS) {
        getTestData(token, testId).then(testMeta => {
          cy.readFile(`${metafile}`).then(json => {
            console.log("json", json);
            // const data = JSON.parse(json);
            json[testId] = testMeta;
            cy.writeFile(`${metafile}`, json);
          });
        });
      }
    });
  });

  users.forEach(u => {
    it(`get student  - ${u}`, () => {
      loginUser({ email: u, password: "edulastic" }).then(({ _id, token }) => {
        getStudents(token).then(s => {
          cy.readFile(`${userFile}`).then(json => {
            console.log("json", json);
            const students = json.students || [];
            // const data = JSON.parse(json);
            json.students = Cypress._.concat(students, s);
            cy.writeFile(`${userFile}`, json);
          });
        });
      });
    });
  });
});
