import { userBuilder } from './generate';

Cypress.LocalStorage.clear = () => {};
const BASE_URL =
  'https://pnufcx7h1l.execute-api.us-east-1.amazonaws.com/development/api';

Cypress.Commands.add('createUser', overrides => {
  const user = userBuilder(overrides);
  return cy
    .request({
      url: `${BASE_URL}/auth/signup`,
      method: 'POST',
      body: user
    })
    .then(({ body }) => body.user);
});

Cypress.Commands.add('login', user =>
  cy
    .request({
      url: `${BASE_URL}/auth/login`,
      method: 'POST',
      body: user
    })
    .then(({ body }) => {
      window.localStorage.setItem('access_token', body.token);
      return body.user;
    }));

Cypress.Commands.add('assertHome', () => {
  cy.url().should('eq', `${Cypress.config().baseUrl}/`);
});

Cypress.Commands.add('setToken', () => {
  const postData = {
    email: 'charles@xmen.com',
    password: 'snapwiz'
  };
  cy.request({
    url: `${BASE_URL}/auth/login`,
    method: 'POST',
    body: postData
  }).then(({ body }) => {
    console.log('Result = ', body.result.token);
    window.localStorage.setItem('access_token', body.result.token);
    return true;
  });
});

Cypress.Commands.add('makeSelection', {
  prevSubject: 'element'
}, (subject) => {
    cy.wrap(subject)
      .trigger('mousedown')
      .then(($el) => {
        const el = $el[0];
        const document = el.ownerDocument;
        const range = document.createRange();
        range.selectNodeContents(el);
        document.getSelection().removeAllRanges(range);
        document.getSelection().addRange(range);
      })
      .trigger('mouseup');
    
    cy.document().trigger('selectionchange');
});

Cypress.Commands.add('verifyNumInput', {
  prevSubject: 'element'
}, (subject, step ) => {
    const exp = `${step+1}`;
    cy.wrap(subject)
      .type('{selectall}')
      .type(1)
      .should('have.value', '1')
      .type('{uparrow}')
      .should('have.value', exp)
      .type('{downarrow}')
      .should('have.value', '1');
})
