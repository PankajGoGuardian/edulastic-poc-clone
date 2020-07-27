import CypressHelper from "../util/cypressHelpers"

export default class MyProfile {

    // *** ELEMENTS START ***

    getSchoolNameInput = () => cy.get('#request_school_name')

    getAddressInput = () => cy.get('#request_school_address')

    getCityInput= () => cy.get('#request_school_city')

    getZipInput= () => cy.get('#request_school_zip')

    getSchoolSearchBox= () => cy.get("[data-cy='Search by Zip, Name or City']")

    getProceedButton= () => cy.contains("span","Proceed");

    getConfirmationBox= () => cy.get('#confirmationText')

    getMySchools= () => cy.get('[data-cy="mySchools"] > span')

    getRequestNewSchool= () => cy.get(`[data-cy="reqNewSchoolBtn"]`)
    
    // *** ELEMENTS END ***

    // *** ACTIONS START ***
    
    selectState = (state) => {
        CypressHelper.selectDropDownByAttribute("state",state)
    }

    clickOnAddSchool = () => {
        cy.get(`[data-cy="addSchool"]`).click();
        cy.get(`[data-cy="joinSchoolBody"]`)
    }

    requestNewSchool = (schoolName,address,city,zip,state) => {
        cy.server();
        cy.route("POST", "**/school").as("school");
        cy.route("PUT", "**/user/*").as("user");
        this.getRequestNewSchool().click();
        this.enterSchoolDetails(schoolName,address,city,zip,state)
        this.getRequestNewSchool().click();
        var schoolData = {}
        cy.wait("@school").then(xhr => {
            expect(xhr.status).to.eq(200);
            const schoolID = xhr.responseBody.result._id
            schoolData['schoolId'] = schoolID
            cy.log("new school created with _id - ", schoolID);
        })
        cy.wait("@user").then(xhr => {
            var userID = JSON.stringify(xhr.url).split("/")[5]
            userID = userID.replace(`"`,'')
            schoolData['userId'] = userID
            cy.saveSchoolToDelete(schoolData);
        })
        cy.get(`[data-cy="joinSchoolBody"]`).should('not.be.visible')
    }

    enterSchoolDetails = (schoolName,address,city,zip,state) => {
        if(schoolName){
            this.getSchoolNameInput().type(schoolName)
        }
        if(address){
            this.getAddressInput().type(address)
        }
        if(city){
            this.getCityInput().type(city)
        }
        if(zip){
            this.getZipInput().type(zip)
        }
        if(state){
            this.selectState(state)
        }
    }

    verifyExistingSchools = (schools) => {
        this.getSchoolSearchBox().click({ force: true })
        cy.get(".ant-select-dropdown")
        schools.forEach((school) => {
            cy.get(`[title="${school}"]`).should('be.visible');
        })
    }

    searchSchoolWithText(text) {
        this.getSchoolSearchBox().type(text)
        cy.get(".ant-select-dropdown").should('be.visible')
    }

    searchAndSelectSchool(schoolName, nameOrCity = undefined) {
        if (nameOrCity != undefined) {
            this.searchSchoolWithText(nameOrCity)
        } else {
            this.searchSchoolWithText(schoolName)
        }
        cy.get(`[title="${schoolName}"]`).click()
        cy.wait(1000)
        cy.get("[data-cy='selectedSchool']").should('have.text', schoolName)
        cy.wait(1000)
    }

    isSchoolInMySchools(schoolName) {
        this.getMySchools().contains(schoolName).should('be.visible')
    }

    isSchoolNotInMySchools(schoolName) {
        this.getMySchools().contains(schoolName).should('not.be.visible')
    }

    removeSchool(schoolName,removable = true) {
        cy.server();
        cy.route("PUT", "**/remove").as("remove");
        this.getMySchools().contains(schoolName).find(".anticon-close").should('be.visible').click()
        cy.get(`[data-cy="removeSchoolModal"]`).should('be.visible')
        this.getConfirmationBox().type("REMOVE")
        cy.contains('YES, REMOVE').click()
        if(removable){
            cy.wait("@remove").then((xhr)=>{
                expect(xhr.status).to.eq(200);
               /*  var schoolId = JSON.stringify(xhr.url).split("/")[6]
                schoolId = schoolId.replace(`"`,'') */
                cy.removeSchoolInTestdata(xhr.requestBody.schoolId)
            })
        }else{
            cy.wait("@remove").then((xhr) => {
                expect(xhr.status,"Expected to archive class before removing").to.eq(403)
                expect(xhr.responseBody).to.have.string("Please archive all your classes for this school to continue.")
              })              
        }
        cy.get(`[data-cy="removeSchoolModal"]`).should('not.be.visible')

    }

    clickProceed() {
        cy.server();
        cy.route("PUT", "**/user/*").as("join");
        this.getProceedButton().should('be.visible').click()
        cy.wait("@join").then((xhr) =>{
            expect(xhr.status).to.eq(200);
            var schoolData = {}
            const institutionIds = xhr.responseBody.result.institutionIds
            schoolData['schoolId'] = institutionIds[institutionIds.length -1]
            schoolData['userId'] = xhr.responseBody.result._id
            cy.saveSchoolToDelete(schoolData);
        })
        cy.get(`[data-cy="joinSchoolBody"]`).should('not.be.visible')
    }

    closePopup() {
        cy.get("body").then($body => {
            if ($body.find(".ant-modal-close-x").length > 0) {
                cy.get(".ant-modal-close-x").click({ force: true })
            }
        })
    }

    // *** ACTIONS END ***

    // *** APPHELPERS START ***
    
    // *** APPHELPERS END ***
}