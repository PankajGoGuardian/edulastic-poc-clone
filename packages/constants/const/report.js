const WHOLE_LEARNER_REPORT = 'whole-learner-report'
const MULTIPLE_ASSESSMENT_REPORT_DW = 'multiple-assessment-report-dw'

const reportGroupType = {
  SINGLE_ASSESSMENT_REPORT: 'single-assessment-report',
  MULTIPLE_ASSESSMENT_REPORT: 'multiple-assessment-report',
  STANDARDS_MASTERY_REPORT: 'standards-mastery-report',
  STUDENT_PROFILE_REPORT: 'student-profile-report',
  ENGAGEMENT_REPORT: 'engagement-report',
  WHOLE_LEARNER_REPORT,
  MULTIPLE_ASSESSMENT_REPORT_DW,
  NON_ACADEMIC_REPORT: 'non-academic-report',
}

const reportNavType = {
  ASSESSMENT_SUMMARY: 'assessment-summary',
  PEER_PERFORMANCE: 'peer-performance',
  QUESTION_ANALYSIS: 'question-analysis',
  RESPONSE_FREQUENCY: 'response-frequency',
  PERFORMANCE_BY_STANDARDS: 'performance-by-standards',
  PERFORMANCE_BY_STUDENTS: 'performance-by-students',
  PERFORMANCE_OVER_TIME: 'performance-over-time',
  PEER_PROGRESS_ANALYSIS: 'peer-progress-analysis',
  STUDENT_PROGRESS: 'student-progress',
  PRE_VS_POST: 'pre-vs-post',
  STANDARDS_PERFORMANCE_SUMMARY: 'standards-performance-summary',
  STANDARDS_GRADEBOOK: 'standards-gradebook',
  STANDARDS_PROGRESS: 'standards-progress',
  PERFORMANCE_BY_RUBRICS_CRITERIA: 'performance-by-rubric-criteria',
  STUDENT_PROFILE_SUMMARY: 'student-profile-summary',
  STUDENT_MASTERY_PROFILE: 'student-mastery-profile',
  STUDENT_ASSESSMENT_PROFILE: 'student-assessment-profile',
  ENGAGEMENT_SUMMARY: 'engagement-summary',
  ACTIVITY_BY_SCHOOL: 'activity-by-school',
  ACTIVITY_BY_TEACHER: 'activity-by-teacher',
  WHOLE_LEARNER_REPORT,
  MULTIPLE_ASSESSMENT_REPORT_DW,
  SOCIAL_EMOTIONAL_LEARNING: 'social-emotional-learning',
  SEL_RESPONSE_SUMMARY: 'sel-response-summary',
}

const ReportPaths = {
  PRE_VS_POST: '/author/reports/pre-vs-post',
}

const sharedWithType = {
  COLLABORATION_GROUP: 'collaborationGroup',
  USER: 'user',
}

module.exports = {
  reportGroupType,
  reportNavType,
  sharedWithType,
  ReportPaths,
  WHOLE_LEARNER_REPORT,
  MULTIPLE_ASSESSMENT_REPORT_DW,
}
