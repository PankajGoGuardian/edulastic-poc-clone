import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { connect } from 'react-redux'
import { debounce } from 'lodash'

// components & constants
import { roleuser, assignmentStatusOptions } from '@edulastic/constants'
import MultiSelectSearch from '../widgets/MultiSelectSearch'
// ducks
import {
  currentDistrictInstitutionIds,
  getUser,
  getUserOrgId,
} from '../../../../src/selectors/user'
import {
  receiveTestListAction,
  getTestListSelector,
  getTestListLoadingSelector,
} from '../../../ducks'
import { shortTestIdKeyLength } from '../../../../Assignments/constants'

const { IN_PROGRESS, IN_GRADING, DONE } = assignmentStatusOptions
const DEFAULT_SEARCH_TERMS = {
  text: '',
  selectedText: '',
  selectedKey: '',
  searchedText: '',
}

const AssessmentAutoComplete = ({
  userDetails,
  testList,
  loading,
  loadTestList,
  termId,
  grades,
  subjects,
  testTypes,
  selectedTestIds,
  selectCB,
  dataCy,
  tagIds,
  districtId,
  institutionIds,
  loc,
}) => {
  const assessmentFilterRef = useRef()
  const [searchTerms, setSearchTerms] = useState(DEFAULT_SEARCH_TERMS)

  // build dropdown data
  const dropdownData = testList.map((item) => ({
    key: item._id,
    title: `${item.title} (ID: ${
      item._id?.substring(item._id.length - shortTestIdKeyLength) || ''
    })`,
  }))

  // build search query
  const query = useMemo(() => {
    const { role } = userDetails
    const q = {
      limit: 35,
      page: 1,
      search: {
        searchString:
          searchTerms.selectedText === searchTerms.text ? '' : searchTerms.text,
        statuses: [IN_PROGRESS, IN_GRADING, DONE],
        districtId,
      },
      aggregate: true,
    }
    if (role === roleuser.SCHOOL_ADMIN && institutionIds?.length) {
      q.search.institutionIds = institutionIds
    }
    if (termId) {
      q.search.termId = termId
    }
    if (grades) {
      q.search.grades = Array.isArray(grades) ? grades : grades.split(',')
    }
    if (subjects) {
      q.search.subjects = Array.isArray(subjects)
        ? subjects
        : subjects.split(',')
    }
    if (testTypes) {
      q.search.testTypes = testTypes.split(',')
    }
    if (tagIds) {
      q.search.tagIds = tagIds.split(',')
    }
    return q
  }, [
    searchTerms.text,
    termId,
    grades,
    subjects,
    testTypes,
    tagIds,
    institutionIds,
  ])

  // handle autocomplete actions
  const onSearch = (value) => {
    setSearchTerms({ ...searchTerms, text: value, searchedText: value })
  }
  const onChange = (selected, selectedElements) => {
    const _selectedTestIds = !selected.length
      ? []
      : typeof selected === 'string'
      ? [selected]
      : selected
    setSearchTerms({
      ...searchTerms,
      searchedText: '',
      selectedKey: _selectedTestIds.join(','),
    })
    const _selectedTests = selectedElements.map(({ props }) => ({
      key: props.value,
      title: props.title,
    }))
    selectCB(_selectedTests)
  }

  const onSelectAll = () => {
    selectCB(dropdownData)
  }
  const loadTestListDebounced = useCallback(
    debounce(loadTestList, 500, { trailing: true }),
    []
  )

  // effects
  useEffect(() => {
    if ((!searchTerms.text && !searchTerms.selectedText) || searchTerms.text) {
      loadTestListDebounced(query)
    }
  }, [query])
  useEffect(() => {
    if (searchTerms.selectedKey && !searchTerms.searchedText) {
      const validTests = dropdownData.filter((d) =>
        selectedTestIds.includes(d.key)
      )
      selectCB(validTests)
    }
    setSearchTerms({
      ...searchTerms,
      selectedText: searchTerms.text,
    })
  }, [testList])

  const suffixIcon = loc === 'completion-report' && (
    <a
      onClick={onSelectAll}
      style={{ color: 'blue', fontSize: '15px', fontWeight: 400 }}
    >
      <u>SELECT ALL </u>
    </a>
  )

  return (
    <MultiSelectSearch
      dataCy={dataCy}
      label="Test"
      placeholder="Search and select a test using the name or last 6 digits of test ID"
      el={assessmentFilterRef}
      onChange={onChange}
      onSearch={onSearch}
      value={selectedTestIds}
      options={!loading ? dropdownData : []}
      loading={loading}
      suffixIcon={suffixIcon}
      loc={loc}
    />
  )
}

export default connect(
  (state) => ({
    userDetails: getUser(state),
    testList: getTestListSelector(state),
    loading: getTestListLoadingSelector(state),
    districtId: getUserOrgId(state),
    institutionIds: currentDistrictInstitutionIds(state),
  }),
  {
    loadTestList: receiveTestListAction,
  }
)(AssessmentAutoComplete)
