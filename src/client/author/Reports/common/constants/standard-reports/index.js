import { ReportPaths } from '@edulastic/constants/const/report'
import {
  IconGraduationCapAlt,
  IconLinkHorizontal,
  IconMultipleFile,
  IconMultipleLayers,
  IconSingleFile,
} from '@edulastic/icons'
import React from 'react'

// thumbnail
import appConfig from '../../../../../../app-config'
import ActivityBySchoolImg from '../../../../src/assets/reports/activity-by-school/activity-by-school.png'
import ActivityByTeacherImg from '../../../../src/assets/reports/activity-by-teacher/activity-by-teacher.png'
import AssessmentSummaryImg from '../../../../src/assets/reports/assessment-summary/assessment-summary.png'
import EngagementSummaryImg from '../../../../src/assets/reports/engagement-summary/engagement-summary.png'
import MarAnalysis from '../../../../src/assets/reports/mar-analysis/mar-analysis.png'
import MarTestCompletionAnalysis from '../../../../src/assets/reports/mar-test-completion-analysis/mar-test-completion-analysis.png'
import MarOverTime from '../../../../src/assets/reports/mar-over-time/mar-over-time.png'
import MARPreVsPost from '../../../../src/assets/reports/mar-pre-vs-post/mar-pre-vs-post.png'
import MarProgress from '../../../../src/assets/reports/mar-progress/mar-progress.png'
import PerformanceByRubricCriteria from '../../../../src/assets/reports/performance-by-rubric-criteria/performance-by-rubric-criteria.png'
import PerformanceByStandards from '../../../../src/assets/reports/performance-by-standards/performance-by-standards.png'
import performanceByStudents from '../../../../src/assets/reports/performance-by-students/performance-by-students.png'
import QuestionAnalysis from '../../../../src/assets/reports/question-analysis/question-analysis.png'
import ResponseFrequency from '../../../../src/assets/reports/response-frequency/response-frequency.png'
import SMRGradbook from '../../../../src/assets/reports/smr-gradbook/smr-gradbook.png'
import SMRPerformance from '../../../../src/assets/reports/smr-performance-summary/smr-performance-summary.png'
import SMRProgress from '../../../../src/assets/reports/smr-standards-progress/smr-standards-progress.png'
import StudentAssessmentImg from '../../../../src/assets/reports/student-assessment-profile/student-assessment-profile.png'
import StudentMasteryImg from '../../../../src/assets/reports/student-mastery-profile/student-mastery-profile.png'
import StudentSummaryImg from '../../../../src/assets/reports/student-profile-summary/student-profile-summary.png'
import StudentProgressProfileImg from '../../../../src/assets/reports/student-progress-profile/student-progress-profile.png'
import PeerPerformanceImg from '../../../../src/assets/reports/sup-group-performance/sup-group-performance.png'

const CDN_PREFIX = `${appConfig.getCDNOrigin()}/JS/assets`

// sell thumbnail
const AssessmentSummaryImgIcon = `${CDN_PREFIX}/assessment-summary-icon.png`
const MarTestCompletionAnalysisIcon = `${CDN_PREFIX}/mar-test-completion-analysis.png`
const MarAnalysisIcon = `${CDN_PREFIX}/mar-analysis-icon.png`
const MarOverTimeIcon = `${CDN_PREFIX}/mar-over-time-icon.png`
const MARPreVsPostIcon = `${CDN_PREFIX}/mar-pre-vs-post-icon.png`
const MarProgressIcon = `${CDN_PREFIX}/mar-progress-icon.png`
const PerformanceByRubricCriteriaIcon = `${CDN_PREFIX}/performance-by-rubric-criteria-icon.png`
const PerformanceByStandardsIcon = `${CDN_PREFIX}/performance-by-standards-icon.png`
const performanceByStudentsIcon = `${CDN_PREFIX}/performance-by-students-icon.png`
const QuestionAnalysisIcon = `${CDN_PREFIX}/question-analysis-icon.png`
const ResponseFrequencyIcon = `${CDN_PREFIX}/response-frequency-icon.png`
const SMRGradbookIcon = `${CDN_PREFIX}/smr-gradbook-icon.png`
const SMRPerformanceIcon = `${CDN_PREFIX}/smr-performance-summary-icon.png`
const SMRProgressIcon = `${CDN_PREFIX}/smr-standards-progress-icon.png`
const StudentAssessmentImgIcon = `${CDN_PREFIX}/student-assessment-profile-icon.png`
const StudentMasteryImgIcon = `${CDN_PREFIX}/student-mastery-profile-icon.png`
const StudentSummaryImgIcon = `${CDN_PREFIX}/student-profile-summary-icon.png`
const StudentProgressProfileImgIcon = `${CDN_PREFIX}/student-progress-profile-icon.png`
const PeerPerformanceImgIcon = `${CDN_PREFIX}/sup-group-performance-icon.png`
const ActivityBySchoolImgIcon = `${CDN_PREFIX}/activity-by-school-icon.png`
const ActivityByTeacherImgIcon = `${CDN_PREFIX}/activity-by-teacher-icon.png`
const EngagementSummaryImgIcon = `${CDN_PREFIX}/engagement-summary-icon.png`

export const FREE_REPORT = {
  standardsGradebook: {
    key: 'standardsGradebook',
    freeReport: true,
    title: 'Standards Gradebook',
    sellThumbnail: SMRGradbookIcon,
    thumbnail: SMRGradbook,
    location: '/author/reports/standards-gradebook',
    description:
      'View a summary of proficiency on all standards assessed on one or more tests. Can be filtered by individual, class, or group.',
    sellDescription:
      'View a summary of proficiency on all standards assessed on one or more tests.',
  },
}

export const INSIGHT_REPORTS = [
  {
    key: 'singleAssessmentReport',
    className: 'single-assessment-reports',
    heading: 'Single Assessment Report',
    icon: <IconSingleFile />,
    cards: [
      {
        key: 'assessmentSummary',
        title: 'Assessment Summary',
        sellThumbnail: AssessmentSummaryImgIcon,
        thumbnail: AssessmentSummaryImg,
        location: '/author/reports/assessment-summary/test/',
        description: 'View a high level analysis of data for one assessment.',
        sellDescription:
          'View a high level analysis of how students performed in an assessment.',
      },
      {
        key: 'peerPerformance',
        title: 'Sub-Group Performance',
        sellThumbnail: PeerPerformanceImgIcon,
        thumbnail: PeerPerformanceImg,
        description:
          'Drill down to compare the performance on an assessment by student group, class, or cohort.',
        location: '/author/reports/peer-performance/test/',
        sellDescription:
          'Drill down to compare the performance on an assessment by student group, class, or cohort.',
      },
      {
        key: 'questionAnalysis',
        title: 'Question Analysis',
        sellThumbnail: QuestionAnalysisIcon,
        thumbnail: QuestionAnalysis,
        description:
          'Identity the most difficult questions for further analysis.',
        location: '/author/reports/question-analysis/test/',
        sellDescription:
          'Identity the questions students found most difficult to answer.',
      },
      {
        key: 'responseFrequency',
        title: 'Response Frequency',
        sellThumbnail: ResponseFrequencyIcon,
        thumbnail: ResponseFrequency,
        description:
          'Diagnose the areas of misunderstanding by question type and frequently chosen answers.',
        location: '/author/reports/response-frequency/test/',
        sellDescription:
          'Diagnose the areas of misunderstanding by question type and frequently chosen answers.',
      },
      {
        key: 'performanceByStandards',
        title: 'Performance by Standards',
        sellThumbnail: PerformanceByStandardsIcon,
        thumbnail: PerformanceByStandards,
        description:
          'View overall performance of the standards assessed. Analyze by domain, standard, and student levels.',
        location: '/author/reports/performance-by-standards/test/',
        sellDescription:
          'View overall performance of the standards assessed. Analyze by domain, standard, and mastery levels.',
      },
      {
        key: 'performanceByStudents',
        title: 'Performance by Students',
        sellThumbnail: performanceByStudentsIcon,
        thumbnail: performanceByStudents,
        description:
          'Identify groups of students by proficiency level to gauge next steps or develop differentiated paths.',
        location: '/author/reports/performance-by-students/test/',
        sellDescription:
          'Identify groups of students by proficiency level to gauge next steps or develop differentiated paths.',
      },
    ],
  },
  {
    key: 'multipleAssessmentReport',
    className: 'multiple-assessment-reports',
    heading: 'Multiple Assessment Report',
    icon: <IconMultipleFile />,
    cards: [
      {
        key: 'completionReport',
        title: 'Test Completion Analysis',
        sellThumbnail: MarTestCompletionAnalysisIcon,
        thumbnail: MarTestCompletionAnalysis,
        location: '/author/reports/completion-report',
        description:
          'Understand which students are yet to submit assignments across schools, classes, etc., to help increase completion rates quickly.',
        sellDescription:
          'Understand which students are yet to submit assignments.',
      },
      {
        key: 'performanceOverTime',
        title: 'Performance Over Time',
        sellThumbnail: MarOverTimeIcon,
        thumbnail: MarOverTime,
        location: '/author/reports/performance-over-time',
        description:
          'Compare student performance across two or more assessments.',
        sellDescription:
          'Compare student performance across two or more assessments.',
      },
      {
        key: 'peerProgressAnalysis',
        title: 'Peer Progress Analysis',
        sellThumbnail: MarAnalysisIcon,
        thumbnail: MarAnalysis,
        location: '/author/reports/peer-progress-analysis',
        description:
          'Explore trends in performance by class or cohort. Isolates groups that are on, at or below target.',
        sellDescription:
          'Explore trends in performance by class or cohort. Isolates groups that are on, at or below target.',
      },
      {
        key: 'studentProgress',
        title: 'Student Progress',
        sellThumbnail: MarProgressIcon,
        thumbnail: MarProgress,
        location: '/author/reports/student-progress',
        description:
          'Explore trends in performance by student. Isolates those who are on, at, or below target to aid in differentiated instruction.',
        sellDescription:
          'Explore trends in performance by student. Isolates those who are on, at, or below target to aid in differentiated instruction.',
      },
      {
        key: 'preVsPost',
        title: 'Pre vs Post',
        sellThumbnail: MARPreVsPostIcon,
        thumbnail: MARPreVsPost,
        location: ReportPaths.PRE_VS_POST,
        description:
          'Compare student performance across two assessments to analyze the change in scores and the movement of students across performance bands to assign an appropriate intervention.',
        sellDescription:
          'Find out how student performance changed between two tests, say pre vs post intervention.',
      },
    ],
  },
  {
    key: 'standardMasteryReport',
    className: 'standards-mastery-reports',
    heading: 'Standards Mastery Report',
    icon: <IconMultipleLayers />,
    cards: [
      {
        key: 'standardsPerformanceSummary',
        title: 'Standards Performance Summary',
        sellThumbnail: SMRPerformanceIcon,
        thumbnail: SMRPerformance,
        location: '/author/reports/standards-performance-summary',
        description:
          'View an aggregate of overall mastery on all domains assessed in a subject, filtered by individual, class, or group.',
        sellDescription:
          'View an aggregate of overall mastery on all domains assessed in a subject.',
      },
      FREE_REPORT.standardsGradebook,
      {
        key: 'standardsProgress',
        title: 'Standards Progress',
        sellThumbnail: SMRProgressIcon,
        thumbnail: SMRProgress,
        location: '/author/reports/standards-progress',
        description:
          'View a summary of proficiency levels on a specific standard across one or more assessments. Can be filtered by individual, class, or group.',
        sellDescription:
          'View a summary of proficiency levels on a specific standard across one or more assessments.',
      },
      {
        key: 'performanceByRubricCriteria',
        title: 'Performance By Rubric Criteria',
        sellThumbnail: PerformanceByRubricCriteriaIcon,
        thumbnail: PerformanceByRubricCriteria,
        location: '/author/reports/performance-by-rubric-criteria',
        description: `View the rubric average and distribution of responses on the rubric's criteria assessed on one or more tests. Can be filtered by individual, class, or group.`,
        sellDescription:
          'View the rubric average and distribution of responses on the rubric’s criteria assessed on one or more tests.',
      },
    ],
  },
  {
    key: 'studentProfileReport',
    className: 'student-profile-reports',
    heading: 'Student Profile Report',
    icon: <IconGraduationCapAlt />,
    cards: [
      {
        key: 'studentProfileSummary',
        title: 'Student Profile Summary',
        location: '/author/reports/student-profile-summary/student/',
        sellThumbnail: StudentSummaryImgIcon,
        thumbnail: StudentSummaryImg,
        description: 'View an overall snapshot of student performance to date.',
        sellDescription:
          'View an overall snapshot of student performance to date.',
      },
      {
        key: 'studentMasteryProfile',
        title: 'Student Mastery Profile',
        sellThumbnail: StudentMasteryImgIcon,
        thumbnail: StudentMasteryImg,
        location: '/author/reports/student-mastery-profile/student/',
        description:
          'Drill down to individual performance by domain and standards.',
        sellDescription:
          'Drill down to individual performance by domain and standards.',
      },
      {
        key: 'studentAssessmentProfile',
        title: 'Student Assessment Profile',
        sellThumbnail: StudentAssessmentImgIcon,
        thumbnail: StudentAssessmentImg,
        location: '/author/reports/student-assessment-profile/student/',
        description:
          'See performance by score on each assessment taken, filtered by course.',
        sellDescription: 'See performance by score on each assessment taken.',
      },
      {
        key: 'studentProgressProfile',
        title: 'Student Standards Progress',
        sellThumbnail: StudentProgressProfileImgIcon,
        thumbnail: StudentProgressProfileImg,
        location: '/author/reports/student-progress-profile/student/',
        description:
          'Explore trends in performance of a student on various standards over time.',
        sellDescription:
          'Explore trends in performance of a student on various standards over time.',
      },
    ],
  },
  {
    key: 'engagementReport',
    className: 'engagement-reports',
    adminReport: true,
    heading: 'Engagement Report',
    icon: <IconLinkHorizontal />,
    cards: [
      {
        key: 'engagementSummary',
        title: 'Engagement Summary',
        sellThumbnail: EngagementSummaryImgIcon,
        thumbnail: EngagementSummaryImg,
        location: '/author/reports/engagement-summary',
        description:
          'View overall no. of assessments assigned and total no. of students taking the assessments over time.',
        sellDescription:
          'View overall no. of assessments assigned and total no. of students taking the assessments over time.',
      },
      {
        key: 'activityBySchool',
        title: 'Activity by School',
        sellThumbnail: ActivityBySchoolImgIcon,
        thumbnail: ActivityBySchoolImg,
        location: '/author/reports/activity-by-school',
        description:
          'View the no. of assessments, active teacher and students taking assessment by each school.',
        sellDescription:
          'View overall no. of assessments, active teacher and students taking assessments by each school.',
      },
      {
        key: 'activityByTeacher',
        title: 'Activity by Teacher',
        sellThumbnail: ActivityByTeacherImgIcon,
        thumbnail: ActivityByTeacherImg,
        location: '/author/reports/activity-by-teacher',
        description:
          'View the no. of assessments and students taking assessment under each teacher.',
        sellDescription:
          'View the no. of assessments and students taking assessment under each teacher.',
      },
    ],
  },
]
