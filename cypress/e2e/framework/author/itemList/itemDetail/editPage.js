import Header from './header.js';

class EditItemPage {

     constructor(){
         this.header = new Header();
         this.header.save = function() {
            cy.server();
            cy.route('PUT','**/testitem/**').as('saveItem');
            cy.contains('div','SAVE')
                .should('be.visible')   
                .click();
            cy.wait('@saveItem');
            return this;
         };
    }

    clickOnSource() {
        cy.get('[data-cy="source"]').should('be.visible')
            .click();

        return this;
    }

    clickOnCancel() {
        cy.get('button')
            .find('Cancel')
            .should('be.visible')
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

    getSource() {
        cy.get('[data-cy="source"]').should('be.visible')
            .click();

    }

    cancelSource() {
        cy.contains('Cancel')
            .should('be.visible')
            .click();
    }

    getEditButton() { 
        return cy.get('button[title="Edit"]');
    }

    getDelButton() { 
        return cy.get('button[title="Delete"]');
            
    }

    getItemWithId(itemUrl) {
        cy.server();
        cy.route('GET', '**/testitem/**').as('getItem');
        cy.visit(`/author/items/${itemUrl}/item-detail`);
        cy.wait('@getItem');
    }
}

export default EditItemPage;