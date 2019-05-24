import { studentSide } from "../../constants/assignmentStatus";
import { attemptTypes } from "../../constants/questionTypes";

export default class StandardBasedReportPage {
  getStandardRow = standard => cy.contains(standard).closest("tr");

  getStandardPerformance = (attemptData, questionTypeMap) => {
    const allStandardPerformance = {};
    const queList = Object.keys(questionTypeMap);

    attemptData
      .filter(({ status }) => status === studentSide.SUBMITTED)
      .forEach(({ attempt, stuName }) => {
        queList.forEach(queNum => {
          const { points, standards } = questionTypeMap[queNum];
          const attemptType = attempt[queNum];
          standards.forEach(standard => {
            // debugger;
            let scoreObtain = 0;
            let maxScore = 0;
            if (!allStandardPerformance[standard]) {
              allStandardPerformance[standard] = { students: {}, questions: [] };
              allStandardPerformance[standard].students[stuName] = {};
            } else if (!allStandardPerformance[standard].students[stuName]) {
              allStandardPerformance[standard].students[stuName] = {};
            } else if (allStandardPerformance[standard].students[stuName].max) {
              scoreObtain = allStandardPerformance[standard].students[stuName].obtain;
              maxScore = allStandardPerformance[standard].students[stuName].max;
            }
            allStandardPerformance[standard].questions = Cypress._.union(allStandardPerformance[standard].questions, [
              queNum
            ]);
            if (attemptType === attemptTypes.RIGHT) scoreObtain += points;
            maxScore += points;
            allStandardPerformance[standard].students[stuName] = { obtain: scoreObtain, max: maxScore };
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
      const { standards } = questionTypeMap[que];
      allStandards = Cypress._.union(allStandards, standards);
    });

    allStandards.forEach(standard => {
      this.verifyStanadardPerformanceForStandard(standard, performanceData[standard]);
    });
  };

  calculateScoreAndPerfForStandard = performanceData => {
    let stdScore = 0;
    let stdMax = 0;
    const { students } = performanceData;
    Object.keys(students).forEach(student => {
      const { obtain, max } = students[student];
      stdScore += obtain;
      stdMax += max;
    });

    return Cypress._.round((stdScore / stdMax) * 100, 2);
  };

  verifyStudentPerformance = students => {
    cy.contains("Student Performance")
      .closest(".ant-card-body")
      .then(ele => {
        cy.wrap(ele)
          .find(".ant-table-tbody")
          .as("table");
        Object.keys(students).forEach(student => {
          const { obtain, max } = students[student];
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
            .should("have.text", `(${Cypress._.round((obtain / max) * 100, 2)}%)`);
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
