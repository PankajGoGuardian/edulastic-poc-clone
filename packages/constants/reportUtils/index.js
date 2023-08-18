// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| COMMON |-----|-----|-----|----- //

const common = require('./common')

// -----|-----|-----|-----| COMMON |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SINGLE ASSESSMENT REPORT |-----|-----|-----|----- //

const singleAssessmentReport = require('./singleAssessmentReport/common')
const performanceByStandards = require('./singleAssessmentReport/performanceByStandards')
const performanceByStudents = require('./singleAssessmentReport/performanceByStudents')
const questionAnalysis = require('./singleAssessmentReport/questionAnalysis')
const peerPerformance = require('./singleAssessmentReport/peerPerformance')

// -----|-----|-----|-----| SINGLE ASSESSMENT REPORT |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| MULTIPLE ASSESSMENT REPORT |-----|-----|-----|----- //

// TODO...

// -----|-----|-----|-----| MULTIPLE ASSESSMENT REPORT |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| STANDARDS MASTERY REPORT |-----|-----|-----|----- //

const standardsPerformanceSummary = require('./standardsMasteryReport/standardsPerformanceSummary')
const standardsGradebook = require('./standardsMasteryReport/standardsGradebook')
const standardsProgress = require('./standardsMasteryReport/standardsProgress')

// -----|-----|-----|-----| STANDARDS MASTERY REPORT |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

module.exports = {
  common,
  // SAR
  singleAssessmentReport,
  performanceByStandards,
  performanceByStudents,
  questionAnalysis,
  peerPerformance,
  // SMR
  standardsPerformanceSummary,
  standardsGradebook,
  standardsProgress,
}
