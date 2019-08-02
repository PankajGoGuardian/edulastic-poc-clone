// eslint-disable-next-line spaced-comment
/// <reference types="Cypress"/>
import { addMatchImageSnapshotCommand } from "cypress-image-snapshot/command";
import { userBuilder } from "./generate";
import LoginPage from "../e2e/framework/student/loginPage";

addMatchImageSnapshotCommand({
  failureThreshold: 100, // threshold for entire image
  failureThresholdType: "pixel", // pixel/percent for of total pixels
  customDiffConfig: { threshold: 0.0 }, // threshold for each pixel
  capture: "viewport" // capture only viewport in screenshot
});

Cypress.Commands.add("setResolution", size => {
  if (Cypress._.isArray(size)) {
    cy.viewport(size[0], size[1]);
  } else {
    cy.viewport(size);
  }
});

Cypress.LocalStorage.clear = () => {};
const BASE_URL = Cypress.config("API_URL");
const DEFAULT_USERS = {
  teacher: {
    username: "auto.teacher1@snapwiz.com",
    password: "snapwiz"
  },
  student: {
    username: "auto.student3@snapwiz.com",
    password: "snapwiz"
  }
};

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

Cypress.Commands.add("setToken", (email = DEFAULT_USERS.teacher.username) => {
  const user = {
    password: "snapwiz"
  };

  user.username = email;
  window.localStorage.clear();
  cy.request({
    url: `${BASE_URL}/auth/login`,
    method: "POST",
    body: user
  }).then(({ body }) => {
    const { _id: userId, role } = body.result;
    const tokenKey = `user:${userId}:role:${role}`;
    window.localStorage.setItem("defaultTokenKey", tokenKey);
    window.localStorage.setItem(tokenKey, body.result.token);
  });
});

Cypress.Commands.add("assertHome", () => {
  cy.url().should("eq", `${Cypress.config().baseUrl}/`);
});

Cypress.Commands.add("login", (role = "teacher", email, password = "snapwiz") => {
  const postData = {};
  postData.username = !email ? (role === "teacher" ? DEFAULT_USERS.teacher.email : DEFAULT_USERS.student.email) : email;
  postData.password = password;
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
  cy.route("POST", "**/auth/**").as("auth");
  login.fillLoginForm(postData.username, postData.password);
  login.onClickSignin();
  cy.wait("@auth");
  // .then(() => {
  // TODO: wierd login issue redirects doesn't happens automatically
  /*   if (role === "teacher") {
    cy.visit("/author/assignments");
  } else {
    cy.visit("/home/assignments");
  } */
  cy.wait("@assignment");
});

Cypress.Commands.add(
  "assignAssignment",
  (
    testId = "",
    startDt = new Date(),
    dueDt = new Date(new Date().setDate(startDt.getDate() + 1)),
    assignmentKey = "default"
  ) => {
    cy.request({
      url: `${BASE_URL}/auth/login`,
      method: "POST",
      body: DEFAULT_USERS.teacher
    }).then(({ body }) => {
      cy.fixture("assignments").then(asgns => {
        const postData = asgns[assignmentKey];
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

Cypress.Commands.add("deleteAllAssignments", (student, teacher) => {
  const asgnIds = [];

  cy.request({
    url: `${BASE_URL}/auth/login`,
    method: "POST",
    body: student ? { username: student, password: "snapwiz" } : DEFAULT_USERS.student
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
    body: teacher ? { username: teacher, password: "snapwiz" } : DEFAULT_USERS.teacher
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
        cy.server();
        cy.route("POST", "**/file/**").as("fileUpload");
        const el = subject[0];
        const testFile = new File([blob], fileName, {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(testFile);
        el.files = dataTransfer.files;
        return cy.wait("@fileUpload").then(() => subject);
      })
  )
);

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
