/* eslint-disable cypress/no-unnecessary-waiting */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress"/>
import { addMatchImageSnapshotCommand } from "cypress-image-snapshot/command";
import { userBuilder } from "./generate";
import LoginPage from "../e2e/framework/student/loginPage";
import { getAccessToken } from "../../packages/api/src/utils/Storage";
import { getMimetype } from "./misc/mimeTypes";
import DndSimulatorDataTransfer from "./misc/dndSimulator";
import FileHelper from "../e2e/framework/util/fileHelper";
import "cypress-file-upload";

const screenResolutions = Cypress.config("SCREEN_SIZES");
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

addMatchImageSnapshotCommand({
  failureThreshold: 100, // threshold for entire image
  failureThresholdType: "pixel", // pixel/percent for of total pixels
  customDiffConfig: { threshold: 0.0 }, // threshold for each pixel
  capture: "viewport" // capture only viewport in screenshot
});

// overriding Cypress command
Cypress.LocalStorage.clear = () => {};

Cypress.Commands.add("setResolution", size => {
  if (Cypress._.isArray(size)) {
    cy.viewport(size[0], size[1]);
  } else {
    cy.viewport(size);
  }
});

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

Cypress.Commands.add("isPageScrollPresent", (scrollOffset = 10, pageHeight) =>
  cy.document().then(doc => {
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
  })
);

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
  // FIXME: sometimgs app fails to load to login page
  if (Cypress.$(".footerDropdown").length > 0) {
    Cypress.$(".footerDropdown").click();
    Cypress.$('[data-cy="footer-dropdown"]').click();
    Cypress.$('[data-cy="signout"]').click();
  }

  const login = new LoginPage();
  cy.visit("/login");
  cy.server();
  cy.route("GET", "**/test-activity/**").as("testActivity");
  cy.route("GET", "**curriculum**").as("apiLoad");
  cy.route("GET", "**assignments**").as("assignment");
  cy.route("POST", "**/auth/**").as("auth");
  cy.route("POST", "**/search/courses").as("searchCourse");
  cy.route("GET", "**/dashboard/**").as("teacherDashboard");
  cy.route("GET", "**/api/user-context?name=RECENT_PLAYLISTS").as("curatorDash");
  login.fillLoginForm(postData.username, postData.password);
  login.clickOnSignin();
  cy.wait("@auth");

  switch (role) {
    case "teacher":
      cy.wait("@teacherDashboard");
      cy.wait("@searchCourse");
      break;
    case "student":
      cy.wait("@assignment");
      cy.wait("@testActivity");
      break;
    case "publisher":
    case "curator":
      cy.wait("@curatorDash");
      break;
    default:
      break;
  }
  // conditionally closing pendo guide if pops up
  if (Cypress.$("._pendo-close-guide").length > 0) {
    Cypress.$("._pendo-close-guide").click();
  }
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
        }).then(({ body: assignResponseBody }) => {
          console.log("Assignment Assigned = ", assignResponseBody.result._id);
        });
      });
    });
  }
);

Cypress.Commands.add("deleteAllAssignments", (student, teacher, password = "snapwiz", testsToExclude = []) => {
  const asgnIds = [];
  const testAssign = [];
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
    }).then(({ body: responseBody }) => {
      const assignments = responseBody.result.assignments || responseBody.result;
      const tests = responseBody.result.tests || [];
      assignments.forEach(asgnDO => {
        const assignment = {};
        assignment._id = asgnDO._id;
        assignment.groupId = asgnDO.classId || asgnDO.class[0]._id;
        asgnIds.push(assignment);
      });
      tests.forEach(test => {
        if (testsToExclude.indexOf(test._id) === -1) testAssign.push(test._id);
      });
      console.log("All Assignments = ", asgnIds);
      console.log("All Tests = ", testAssign);
      // TODO: FIX this once it is fixed in UI
      // asgnIds.forEach(({ _id, groupId }) => {
      //   cy.request({
      //     url: `${BASE_URL}/assignments/${_id}/group/${groupId}`, // added groupId as per API change
      //     method: "DELETE",
      //     headers: {
      //       authorization: authToken,
      //       "Content-Type": "application/json"
      //     }
      //   }).then(({ body }) => {
      //     console.log(`${_id} :: `, body.result);
      //   });
      // });

      testAssign.forEach(test => {
        cy.request({
          url: `${BASE_URL}/test/${test}/delete-assignments`,
          method: "DELETE",
          headers: {
            authorization: authToken,
            "Content-Type": "application/json"
          },
          retryOnStatusCodeFailure: true // cause 502 intermittently and blocks complete suite, now will retry on such occurences
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
      cy.wrap($el.get(0)).as("target");

      cy.get("@target").trigger("dragover", {
        dataTransfer
      });
      cy.get("@target").trigger("drop", {
        dataTransfer,
        clientX: x + opts.offsetX,
        clientY: y + opts.offsetY
      });
      // cy.get("@target").trigger("dragend", {
      //   dataTransfer
      // });
    });
  }
);

/* 
@param fileName : 'testImages/sample.jpg'
@param selector : valid element selector eg: 'input[type=file]'
@param subjectType : 'input' / 'drag-n-drop'
*/
Cypress.Commands.add("uploadFile", (fileName, selector, subjectType = "input") =>
  cy.get(selector).then(subject => {
    cy.fixture(fileName, "base64").then(fileContent => {
      cy.server();
      cy.route("POST", /edureact/g).as("fileUpload");
      cy.wrap(subject)
        .upload({ fileContent, fileName, mimeType: getMimetype(fileName) }, { subjectType })
        .then(() => cy.wait("@fileUpload").then(() => subject));
    });
  })
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
