import { isEmpty } from 'lodash'
import { fieldKey } from '../../../ducks/constants'

export const getFormattedQueryData = ({
  filterQuery,
  attendanceBandData = [],
  performanceBandData = [],
}) => {
  const { rules = [] } = filterQuery || {}
  let updatedRules = rules
  if (
    !isEmpty(filterQuery) &&
    (attendanceBandData?.length || performanceBandData?.length)
  ) {
    updatedRules = rules.map((rule) => {
      const { field, value = [] } = rule || {}
      if (field === fieldKey.proficiencyBands && value?.length) {
        const { _id, levels_min = [] } = value[0]
        if (_id?.length && levels_min?.length && performanceBandData?.length) {
          const selectedPerformanceBandIndex = performanceBandData.findIndex(
            (performanceBand) => performanceBand._id === _id
          )
          const selectedPerformanceBand =
            performanceBandData[selectedPerformanceBandIndex]
          if (
            selectedPerformanceBandIndex !== -1 &&
            !isEmpty(selectedPerformanceBand)
          ) {
            const values = []
            levels_min.forEach((minValue) => {
              const { performanceBand: bands } = selectedPerformanceBand
              const bandRange = bands.find((band) => band.to === minValue)
              const { from, to } = bandRange
              values.push(`band${_id}_${to}_${from}`)
            })
            return {
              ...rule,
              value: values.join(','),
              field: `${fieldKey.proficiencyBands}_${selectedPerformanceBandIndex}`,
            }
          }
        }
      }

      if (field === fieldKey.attendanceBands && value?.length) {
        const { _id, levels_min = [] } = value[0]
        if (_id?.length && levels_min?.length && attendanceBandData?.length) {
          const selectedAttendanceBandIndex = attendanceBandData.findIndex(
            (attendanceBand) => attendanceBand.metaData._id === _id
          )
          const selectedAttendanceBand =
            attendanceBandData[selectedAttendanceBandIndex]
          if (
            selectedAttendanceBandIndex !== -1 &&
            !isEmpty(selectedAttendanceBand)
          ) {
            const values = []
            levels_min.forEach((minValue) => {
              const { metaData: { bands } = {} } = selectedAttendanceBand
              const bandRange = bands.find((band) => band.min === minValue)
              const { min, max } = bandRange
              values.push(`band${_id}_${min}_${max}`)
            })
            return {
              ...rule,
              value: values.join(','),
              field: `${fieldKey.attendanceBands}_${selectedAttendanceBandIndex}`,
            }
          }
        }
      }
      return rule
    })
  }
  console.log('filterData', { ...filterQuery, rules: updatedRules })
  return { ...filterQuery, rules: updatedRules }
}
