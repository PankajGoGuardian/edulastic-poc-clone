/* eslint-disable cypress/no-unnecessary-waiting */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress"/>
import { addMatchImageSnapshotCommand } from "cypress-image-snapshot/command";
import { userBuilder } from "./generate";
import LoginPage from "../e2e/framework/student/loginPage";
import { getAccessToken } from "../../packages/api/src/utils/Storage";
import FileHelper from "../e2e/framework/util/fileHelper";

const screenResolutions = Cypress.config("SCREEN_SIZES");

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
    username: "ashishsnap@snawpiz.com",
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

Cypress.Commands.add("matchImageSnapshotWithSize", filename => {
  cy.wait(300);
  return cy.document().then(doc => {
    const testName = FileHelper.getTestFullName();
    let width;

    for (const res of screenResolutions) {
      width = testName.includes(res) ? res[0] : undefined;
      if (width) break;
    }

    const screenshotFile = `${width || doc.body.clientWidth}/${filename || testName}`;
    cy.matchImageSnapshot(screenshotFile);
  });
});

Cypress.Commands.add("isPageScrollPresent", (scrollOffset = 10, pageHeight) => {
  return cy.document().then(doc => {
    const scrollHeight = pageHeight || doc.body.scrollHeight;
    const scroll = {
      scrollHeight,
      clientHeight: doc.body.clientHeight,
      hasScroll: doc.body.scrollHeight > doc.body.clientHeight,
      minScrolls: Cypress._.ceil(scrollHeight / (doc.body.clientHeight - scrollOffset)) - 1,
      scrollSize: doc.body.clientHeight - scrollOffset
    };
    console.log("scroll", JSON.stringify(scroll));
    return scroll;
  });
});

Cypress.Commands.add("scrollPageAndMatchImageSnapshots", (scrollOffset, pageHeight, pageContext) => {
  cy.isPageScrollPresent(scrollOffset, pageHeight).then(({ hasScroll, minScrolls, scrollSize }) => {
    if (hasScroll) {
      let scrollNum = 1;
      let scrollInPixel = scrollSize;
      const testName = FileHelper.getTestFullName();

      while (scrollNum <= minScrolls) {
        if (pageContext) {
          cy.wrap(pageContext).scrollTo(0, scrollInPixel);
        } else cy.scrollTo(0, scrollInPixel);
        cy.wait(1000);
        cy.matchImageSnapshotWithSize(`${testName}-scroll-${scrollNum}`);
        scrollNum += 1;
        scrollInPixel += scrollSize;
      }
    } else cy.log("Page scroll not found, not taking scrolled screenshots");
  });
});

Cypress.Commands.add("clearToken", () => {
  window.localStorage.clear();
  window.sessionStorage.clear();
});

Cypress.Commands.add("setToken", (email = DEFAULT_USERS.teacher.username, password = "snapwiz") => {
  const user = {
    password
  };

  user.username = email;
  window.localStorage.clear();
  window.sessionStorage.clear();
  cy.request({
    url: `${BASE_URL}/auth/login`,
    method: "POST",
    body: user
  }).then(({ body }) => {
    const { _id: userId, role } = body.result;
    const tokenKey = `user:${userId}:role:${role}`;
    window.localStorage.setItem("defaultTokenKey", tokenKey);
    window.localStorage.setItem(tokenKey, body.result.token);
    return userId;
  });
});

Cypress.Commands.add("getToken", () => getAccessToken());

Cypress.Commands.add("assertHome", () => {
  cy.url().should("eq", `${Cypress.config().baseUrl}/`);
});

Cypress.Commands.add("login", (role = "teacher", email, password = "snapwiz") => {
  const postData = {};
  postData.username = !email
    ? role === "teacher"
      ? DEFAULT_USERS.teacher.username
      : DEFAULT_USERS.student.username
    : email;
  postData.password = password;
  cy.clearToken();
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
  cy.route("POST", "**/search/courses").as("searchCourse");
  cy.route("GET", "**/dashboard/**").as("teacherDashboard");
  login.fillLoginForm(postData.username, postData.password);
  login.clickOnSignin();
  cy.wait("@auth");
  if (role === "teacher") {
    cy.wait("@teacherDashboard");
    cy.wait("@searchCourse");
  } else cy.wait("@assignment");
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

Cypress.Commands.add("deleteAllAssignments", (student, teacher, password = "snapwiz") => {
  const asgnIds = [];
  let authToken;
  cy.request({
    url: `${BASE_URL}/auth/login`,
    method: "POST",
    body: { username: teacher, password }
  }).then(({ body }) => {
    authToken = body.result.token;

    cy.request({
      url: `${BASE_URL}/assignments`,
      method: "GET",
      headers: {
        authorization: authToken,
        "Content-Type": "application/json"
      }
    }).then(({ body }) => {
      const assignments = body.result.assignments || body.result;
      assignments.forEach(asgnDO => {
        const assignment = {};
        assignment._id = asgnDO._id;
        assignment.groupId = asgnDO.classId || asgnDO.class[0]._id;
        asgnIds.push(assignment);
      });
      console.log("All Assignments = ", asgnIds);

      asgnIds.forEach(({ _id, groupId }) => {
        cy.request({
          url: `${BASE_URL}/assignments/${_id}/group/${groupId}`, // added groupId as per API change
          method: "DELETE",
          headers: {
            authorization: authToken,
            "Content-Type": "application/json"
          }
        }).then(({ body }) => {
          console.log(`${_id} :: `, body.result);
        });
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
