import { formatDate } from '@edulastic/constants/reportUtils/common'

export const chartDataFormatter = (chartData = []) =>
  chartData.map((item) => ({
    testName: item.testName,
    gradedPercentage: ((item.graded / item.assigned) * 100).toFixed(2),
    submittedPercentage: ((item.submitted / item.assigned) * 100).toFixed(2),
    inProgressPercentage: ((item.inProgress / item.assigned) * 100).toFixed(2),
    notStartedPercentage: ((item.notStarted / item.assigned) * 100).toFixed(2),
    absentPercentage: ((item.absent / item.assigned) * 100).toFixed(2),
    graded: item.graded,
    submitted: item.submitted,
    inProgress: item.inProgress,
    notStarted: item.notStarted,
    absent: item.absent,
    totalCount: item.assigned,
    testDate: formatDate(item.assessmentDate),
    testId: item.testId,
    testType: item.testType,
  }))
