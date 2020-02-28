const BASE_URL = Cypress.config("API_URL");

export function getStudents(token, allGroups = []) {
  return cy
    .request({
      url: `${BASE_URL}/group/mygroups`,
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json"
      }
    })
    .then(({ status, body }) => {
      expect(status).to.eq(200);
      const groups = body.result.map(g => g._id);
      let allstudents = [];
      groups.forEach(group => {
        if (allGroups.length > 0 ? allGroups.indexOf(group) != -1 : true) {
          cy.request({
            url: `${BASE_URL}/enrollment/class/${group}`,
            method: "GET",
            headers: {
              Authorization: token,
              "Content-Type": "application/json"
            }
          }).then(({ status, body }) => {
            expect(status).to.eq(200);
            const students = body.result.students.map(g => ({
              id: g._id,
              email: g.email,
              groupId: group
            }));
            // allstudents = Cypress._.concat(allstudents, students);
            allstudents.push(students);
          });
        }
      });
      cy.wait(1).then(() => allstudents);
    });
}
