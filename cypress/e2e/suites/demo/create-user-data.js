const BASE_URL = Cypress.config("API_URL");

const districtId = "5d00a260ddd15a3a52c124a9";
const institutionId = "5e0dba2dbd61a000075e288b";

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

let standards = {
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

let group = {
  thumbnail: "https://cdn.edulastic.com/images/classThumbnails/learning-7.jpg-3.jpg",
  startDate: `${new Date().getTime()}`,
  endDate: "1880064000000",
  grades: ["K"],
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

const suiteName = "hogwarts";
const teacherCount = 1;
const classPerTeacherCount = 4;
const studentsPerClassCount = 100;
const studentStart = 200;
const studentMax = studentStart + studentsPerClassCount;

function getUser(suiteKey, role, i) {
  const user = {};
  user.firstName = `${role}.${i}`;
  user.lastName = suiteKey;
  user.email = `${role}.${i}.${suiteKey}@automation.com`.toLowerCase();
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

describe("create-test-data", () => {
  it("create data", () => {
    window.localStorage.clear();
    window.sessionStorage.clear();

    const teacher = {
      firstName: `Severus`,
      lastName: "Snape",
      email: "severus.snape@hogwarts.com",
      password: "snapwiz",
      role: `teacher`
    };
    // getUser(suiteName, "teacher", 1);
    loginUser(teacher).then(user => {
      // signupUser(teacher).then(user => {
      // SETTING SCHOOL
      const setSchoolBody = school;
      setSchoolBody.email = teacher.email.toLowerCase();
      setSchoolBody.firstName = teacher.firstName;
      setSchoolBody.lastName = teacher.lastName;
      /*   cy.request({
        url: `${BASE_URL}/user/${user._id}`,
        method: "PUT",
        body: setSchoolBody,
        headers: {
          Authorization: user.token,
          "Content-Type": "application/json"
        }
      }).then(({ status }) => {
        expect(status).to.eq(200);
        console.log(`school set :: ${teacher.role} :: ${teacher.email}`);

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
          expect(status).to.eq(200);
          console.log(`standard set :: ${teacher.role} :: ${teacher.email}`);

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
            expect(status).to.eq(200);
            console.log(`signup done :: ${teacher.role} :: ${teacher.email}`);
 */
      // CREATE CLASS
      group.name = `Automation Class - ${suiteName} ${teacher.firstName} - Class 5`;
      group.parent = {
        id: user._id
      };
      group.owners = [user._id];

      cy.request({
        url: `${BASE_URL}/group`,
        method: "POST",
        body: group,
        headers: {
          Authorization: user.token,
          "Content-Type": "application/json"
        }
      }).then(({ status, body }) => {
        let students = {};
        const { code, _id } = body.result;
        expect(status).to.eq(200);
        console.log(`class created :: ${_id} :: ${code} :: '${group.name}'`);

        // CREATE STUDENTS
        for (let index = studentStart; index < studentMax; index++) {
          const student = getUser(suiteName, "student", index + 1);
          student.code = code;
          signupUser(student); // "khioio5, student.1"
          students[index + 1] = {
            email: student.email,
            stuName: `${student.lastName}, ${student.firstName}`
          };
        }
        console.log("students :: ", students);
        console.log("students string:: ", JSON.stringify(students));
      });
    });
  });
  //     });
  //   });
  // });
});
