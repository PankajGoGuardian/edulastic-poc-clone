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

Cypress.Commands.add('setToken', (role = 'student') => {
  const postData =
    role == 'teacher'
      ? {
          email: 'charles@xmen.com',
          password: 'snapwiz'
        }
      : {
          email: 'auto.student3@snapwiz.com',
          password: 'snapwiz'
        };
  cy.request({
    url: `${BASE_URL}/auth/login`,
    method: 'POST',
    body: postData
  }).then(({ body }) => {
    console.log('Result = ', body.result);
    window.localStorage.setItem('access_token', body.result.token);
    return true;
  });
});

Cypress.Commands.add(
  'assignAssignment',
  (
    startDt = new Date(),
    dueDt = new Date(new Date().setDate(startDt.getDate() + 1))
  ) => {
    const accessPostData = {
      email: 'auto.teacher1@snapwiz.com',
      password: 'snapwiz'
    };

    cy.request({
      url: `${BASE_URL}/auth/login`,
      method: 'POST',
      body: accessPostData
    }).then(({ body }) => {
      console.log('Result = ', body.result);
      cy.fixture('assignments').then(asgns => {
        const postData = asgns['default'];
        postData['startDate'] = startDt;
        postData['endDate'] = dueDt;
        console.log('asdnDO - ', postData);
        cy.request({
          url: `${BASE_URL}/assignments`,
          method: 'POST',
          body: postData,
          headers: {
            authorization: body.result.token,
            'Content-Type': 'application/json'
          }
        }).then(({ body }) => {
          console.log('Assignment Assigned = ', body.result._id);
        });
      });
    });
  }
);

Cypress.Commands.add('deleteAllAssignments', () => {
  const teacherPostData = {
    email: 'auto.teacher1@snapwiz.com',
    password: 'snapwiz'
  };

  const studentPostData = {
    email: 'auto.student3@snapwiz.com',
    password: 'snapwiz'
  };

  let asgnIds = [];

  cy.request({
    url: `${BASE_URL}/auth/login`,
    method: 'POST',
    body: studentPostData
  }).then(({ body }) => {
    cy.request({
      url: `${BASE_URL}/assignments`,
      method: 'GET',
      headers: {
        authorization: body.result.token,
        'Content-Type': 'application/json'
      }
    }).then(({ body }) => {
      body.result.forEach((asgnDO, i) => {
        asgnIds.push(asgnDO._id);
      });
      console.log('All Assignments = ', asgnIds);
    });
  });

  cy.request({
    url: `${BASE_URL}/auth/login`,
    method: 'POST',
    body: teacherPostData
  }).then(({ body }) => {
    asgnIds.forEach(asgnId => {
      cy.request({
        url: `${BASE_URL}/assignments/${asgnId}`,
        method: 'DELETE',
        headers: {
          authorization: body.result.token,
          'Content-Type': 'application/json'
        }
      }).then(({ body }) => {
        console.log(`${asgnId} :: `, body.result);
      });
    });
  });
});

Cypress.Commands.add(
  'makeSelection',
  {
    prevSubject: 'element'
  },
  subject => {
    cy.wrap(subject)
      .trigger('mousedown')
      .then($el => {
        const el = $el[0];
        const document = el.ownerDocument;
        const range = document.createRange();
        range.selectNodeContents(el);
        document.getSelection().removeAllRanges(range);
        document.getSelection().addRange(range);
      })
      .trigger('mouseup');

    cy.document().trigger('selectionchange');
  }
);

Cypress.Commands.add(
  'verifyNumInput',
  {
    prevSubject: 'element'
  },
  (subject, step) => {
    const exp = `${step + 1}`;
    cy.wrap(subject)
      .type('{selectall}')
      .type(1)
      .should('have.value', '1')
      .type('{uparrow}')
      .should('have.value', exp)
      .type('{downarrow}')
      .should('have.value', '1');
  }
);
