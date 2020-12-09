import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { connect } from 'react-redux'
import { debounce } from 'lodash'

// components & constants
import { roleuser, assignmentStatusOptions } from '@edulastic/constants'
import MultiSelectSearch from '../../../../../common/components/widgets/MultiSelectSearch'
// ducks
import { getUser } from '../../../../../../src/selectors/user'
import {
  receiveTestListAction,
  getTestListSelector,
  getTestListLoadingSelector,
} from '../../../../../ducks'

const { DONE } = assignmentStatusOptions
const DEFAULT_SEARCH_TERMS = { text: '', selectedText: '', selectedKey: 'All' }

const AssessmentAutoComplete = ({
  userDetails,
  testList,
  loading,
  loadTestList,
  selectedTestIds,
  selectCB,
  filters,
  firstLoad,
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
        searchString: searchTerms.text,
        statuses: [DONE],
        districtId,
        grades:
          !filters.grade || filters.grade === 'All' ? [] : [filters.grade],
        subjects:
          !filters.subject || filters.subject === 'All'
            ? []
            : [filters.subject],
        testTypes:
          (filters.assessmentTypes && filters.assessmentTypes.split(',')) || [],
      },
      aggregate: true,
    }
    if (role === roleuser.SCHOOL_ADMIN && institutionIds?.length) {
      q.search.institutionIds = institutionIds
    }
    if (firstLoad && selectedTestIds.length) {
      q.search.testIds = selectedTestIds
    }
    if (filters.termId) {
      q.search.termId = filters.termId
    }
    return q
  }, [
    searchTerms.text,
    filters.termId,
    filters.grade,
    filters.subject,
    filters.assessmentTypes,
  ])

  // handle autocomplete actions
  const onSearch = (value) => {
    setSearchTerms({ ...searchTerms, text: value })
  }
  const onSelect = (key) => {
    if (key) {
      const value = testList.find((s) => s._id === key)?.title
      setSearchTerms({ text: value, selectedText: value, selectedKey: key })
      selectCB([key])
    } else {
      setSearchTerms({ ...DEFAULT_SEARCH_TERMS })
      selectCB([])
    }
  }
  const loadTestListDebounced = useCallback(
    debounce(loadTestList, 500, { trailing: true }),
    []
  )

  // effects
  useEffect(() => {
    if (!searchTerms.selectedText && testList.length) {
      onSelect(testList[0]._id)
    } else if (!loading && !testList.length) {
      onSelect()
    }
  }, [testList])
  useEffect(() => {
    if (searchTerms.selectedText) {
      setSearchTerms({ ...DEFAULT_SEARCH_TERMS })
    }
  }, [filters.termId, filters.grade, filters.subject, filters.assessmentTypes])
  useEffect(() => {
    if (
      (!searchTerms.text && !searchTerms.selectedText) ||
      searchTerms.text !== searchTerms.selectedText
    ) {
      loadTestListDebounced(query)
    }
  }, [query])

  // build dropdown data
  const dropdownData = testList.map((item) => ({
    key: item._id,
    title: `${item.title} (ID: ${
      item._id?.substring(item._id.length - 5) || ''
    })`,
  }))
  return (
    <MultiSelectSearch
      label="Test"
      placeholder="Select a test"
      el={assessmentFilterRef}
      onChange={(selected) =>
        selectCB(
          !selected.length
            ? []
            : typeof selected === 'string'
            ? [selected]
            : selected
        )
      }
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
