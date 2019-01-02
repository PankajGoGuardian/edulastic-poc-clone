class ChoiceMatrixStandardPage {

    // question content
    getQuestionEditor() {
        return cy.get('[data-placeholder="Enter question"]');
    }

    // choices
    getChoiceByIndex(index) {
        const selector = '#idlist1'+index;
        return cy.get(selector)
                    .next()
                    .find('.ql-editor');
    }

    deleteChoiceByIndex(index) {
        const selector = '[data-cy=deletelist1'+index+']';
        cy.get(selector)
            .click();
        return this;
    }

    getallChoices() {
        return cy.contains('div','Multiple Choice Options')
                    .next()
                    .find('.ql-editor');
                }
                
    addNewChoice() {
        cy.contains('div','Multiple Choice Options')
            .next()
            .contains('Add new choice')
            .should('be.visible')
            .click();
        return this;
    }
                
    // steams
    getSteamByIndex(index) {
        const selector = '#idlist2'+index;
        return cy.get(selector)
                    .next()
                    .find('.ql-editor');
    }

    deleteSteamByIndex(index) {
        const selector = '[data-cy=deletelist2'+index+']';
        cy.get(selector)
                    .click();
        return this;
    }

    getallSteam() {
        return cy.contains('div','Steams')
                    .next()
                    .find('.ql-editor');
    }

    addNewSteam() {
        cy.contains('div','Steams')
            .next()
            .contains('Add new choice')
            .should('be.visible')
            .click();
        return this;
    }

    // correct ans
    getCorrectAnsTable() {
        return cy.get('table')
                    .children()
                    .get('tr.ant-table-row');
    }

    addAlternate() {

        cy.get('[data-cy="alternate"]')
            .should('be.visible')
            .click();
        return this;
    }

    getAlternates() {
        return cy.contains('div','Set Correct Answer(s)')
                    .next()
                    .contains('span','Alternate');
    }

    deleteAlternate() {
        cy.get('[data-cy="del-alter"]')
            .should('be.visible')
            .click();

        cy.contains('div','Set Correct Answer(s)')
            .next().contains('div','Correct')
            .should('be.visible')
            .click();
        return this;

    }

    getMultipleResponse() {
        return cy.contains('Multiple responses')
                    .should('be.visible');
        
    } 

    // advance options
    clickOnAdvancedOptions() {
        cy.get('[data-cy=iconPlus]')
            .should('be.visible')
            .click();
        return this;
    }
}

export default ChoiceMatrixStandardPage;