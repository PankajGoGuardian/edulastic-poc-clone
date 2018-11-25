import { userBuilder } from './generate';

Cypress.Commands.add('createUser', (overrides) => {
  const user = userBuilder(overrides);
  return cy
    .request({
      url: 'http://edulastic-poc.snapwiz.net/api/auth/signup',
      method: 'POST',
      body: user,
    })
    .then(({ body }) => body.user);
});

Cypress.Commands.add('login', user =>
  cy
    .request({
      url: 'http://edulastic-poc.snapwiz.net/api/auth/login',
      method: 'POST',
      body: user,
    })
    .then(({ body }) => {
      window.localStorage.setItem('token', body.token);
      return body.user;
    }));

Cypress.Commands.add('assertHome', () => {
  cy.url().should('eq', `${Cypress.config().baseUrl}/`);
});

Cypress.Commands.add('setToken', () => {
  const postData = {
    email: 'vasilev123@snapwiz.com',
    password: 'testpassword'
  };
   cy
    .request({
      url: 'http://edulastic-poc.snapwiz.net/api/auth/login',
      method: 'POST',
      body: postData,
    })
    .then(({ body }) => {
      console.log('Result = ', body.result.token);
      window.localStorage.setItem('access_token', body.result.token);
      return true;
    });
});