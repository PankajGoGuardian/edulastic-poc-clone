/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable no-loop-func */

import { classes } from "./temp-class";

const BASE_URL = Cypress.config("API_URL");

// const districtId = "5dce7e3f3d12210006256c58";
// const institutionId = "5e3a9f9e953588000806332c";

// const districtId = "5d00a260ddd15a3a52c124a9";
// const institutionId = "5e0dba2dbd61a000075e288b";

// AMIT
const districtId = "5eb42520254763000734b599";
const institutionId = "5eb42520254763000734b5a0";

const allGrades = ["K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

const school = {
  institutionIds: [institutionId],
  currentSignUpState: "PREFERENCE_NOT_SELECTED",
  districtId
};

const teacherSignupDone = {
  currentSignUpState: "DONE",
  institutionIds: [institutionId],
  districtId
};

const standards = {
  districtId,
  orgType: "teacher",
  isSignUp: true,
  curriculums: [
    {
      _id: 212,
      name: "Math - Common Core",
      subject: "Mathematics",
      grades: ["K"]
    }
  ],
  defaultGrades: ["K"],
  defaultSubjects: ["Mathematics"]
};

const endDate = new Date().setFullYear(new Date().getFullYear() + 1);

const group = {
  thumbnail: "https://cdn.edulastic.com/images/classThumbnails/learning-7.jpg-3.jpg",
  startDate: `${new Date().getTime()}`,
  endDate: `${endDate}`,
  grades: [],
  subject: "Mathematics",
  standardSets: [
    {
      _id: 212,
      name: "Math - Common Core"
    }
  ],
  tags: [],
  type: "class",
  institutionId,
  districtId
};

const suiteName = "";
const classPerTeacherCount = 1;
const studentsPerClassCount = 300;
const domain = "edulastic";
let studentNumber = 1; // 137;
let teacherNumber = 1;
const teacherCount = teacherNumber + 0;

function getUser(classs, role, i) {
  const user = {};
  user.firstName = classs;
  user.lastName = `${role === "teacher" ? "t" : "student"}${i < 10 ? "00" : i < 100 ? "0" : ""}${i}`;
  user.email = `${classs}.student${i < 10 ? "00" : i < 100 ? "0" : ""}${i}@${domain}.com`.toLowerCase();
  user.password = "snapwiz";
  user.role = `${role}`;
  return user;
}

function signupUser(user) {
  return cy
    .request({
      url: `${BASE_URL}/auth/signup`,
      method: "POST",
      body: user
    })
    .then(({ status, body }) => {
      const { token, _id, email, role } = body.result;
      expect(status).to.eq(200);
      console.log(`user created :: ${role} :: ${email} :: _id:${_id}`);
      return { _id, token };
    });
}

function loginUser(user) {
  return cy
    .request({
      url: `${BASE_URL}/auth/login`,
      method: "POST",
      body: { password: user.password, username: user.email }
    })
    .then(({ status, body }) => {
      const { token, _id } = body.result;
      expect(status).to.eq(200);
      console.log(`user login :: ${user.role} :: ${user.email} :: _id:${_id}`);
      return { _id, token };
    });
}

const groupUpdate = {
  thumbnail: "https://cdn.edulastic.com/images/classThumbnails/learning-7.jpg-3.jpg",
  tags: [],
  startDate: "1581513135926",
  endDate: "1613134799000",
  subject: "Mathematics",
  standardSets: [
    {
      _id: 212,
      name: "Math - Common Core"
    }
  ],
  institutionId,
  districtId,
  type: "class"
};

// const teachers = ["t001@v2demo.com"];

describe("create-test-data", () => {
  it("create data", () => {
    window.localStorage.clear();
    window.sessionStorage.clear();

    for (; teacherNumber <= teacherCount; teacherNumber++) {
      // const teacher = getUser(suiteName, "teacher", teacherNumber);
      const teacher = {
        firstName: "teacher",
        lastName: `spr`,
        email: "teacher.spr@edulastic.com",
        password: "snapwiz",
        role: `teacher`
      };

      loginUser(teacher).then(user => {
        // signupUser(teacher).then(user => {
        // cy.wait(300);

        /*         // START
        // SETTING SCHOOL
        const setSchoolBody = school;
        setSchoolBody.email = teacher.email.toLowerCase();
        setSchoolBody.firstName = teacher.firstName;
        setSchoolBody.lastName = teacher.lastName;
        cy.request({
          url: `${BASE_URL}/user/${user._id}`,
          method: "PUT",
          body: setSchoolBody,
          headers: {
            Authorization: user.token,
            "Content-Type": "application/json"
          }
        }).then(({ status }) => {
          cy.wait(300);
          expect(status).to.eq(200);
          //   console.log(`school set :: ${teacher.role} :: ${teacher.email}`);

          // SETTING STANDARDS
          const setStandardBody = standards;
          setStandardBody.orgId = user._id;
          cy.request({
            url: `${BASE_URL}/setting/interested-standards`,
            method: "POST",
            body: setStandardBody,
            headers: {
              Authorization: user.token,
              "Content-Type": "application/json"
            }
          }).then(({ status }) => {
            cy.wait(300);

            expect(status).to.eq(200);
            // console.log(`standard set :: ${teacher.role} :: ${teacher.email}`);

            // SETTING FINAL STATUS
            teacherSignupDone.email = teacher.email;
            cy.request({
              url: `${BASE_URL}/user/${user._id}`,
              method: "PUT",
              body: teacherSignupDone,
              headers: {
                Authorization: user.token,
                "Content-Type": "application/json"
              }
            }).then(({ status }) => {
              cy.wait(300);

              expect(status).to.eq(200);
              console.log(`signup done :: ${teacher.role} :: ${teacher.email}`);
              // END */
        // for (let classNumber = 1; classNumber <= classPerTeacherCount; classNumber++) {

        classes.forEach((cls, i) => {
          if (i == 9) {
            cy.wait(1).then(() => {
              let classNumber = i + 1;
              const { code } = cls;

              // cy.wait(1).then(() => {
              console.log("classNumber", classNumber);
              console.log("classCode", code);

              /*   // CREATE CLASS
            group.name = `SPR Class-${classNumber}`;
            group.parent = {
              id: user._id
            };
            group.owners = [user._id];
            group.grades = [allGrades[Math.floor(Math.random() * allGrades.length)]];
            cy.request({
              url: `${BASE_URL}/group`,
              method: "POST",
              body: group,
              headers: {
                Authorization: user.token,
                "Content-Type": "application/json"
              }
            }).then(({ status, body }) => {
              cy.wait(300);

              let students = [];
              const { code, _id } = body.result;
              expect(status).to.eq(200);
              console.log(`class created :: ${_id} :: ${code} :: '${group.name}'`);
 */
              let students = [];

              // CREATE STUDENTS
              for (let index = 1; index <= studentsPerClassCount; index++) {
                cy.wait(1).then(() => {
                  const student = getUser(`c${classNumber}`, "student", index);
                  student.code = code;
                  signupUser(student);
                  studentNumber++;
                  // "khioio5, student.1"
                  students.push(student.email);
                });
              }
              // console.log("students :: ", students);
              cy.wait(1).then(() => console.log("students string:: ", JSON.stringify(students)));
              // });
            });
          }
        });

        // });
        // }
      });
      // });
      // });
      // });
    }
  });

  /* teachers.forEach(teausername => {
    it(`fix class - ${teausername}`, () => {
      cy.request({
        url: `${BASE_URL}/auth/login`,
        method: "POST",
        body: { password: "edulastic", username: teausername }
      }).then(({ status, body }) => {
        const { token, _id, orgData } = body.result;
        expect(status).to.eq(200);
        console.log(`user login :: ${teausername} `);
        orgData.classList.forEach(({ _id: classId, name }) => {
          cy.wait(300).then(() => {
            groupUpdate.parent = {
              id: _id
            };
            groupUpdate.owners = [_id];
            groupUpdate.grades = [allGrades[Math.floor(Math.random() * allGrades.length)]];
            groupUpdate.name = name;
            cy.request({
              url: `${BASE_URL}/group/${classId}`,
              method: "PUT",
              body: groupUpdate,
              headers: {
                Authorization: token,
                "Content-Type": "application/json"
              }
            }).then(({ status }) => {
              cy.wait(300);
              expect(status).to.eq(200);
            });
          });
        });
      });
    });
  }); */
});
