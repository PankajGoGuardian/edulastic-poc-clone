import { getResponseByAttempt } from "./util";

const BASE_URL = Cypress.config("API_URL");

export function attemptAssignment(auth, assignment, testItems, attempts) {
  console.log("auth, assignment, testItems, attempts", auth, assignment, testItems, attempts);
  const { token, groupId, institutionId } = auth;
  const { _id: assignmentId, testId } = assignment;
  const postTA = {
    assignmentId,
    testId,
    groupId,
    institutionId,
    groupType: "class"
  };
  return cy
    .request({
      url: `${BASE_URL}/test-activity`,
      method: "POST",
      body: postTA,
      headers: {
        Authorization: token,
        "Content-Type": "application/json"
      }
    })
    .then(({ status, body }) => {
      const testActivityId = body.result._id;
      expect(status).to.eq(200);
      testItems.forEach(item => {
        cy.wait(1).then(() => {
          const { itemId, questionId, options, validResponse } = item;
          const postItemActivity = {
            userResponse: {},
            assignmentId,
            groupId,
            timesSpent: {},
            shuffledOptions: {},
            bookmarked: false,
            userWork: {
              scratchpad: false
            }
          };
          if (getResponseByAttempt(attempts[itemId], options, validResponse))
            postItemActivity.userResponse[questionId] = getResponseByAttempt(
              attempts[itemId],
              options,
              validResponse
            );
          postItemActivity.timesSpent[questionId] = Cypress._.random(5, 55) * 1000;
          return cy
            .request({
              url: `${BASE_URL}/test-activity/${testActivityId}/test-item/${itemId}?autoSave=false`,
              method: "POST",
              body: postItemActivity,
              headers: {
                Authorization: token,
                "Content-Type": "application/json"
              },
              failOnStatusCode: false
            })
            .then(({ status, body }) => {
              expect(status).to.eq(200);
            });
        });
      });

      cy.wait(1).then(() => {
        return cy
          .request({
            url: `${BASE_URL}/test-activity/${testActivityId}/status`,
            method: "PUT",
            body: { status: 1, groupId: groupId },
            headers: {
              Authorization: token,
              "Content-Type": "application/json"
            }
          })
          .then(({ status, body }) => {
            expect(status).to.eq(200);
          });
      });
    });
}
