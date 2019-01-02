
import EditItemPage from './itemDetail/editPage.js';

class ItemListPage {
    clickOnCreate() {
        cy.contains('Create').should('be.visible')
            .click();
        return new EditItemPage();
    }
    
}

export default ItemListPage;
