import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { notification } from '@edulastic/common'
import { Select } from 'antd'
import { IconExpandBox } from '@edulastic/icons'
import { withNamespaces } from 'react-i18next'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { isEqual, uniq } from 'lodash'
import { getPreviouslyUsedOrDefaultInterestsSelector } from '../../../author/src/selectors/user'
import StandardsModal from './StandardsModal'
import {
  getDictCurriculumsAction,
  getDictStandardsForCurriculumAction,
} from '../../../author/src/actions/dictionaries'
import {
  getCurriculumsListSelector,
  getStandardsListSelector,
  standardsSelector,
} from '../../../author/src/selectors/dictionaries'

function StandardsSelectButton(props) {
  const {
    onChange,
    disabled,
    mode,
    placeholder,
    size,
    allStandards,
    disableDropdown,
    onDropdown,
    onIconClick,
    value,
    preventInput,
  } = props
  let [selectedStandardIds, setSelectedStandardIds] = useState([])
  const extraProps = {}

  const handleChange = (_values) => {
    setSelectedStandardIds(_values)
    onChange(_values)
  }

  if (typeof value !== 'undefined') {
    selectedStandardIds = value
    setSelectedStandardIds = () => {}
  }
  if (disableDropdown) extraProps.open = false
  if (preventInput) {
    extraProps.onInput = () => {}
    extraProps.style = {
      caretColor: 'transparent',
    }
  }
  return (
    <Select
      data-cy="selectStd"
      disabled={disabled}
      filterOption={(input, option) =>
        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      getPopupContainer={(el) => el.parentNode}
      mode={mode}
      onChange={handleChange}
      optionFilterProp="children"
      placeholder={placeholder}
      size={size}
      value={selectedStandardIds}
      suffixIcon={
        <IconExpandBox onClick={disabled ? undefined : onIconClick} />
      }
      onDropdownVisibleChange={onDropdown}
      allowClear
      maxTagCount={4}
      {...extraProps}
    >
      {allStandards.map((el) => (
        <Select.Option key={el._id} value={el._id}>
          {`${el.identifier}`}
        </Select.Option>
      ))}
    </Select>
  )
}

StandardsSelectButton.propTypes = {
  mode: PropTypes.oneOf(['default', 'multiple', 'tags', 'combobox']),
  size: PropTypes.oneOf(['small', 'default', 'large']),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  allStandards: PropTypes.arrayOf(PropTypes.object).isRequired,
  disableDropdown: PropTypes.bool,
  onDropdown: PropTypes.func,
  onIconClick: PropTypes.func,
  value: PropTypes.array,
}

StandardsSelectButton.defaultProps = {
  onIconClick: () => {},
  size: 'default',
  placeholder: 'Select Standards',
  onChange: () => {},
  disabled: false,
  mode: 'default',
  disableDropdown: false,
  onDropdown: () => {},
  value: undefined,
}

function StandardsSelect(props) {
  const {
    t,
    mode,
    onChange,
    getCurriculumStandards,
    curriculumStandardsLoading,
    curriculums,
    curriculumStandards,
    getCurriculums,
    preventInput,
    disabled,
    standardDetails,
    previouslyUsedOrDefaultInterests,
    placeholder,
    selectedSubject,
  } = props
  if (selectedSubject)
    previouslyUsedOrDefaultInterests.subject = selectedSubject
  const {
    subject: defaultSubject,
    grades: defaultGrades,
    curriculum: defaultCurriculum,
  } = previouslyUsedOrDefaultInterests

  const defaultCurriculumId = defaultCurriculum?.id || ''

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [searchProps, setSearchProps] = useState({
    id: '',
    grades: [],
    searchStr: '',
  })
  const extraProps = {}

  // TODO only used by StandardsModal. Better move into that.
  const searchCurriculumStandards = (searchObject) => {
    if (!isEqual(searchProps, searchObject)) {
      setSearchProps(searchObject)
      getCurriculumStandards(
        searchObject.id,
        searchObject.grades,
        searchObject.searchStr
      )
    }
  }

  const handleApply = (data) => {
    if (!data?.eloStandards?.length) {
      return notification({
        type: 'warn',
        messageKey: 'pleaseSelectStantdardBeforeApplying',
      })
    }
    const { subject: _subject, eloStandards, grades } = data
    const _grades = uniq(
      grades.length
        ? grades
        : eloStandards.flatMap((elo) => elo.grades || []) || []
    )
    const newStandardDetails = {
      subject: _subject,
      grades: _grades,
      standards: eloStandards.map((elo) => ({
        curriculumId: elo.curriculumId,
        standardId: elo._id,
        domainId: elo.tloId,
        identifier: elo.identifier,
        grades: elo.grades,
        _id: elo._id,
      })),
    }
    setIsModalVisible(false)
    onChange(newStandardDetails)
  }

  const handleSelectChange = (values) => {
    if (!values?.length) {
      onChange('')
      return
    }
    onChange({
      ...standardDetails,
      standards:
        standardDetails?.standards?.filter((std) =>
          values.includes(std.standardId)
        ) || [],
    })
  }

  useEffect(() => {
    searchCurriculumStandards({
      id: defaultCurriculumId,
      grades: defaultGrades,
      searchStr: '',
    })
    if (curriculums.length === 0) {
      getCurriculums()
    }
  }, [])

  const standardIds = useMemo(
    () => standardDetails?.standards?.map((std) => std.standardId) || [],
    [standardDetails?.standards]
  )

  if (preventInput) {
    extraProps.preventInput = true
    extraProps.onDropdown = setIsModalVisible
    extraProps.disableDropdown = true
  }

  return (
    <>
      <StandardsModal
        t={t}
        defaultSubject={defaultSubject}
        defaultGrades={defaultGrades}
        defaultStandards={[]}
        defaultStandard={defaultCurriculum}
        visible={isModalVisible}
        curriculums={curriculums}
        onApply={handleApply}
        onCancel={() => setIsModalVisible(false)}
        curriculumStandardsELO={curriculumStandards.elo}
        curriculumStandardsTLO={curriculumStandards.tlo}
        getCurriculumStandards={searchCurriculumStandards}
        curriculumStandardsLoading={curriculumStandardsLoading}
        singleSelect={mode !== 'multiple'}
        standardDetails={standardDetails}
        enableSelectAll
      />
      <StandardsSelectButton
        mode={mode}
        allStandards={standardDetails?.standards || []}
        onIconClick={() => setIsModalVisible(true)}
        value={standardIds}
        onChange={handleSelectChange}
        disabled={disabled}
        placeholder={placeholder}
        {...extraProps}
      />
    </>
  )
}

StandardsSelect.propTypes = {
  mode: PropTypes.oneOf(['multiple', 'default']),
  onChange: PropTypes.func,
  preventInput: PropTypes.bool,
  standardDetails: PropTypes.object,
  disabled: PropTypes.bool,
}

StandardsSelect.defaultProps = {
  mode: 'multiple',
  onChange: () => {},
  preventInput: false,
  standardDetails: undefined,
  disabled: false,
}

const enhance = compose(
  withNamespaces('assessment'),
  connect(
    (state) => ({
      curriculumStandards: getStandardsListSelector(state),
      curriculumStandardsLoading: standardsSelector(state).loading,
      curriculums: getCurriculumsListSelector(state),
      previouslyUsedOrDefaultInterests: getPreviouslyUsedOrDefaultInterestsSelector(
        state
      ),
    }),
    {
      getCurriculums: getDictCurriculumsAction,
      getCurriculumStandards: getDictStandardsForCurriculumAction,
    }
  )
)

export default enhance(StandardsSelect)
