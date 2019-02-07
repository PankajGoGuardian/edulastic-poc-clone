describe('Test Graphing - number line', () => {
  before(() => {
    cy.setToken();
  });

  it('Visit Item List Page', () => {
    cy.visit('/author/items');
  });

  it('Check Flow', () => {
    cy.get('button')
      .contains('Create')
      .should('be.visible');
    cy.contains('Create').click();
    cy.contains('Add New').click();

    cy.get('li').should('contain', 'Multiple Choice');
    cy.get('li').should('contain', 'Fill in the Blanks');
    cy.get('li').should('contain', 'Classify, Match & Order');
    cy.get('li').should('contain', 'Written & Spoken');
    cy.get('li').should('contain', 'Highlight');
    cy.get('li').should('contain', 'Math');
    cy.get('li').should('contain', 'Graphing');
    cy.get('li').should('contain', 'Charts');
    cy.get('li').should('contain', 'Chemistry');
    cy.get('li').should('contain', 'Other');
  });

  it('Graphing - Number line with plot', () => {
    cy.get('li')
      .contains('Graphing')
      .click();

    cy.get('div')
      .contains('Number line with plot')
      .click();

    cy.get('div')
      .find('[contenteditable]')
      .eq(0)
      .focus()
      .clear()
      .type('Type a question');

    cy.get('input[name="x_min"]')
      .clear()
      .type(-15);

    cy.get('input[name="x_max"]')
      .clear()
      .type(15);

    cy.get('input[name="title"]')
      .clear()
      .type('Type a title');

    cy.get('input[name="responsesAllowed"]')
      .clear()
      .type(3);
  });

  it('set Advance Options', () => {
    cy.contains('div', 'Advanced Options')
      .as('AdvancedButton')
      .click();

    // Layout settings
    cy.get('@AdvancedButton')
      .next()
      .should('be.visible')
      .within(() => {
        // cy.get('input[name="layout_width"]')
        //   .clear()
        //   .type('1100');

        cy.get('input[name="margin"]')
          .clear()
          .type('30');

        cy.get('input[name="stackResponsesSpacing"]')
          .clear()
          .type('50');

        cy.contains('Show max arrow')
          .click();

        cy.contains('Show min arrow')
          .click();

        cy.contains('Stack responses')
          .click();

        cy.get('select')
          .eq(1)
          .select('Large');
      });

    // Grid
    cy.contains('Ticks')
      .parent()
      .within(() => {
        cy.get('input[name="ticksDistance"]')
          .clear()
          .type(3);

        cy.get('input[name="minorTicks"]')
          .clear()
          .type('5');

        cy.get('select')
          .select('Zero');

        cy.contains('Show max')
          .click();

        cy.contains('Show min')
          .click();
      });

    cy.contains('Labels')
      .parent()
      .within(() => {

      });

    cy.get('@AdvancedButton').click();
  });

  const svgWidth = 600;
  const svgHeight = 300;

  function CreateEvent(eventName, pos, offset) {
    const ev = new Event(eventName);
    ev.clientX = pos[0] * svgWidth + offset[0];
    ev.clientY = pos[1] * svgHeight + offset[1];

    return ev;
  }

  function CreatePointerDown(xPer, yPer, offsetX, offsetY) {
    return CreateEvent('pointerdown', [xPer, yPer], [offsetX, offsetY]);
  }

  function CreatePointerUp(xPer, yPer, offsetX, offsetY) {
    return CreateEvent('pointerup', [xPer, yPer], [offsetX, offsetY]);
  }


  // xK - percentage of graph width
  // yK - percentage of graph height
  function InvokeBoardTrigger(xK, yK) {
    cy.get('@Board')
      .then((board) => {
        cy.window()
          .then((window) => {
            const boardRect = board[0].getBoundingClientRect();

            const left = boardRect.left + window.pageXOffset;
            const { top } = boardRect;
            const downEvent = CreatePointerDown(xK, yK, left, top);
            const upEvent = CreatePointerUp(xK, yK, left, top);

            let result = true;
            try {
              board[0].dispatchEvent(downEvent);
              window.document.dispatchEvent(upEvent);
            } catch (e) {
              result = false;
            }

            assert.isTrue(result, 'Invoke board trigger');
          });
      });
  }

  function DrawPoints(points) {
    for (let i = 0; i < points.length; i++) {
      InvokeBoardTrigger(points[i][0], points[i][1]);
    }
  }

  // Needed variables - CurrentTool, Board, ClearBtn
  function TestDraw(points, selector, save = false) {
    DrawPoints(points);

    cy.get('@Board')
      .find(selector)
      .should('exist');

    if (!save) {
      cy.get('@ClearTool')
        .click();

      DrawPoints(points);

      cy.get('@Board')
        .find(selector)
        .should('not.exist');
    }
  }

  it('Select Correct Answer', () => {
    cy.get('.tool-btn-icon')
      .eq(9)
      .as('ClearTool');

    cy.get(`svg[height="${svgHeight}"]`)
      .as('Board');

    /* Draw Point */
    TestDraw([[0.5, 0.3]], 'ellipse[fill="#00b2ff"]');

    /* Draw line 1 */
    cy.get('.tool-btn-icon')
      .eq(1)
      .click();

    TestDraw([[0.5, 0.5]], 'line[fill="#00b2ff"]');

    /* Draw line 2 */
    cy.get('.tool-btn-icon')
      .eq(2)
      .click();

    TestDraw([[0.5, 0.5]], 'line[fill="#00b2ff"]');

    /* Draw line 3 */
    cy.get('.tool-btn-icon')
      .eq(3)
      .click();

    TestDraw([[0.5, 0.5]], 'line[fill="#00b2ff"]');

    /* Draw line 4 */
    cy.get('.tool-btn-icon')
      .eq(4)
      .click();

    TestDraw([[0.5, 0.5]], 'line[fill="#00b2ff"]');

    /* Draw line 5 */
    cy.get('.tool-btn-icon')
      .eq(5)
      .click();

    TestDraw([[0.5, 0.5]], 'line[fill="#00b2ff"]');

    /* Draw line 6 */
    cy.get('.tool-btn-icon')
      .eq(6)
      .click();

    TestDraw([[0.5, 0.5]], 'line[fill="#00b2ff"]');

    /* Draw line 7 */
    cy.get('.tool-btn-icon')
      .eq(7)
      .click();

    TestDraw([[0.5, 0.5]], 'line[fill="#00b2ff"]');

    /* Draw line 8 */
    cy.get('.tool-btn-icon')
      .eq(8)
      .click();

    TestDraw([[0.5, 0.5]], 'line[fill="#00b2ff"]');

    /* Draw line 8 */
    cy.get('.tool-btn-icon')
      .eq(8)
      .click();

    TestDraw([[0.5, 0.5]], 'line[fill="#00b2ff"]', true);
  });

  it('Visit Preview Page', () => {
    cy.server();
    cy.route('PUT', '**/testitem/**').as('saveItem');
    cy.route('GET', '**/testitem/**').as('reload');

    cy.contains('div', 'SAVE')
      .should('be.visible')
      .click();

    cy.wait('@saveItem');
    cy.wait('@reload');

    cy.contains('PREVIEW').should('be.visible');
    cy.contains('PREVIEW').click();
  });

  it('Check Answers', () => {
    // Set board variable for InvokeBoardTrigger function
    cy.get('svg')
      .should('have.id')
      .and('match', /jxgbox/)
      .as('Board');

    // Clear button
    cy.contains('Clear')
      .as('ClearBtn');

    cy.contains('Show Answers')
      .click();

    // Yellow point (correct answer)
    cy.get('@Board')
      .find('ellipse[fill="#ffcb00"]')
      .should('exist');

    cy.get('@ClearBtn')
      .click();

    /* Draw red point */
    cy.get('.tool-btn-icon')
      .eq(8)
      .click();

    InvokeBoardTrigger(0.3, 0.5);

    cy.get('button')
      .contains('Check Answer')
      .as('CheckAnswer')
      .click();

    // Red point
    cy.get('@Board')
      .find('ellipse[fill="#ee1658"]')
      .should('exist');

    cy.get('@ClearBtn')
      .click();

    /* Draw correct answer */
    cy.get('.tool-btn-icon')
      .eq(8)
      .click();

    InvokeBoardTrigger(0.5, 0.5);

    cy.get('@CheckAnswer')
      .click();

    cy.get('@Board')
      .find('ellipse[fill="#1fe3a1"]')
      .should('exist');
  });
});
