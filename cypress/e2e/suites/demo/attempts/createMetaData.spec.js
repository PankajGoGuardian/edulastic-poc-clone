import { getStudents } from "./getStudents";
import { getTestData } from "./getTestData";
import { loginUser } from "./login";

const allTeachers = ["wolverine@xmen.com"];
const password = "welcome";
const allTests = ["5e57b5ac245a62000856de7c", "5e57b998a7c44300082e6872"];
// allGroups: optional ,only if few specific groups are required from teacher account, to be passed manually
const allGroups = ["5e33bfbaa5c8710008690987", "5e57b6d1a7c44300082e6866", "5e57b78530bf6f0008c881ab"];

const metafile = "cypress/fixtures/demo-metadata.json";
const userFile = "cypress/fixtures/demo-students.json";

describe("create demo data", () => {
  before("createResetFle", () => {
    cy.writeFile(metafile, {});
    cy.writeFile(userFile, {});
  });

  it("get metadata for attempts", () => {
    loginUser({ password, email: allTeachers[0] }).then(({ _id, token }) => {
      for (let testId of allTests) {
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

  allTeachers.forEach(u => {
    it(`get student  - ${u}`, () => {
      loginUser({ email: u, password }).then(({ _id, token }) => {
        getStudents(token, allGroups).then(s => {
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
