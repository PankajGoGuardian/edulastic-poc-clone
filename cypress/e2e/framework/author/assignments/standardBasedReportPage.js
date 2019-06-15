import { studentSide } from "../../constants/assignmentStatus";
import { attemptTypes } from "../../constants/questionTypes";
import LiveClassboardPage from "./LiveClassboardPage";

export default class StandardBasedReportPage extends LiveClassboardPage {
  getStandardRow = standard => cy.contains(standard).closest("tr");

  getStandardPerformance = (stuAttemptData, questionTypeMap) => {
    const allStandardPerformance = {};
    const queList = Object.keys(questionTypeMap);

    stuAttemptData
      .filter(({ status }) => status === studentSide.SUBMITTED)
      .forEach(({ attempt, stuName }) => {
        queList.forEach(queNum => {
          const { points, standards, attemptData, queKey } = questionTypeMap[queNum];
          const attemptType = attempt[queNum];
          standards.forEach(({ standard }) => {
            standard.forEach(std => {
              // debugger;
              let scoreObtain = 0;
              let maxScore = 0;
              let perfPerQue = [];
              if (!allStandardPerformance[std]) {
                allStandardPerformance[std] = { students: {}, questions: [] };
                allStandardPerformance[std].students[stuName] = {};
              } else if (!allStandardPerformance[std].students[stuName]) {
                allStandardPerformance[std].students[stuName] = {};
              } else if (allStandardPerformance[std].students[stuName].max) {
                scoreObtain = allStandardPerformance[std].students[stuName].obtain;
                maxScore = allStandardPerformance[std].students[stuName].max;
                perfPerQue = allStandardPerformance[std].students[stuName].performanceAllQue;
              }
              allStandardPerformance[std].questions = Cypress._.union(allStandardPerformance[std].questions, [queNum]);
              // if (attemptType === attemptTypes.RIGHT) scoreObtain += points;
              const score = this.questionResponsePage.getScoreByAttempt(
                attemptData,
                points,
                queKey.split(".")[0],
                attemptType
              );
              const performance = Cypress._.round((score / points) * 100, 2);
              scoreObtain += score;
              maxScore += points;
              perfPerQue.push(performance);
              allStandardPerformance[std].students[stuName] = {
                obtain: scoreObtain,
                max: maxScore,
                performanceAllQue: perfPerQue
              };
            });
          });
        });
      });

    return allStandardPerformance;
  };

  verifyStandardPerformance = (attemptData, questionTypeMap) => {
    const performanceData = this.getStandardPerformance(attemptData, questionTypeMap);
    let allStandards = [];

    const queList = Object.keys(questionTypeMap);

    queList.forEach(que => {
      let stdPerQue = [];
      const { standards } = questionTypeMap[que];
      standards.forEach(({ standard }) => {
        stdPerQue = Cypress._.union(stdPerQue, standard);
      });
      allStandards = Cypress._.union(allStandards, stdPerQue);
    });

    allStandards.forEach(standard => {
      this.verifyStanadardPerformanceForStandard(standard, performanceData[standard]);
    });
  };

  calculateScoreAndPerfForStandard = performanceData => {
    let stdScore = 0;
    let stdMax = 0;
    let perfSum = 0;
    const overallAvgStdPerformance = [];
    const { students } = performanceData;
    Object.keys(students).forEach(student => {
      const { obtain, max, performanceAllQue } = students[student];
      overallAvgStdPerformance.concat(performanceAllQue);
      stdScore += obtain;
      stdMax += max;
    });

    overallAvgStdPerformance.forEach(perf => {
      perfSum += perf;
    });

    return Cypress._.round(perfSum / overallAvgStdPerformance.length, 2);
    // return Cypress._.round((stdScore / stdMax) * 100, 2);
  };

  verifyStudentPerformance = students => {
    cy.contains("Student Performance")
      .closest(".ant-card-body")
      .then(ele => {
        cy.wrap(ele)
          .find(".ant-table-tbody")
          .as("table");
        Object.keys(students).forEach(student => {
          const { obtain, max, performanceAllQue } = students[student];
          let perfSum = 0;
          performanceAllQue.forEach(perf => {
            perfSum += perf;
          });

          cy.contains(student)
            .closest("tr")
            .as("studentrow")
            .find("td")
            .last()
            .find("span")
            .eq(0)
            .should("have.text", `${obtain}/${max}`);

          cy.get("@studentrow")
            .find("td")
            .last()
            .find("span")
            .eq(1)
            .should("have.text", `(${Cypress._.round(perfSum / performanceAllQue.length, 2)}%)`);
          // .should("have.text", `(${Cypress._.round((obtain / max) * 100, 2)}%)`);
        });
      });
  };

  verifyStanadardPerformanceForStandard = (standard, performanceData) => {
    const stdPerf = this.calculateScoreAndPerfForStandard(performanceData);
    const { questions, students } = performanceData;

    this.getStandardRow(standard).as("row");

    cy.get("@row")
      .find("td")
      .eq(1)
      .find("div")
      .then(ele => {
        questions.forEach(que => cy.wrap(ele).should("contain", que));
      });

    cy.get("@row")
      .find("td")
      .eq(2)
      .then(ele => {
        cy.wrap(ele)
          .find(".ant-progress-text")
          .should("have.text", `${stdPerf}%`);
      });

    cy.get("@row")
      .find("td")
      .last()
      .click();

    this.verifyStudentPerformance(students);
  };
}
