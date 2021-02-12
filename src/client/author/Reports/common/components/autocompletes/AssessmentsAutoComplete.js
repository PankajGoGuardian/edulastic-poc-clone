import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { connect } from 'react-redux'
import { debounce } from 'lodash'

// components & constants
import { roleuser, assignmentStatusOptions } from '@edulastic/constants'
import MultiSelectSearch from '../widgets/MultiSelectSearch'
// ducks
import { getUser } from '../../../../src/selectors/user'
import {
  receiveTestListAction,
  getTestListSelector,
  getTestListLoadingSelector,
} from '../../../ducks'

const { DONE } = assignmentStatusOptions
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
  grade,
  subject,
  testTypes,
  selectedTestIds,
  selectCB,
  dataCy,
}) => {
  const assessmentFilterRef = useRef()
  const [searchTerms, setSearchTerms] = useState(DEFAULT_SEARCH_TERMS)

  // build search query
  const query = useMemo(() => {
    const { role, orgData = {} } = userDetails
    const { districtIds, institutionIds } = orgData
    const districtId = districtIds?.[0]
    const q = {
      limit: 25,
      page: 1,
      search: {
        searchString:
          searchTerms.selectedText === searchTerms.text ? '' : searchTerms.text,
        statuses: [DONE],
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
    if (grade) {
      q.search.grades = [grade]
    }
    if (subject) {
      q.search.subjects = [subject]
    }
    if (testTypes) {
      q.search.testTypes = testTypes.split(',')
    }
    return q
  }, [searchTerms.text, termId, grade, subject, testTypes])

  // handle autocomplete actions
  const onSearch = (value) => {
    setSearchTerms({ ...searchTerms, text: value, searchedText: value })
  }
  const loadTestListDebounced = useCallback(
    debounce(loadTestList, 500, { trailing: true }),
    []
  )

  useEffect(() => {
    if ((!searchTerms.text && !searchTerms.selectedText) || searchTerms.text) {
      loadTestListDebounced(query)
    }
  }, [query])
  useEffect(() => {
    if (searchTerms.selectedKey && !searchTerms.searchedText) {
      const validTestIds = selectedTestIds.filter((testId) => {
        return testList.find((t) => t._id === testId)
      })
      selectCB(validTestIds)
    }
    setSearchTerms({
      ...searchTerms,
      selectedText: searchTerms.text,
    })
  }, [testList])

  // build dropdown data
  const dropdownData = testList.map((item) => ({
    key: item._id,
    title: `${item.title} (ID: ${
      item._id?.substring(item._id.length - 5) || ''
    })`,
  }))

  const setAssessments = (assessments) => {
    const selectedAssessmentIds = !assessments.length
      ? []
      : typeof assessments === 'string'
      ? [assessments]
      : assessments
    setSearchTerms({
      ...searchTerms,
      searchedText: '',
      selectedKey: selectedAssessmentIds.join(','),
    })
    selectCB(selectedAssessmentIds)
  }

  return (
    <MultiSelectSearch
      dataCy={dataCy}
      label="Test"
      placeholder="All Tests"
      el={assessmentFilterRef}
      onChange={(selected) => setAssessments(selected)}
      onSearch={onSearch}
      value={selectedTestIds}
      options={!loading ? dropdownData : []}
      loading={loading}
    />
  )
}

export default connect(
  (state) => ({
    userDetails: getUser(state),
    testList: getTestListSelector(state),
    loading: getTestListLoadingSelector(state),
  }),
  {
    loadTestList: receiveTestListAction,
  }
)(AssessmentAutoComplete)
