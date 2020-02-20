const BASE_URL = Cypress.config("API_URL");

export function getAssignments(token, groupId) {
  return cy
    .request({
      url: `${BASE_URL}/assignments?groupId=${groupId}`,
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json"
      }
    })
    .then(({ status, body }) => {
      expect(status).to.eq(200);
      return body.result;
    });
}
