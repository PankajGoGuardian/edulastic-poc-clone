import FileHelper from "../framework/util/fileHelper";

const BASE_URL = Cypress.config("API_URL");
const PAGE = "signup";
const SCREEN_SIZES = Cypress.config("SCREEN_SIZES");
const userEmail = "test.teacher.aug13@snapwiz.com";
const userBody = {
  institutionIds: ["5d2884b38532772801a46bd8"],
  districtId: "5d2884b28532772801a46bd5",
  email: userEmail,
  firstName: "test",
  lastName: "teacher"
};
let userId;
const header = { "Content-Type": "application/json" };

function setSignupStatus(signUpState) {
  userBody.currentSignUpState = signUpState;
  cy.request({
    url: `${BASE_URL}/user/${userId}`,
    headers: header,
    method: "PUT",
    body: userBody
  }).then(res => {
    expect(res.status).to.eq(200);
  });
}

describe(`visual regression tests - ${FileHelper.getSpecName(Cypress.spec.name)}`, () => {
  before("set token", () => {
    cy.setToken(userEmail).then(id => {
      userId = id;
      cy.getToken().then(auth => {
        header.Authorization = auth;
      });
    });
  });

  context(`school`, () => {
    before("set signup status", () => {
      setSignupStatus("SCHOOL_NOT_SELECTED");
    });

    SCREEN_SIZES.forEach(size => {
      it(`'select page' when resolution is '${size}'`, () => {
        cy.setResolution(size);
        cy.visit(`/${PAGE}`);
        cy.wait("@schoolSearch");
        cy.contains("Collaborate with your colleagues and more").should("be.visible");
        cy.matchImageSnapshot();
      });

      // skipping below test as option is now hidden temperarely
      it.skip(`'request new school' page when resolution is '${size}'`, () => {
        cy.setResolution(size);
        cy.contains("Request a new School").click();
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500);
        cy.get("button").contains("Request a new school");
        cy.matchImageSnapshot();
      });
    });
  });

  context(`select school page`, () => {
    before("set signup status", () => {
      setSignupStatus("PREFERENCE_NOT_SELECTED");
    });

    SCREEN_SIZES.forEach(size => {
      it(`'grade/subject preference' page when resolution is '${size}'`, () => {
        cy.setResolution(size);
        cy.visit(`/${PAGE}`);
        cy.get("button")
          .contains("Get Started")
          .should("be.visible");
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500);
        cy.matchImageSnapshot();
      });
    });
  });
});
