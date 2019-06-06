import { attemptTypes } from "../../constants/questionTypes";

export default class BarGraph {
  constructor() {
    this.axis = "currentAxis";
  }

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

  getScalingLineByValue = value =>
    cy
      .get(`@${this.axis}`)
      .find("tspan")
      .contains(value);

  getToolTip = () => cy.get(".recharts-tooltip-wrapper");

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
}
