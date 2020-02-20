const BASE_URL = Cypress.config("API_URL");

export function loginUser(user) {
  return cy
    .request({
      url: `${BASE_URL}/auth/login`,
      method: "POST",
      body: { password: user.password, username: user.email }
    })
    .then(({ status, body }) => {
      const { token, _id, districtId, orgData } = body.result;
      expect(status).to.eq(200);
      return {
        _id,
        token,
        districtId,
        groupId: orgData.defaultClass,
        institutionId: orgData.defaultSchool
      };
    });
}
