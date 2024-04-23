import { formatDate } from '@edulastic/constants/reportUtils/common'

const calculateMinWidth = (value, total) => {
  const minWidth = 3
  return Math.max(((value / total) * 100).toFixed(2), minWidth)
}

export const chartDataFormatter = (chartData = []) => {
  // chart data is already sorted in required order
  // reverse the order to show it in bar chart from right to left
  const ascendingChartData = chartData.reverse()
  return ascendingChartData.map((item) => {
    const submittedWidth =
      item.submitted === '0'
        ? 0
        : calculateMinWidth(item.submitted, item.assigned)

    const inProgressWidth =
      item.inProgress === '0'
        ? 0
        : calculateMinWidth(item.inProgress, item.assigned)

    const notStartedWidth =
      item.notStarted === '0'
        ? 0
        : calculateMinWidth(item.notStarted, item.assigned)

    const absentWidth =
      item.absent === '0' ? 0 : calculateMinWidth(item.absent, item.assigned)

    const gradedWidth =
      item.graded === '0' ? 0 : calculateMinWidth(item.graded, item.assigned)
    const notOpenWidth =
      item.notOpen === '0' ? 0 : calculateMinWidth(item.notOpen, item.assigned)

    const totalWidth =
      gradedWidth +
      absentWidth +
      notStartedWidth +
      inProgressWidth +
      submittedWidth +
      notOpenWidth

    return {
      testName: item.testName,
      gradedPercentage: ((item.graded / item.assigned) * 100).toFixed(2),
      submittedPercentage: ((item.submitted / item.assigned) * 100).toFixed(2),
      inProgressPercentage: ((item.inProgress / item.assigned) * 100).toFixed(
        2
      ),
      notStartedPercentage: ((item.notStarted / item.assigned) * 100).toFixed(
        2
      ),
      notOpenPercentage: ((item.notOpen / item.assigned) * 100).toFixed(2),
      absentPercentage: ((item.absent / item.assigned) * 100).toFixed(2),
      gradedContribution: (gradedWidth / totalWidth) * 100,
      inProgressContribution: (inProgressWidth / totalWidth) * 100,
      notStartedContribution: (notStartedWidth / totalWidth) * 100,
      submittedContribution: (submittedWidth / totalWidth) * 100,
      absentContribution: (absentWidth / totalWidth) * 100,
      notOpenContribution: (notOpenWidth / totalWidth) * 100,
      graded: item.graded,
      submitted: item.submitted,
      inProgress: item.inProgress,
      notStarted: item.notStarted,
      notOpen: item.notOpen,
      absent: item.absent,
      totalCount: item.assigned,
      testDate: +item.assessmentDate
        ? formatDate(item.assessmentDate)
        : 'Not Open',
      testId: item.testId,
      testType: item.testType,
      totalTests: item.totalRows,
    }
  })
}

export const barsLabelFormatter = (value, payload, height) => {
  if (height > 14) return value
  return ''
}

export const yLabelFormatter = () => ''

export const yTicks = Array.from({ length: 21 }, (_, i) => i * 5)
