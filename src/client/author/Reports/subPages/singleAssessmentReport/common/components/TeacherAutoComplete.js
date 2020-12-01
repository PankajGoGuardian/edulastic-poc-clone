import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { connect } from 'react-redux'
import { get, isEmpty, debounce } from 'lodash'

// components & constants
import { roleuser } from '@edulastic/constants'
import MultiSelectSearch from '../../../../common/components/widgets/MultiSelectSearch'

// ducks
import { getOrgDataSelector } from '../../../../../src/selectors/user'
import {
  getTeachersListSelector,
  receiveTeachersListAction,
} from '../../../../../Teacher/ducks'

const DEFAULT_SEARCH_TERMS = { text: '', selectedText: '', selectedKey: '' }

const transformTeacherList = (list) => {
  return list.map((t) => ({
    ...t,
    name: [t.firstName, t.middleName, t.lastName]
      .filter((n) => n)
      .join(' ')
      .trim(),
  }))
}

const TeacherAutoComplete = ({
  userOrgData,
  teacherList: teacherListRaw,
  loading,
  loadTeacherList,
  school: institutionId,
  selectedTeacherIds,
  selectCB,
}) => {
  const teacherFilterRef = useRef()
  const [searchTerms, setSearchTerms] = useState(DEFAULT_SEARCH_TERMS)
  const [searchResult, setSearchResult] = useState([])

  const teacherList = transformTeacherList(teacherListRaw)

  // build search query
  const query = useMemo(() => {
    const { districtIds } = userOrgData
    const districtId = districtIds?.[0]
    const q = {
      limit: 25,
      page: 1,
      districtId,
      search: { name: searchTerms.text },
      role: roleuser.TEACHER,
    }
    if (institutionId) {
      q.institutionId = institutionId
    }
    return q
  }, [searchTerms.text, institutionId])

  // handle autocomplete actions
  const onSearch = (value) => {
    setSearchTerms({ ...searchTerms, text: value })
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
  const getDefaultTeacherList = () => {
    if (isEmpty(searchResult)) {
      loadTeacherListDebounced(query)
    }
  }

  // effects
  useEffect(() => {
    if (isEmpty(searchResult) || !searchTerms.text) {
      setSearchResult(transformTeacherList(teacherListRaw))
    }
  }, [teacherListRaw])
  useEffect(() => {
    if (searchTerms.text && searchTerms.text !== searchTerms.selectedText) {
      loadTeacherListDebounced(query)
    }
  }, [searchTerms])
  useEffect(() => {
    setSearchResult([])
  }, [institutionId])

  const dropdownData = (searchTerms.text ? teacherList : searchResult).map(
    (item) => {
      return {
        key: item._id,
        title: item.name,
      }
    }
  )

  return (
    <MultiSelectSearch
      label="Teacher"
      el={teacherFilterRef}
      onChange={(e) => selectCB(e)}
      onSearch={onSearch}
      onBlur={onBlur}
      onFocus={() => getDefaultTeacherList()}
      value={selectedTeacherIds}
      options={!loading ? dropdownData : []}
      loading={loading}
    />
  )
}

export default connect(
  (state) => ({
    userOrgData: getOrgDataSelector(state),
    teacherList: getTeachersListSelector(state),
    loading: get(state, ['teacherReducer', 'loading'], false),
  }),
  {
    loadTeacherList: receiveTeachersListAction,
  }
)(TeacherAutoComplete)
