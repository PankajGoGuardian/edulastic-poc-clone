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
    })
);

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
