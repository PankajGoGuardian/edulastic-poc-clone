import { attemptTypes, queColor } from "../../constants/questionTypes";
import QuestionResponsePage from "./QuestionResponsePage";

export default class BarGraph {
  constructor() {
    this.axis = "currentAxis";
    this.questionResponsePage = new QuestionResponsePage();
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

  getBarByIndexByAttemptClass = (attemptClass, index) =>
    cy
      .get(`.recharts-bar.${attemptClass}`)
      .find(".recharts-bar-rectangle")
      .eq(index)
      .find("path");

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

  getQueBarData = (questions, attemptsData, questionCentric = false) => {
    const queData = {};
    const studentWiseData = {};
    const students = attemptsData.map(item => item.stuName);
    questions.forEach(que => {
      studentWiseData[que] = {};
      let correct = 0;
      let incorrect = 0;
      let partial = 0;
      let manual = 0;
      let skip = 0;
      attemptsData
        .map(item => item.attempt)
        .forEach((attempt, stuIndex) => {
          const stu = students[stuIndex];
          switch (attempt[que]) {
            case attemptTypes.RIGHT:
              correct++;
              studentWiseData[que][stu] = attemptTypes.RIGHT;
              break;

            case attemptTypes.WRONG:
              studentWiseData[que][stu] = attemptTypes.WRONG;
              incorrect++;

              break;

            case attemptTypes.PARTIAL_CORRECT:
              studentWiseData[que][stu] = attemptTypes.PARTIAL_CORRECT;
              partial++;

              break;

            case attemptTypes.MANUAL_GRADE:
              studentWiseData[que][stu] = attemptTypes.MANUAL_GRADE;
              manual++;

              break;

            case attemptTypes.SKIP:
              studentWiseData[que][stu] = attemptTypes.SKIP;
              skip++;

              break;

            default:
              break;
          }
        });

      queData[que] = { correct, incorrect, partial, manual, skip };
    });

    if (!questionCentric) return queData;
    else return studentWiseData;
  };

  verifyQueToolTip = (queNum, queBarData) => {
    const { correct, incorrect, partial } = queBarData;

    cy.get("@latest-selected-bar")
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

  verifyQueBarAndToolTipBasedOnAttemptData = (attemptsData, questions, questionCentric = false) => {
    let rCla, wCla, pCla, mCla, sCla;

    if (questionCentric) {
      [rCla, wCla, pCla, mCla, sCla] = ["correct", "wrong", "pCorrect", "manuallyGraded", "skipped"];
      const studentWiseData = this.getQueBarData(questions, attemptsData, true);

      Cypress._.values(studentWiseData).forEach((queData, index) => {
        this.questionResponsePage.selectQuestion(`Q${index + 1}`);

        Cypress._.values(queData).forEach((attempt, studentIndex) => {
          if (attempt === attemptTypes.RIGHT)
            this.getBarByIndexByAttemptClass(rCla, studentIndex)
              .should("have.length", 1)
              .should("have.css", "fill", queColor.RIGHT);

          if (attempt === attemptTypes.PARTIAL_CORRECT)
            this.getBarByIndexByAttemptClass(pCla, studentIndex)
              .should("have.length", 1)
              .should("have.css", "fill", queColor.YELLOW);

          if (attempt === attemptTypes.WRONG)
            this.getBarByIndexByAttemptClass(wCla, studentIndex)
              .should("have.length", 1)
              .should("have.css", "fill", queColor.WRONG);

          if (attempt === attemptTypes.SKIP)
            this.getBarByIndexByAttemptClass(sCla, studentIndex)
              .should("have.length", 1)
              .should("have.css", "fill", "rgb(177, 177, 177)");

          if (attempt === attemptTypes.MANUAL_GRADE)
            this.getBarByIndexByAttemptClass(mCla, studentIndex)
              .should("have.length", 1)
              .should("have.css", "fill", queColor.MANUAL_GRADE);
        });
      });
    } else {
      [rCla, wCla, pCla, mCla, sCla] = [
        "correctAttemps",
        "incorrectAttemps",
        "partialAttempts",
        "manualGradedNum",
        "skippedNum"
      ];
      const questBarData = this.getQueBarData(questions, Array.isArray(attemptsData) ? attemptsData : [attemptsData]);

      Cypress._.values(questBarData).forEach((quedata, queIndex) => {
        const { correct, incorrect, partial, manual, skip } = quedata;

        if (correct)
          this.getBarByIndexByAttemptClass(rCla, queIndex)
            .should("have.length", 1)
            .as("latest-selected-bar")
            .should("have.css", "fill", queColor.RIGHT);
        else this.getBarByIndexByAttemptClass(rCla, queIndex).should("have.length", 0);

        if (incorrect)
          this.getBarByIndexByAttemptClass(wCla, queIndex)
            .should("have.length", 1)
            .as("latest-selected-bar")
            .should("have.css", "fill", queColor.WRONG);
        else this.getBarByIndexByAttemptClass(wCla, queIndex).should("have.length", 0);

        if (partial)
          this.getBarByIndexByAttemptClass(pCla, queIndex)
            .should("have.length", 1)
            .as("latest-selected-bar")
            .should("have.css", "fill", queColor.YELLOW);
        else this.getBarByIndexByAttemptClass(pCla, queIndex).should("have.length", 0);

        if (manual)
          this.getBarByIndexByAttemptClass(mCla, queIndex)
            .should("have.length", 1)
            .as("latest-selected-bar")
            .should("have.css", "fill", queColor.MANUAL_GRADE);
        else this.getBarByIndexByAttemptClass(mCla, queIndex).should("have.length", 0);

        if (skip)
          this.getBarByIndexByAttemptClass(sCla, queIndex)
            .should("have.length", 1)
            .as("latest-selected-bar")
            .should("have.css", "fill", queColor.SKIP);
        else this.getBarByIndexByAttemptClass(sCla, queIndex).should("have.length", 0);

        this.verifyQueToolTip(queIndex, quedata);
      });
    }
  };
  // *** APPHELPERS END ***
}
