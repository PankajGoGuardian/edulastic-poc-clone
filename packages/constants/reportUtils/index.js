// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| COMMON |-----|-----|-----|----- //

const common = require('./common')

// -----|-----|-----|-----| COMMON |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SINGLE ASSESSMENT REPORT |-----|-----|-----|----- //

const singleAssessmentReport = require('./singleAssessmentReport/common')
const performanceByStandards = require('./singleAssessmentReport/performanceByStandards')
const performanceByStudents = require('./singleAssessmentReport/performanceByStudents')

// -----|-----|-----|-----| SINGLE ASSESSMENT REPORT |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| MULTIPLE ASSESSMENT REPORT |-----|-----|-----|----- //

// TODO...

// -----|-----|-----|-----| MULTIPLE ASSESSMENT REPORT |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| STANDARDS MASTERY REPORT |-----|-----|-----|----- //

const standardsPerformanceSummary = require('./standardsMasteryReport/standardsPerformanceSummary')
const standardsGradebook = require('./standardsMasteryReport/standardsGradebook')

// -----|-----|-----|-----| STANDARDS MASTERY REPORT |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

const dwDashboardReport = require('./datawarehouseReports/dashboardReport')

module.exports = {
  common,
  // SAR
  singleAssessmentReport,
  performanceByStandards,
  performanceByStudents,
  // SMR
  standardsPerformanceSummary,
  standardsGradebook,
  dwDashboardReport,
}
