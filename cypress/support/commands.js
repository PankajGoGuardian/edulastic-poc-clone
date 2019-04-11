/// <reference types="Cypress"/>
/* eslint-disable no-shadow */
import { userBuilder } from "./generate";
import LoginPage from "../e2e/framework/student/loginPage";

Cypress.LocalStorage.clear = () => {};
const BASE_URL = Cypress.config("API_URL");
const DEFAULT_USERS = {
  teacher: {
    email: "auto.teacher1@snapwiz.com",
    password: "snapwiz"
  },
  student: {
    email: "auto.student3@snapwiz.com",
    password: "snapwiz"
  }
};

const ITEM_ID = "5ca369b88682ac3dab2fe2aa";

Cypress.Commands.add("createUser", overrides => {
  const user = userBuilder(overrides);
  return cy
    .request({
      url: `${BASE_URL}/auth/signup`,
      method: "POST",
      body: user
    })
    .then(({ body }) => body.user);
});

Cypress.Commands.add("login", user =>
  cy
    .request({
      url: `${BASE_URL}/auth/login`,
      method: "POST",
      body: user
    })
    .then(({ body }) => {
      window.localStorage.setItem("access_token", body.token);
      return body.user;
    })
);

Cypress.Commands.add("assertHome", () => {
  cy.url().should("eq", `${Cypress.config().baseUrl}/`);
});

Cypress.Commands.add("setToken", (role = "teacher") => {
  const postData = role === "teacher" ? DEFAULT_USERS.teacher : DEFAULT_USERS.student;
  window.localStorage.clear();
  /* cy.request({
          url: `${BASE_URL}/auth/login`,
          method: 'POST',
          body: postData
        }).then(({ body }) => {
          console.log('Result = ', body.result);
          window.localStorage.setItem('access_token', body.result.token);
          return true;
        }); */

  const login = new LoginPage();
  cy.visit("/login");
  cy.server();
  cy.route("GET", "**curriculum**").as("apiLoad");
  cy.route("GET", "**assignments**").as("assignment");
  login.fillLoginForm(postData.email, postData.password);
  login.onClickSignin().then(() => {
    if (role === "teacher") {
      cy.wait("@apiLoad");
    } else {
      cy.wait("@assignment");
    }
  });
});

Cypress.Commands.add(
  "assignAssignment",
  (testId = "", startDt = new Date(), dueDt = new Date(new Date().setDate(startDt.getDate() + 1))) => {
    cy.request({
      url: `${BASE_URL}/auth/login`,
      method: "POST",
      body: DEFAULT_USERS.teacher
    }).then(({ body }) => {
      cy.fixture("assignments").then(asgns => {
        const postData = asgns.default;
        postData.assignments[0].testId = testId.valueOf();
        postData.assignments[0].startDate = startDt.valueOf();
        postData.assignments[0].endDate = dueDt.valueOf();
        cy.request({
          url: `${BASE_URL}/assignments`,
          method: "POST",
          body: postData,
          headers: {
            authorization: body.result.token,
            "Content-Type": "application/json"
          }
        }).then(({ body }) => {
          console.log("Assignment Assigned = ", body.result._id);
        });
      });
    });
  }
);

Cypress.Commands.add("deleteAllAssignments", () => {
  const asgnIds = [];

  cy.request({
    url: `${BASE_URL}/auth/login`,
    method: "POST",
    body: DEFAULT_USERS.student
  }).then(({ body }) => {
    cy.request({
      url: `${BASE_URL}/assignments`,
      method: "GET",
      headers: {
        authorization: body.result.token,
        "Content-Type": "application/json"
      }
    }).then(({ body }) => {
      body.result.forEach(asgnDO => {
        asgnIds.push(asgnDO._id);
      });
      console.log("All Assignments = ", asgnIds);
    });
  });

  cy.request({
    url: `${BASE_URL}/auth/login`,
    method: "POST",
    body: DEFAULT_USERS.teacher
  }).then(({ body }) => {
    asgnIds.forEach(asgnId => {
      cy.request({
        url: `${BASE_URL}/assignments/${asgnId}`,
        method: "DELETE",
        headers: {
          authorization: body.result.token,
          "Content-Type": "application/json"
        }
      }).then(({ body }) => {
        console.log(`${asgnId} :: `, body.result);
      });
    });
  });
});

Cypress.Commands.add(
  "makeSelection",
  {
    prevSubject: "element"
  },
  subject => {
    cy.wrap(subject)
      .trigger("mousedown")
      .then($el => {
        const el = $el[0];
        const document = el.ownerDocument;
        const range = document.createRange();
        range.selectNodeContents(el);
        document.getSelection().removeAllRanges(range);
        document.getSelection().addRange(range);
      })
      .trigger("mouseup");

    cy.document().trigger("selectionchange");
  }
);

Cypress.Commands.add(
  "verifyNumInput",
  {
    prevSubject: "element"
  },
  (subject, step) => {
    const exp = `${step + 1}`;
    cy.wrap(subject)
      .type("{selectall}")
      .type(1)
      .should("have.value", "1")
      .type("{uparrow}")
      .should("have.value", exp)
      .type("{downarrow}")
      .should("have.value", "1");
  }
);

Cypress.Commands.add("logOut", () => {
  cy.clearLocalStorage();
  cy.visit("/").then(win => {
    win.localStorage.clear();
  });
});

Cypress.Commands.add("uploadImage", base64Image => {
  const formData = new FormData();
  formData.append("file", base64Image);
  cy.request({
    url: `${BASE_URL}/auth/login`,
    method: "POST",
    body: DEFAULT_USERS.teacher
  }).then(({ body }) =>
    cy
      .server()
      .route("POST", `${BASE_URL}/file/upload`)
      .as("formRequest")
      .window()
      .then(win => {
        const xhr = new win.XMLHttpRequest();
        xhr.open("POST", `${BASE_URL}/file/upload`);
        xhr.setRequestHeader("authorization", body.result.token);
        xhr.send(formData);
      })
      .wait("@formRequest")
  );
});

class DndSimulatorDataTransfer {
  data = {};

  dropEffect = "move";

  effectAllowed = "all";

  files = [];

  items = [];

  types = [];

  clearData(format) {
    if (format) {
      delete this.data[format];

      const index = this.types.indexOf(format);
      delete this.types[index];
      delete this.data[index];
    } else {
      this.data = {};
    }
  }

  setData(format, data) {
    this.data[format] = data;
    this.items.push(data);
    this.types.push(format);
  }

  getData(format) {
    if (format in this.data) {
      return this.data[format];
    }

    return "";
  }
}

Cypress.Commands.add(
  "customDragDrop",
  {
    prevSubject: "element"
  },
  (sourceSelector, targetSelector, options) => {
    const dataTransfer = new DndSimulatorDataTransfer();
    const opts = {
      offsetX: 100,
      offsetY: 100,
      ...(options || {})
    };

    cy.wrap(sourceSelector.get(0))
      .trigger("dragstart", {
        dataTransfer
      })
      .trigger("drag", {});

    cy.get(targetSelector).then($el => {
      const { x, y } = $el.get(0).getBoundingClientRect();

      cy.wrap($el.get(0))
        .trigger("dragover", {
          dataTransfer
        })
        .trigger("drop", {
          dataTransfer,
          clientX: x + opts.offsetX,
          clientY: y + opts.offsetY
        })
        .trigger("dragend", {
          dataTransfer
        });
    });
  }
);

Cypress.Commands.add("uploadFile", (fileName, selector) =>
  cy.get(selector).then(subject =>
    cy
      .fixture(fileName, "base64")
      .then(Cypress.Blob.base64StringToBlob)
      .then(blob => {
        const el = subject[0];
        const testFile = new File([blob], fileName, {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(testFile);
        el.files = dataTransfer.files;
        return subject;
      })
  )
);

Cypress.Commands.add("selectQuestionType", ({ editItem, queData, itemId = ITEM_ID }) => {
  // create new que and select type
  editItem.getItemWithId(itemId);
  editItem.deleteAllQuestion();
  editItem.addNew().chooseQuestion(queData.group, queData.queType);
});

Cypress.Commands.add("deleteOldQuestion", ({ editItem, itemId = ITEM_ID }) => {
  editItem.getItemWithId(itemId);
  editItem.deleteAllQuestion();
});

Cypress.Commands.add(
  "typeWithDelay",
  {
    prevSubject: "element"
  },
  (subject, typeObject) => {
    cy.wrap(subject).type(typeObject, { force: true, delay: 100 });
  }
);

Cypress.Commands.add(
  "movesCursorToEnd",
  {
    prevSubject: "element"
  },
  (subject, length) => {
    cy.wrap(subject).type("{rightarrow}".repeat(length), { force: true });
  }
);
