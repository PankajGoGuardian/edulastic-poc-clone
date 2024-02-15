import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { connect } from 'react-redux'
import { get, isEmpty, debounce } from 'lodash'
import { Tooltip } from 'antd'

// components & constants
import { roleuser } from '@edulastic/constants'
import MultiSelectSearch from '../widgets/MultiSelectSearch'

// ducks
import { getUserOrgId } from '../../../../src/selectors/user'
import {
  getTeachersListSelector,
  receiveTeachersListAction,
} from '../../../../Teacher/ducks'
import { combineNames } from '../../util'

const DEFAULT_SEARCH_TERMS = { text: '', selectedText: '', selectedKey: '' }

const TeacherAutoComplete = ({
  dataCy,
  teacherList: teacherListRaw,
  loading,
  loadTeacherList,
  school: institutionId,
  selectedTeacherIds,
  selectCB,
  testId,
  termId,
  districtId,
  userDistrictId,
  networkIds,
  disabled,
  disabledMessage,
}) => {
  const teacherFilterRef = useRef()
  const [searchTerms, setSearchTerms] = useState(DEFAULT_SEARCH_TERMS)
  const [searchResult, setSearchResult] = useState([])

  const teacherList = useMemo(() => combineNames(teacherListRaw), [
    teacherListRaw,
  ])

  // build dropdown data
  const dropdownData = (searchTerms.text ? teacherList : searchResult).map(
    (item) => {
      return {
        key: item._id,
        title: item.name,
      }
    }
  )

  // build search query
  const query = useMemo(() => {
    const q = {
      limit: 25,
      page: 1,
      districtId: districtId || userDistrictId,
      search: {
        name: searchTerms.text,
      },
      networkIds: (networkIds || '').split(',').filter(Boolean),
      role: roleuser.TEACHER,
    }
    if (institutionId) {
      q.institutionId = institutionId
    }
    if (termId) {
      q.termId = termId
    }
    if (testId) {
      q.testIds = [testId]
    }
    return q
  }, [searchTerms.text, institutionId, testId, termId, districtId, networkIds])

  // handle autocomplete actions
  const onSearch = (value) => {
    setSearchTerms({ ...searchTerms, text: value })
  }
  const onChange = (selected, selectedElements) => {
    const _selectedTeachers = selectedElements.map(({ props }) => ({
      key: props.value,
      title: props.title,
    }))
    selectCB(_selectedTeachers)
  }
  const onBlur = () => {
    if (searchTerms.text === '' && searchTerms.selectedText !== '') {
      setSearchTerms(DEFAULT_SEARCH_TERMS)
    } else {
      setSearchTerms({ ...searchTerms, text: searchTerms.selectedText })
    }
  }
  const loadTeacherListDebounced = useCallback(
    debounce(loadTeacherList, 500, { trailing: true }),
    []
  )
  const onFocus = () => {
    if (isEmpty(searchResult) && !disabled) {
      loadTeacherListDebounced(query)
    }
  }

  // effects
  useEffect(() => {
    if (selectedTeacherIds.length && !disabled) {
      loadTeacherListDebounced({ ...query, teacherIds: selectedTeacherIds })
    }
  }, [])
  useEffect(() => {
    if (isEmpty(searchResult) || !searchTerms.text) {
      setSearchResult(teacherList)
    }
  }, [teacherList])
  useEffect(() => {
    if (
      searchTerms.text &&
      searchTerms.text !== searchTerms.selectedText &&
      !disabled
    ) {
      loadTeacherListDebounced(query)
    }
  }, [searchTerms])
  useEffect(() => {
    setSearchResult([])
  }, [institutionId, testId, termId, districtId, networkIds, disabled])

  return (
    <Tooltip title={disabledMessage}>
      <MultiSelectSearch
        dataCy={dataCy}
        label="Teacher"
        placeholder="All Teachers"
        el={teacherFilterRef}
        onChange={onChange}
        onSearch={onSearch}
        onBlur={onBlur}
        onFocus={onFocus}
        value={selectedTeacherIds}
        options={!loading ? dropdownData : []}
        loading={loading}
      />
    </Tooltip>
  )
}

export default connect(
  (state) => ({
    teacherList: getTeachersListSelector(state),
    loading: get(state, ['teacherReducer', 'loading'], false),
    userDistrictId: getUserOrgId(state),
  }),
  {
    loadTeacherList: receiveTeachersListAction,
  }
)(TeacherAutoComplete)
