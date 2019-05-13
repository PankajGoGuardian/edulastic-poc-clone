class GraphingStandardPage {
  constructor() {
    this.ignoreRepeatedShapesOption = {
      No: "no",
      "Compare by slope": "yes",
      "Compare by points": "strict"
    };

    this.ignoreLabelsOption = {
      No: "no",
      Yes: "yes"
    };

    this.stemNumerationOption = {
      Numerical: "numerical",
      "Uppercase alphabet": "uppercase_alphabet",
      "Lowercase alphabet": "lowercase_alphabet"
    };

    this.fontSizeOption = {
      Small: "small",
      Normal: "normal",
      Large: "large",
      "Extra Large": "extra_large",
      Huge: "huge"
    };

    this.controls = {
      Undo: "undo",
      Redo: "redo",
      Reset: "reset",
      Delete: "delete"
    };

    this.segmentTools = {
      Point: "segments_point",
      Segment: "segment_both_point_included",
      "Segment with both hollow points": "segment_both_points_hollow",
      "Segment with left hollow point": "segment_left_point_hollow",
      "Segment with right hollow point": "segment_right_point_hollow",
      "Left ray": "ray_left_direction",
      "Right ray": "ray_right_direction",
      "Left ray with hollow point": "ray_left_direction_right_hollow",
      "Right ray with hollow point": "ray_right_direction_left_hollow"
    };

    this.graphTools = {
      Point: "point",
      Line: "line",
      Ray: "ray",
      Segment: "segment",
      Vector: "vector",
      Circle: "circle",
      Ellipse: "ellipse",
      Parabola: "parabola",
      Sine: "sine",
      Tangent: "tangent",
      Secant: "secant",
      Exponent: "exponent",
      Polynom: "polynom",
      Logarithm: "logarithm",
      Hyperbola: "hyperbola",
      Polygon: "polygon",
      Label: "label"
    };
  }
  // elements ---------------------------------------------------------------

  getCorrectAnswersContainer() {
    return cy.contains("section", "Set Correct Answer(s)");
  }

  getControlsContainer() {
    return cy.contains("section", "Controls");
  }

  getToolsContainer() {
    return cy.contains("section", "Tools");
  }

  getGridContainer() {
    return cy.contains("section", "Grid");
  }

  getAnnotationContainer() {
    return cy.contains("section", "Annotation");
  }

  getQuestionEditor() {
    return cy.get('[data-placeholder="Enter your question"]');
  }

  getStimulus() {
    return cy.get("#stimulus");
  }

  getQuestionHeader() {
    return cy.get('[data-cy="questionHeader"]');
  }

  getXMinParameter() {
    return cy.get('input[name="x_min"]');
  }

  getXMaxParameter() {
    return cy.get('input[name="x_max"]');
  }

  getYMinParameter() {
    return cy.get('input[name="y_min"]');
  }

  getYMaxParameter() {
    return cy.get('input[name="y_max"]');
  }

  getGroups() {
    return this.getToolsContainer().find('[data-cy="toolSubTitle"]');
  }

  getGroupTools(groupName) {
    return this.getToolsContainer()
      .contains("div", groupName)
      .find('[data-cy="graphToolSelect"]');
  }

  getGroupDeleteButton(groupName) {
    return this.getToolsContainer()
      .contains("span", groupName)
      .find("svg");
  }

  getToolDeleteButton(groupName, index) {
    return this.getToolsContainer()
      .contains("div", groupName)
      .find('[data-cy="graphToolSelect"]')
      .eq(index)
      .parent()
      .next();
  }

  getLayoutWidth() {
    return cy.get('input[name="layout_width"]');
  }

  getLayoutHeight() {
    return cy.get('input[name="layout_height"]');
  }

  getLayoutMargin() {
    return cy.get('input[name="layout_margin"]');
  }

  getLayoutSnapto() {
    return cy.get('input[name="layout_snapto"]');
  }

  getAxisXSettingsContainer() {
    return this.getGridContainer()
      .contains("Axis X")
      .parent()
      .parent();
  }

  getAxisYSettingsContainer() {
    return this.getGridContainer()
      .contains("Axis Y")
      .parent()
      .parent();
  }

  getXDistance() {
    return cy.get('input[name="xDistance"]');
  }

  getYDistance() {
    return cy.get('input[name="yDistance"]');
  }

  getXTickDistance() {
    return cy.get('input[name="xTickDistance"]');
  }

  getYTickDistance() {
    return cy.get('input[name="yTickDistance"]');
  }

  getXAxisLabel() {
    return cy.get('input[name="xAxisLabel"]');
  }

  getYAxisLabel() {
    return cy.get('input[name="yAxisLabel"]');
  }

  getBgImageUrl() {
    return cy.get('input[name="src"]');
  }

  getBgImageHeight() {
    return cy.get('input[name="height"]');
  }

  getBgImageWidth() {
    return cy.get('input[name="width"]');
  }

  getBgImageXAxisPosition() {
    return cy.contains("X axis image position").siblings("input");
  }

  getBgImageYAxisPosition() {
    return cy.contains("Y axis image position").siblings("input");
  }

  getBgImageOpacity() {
    return cy.get('input[name="opacity"]');
  }

  getBgImageOnBoard(index) {
    return this.getBoards(index).find("svg image");
  }

  getBoards() {
    return cy.get('[data-cy="axis-quadrants-container"] [data-cy="jxgbox"]');
  }

  getGraphContainers() {
    return cy.get('[data-cy="axis-quadrants-container"]');
  }

  getCorrectAnswerGraphContainer() {
    return this.getGraphContainers().first();
  }

  getBgShapesGraphContainer() {
    return this.getGraphContainers().last();
  }

  getGraphTools() {
    return cy.get('[data-cy="graphTools"]');
  }

  getGraphToolsMainShapes() {
    return cy.get("ul:first > li");
  }

  getGraphControls() {
    return cy.get("ul:last > li");
  }

  getGraphControlByName(name) {
    return cy.get("ul:last > li").contains(name);
  }

  getGraphToolsGroupShapes() {
    return cy.get("ul > li");
  }

  getLabelsOnGraphTool(index) {
    return this.getGraphTools()
      .eq(index)
      .find("span");
  }

  getVisibleTickLabelsOnBoard(index, containText = null) {
    if (containText !== null) {
      return this.getBoards()
        .eq(index)
        .find("text.JXGtext:not(:empty)")
        .filter(":visible")
        .filter(`:contains('${containText}')`);
    }
    return this.getBoards()
      .eq(index)
      .find("text.JXGtext:not(:empty)")
      .filter(":visible");
  }

  getAxisLabelByNameOnBoard(index, name) {
    return this.getBoards()
      .eq(index)
      .contains("div.JXGtext", name);
  }

  getPointsParameter() {
    return this.getCorrectAnswersContainer().find('input[type="number"]');
  }

  getGraphBgShapesPoints() {
    return cy.get('ellipse[fill="#ccc"]').filter(":visible");
  }

  getAnnotationTitle() {
    return this.getAnnotationContainer()
      .contains("Title")
      .next()
      .find(".ql-editor");
  }

  getAnnotationLabelTop() {
    return this.getAnnotationContainer()
      .contains("Label top")
      .next()
      .find(".ql-editor");
  }

  getAnnotationLabelLeft() {
    return this.getAnnotationContainer()
      .contains("Label left")
      .next()
      .find(".ql-editor");
  }

  getAnnotationLabelRight() {
    return this.getAnnotationContainer()
      .contains("Label right")
      .next()
      .find(".ql-editor");
  }

  getAnnotationLabelBottom() {
    return this.getAnnotationContainer()
      .contains("Label bottom")
      .next()
      .find(".ql-editor");
  }

  getGraphPoints() {
    return cy.get('ellipse[fill="#00b2ff"][stroke="#00b2ff"]').filter(":visible");
  }

  getGraphHollowPoints() {
    return cy.get('ellipse[fill="#ffffff"][stroke="#00b2ff"]').filter(":visible");
  }

  getGraphCorrectAnswerPoints() {
    return cy.get('ellipse[fill="#ffcb00"][stroke="#ffcb00"]').filter(":visible");
  }

  getGraphIncorrectPoints() {
    return cy.get('ellipse[fill="#ee1658"][stroke="#ee1658"]').filter(":visible");
  }

  getGraphCorrectPoints() {
    return cy.get('ellipse[fill="#1fe3a1"][stroke="#1fe3a1"]').filter(":visible");
  }

  getGraphCircles() {
    return cy.get('ellipse[fill="transparent"][stroke="#00b2ff"]').filter(":visible");
  }

  getGraphLines() {
    return cy.get('line[stroke="#00b2ff"]').filter(":visible");
  }

  getGraphParabolas() {
    return cy.get('path[stroke="#00b2ff"]').filter(":visible");
  }

  getGraphSines() {
    return cy.get('path[stroke="#00b2ff"]').filter(":visible");
  }

  getGraphPolygon() {
    return cy.get('polygon[fill="#00b2ff"]').filter(":visible");
  }

  getTabsContainer() {
    return cy.get('[data-cy="tabs"]');
  }

  // actions------------------------------------------------------

  clickOnStimulusH2Button() {
    return this.getStimulus()
      .find("button.ql-header[value=2]")
      .click();
  }

  clickOnToolDeleteButton(groupName, index) {
    this.getToolDeleteButton(groupName, index).trigger("click"); // because .click() not worked
    return this;
  }

  selectTool(groupName, index, option) {
    this.getToolsContainer()
      .contains("div", groupName)
      .find('[data-cy="graphToolSelect"]')
      .eq(index)
      .click();

    const selectOp = `[data-cy="${this.graphTools[option]}"]`;

    cy.get(selectOp)
      .scrollIntoView()
      .should("be.visible")
      .click();

    this.getToolsContainer()
      .contains("div", groupName)
      .find('[data-cy="graphToolSelect"]')
      .eq(index)
      .find(".ant-select-selection-selected-value")
      .should("contain", option);

    return this;
  }

  clickOnNewGroupButton() {
    cy.contains("button", "ADD NEW GROUP").click();
    return this;
  }

  clickOnAddToolButton(groupName) {
    if (groupName) {
      cy.contains("div", groupName)
        .find("button", "ADD TOOL")
        .click();
      return this;
    }

    cy.contains("ADD TOOL").click();
    return this;
  }

  clickOnGroupDeleteButton(groupName) {
    this.getGroupDeleteButton(groupName).click();
    return this;
  }

  selectIgnoreRepeatedShapesOption(option) {
    const selectOp = `[data-cy="${this.ignoreRepeatedShapesOption[option]}"]`;
    cy.get('[data-cy="ignoreRepeatedShapes"]')
      .should("be.visible")
      .click();

    cy.get(selectOp)
      .should("be.visible")
      .click();

    cy.get('[data-cy="ignoreRepeatedShapes"]')
      .find(".ant-select-selection-selected-value")
      .should("contain", option);

    return this;
  }

  selectIgnoreLabelsOption(option) {
    const selectOp = `[data-cy="${this.ignoreLabelsOption[option]}"]`;
    cy.get('[data-cy="ignoreLabels"]')
      .should("be.visible")
      .click();

    cy.get(selectOp)
      .should("be.visible")
      .click();

    cy.get('[data-cy="ignoreLabels"]')
      .find(".ant-select-selection-selected-value")
      .should("contain", option);

    return this;
  }

  clickOnDrawLabelZero() {
    cy.contains("Draw label zero").click();
    return this;
  }

  clickOnDisplayPositionOnHover() {
    cy.contains("Display position on hover").click();
    return this;
  }

  selectStemNumerationOption(option) {
    const selectOp = `[data-cy="${this.stemNumerationOption[option]}"]`;
    cy.get('[data-cy="stemNumeration"]')
      .should("be.visible")
      .click();

    cy.get(selectOp)
      .should("be.visible")
      .click();

    cy.get('[data-cy="stemNumeration"]')
      .find(".ant-select-selection-selected-value")
      .should("contain", option);

    return this;
  }

  selectFontSizeOption(option) {
    const selectOp = `[data-cy="${this.fontSizeOption[option]}"]`;
    cy.get('[data-cy="fontSize"]')
      .should("be.visible")
      .click();

    cy.get(selectOp)
      .should("be.visible")
      .click();

    cy.get('[data-cy="fontSize"]')
      .find(".ant-select-selection-selected-value")
      .should("contain", option);

    return this;
  }

  clickOnShowAxisLabel() {
    cy.contains("Show axis label").click();
    return this;
  }

  clickOnHideTicks() {
    cy.contains("Hide ticks").click();
    return this;
  }

  clickOnDrawLabels() {
    cy.contains("Draw labels").click();
    return this;
  }

  clickOnMinArrow() {
    cy.contains("Min arrow").click();
    return this;
  }

  clickOnMaxArrow() {
    cy.contains("Max arrow").click();
    return this;
  }

  clickOnCommaInLabel() {
    cy.contains("Comma in label").click();
    return this;
  }

  clickOnShowBgShapesPoints() {
    cy.contains("Show background shape points").click();
    return this;
  }

  clickOnControlDeleteButton(index) {
    cy.get('[data-cy="controlSelect"]')
      .eq(index)
      .parent()
      .next()
      // .click();
      .trigger("click"); // because .click() not worked
    return this;
  }

  selectControlOption(index, option) {
    const selectOp = `[data-cy="${this.controls[option]}"]`;
    cy.get('[data-cy="controlSelect"]')
      .eq(index)
      .should("be.visible")
      .click();

    cy.get(selectOp)
      .should("be.visible")
      .click();

    cy.get('[data-cy="controlSelect"]')
      .eq(index)
      .find(".ant-select-selection-selected-value")
      .should("contain", option);

    return this;
  }

  clickOnResetButton() {
    cy.contains("Reset")
      .eq(0)
      .click();
    return this;
  }

  clickOnTabsPlusButton() {
    this.getTabsContainer()
      .find("button")
      .click();
    return this;
  }

  clickOnTab(index) {
    this.getTabsContainer()
      .find("> div")
      .eq(index)
      .click();
    return this;
  }

  clickOnAlternateAnswerDeleteButton(index) {
    this.getTabsContainer()
      .contains("Alternate")
      .eq(index)
      .parent()
      .find("svg")
      .click();
    return this;
  }

  // boardIndex - board number on page, start with 0
  // xK - percentage of graph width
  // yK - percentage of graph height
  invokeBoardClick(boardIndex, xK, yK) {
    return this.getBoards()
      .eq(boardIndex)
      .then(board => {
        cy.window().then(window => {
          const boardRect = board[0].getBoundingClientRect();
          const left = boardRect.left + window.pageXOffset;
          const { top, width, height } = boardRect;

          const point = {
            clientX: xK * width + left,
            clientY: yK * height + top
          };

          const downEvent = new Event("pointerdown");
          downEvent.clientX = point.clientX;
          downEvent.clientY = point.clientY;

          const upEvent = new Event("pointerup");
          upEvent.clientX = point.clientX;
          upEvent.clientY = point.clientY;

          let result = true;
          try {
            board[0].dispatchEvent(downEvent);
            window.document.dispatchEvent(upEvent);
          } catch (e) {
            result = false;
          }

          assert.isTrue(result, "invoke board click");
        });
      });
  }
}

export default GraphingStandardPage;
