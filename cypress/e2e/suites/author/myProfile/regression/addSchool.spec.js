import StudentTestPage from "../../../../framework/student/studentTestPage";
import TestAssignPage from "../../../../framework/author/tests/testDetail/testAssignPage";
import AssignmentsPage from "../../../../framework/student/assignmentsPage";
import TeacherSideBar from "../../../../framework/author/SideBarPage";
import MyProfile from "../../../../framework/author/myProfilePage";
import FileHelper from "../../../../framework/util/fileHelper";
import TeacherManageClassPage from "../../../../framework/author/manageClassPage";
import { grades } from "../../../../framework/constants/assignmentStatus";
import AuthorAssignmentPage from "../../../../framework/author/assignments/AuthorAssignmentPage";
import Helpers from "../../../../framework/util/Helpers";


describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Add new school`, () => {

    const sideBarPage = new TeacherSideBar()
    const myProfile = new MyProfile()
    const manageClass = new TeacherManageClassPage();
    const authorAssignmentPage = new AuthorAssignmentPage();
    const startDate = new Date();
    const studentPage = new AssignmentsPage();
    const testAssignPage = new TestAssignPage();
    const test = new StudentTestPage();

    const schoolData = {
        schoolName: "Auto_school_",
        address: "Test address",
        city: "Test city",
        zip: "01230",
        state: "Alaska",
        existingSchools: ["Visual Regression Automation", "Automation School - Regression Suite", "Automation School - Smoke Suite"],
        zipSearch: "987654321",
        citySearch: "Bangalore"
    }

    let schoolName;
    let className;
    let username;
    let rejoinClassName;

    /* var testData = {
        subjects: ["ELA", "Mathematics"],
        grades: ["Grade 5", "Grade 6"],
        tags: ["test-tag-3", "test-tag-4"],
        items: ["ESSAY_RICH.default", "ESSAY_RICH.2", "ESSAY_RICH.5"],
        name: "test_1",
        description: "This is test_1",
        id: "5ef9e308dd76ba000717229b"
    } */

    const classData = {
        className: `Auto_Class_`,
        grade: grades.GRADE_10,
        subject: "Mathematics",
        standardSet: "Math - Common Core",
        testID: "5f118b5c7379eb000800f0fa"
    }

    const studData = {
        username: "auto_stud_",
        name: "autoStud",
        password: "snapwiz"
    }

    const endDate = new Date(new Date().setDate(startDate.getDate() + 30));

    before(() => {
        cy.login('teacher', 'teacherProfile.auto@snapwiz.com', 'automation');
        // Create test
        /* testLibraryPage.createTest().then(id => {
            classData.testID = id
        }); */
    });

    context(" > Search and select school", () => {

        before(() => {
            sideBarPage.clickMyProfile()
        })

        beforeEach(() =>{
            myProfile.closePopup()
        })

        it("> Existing schools", () => {
            myProfile.clickOnAddSchool()
            myProfile.verifyExistingSchools(schoolData.existingSchools)
        })

        it(" > Search and select school", () => {
            myProfile.clickOnAddSchool()
            myProfile.searchAndSelectSchool(schoolData.existingSchools[1])
        })

        it(" > Search school with Zip", () => {
            myProfile.clickOnAddSchool()
            myProfile.searchAndSelectSchool(schoolData.existingSchools[1], schoolData.zipSearch)
        })

        it(" > Search school with City", () => {
            myProfile.clickOnAddSchool()
            myProfile.searchAndSelectSchool(schoolData.existingSchools[2], schoolData.citySearch)
        })

        it(" > Verify if school is selected", () => {
            myProfile.clickOnAddSchool()
            myProfile.searchAndSelectSchool(schoolData.existingSchools[1])
            myProfile.clickProceed()
            myProfile.isSchoolInMySchools(schoolData.existingSchools[1])
        })

        it(" > Remove school from My Schools", () => {
            myProfile.removeSchool(schoolData.existingSchools[1])
            cy.login('teacher', 'teacherProfile.auto@snapwiz.com', 'automation')
            sideBarPage.clickMyProfile()
            myProfile.isSchoolNotInMySchools(schoolData.existingSchools[1])
        })
    })

    context(" > Add new school", () => {

        beforeEach(() =>{
            cy.reload()
            sideBarPage.clickOnDashboard()
        })

        it(" > Add new school while joining existing school", () => {
            sideBarPage.clickMyProfile()
            myProfile.clickOnAddSchool()
            myProfile.searchAndSelectSchool(schoolData.existingSchools[1])
            schoolName = schoolData.schoolName + Helpers.getRamdomString()
            myProfile.requestNewSchool(schoolName, schoolData.address, schoolData.city
                , schoolData.zip, schoolData.state)
            myProfile.isSchoolInMySchools(schoolName)
            myProfile.removeSchool(schoolName)
        });

        it(" > Add new school", () => {
            sideBarPage.clickMyProfile()
            myProfile.clickOnAddSchool()
            schoolName = schoolData.schoolName + Helpers.getRamdomString()
            myProfile.requestNewSchool(schoolName, schoolData.address, schoolData.city
                , schoolData.zip, schoolData.state)
            myProfile.isSchoolInMySchools(schoolName)
        });

        it(" > Create a class in the new school", () => {
            sideBarPage.clickOnManageClass();
            manageClass.clickOnCreateClass();
            username = studData.username + Helpers.getRamdomString()
            className = classData.className + Helpers.getRamdomString()
            manageClass.fillClassDetails(className, startDate, endDate, classData.grade, classData.subject, classData.standardSet);
            manageClass.verifyIfSchoolPresent(schoolName)
            manageClass.selectSchool(schoolName)
            manageClass.clickOnSaveClass();
            manageClass.clickOnAddStudent()
            manageClass.fillStudentDetails(username, studData.name, studData.password)
            manageClass.clickOnAddUserButton()
            sideBarPage.clickOnManageClass();
            manageClass.verifyClassRowVisibleByName(className)
        })

        it(" > Verify class is in Assign page and Assign", () => {
            testAssignPage.visitAssignPageById(classData.testID)
            testAssignPage.selectClass(className)
            testAssignPage.clickOnAssign()
        })

        it(" > Verify class is in Assignment Page filter", () => {
            sideBarPage.clickOnAssignment()
            authorAssignmentPage.smartFilter.expandFilter();
            authorAssignmentPage.smartFilter.setClass(className)
            authorAssignmentPage.getAssignmentRowsTestById(classData.testID)
        })

        it(" > Verify school displayed in Student and attempt", () => {
            cy.login('student', username, studData.password)
            studentPage.getclass(className)
            studentPage.getAssignmentByTestId(classData.testID)
            studentPage.clickOnAssigmentByTestId(classData.testID)
            test.clickOnChoice("A")
            test.clickOnNext()
            test.submitTest()
        })

    })

    context(" > Archive and unarchive classes", () => {
        
        before(() => {
            cy.login('teacher', 'teacherProfile.auto@snapwiz.com', 'automation');
        });

        beforeEach(() =>{
            cy.reload()
            sideBarPage.clickOnDashboard()
        })

        it(" > Verify classes from other schools", () => {

            sideBarPage.clickMyProfile()
            myProfile.clickOnAddSchool()
            myProfile.searchAndSelectSchool(schoolData.existingSchools[1])
            myProfile.clickProceed()
            myProfile.isSchoolInMySchools(schoolData.existingSchools[1])

            sideBarPage.clickOnManageClass()
            manageClass.clickOnCreateClass();
            username = `Auto_rejoinStud_${  Helpers.getRamdomString()}`
            rejoinClassName = `Auto_rejoinClass_${  Helpers.getRamdomString()}`
            manageClass.fillClassDetails(rejoinClassName, startDate, endDate, classData.grade, classData.subject, classData.standardSet);
            manageClass.verifyIfSchoolPresent(schoolData.existingSchools[1])
            manageClass.selectSchool(schoolData.existingSchools[1])
            manageClass.clickOnSaveClass();
            manageClass.clickOnAddStudent()
            manageClass.fillStudentDetails(username, studData.name, studData.password)
            manageClass.clickOnAddUserButton()
            sideBarPage.clickOnManageClass()
            manageClass.verifyClassRowVisibleByName(className)
            manageClass.verifyClassRowVisibleByName(rejoinClassName)
        })

        it(" > Remove school without acrchiving classes", () => {
            sideBarPage.clickMyProfile()
            myProfile.removeSchool(schoolName, false)
            myProfile.isSchoolInMySchools(schoolName)
        });

        it(" > Archive created class and remove school", () => {
            sideBarPage.clickOnManageClass()
            manageClass.clickOnClassRowByName(className)
            manageClass.archieveClass()
            manageClass.verifyNoClassRowByName()
            sideBarPage.clickMyProfile()
            myProfile.removeSchool(schoolName)
            myProfile.isSchoolNotInMySchools(schoolName)
        })

        it(" > UnArchive class without joining school", () => {
            sideBarPage.clickOnManageClass()
            manageClass.selectArchieveClass()
            manageClass.goToLastPage()
            manageClass.unArchieveClassByName(className, false)
        })

        it(" > Rejoin school and unarchive class", () => {

            sideBarPage.clickOnManageClass()
            manageClass.clickOnClassRowByName(rejoinClassName)
            manageClass.archieveClass()
            manageClass.verifyNoClassRowByName()
            sideBarPage.clickMyProfile()
            myProfile.removeSchool(schoolData.existingSchools[1])
            myProfile.isSchoolNotInMySchools(schoolData.existingSchools[1])
            myProfile.clickOnAddSchool()
            myProfile.searchAndSelectSchool(schoolData.existingSchools[1])
            myProfile.clickProceed()
            myProfile.isSchoolInMySchools(schoolData.existingSchools[1])
            sideBarPage.clickOnManageClass()
            manageClass.selectArchieveClass()
            manageClass.goToLastPage()
            manageClass.unArchieveClassByName(rejoinClassName)
            manageClass.verifyClassRowVisibleByName(rejoinClassName)
        })
    })

})