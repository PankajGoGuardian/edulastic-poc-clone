const BASE_URL = Cypress.config("API_URL");

export function getTestData(token, testId) {
  return cy
    .request({
      url: `${BASE_URL}/test/${testId}?data=true&requestLatest=true`,
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json"
      }
    })
    .then(({ status, body }) => {
      const testMeta = {};
      const { itemGroups, _id } = body.result;
      expect(status).to.eq(200);
      const { items } = itemGroups[0];
      items.forEach(item => {
        const itemMeta = {};
        const itemId = item._id;
        const question = item.data.questions[0];
        const questionId = question.id;
        const options = question.options.map(o => o.value);
        const validResponse = question.validation.validResponse.value;
        testMeta[itemId] = { itemId, questionId, options, validResponse };
      });
      return testMeta;
    });
}
