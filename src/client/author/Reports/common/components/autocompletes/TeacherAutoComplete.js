import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { connect } from 'react-redux'
import { get, isEmpty, debounce } from 'lodash'

// components & constants
import { roleuser } from '@edulastic/constants'
import MultiSelectSearch from '../widgets/MultiSelectSearch'

// ducks
import { getOrgDataSelector } from '../../../../src/selectors/user'
import {
  getTeachersListSelector,
  receiveTeachersListAction,
} from '../../../../Teacher/ducks'

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
  dataCy,
  userOrgData,
  teacherList: teacherListRaw,
  loading,
  loadTeacherList,
  school: institutionId,
  selectedTeacherIds,
  selectCB,
  testId,
  termId,
  firstLoad,
  tempTagsData,
  setTempTagsData,
  setTagsData,
}) => {
  const teacherFilterRef = useRef()
  const [searchTerms, setSearchTerms] = useState(DEFAULT_SEARCH_TERMS)
  const [searchResult, setSearchResult] = useState([])
  const [firstUpdate, setFirstUpdate] = useState(false)

  const teacherList = transformTeacherList(teacherListRaw)

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
    if (termId) {
      q.termId = termId
    }
    if (testId) {
      q.testIds = [testId]
    }
    return q
  }, [searchTerms.text, institutionId, testId, termId])

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
    if (selectedTeacherIds.length) {
      // TODO: add backend support for selected ids in query
      loadTeacherListDebounced(query)
      setFirstUpdate(true)
    }
  }, [])
  useEffect(() => {
    if (isEmpty(searchResult) || !searchTerms.text) {
      setSearchResult(transformTeacherList(teacherListRaw))
    }
  }, [teacherListRaw])
  useEffect(() => {
    const _teachers = dropdownData.filter((d) =>
      selectedTeacherIds.includes(d.key)
    )
    if (
      firstUpdate &&
      _teachers.length &&
      !firstLoad &&
      setTempTagsData &&
      setTagsData
    ) {
      // TODO: find a better way to do this
      // add delay for other tag updates to complete
      setTimeout(() => {
        setTempTagsData({ ...tempTagsData, teacherIds: _teachers })
        setTagsData({ ...tempTagsData, teacherIds: _teachers })
      }, 500)
      setFirstUpdate(false)
    }
  }, [teacherListRaw, firstLoad, firstUpdate])
  useEffect(() => {
    if (searchTerms.text && searchTerms.text !== searchTerms.selectedText) {
      loadTeacherListDebounced(query)
    }
  }, [searchTerms])
  useEffect(() => {
    setSearchResult([])
  }, [institutionId, testId, termId])

  return (
    <MultiSelectSearch
      dataCy={dataCy}
      label="Teacher"
      placeholder="All Teachers"
      el={teacherFilterRef}
      onChange={(e) => selectCB(dropdownData.filter((d) => e.includes(d.key)))}
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
