import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import {
  ReportFiltersContainer,
  ReportFiltersWrapper,
} from '../../../../../common/styled'
import FiltersButton from '../../../../../common/components/FilterForm/components/FormLayout/FiltersButton'
import FilterForm from '../../../../../common/components/FilterForm/FilterForm'
import { useFilters } from '../../../../../common/components/FilterForm/FilterProvider'

const useToggleState = (initialValue) => {
  const [value, setValue] = useState(initialValue)

  const toggleValue = useCallback((newValue) => {
    setValue((prevValue) =>
      typeof newValue === 'boolean' ? newValue : !prevValue
    )
  }, [])

  return [value, toggleValue]
}

/** @type {import('../../../../../common/components/FilterForm/FilterForm').FormDefinition} */
const _formDefinition = {
  title: 'Filter',
  description: `Give us the specifics for the dashboard you'd like to view`,
  tabs: [
    {
      title: 'Select Classes',
      fields: [
        'term',
        'schools',
        'teachers',
        'classGrades',
        'classSubjects',
        'course',
        'classes',
        'groups',
      ],
    },
    {
      title: 'Demographics',
      fields: [
        'race',
        'gender',
        'iepStatus',
        'frlStatus',
        'ellStatus',
        'hispanicEthnicity',
        {
          type: 'header',
          title: 'Custom Attributes',
        },
        'demographicAttributeName',
        'demographicAttributeValue',
      ],
    },
    {
      title: 'Period',
      fields: ['period', 'customPeriodStart', 'customPeriodEnd'],
    },
  ],
}

/**
 * @param {*} props
 * @returns
 * @example
 * <FilterProvider>
 *   <Filters />
 * </FilterProvider>
 */
function Filters(props) {
  const { isVisible } = props
  const [popupVisible, togglePopupVisible] = useToggleState(false)
  const { filters, setFilters } = useFilters()
  const onSubmit = useCallback((values) => {
    setFilters(filters)
  }, [])

  return (
    <>
      <ReportFiltersContainer visible={isVisible}>
        <FiltersButton selected={popupVisible} onClick={togglePopupVisible} />
        <ReportFiltersWrapper visible={popupVisible}>
          <FilterForm
            formDefinition={_formDefinition}
            onCancel={togglePopupVisible}
            onSubmit={onSubmit}
          />
        </ReportFiltersWrapper>
      </ReportFiltersContainer>
    </>
  )
}

Filters.propTypes = {
  isVisible: PropTypes.bool,
}
Filters.defaultProps = {
  isVisible: true,
}
const enhance = compose(connect((state) => ({}), {}))
export default enhance(Filters)
