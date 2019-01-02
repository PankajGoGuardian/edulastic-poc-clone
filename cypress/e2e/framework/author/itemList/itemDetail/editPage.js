class EditItemPage {

    clickOnSource() {
        cy.get('[data-cy="source"]').should('be.visible')
            .click();
        return this;
    }

    clickOnLayout() {
        cy.get('[data-cy="layout"]').should('be.visible')
             .click();
        return this;
    }

    addNew() {
        cy.contains('Add New').should('be.visible')
            .click();
            
        return this;
    }
    
    chooseQuestion(qGroup,qType){
        cy.contains(qGroup).should('be.visible')
        .click();
        cy.contains(qType).should('be.visible')
        .click();
    }
}

export default EditItemPage;