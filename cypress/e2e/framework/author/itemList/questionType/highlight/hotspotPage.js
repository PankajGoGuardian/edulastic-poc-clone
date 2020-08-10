/* eslint-disable class-methods-use-this */
import EditToolBar from "../common/editToolBar";
import Header from "../../itemDetail/header";
import Helpers from "../../../../util/Helpers";
import PreviewItemPage from "../../itemDetail/previewPage";
import { queColor } from "../../../../constants/questionTypes";

class HotspotPage {
  constructor() {
    this.editToolBar = new EditToolBar();
    this.header = new Header();
    this.preview = new PreviewItemPage();
    this.scoringTypeOption = { "Exact match": "exactMatch", "Partial match": "partialMatch" };
    this.roundingOption = { None: "none", "Round down": "roundDown" };
  }

  // get current question from Store
  getQuestionText = () => cy.get('[contenteditable="true"]').first();

  getFillColor = () =>
    cy
      .contains("Fill color")
      .parent()
      .parent()
      .find(`span`, `.rc-color-picker-trigger`);

  getOutlineColor = () =>
    cy
      .contains("Outline color")
      .parent()
      .parent()
      .find(`span`, `.rc-color-picker-trigger`);

  changeFillColor = (colorCode, saturation, fillColor) => {
    this.getFillColor()
      .click()
      .then(() => {
        cy.get(`.rc-color-picker-panel-params-input`)
          .find(`input`)
          .first()
          .type(`{selectall}${colorCode}`)
          .should("have.value", colorCode);
        cy.get(`.rc-color-picker-panel-params-input`)
          .find(`input`)
          .last()
          .type(`{selectall}${saturation}`)
          .should("have.value", saturation);
        cy.get("body").click();
      });
    this.getFillColor().should("have.css", "background-color", fillColor);
  };

  verifyPolygonFillColor = fillColor => {
    this.getAnswerContainer()
      .find("polygon")
      .should("have.attr", "fill", fillColor);
  };

  changeOutlineColor = (colorCode, saturation) => {
    this.getOutlineColor()
      .click()
      .then(() => {
        cy.get(`.rc-color-picker-panel-params-input`)
          .find(`input`)
          .first()
          .type(`{selectall}${colorCode}`)
          .should("have.value", colorCode);
        cy.get(`.rc-color-picker-panel-params-input`)
          .find(`input`)
          .last()
          .type(`{selectall}${saturation}`)
          .should("have.value", saturation);
        cy.get("body").click();
      });
    // this.getOutlineColor().should("have.css", "background-color",outLineColor)
  };

  verifyPolygonOutlineColor = outLineColor => {
    this.getAnswerContainer()
      .find("polygon")
      .should("have.attr", "stroke", outLineColor);
  };

  checkFontSize(fontSize) {
    this.header.preview();
    Helpers.getElement("styled-wrapped-component")
      .should("have.css", "font-size")
      .and("eq", fontSize);

    this.header.edit();
  }

  getHotspotMap() {
    return Helpers.getElement("hotspotMap");
  }

  getCurrentStoreQuestion = () => {
    const storeValue = JSON.parse(window.localStorage.getItem("persist:root")).question;
    return JSON.parse(storeValue).entity.data;
  };

  getMaxScore = () => cy.get('[data-cy="maxscore"]').should("be.visible");

  selectRoundingOption(option) {
    const selectOp = `[data-cy="${this.roundingOption[option]}"]`;
    cy.wait(500);
    cy.get(`[data-cy="rounding"]`).click();
    cy.get(selectOp)
      .should("be.visible")
      .click();

    return this;
  }

  selectScoringType(option) {
    const selectOp = `[data-cy="${this.scoringTypeOption[option]}"]`;
    cy.get('[data-cy="scoringType"]')
      .should("be.visible")
      .click();

    cy.get(selectOp)
      .should("be.visible")
      .click();

    cy.get('[data-cy="scoringType"]')
      .find(".ant-select-selection-selected-value")
      .should("contain", option);

    return this;
  }

  getPanalty = () => cy.get('[data-cy="penalty"]').should("be.visible");

  getEnableAutoScoring = () =>
    cy
      .contains("Enable auto scoring")
      .children()
      .eq(0)
      .should("be.visible");

  getMinScore = () => cy.get("[data-cy=minscore]").should("be.visible");

  getDropZoneImageContainer = () => cy.get('[data-cy="dropzone-image-container"]');

  changeImageWidth = width => {
    cy.get('[data-cy="image-width-input"]')
      .click()
      .clear()
      .type("{selectall}")
      .type(width)
      .should("have.value", width);
    return this;
  };

  verifyImageWidthInQuesArea = imageWidth => {
    this.getDrawArea()
      .find("img")
      .should("have.attr", "width", imageWidth);
  };

  verifyImageWidthInAnsArea = imageWidth => {
    this.getHotspotMap()
      .find("img")
      .should("have.attr", "width", imageWidth);
  };

  changeImageHeight = height => {
    cy.get('[data-cy="image-height-input"]')
      .click()
      .clear()
      .type("{selectall}")
      .type(height)
      .should("have.value", height);
    return this;
  };

  verifyImageHeightInQuesArea = imageHeight => {
    this.getDrawArea()
      .find("img")
      .should("have.attr", "height", imageHeight);
  };

  verifyImageHeightInAnsArea = imageHeight => {
    this.getHotspotMap()
      .find("img")
      .should("have.attr", "height", imageHeight);
  };

  expandAdvancedOptions = () => {
    cy.get("body")
      .contains(" ADVANCED OPTIONS")
      .then(ele => {
        // const a=cy.wrap(ele);
        if (ele.parent().siblings().length === 3) {
          cy.wrap(ele).click({ force: true });
        }
      });
  };

  addImageAlternative = altText => {
    cy.get('[data-cy="image-alternative-input"]')
      .click()
      .clear()
      .type(altText)
      .should("have.value", altText);
    return this;
  };

  clickDrawMode = () => {
    cy.get('[data-cy="area-draw-mode"]')
      .click()
      .then($el => {
        cy.wrap($el).should("have.css", "background-color", queColor.BLUE_3);
      });
    return this;
  };

  drawRectangle = points => {
    this.getDrawArea().then($el => {
      points.forEach(point => {
        cy.wrap($el).click(point[0], point[1]);
      });
    });
  };

  clickDeleteMode = () => {
    cy.get('[data-cy="area-delete-mode"]')
      .click()
      .then($el => {
        cy.wrap($el).should("have.css", "background-color", queColor.BLUE_3);
      });
    return this;
  };

  clickPolygonInDrawArea = index => {
    this.getDrawArea()
      .find("polygon")
      .eq(index)
      .click();
  };

  clickPolygonInAnswerArea = (index, select = true, strokeColor = queColor.HOTSPOT_SELECT) => {
    if (select) {
      this.getAnswerContainer()
        .find("polygon")
        .eq(index)
        .click()
        .should("have.css", "stroke", strokeColor);
    } else {
      this.getAnswerContainer()
        .find("polygon")
        .eq(index)
        .click()
        .should("have.css", "stroke", strokeColor);
    }
  };

  verifyPolygonColorInPreview = (index, color) => {
    this.getAnswerContainer()
      .find("polygon")
      .eq(index)
      .should("have.css", "stroke", color);
  };

  clickClearInPreview = () => {
    this.preview.getClear().click();
    this.getAnswerContainer()
      .find("polygon")
      .each(poly => {
        expect(poly).to.have.css("stroke", queColor.HOTSPOT_CLEAR);
      });
  };

  verifyPolygonSelectedInAnsArea = (polygonIndex, selected) => {
    if (selected) {
      this.getAnswerContainer()
        .find("polygon")
        .eq(polygonIndex)
        .should("have.css", "stroke-width", "4px");
    } else {
      this.getAnswerContainer()
        .find("polygon")
        .eq(polygonIndex)
        .should("have.css", "stroke-width", "2px");
    }
  };

  verifyAnswerShown = (index, color) => {
    this.getAnswerContainer()
      .eq(1)
      .find("polygon")
      .should("be.visible")
      .eq(index)
      .should("have.css", "stroke", color);
  };

  verifyNumberOfPolygonInDrawArea = number => {
    this.getDrawArea()
      .find("polygon")
      .should("have.length", number);
  };

  getDrawArea = () => cy.get("#svg-control-block");

  getAnswerContainer = () => cy.get('[data-cy="answer-container"]');

  isImageDisplayedInQuesArea = () => {
    this.getDrawArea()
      .find("img")
      .should("have.attr", "src");
  };

  isImageDisplayedInAnsArea = () => {
    this.getHotspotMap()
      .find("img")
      .should("have.attr", "src");
  };

  clickAreaUndo = () =>
    cy
      .get('[data-cy="area-undo"]')
      .parent()
      .click();

  clickAreaRedo = () =>
    cy
      .get('[data-cy="area-redo"]')
      .parent()
      .click();

  clickAreaClear = () =>
    cy
      .get('[data-cy="area-clear"]')
      .parent()
      .click();

  addAlternate = () => {
    cy.get('[data-cy="alternate"]')
      // .should("be.visible")
      .click({ force: true });
    return this;
  };

  closelternate = () => {
    this.getAddedAlternate()
      .then($el => {
        cy.wrap($el)
          .should("be.visible")
          .click();
      })
      .should("not.exist");
  };

  enterPenalty = penalty => {
    this.getPanalty()
      .clear()
      .type(`{selectall}${penalty}`);
  };

  enterPoints = points => {
    this.getPontsInput()
      .focus()
      .clear()
      .type(`{selectall}${points}`)
      .should("have.value", points);
  };

  clickMultipleCheck = check => {
    if (check) {
      this.getMultipleCheck()
        .click()
        .find("input")
        .should("be.checked");
    } else {
      this.getMultipleCheck()
        .click()
        .find("input")
        .should("not.checked");
    }
  };

  getAddedAlternate = () => cy.get('[data-cy="del-alter"]');

  getPontsInput = () => cy.get('[data-cy="points"]');

  getMultipleCheck = () => cy.contains("span", "Multiple responses").closest("label");

  getLayout() {
    return Helpers.getElement("layout");
  }

  getFontSizeSelect() {
    return Helpers.getElement("fontSizeSelect");
  }

  getSmallFontSizeOption() {
    return Helpers.getElement("small");
  }

  getNormalFontSizeOption() {
    return Helpers.getElement("normal");
  }

  getLargeFontSizeOption() {
    return Helpers.getElement("large");
  }

  getExtraLargeFontSizeOption() {
    return Helpers.getElement("xlarge");
  }

  getHugeFontSizeOption() {
    return Helpers.getElement("xxlarge");
  }

  getMaxWidth() {
    return cy
      .contains("Maximum width")
      .parent()
      .find("input");
  }

  getStemNumeration() {
    return Helpers.getElement("stemNumerationSelect");
  }

  getNumericalStemOption() {
    return Helpers.getElement("numerical");
  }

  getUpperAlphaOption() {
    return Helpers.getElement("upper-alpha");
  }

  getLowerAlphaOption() {
    return Helpers.getElement("lower-alpha");
  }
}

export default HotspotPage;
