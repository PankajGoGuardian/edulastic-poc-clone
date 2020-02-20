/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable no-loop-func */
const BASE_URL = Cypress.config("API_URL");

const districtId = "5d6f541e5abd8778a64e590c";
const institutionId = "5de0f9054bf9dc0007c3a84a";
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

const group = {
  thumbnail: "https://cdn.edulastic.com/images/classThumbnails/learning-7.jpg-3.jpg",
  startDate: `${new Date().getTime()}`,
  endDate: "1613134799000",
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
const teacherCount = 1;
const classPerTeacherCount = 2;
const studentsPerClassCount = 10;
const domain = "v2demodata3";
let studentNumber = 1; // 137;
let teacherNumber = 1;

function getUser(classs, role, i) {
  const user = {};
  user.firstName = role;
  user.lastName = `${role === "teacher" ? "t" : "s"}${i < 10 ? "00" : i < 100 ? "0" : ""}${i}`;
  user.email = `${role === "teacher" ? "t" : "s"}${
    i < 10 ? "00" : i < 100 ? "0" : ""
  }${i}@${domain}.com`.toLowerCase();
  user.password = "edulastic";
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

const teachers = ["t001@v2demo.com"];

describe.skip("create-test-data", () => {
  it("create data", () => {
    window.localStorage.clear();
    window.sessionStorage.clear();

    for (; teacherNumber <= teacherCount; teacherNumber++) {
      const teacher = getUser(suiteName, "teacher", teacherNumber);
      // loginUser(teacher).then(user => {
      signupUser(teacher).then(user => {
        cy.wait(300);
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

              for (let classNumber = 1; classNumber <= classPerTeacherCount; classNumber++) {
                cy.wait(100).then(() => {
                  console.log("classNumber", classNumber);
                  // CREATE CLASS
                  group.name = `${teacher.lastName}c${
                    classNumber < 10 ? "00" : "0"
                  }${classNumber}${domain}`;
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

                    // CREATE STUDENTS
                    for (let index = 1; index <= studentsPerClassCount; index++) {
                      cy.wait(300).then(() => {
                        const student = getUser(group.name, "student", studentNumber);
                        student.code = code;
                        signupUser(student);
                        studentNumber++;
                        // "khioio5, student.1"
                        students.push(student.email);
                      });
                    }
                    // console.log("students :: ", students);
                    console.log("students string:: ", JSON.stringify(students));
                  });
                });
              }
            });
          });
        });
      });
    }
  });

  teachers.forEach(teausername => {
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
  });
});
