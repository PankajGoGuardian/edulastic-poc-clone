import { isEmpty } from 'lodash'
import { allFilterValue } from '../../../common/constants'

export function buildRequestFilters(_settings) {
  const _requestFilters = {}
  Object.keys(_settings.requestFilters).forEach((filterType) => {
    _requestFilters[filterType] =
      _settings.requestFilters[filterType]?.toLowerCase() === allFilterValue
        ? ''
        : _settings.requestFilters[filterType]
  })
  return _requestFilters
}

export const filterPopupFilterSelectedTestTypes = (
  selectedAssessmentTypes,
  availableTestTypes
) => {
  selectedAssessmentTypes = selectedAssessmentTypes || ''
  const testTypesSelectedInPopupFilters = selectedAssessmentTypes.split(',')
  return isEmpty(selectedAssessmentTypes)
    ? availableTestTypes
    : availableTestTypes.filter(({ key }) =>
        testTypesSelectedInPopupFilters.includes(key)
      )
}
