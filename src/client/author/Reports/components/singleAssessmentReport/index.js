import React from "react";
import { LinkItem, CardsWrapper } from "../../common/components/linkItem";
import { BoxHeading } from "../../common/components/boxHeading";

import AssessmentSummaryImg from "../../../src/assets/reports/assessment-summary/assessment-summary.png";
import PeerPerformanceImg from "../../../src/assets/reports/sup-group-performance/sup-group-performance.png";
import QuestionAnalysis from "../../../src/assets/reports/question-analysis/question-analysis.png";
import ResponseFrequency from "../../../src/assets/reports/response-frequency/response-frequency.png";
import PerformanceByStandards from "../../../src/assets/reports/performance-by-standards/performance-by-standards.png";
import performanceByStudents from "../../../src/assets/reports/performance-by-students/performance-by-students.png";

const links = [
  {
    key: "assessmentSummary",
    title: "Assessment Summary",
    thumbnail: AssessmentSummaryImg,
    location: "/author/reports/assessment-summary/test/",
    description: "View a high level analysis of data for one assessment."
  },
  {
    key: "peerPerformance",
    title: "Sub-Group Performance",
    thumbnail: PeerPerformanceImg,
    description: "Drill down to compare the performance on an assessment by student group, class, or cohort.",
    location: "/author/reports/peer-performance/test/"
  },
  {
    key: "questionAnalysis",
    title: "Question Analysis",
    thumbnail: QuestionAnalysis,
    description: "Identity the most difficult questions for further analysis.",
    location: "/author/reports/question-analysis/test/"
  },
  {
    key: "responseFrequency",
    title: "Response Frequency",
    thumbnail: ResponseFrequency,
    description: "Diagnose the areas of misunderstanding by question type and frequently chosen answers.",
    location: "/author/reports/response-frequency/test/"
  },
  {
    key: "performanceByStandards",
    title: "Performance by Standards",
    thumbnail: PerformanceByStandards,
    description: "View overall performance of the standards assessed. Analyze by domain, standard, and student levels.",
    location: "/author/reports/performance-by-standards/test/"
  },
  {
    key: "performanceByStudents",
    title: "Performance by Students",
    thumbnail: performanceByStudents,
    description:
      "Identify groups of students by proficiency level to gauge next steps or develop differentiated paths.",
    location: "/author/reports/performance-by-students/test/"
  }
];

export const SingleAssessmentReport = ({ premium }) => (
  <div>
    <BoxHeading heading="Single Assessment Report" iconType="bar-chart" />

    <CardsWrapper>
      {links.map(data => (
        <LinkItem key={data.title} data={data} tiles premium={premium} />
      ))}
    </CardsWrapper>
  </div>
);
