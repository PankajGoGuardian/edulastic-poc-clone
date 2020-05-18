import { attemptTypes, queColor } from "../../constants/questionTypes";

export default class BarGraph {
  constructor() {
    this.axis = "currentAxis";
  }

  // *** ELEMENTS START ***

  getLeftYAxis = () =>
    cy
      .get(".recharts-yAxis")
      .eq(0)
      .as(this.axis);

  getXAxis = () => cy.get(".recharts-xAxis").as(this.axis);

  getRightYAxis = () =>
    cy
      .get(".recharts-yAxis")
      .eq(1)
      .as(this.axis);

  getAxisScale = () => {
    const scale = [];
    return cy
      .get(`@${this.axis}`)
      .find(".recharts-cartesian-axis-tick-value")
      .then(ele => {
        if (ele.length > 1) {
          cy.wrap(ele).each(e => {
            cy.wrap(e)
              .find("tspan")
              .then(span => {
                scale.push(span.text());
              });
          });
        } else {
          cy.wrap(ele)
            .find("tspan")
            .then(span => {
              scale.push(span.text());
            });
        }
      })
      .then(() => scale);
  };

  getBars = () => cy.get(".recharts-bar.correctAttemps").find("path");

  getBarByIndexByAttemptClass = (index, attemptClass) =>
    cy
      .get(`.recharts-bar.${attemptClass}`)
      .find("path")
      .eq(index);

  getScalingLineByValue = value =>
    cy
      .get(`@${this.axis}`)
      .find("tspan")
      .contains(value);

  getToolTip = () => cy.get(".recharts-tooltip-wrapper");

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  verifyXAxisTicks = items => {
    this.getXAxis();
    this.getAxisScale().then(scale => {
      expect(items).to.eql(scale);
    });
  };

  veryLeftYAxisScale = attemptCount => {
    this.getLeftYAxis();
    this.getAxisScale().then(scale => {
      const maxTick = scale[scale.length - 1];
      // eslint-disable-next-line radix
      expect(parseInt(maxTick)).to.equal(attemptCount + Math.ceil((10 / 100) * attemptCount));
    });
  };

  getQueBarData = (questions, attemptsData) => {
    const queData = {};
    questions.forEach(que => {
      let correct = 0;
      let incorrect = 0;
      let partial = 0;

      attemptsData
        .map(item => item.attempt)
        .forEach(attempt => {
          switch (attempt[que]) {
            case attemptTypes.RIGHT:
              correct++;
              break;

            case attemptTypes.WRONG:
              incorrect++;
              break;

            case attemptTypes.PARTIAL_CORRECT:
              partial++;
              break;

            default:
              break;
          }
        });

      queData[que] = { correct, incorrect, partial };
    });
    return queData;
  };

  verifyQueToolTip = (queNum, index, queBarData) => {
    const { correct, incorrect, partial } = queBarData;
    this.getBars()
      .eq(index)
      .trigger("mouseover", { force: true })
      .then(() => {
        this.getToolTip().then(ele => {
          cy.wrap(ele)
            .contains("Correct Attemps")
            .next()
            .should("have.text", correct.toString());
          cy.wrap(ele)
            .contains("Incorrect Attemps")
            .next()
            .should("have.text", incorrect.toString());
          cy.wrap(ele)
            .contains("Partial Attemps")
            .next()
            .should("have.text", partial.toString());
        });
      });
  };

  verifyQueToolTipBasedOnAttempt = (index, attempt, questionCentric = false) => {
    let rightClass, wrongClass, partialClass, manualClass, skipClass;

    if (!questionCentric)
      [rightClass, wrongClass, partialClass, manualClass, skipClass] = [
        "correctAttemps",
        "incorrectAttemps",
        "partialAttempts",
        "manualGradedNum",
        "skippedNum"
      ];
    else
      [rightClass, wrongClass, partialClass, manualClass, skipClass] = [
        "correct",
        "wrong",
        "pCorrect",
        "manuallyGraded",
        "skipped"
      ];

    let [right, wrong, partial] = [0, 0, 0];
    let color;
    // TODO: Make the method generic as to use with all attempt types and all places
    switch (attempt) {
      case attemptTypes.RIGHT:
        this.getBarByIndexByAttemptClass(index, rightClass).as("question-bar");
        color = queColor.RIGHT;
        right = 1;
        break;
      case attemptTypes.PARTIAL_CORRECT:
        this.getBarByIndexByAttemptClass(index, partialClass).as("question-bar");
        color = queColor.YELLOW;
        partial = 1;
        break;
      case attemptTypes.WRONG:
        this.getBarByIndexByAttemptClass(index, wrongClass).as("question-bar");
        color = queColor.WRONG;
        wrong = 1;
        break;
      case attemptTypes.SKIP:
        this.getBarByIndexByAttemptClass(index, skipClass).as("question-bar");
        color = queColor.SKIP;
        break;
      case attemptTypes.MANUAL_GRADE:
        this.getBarByIndexByAttemptClass(index, manualClass).as("question-bar");
        color = queColor.MANUAL_GRADE;
        break;
      default:
        break;
    }

    cy.get("@question-bar")
      .trigger("mouseover", { force: true })
      .then(() => {
        if (!questionCentric) {
          this.getToolTip().then(ele => {
            cy.wrap(ele)
              .contains("Correct Attemps")
              .next()
              .should("have.text", right.toString());
            cy.wrap(ele)
              .contains("Incorrect Attemps")
              .next()
              .should("have.text", wrong.toString());
            cy.wrap(ele)
              .contains("Partial Attemps")
              .next()
              .should("have.text", partial.toString());
          });
        }
        cy.get("@question-bar").should("have.css", "fill", color); // FDCC3B
      });
  };
  // *** APPHELPERS END ***
}
