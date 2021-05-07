// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| COMMON |-----|-----|-----|----- //

const common = require('./common')

// -----|-----|-----|-----| COMMON |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SINGLE ASSESSMENT REPORT |-----|-----|-----|----- //

const singleAssessmentReport = require('./singleAssessmentReport/common')
// const assessmentSummary = require('./singleAssessmentReport/assessmentSummary')
// const peerPerformance = require('./singleAssessmentReport/peerPerformance')
// const questionAnalysis = require('./singleAssessmentReport/questionAnalysis')
// const responseFrequency = require('./singleAssessmentReport/responseFrequency')
const performanceByStandards = require('./singleAssessmentReport/performanceByStandards')
// const performanceByStudents = require('./singleAssessmentReport/performanceByStudents')

// -----|-----|-----|-----| SINGLE ASSESSMENT REPORT |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| MULTIPLE ASSESSMENT REPORT |-----|-----|-----|----- //

// TODO...

// -----|-----|-----|-----| MULTIPLE ASSESSMENT REPORT |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// TODO...

module.exports = {
  common,
  singleAssessmentReport,
  // assessmentSummary,
  // peerPerformance,
  // questionAnalysis,
  // responseFrequency,
  performanceByStandards,
  // performanceByStudents,
  // TODO...
}
