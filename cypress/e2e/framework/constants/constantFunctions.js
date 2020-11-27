import { queColor, attemptTypes } from './questionTypes'
import { PERF_BANDS, MASTERY } from './assignmentStatus'

export function getPerformanceBandAndColor(performance) {
  const performanceBand =
    performance <= 100 && performance > 90
      ? PERF_BANDS.PROFICIENT
      : performance <= 90 && performance > 50
      ? PERF_BANDS.BASIC
      : PERF_BANDS.BELOW_BASIC

  const bgColor =
    performanceBand === PERF_BANDS.PROFICIENT
      ? queColor.GREEN_5
      : performanceBand === PERF_BANDS.BASIC
      ? queColor.BLUE_1
      : queColor.ORANGE_1

  return { performanceBand, bgColor }
}

export function getMasteryStatus(standardPerformance) {
  return standardPerformance <= 100 && standardPerformance >= 90
    ? MASTERY.EXCEEDS
    : standardPerformance < 90 && standardPerformance >= 80
    ? MASTERY.MASTERED
    : standardPerformance < 80 && standardPerformance >= 70
    ? MASTERY.ALMOST_MASTERED
    : MASTERY.NOT_MASTERED
}

export function getRandomStudent(className, studName, min, max) {
  return getRandomClass(className, min, max) + studName + getNumberInRange(1, 5)
}

export function getRandomClass(className, min, max) {
  return className + getNumberInRange(min, max)
}

export function getNumberInRange(min, max) {
  return Math.floor(Math.random() * (max - min) + min).toString()
}
