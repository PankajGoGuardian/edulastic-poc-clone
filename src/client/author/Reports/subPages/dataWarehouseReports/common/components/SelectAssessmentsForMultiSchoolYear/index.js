import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { connect } from 'react-redux'
import { debounce } from 'lodash'

// components & constants
import { roleuser, assignmentStatusOptions } from '@edulastic/constants'

// ducks

import { notification } from '@edulastic/common'
import { Tooltip } from 'antd'
import {
  getMultiSchoolYearTestList,
  getMultiSchoolYearTestListLoadingSelector,
  getTestListLoadingSelector,
  getTestListSelector,
  receiveMultiSchoolYearTestListAction,
  receiveTestListAction,
} from '../../../../../ducks'

import MultiSelectSearch from '../../../../../common/components/widgets/MultiSelectSearch'
import {
  currentDistrictInstitutionIds,
  getUser,
  getUserOrgId,
} from '../../../../../../src/selectors/user'
import { MandatorySymbol } from '../styledComponents'
import { getIsMultiSchoolYearDataPresent } from '../../utils'

const { IN_PROGRESS, IN_GRADING, DONE } = assignmentStatusOptions
const DEFAULT_SEARCH_TERMS = {
  text: '',
  selectedText: '',
  selectedKey: '',
  searchedText: '',
}
const MAX_TEST_COUNT = 20

const SelectAssessmentsForMultiSchoolYear = ({
  userDetails,
  testList,
  loading,
  loadTestList,
  testTermIds,
  grades,
  subjects,
  schoolYears,
  testTypes,
  selectedTestIds,
  selectCB,
  dataCy,
  tagIds,
  districtId,
  institutionIds,
  multiSchoolYearTestList,
  multiSchoolYearLoading,
  loadMultiSchoolYearTestList,
  termId,
  externalTests = [],
}) => {
  const assessmentFilterRef = useRef()

  const [searchTerms, setSearchTerms] = useState(DEFAULT_SEARCH_TERMS)
  const firstRender = useRef(true)
  const convertItemToArray = (item) =>
    (item && (Array.isArray(item) ? item : item.split(','))) || []

  const testTermIdsArr = useMemo(() => convertItemToArray(testTermIds), [
    testTermIds,
  ])
  const subjectArr = useMemo(() => convertItemToArray(subjects), [subjects])
  const gradesArr = useMemo(() => convertItemToArray(grades), [grades])
  const isStudentTermTestTermNotSame =
    testTermIdsArr.length === 1 && termId !== testTermIdsArr[0]

  const isLongitudinalReport =
    isStudentTermTestTermNotSame ||
    (testTermIdsArr.length > 1 && subjectArr.length && gradesArr.length)

  const isMultiSchoolYear = getIsMultiSchoolYearDataPresent(testTermIds)
  const isLoading = isLongitudinalReport ? multiSchoolYearLoading : loading
  const isDisable = useMemo(() => {
    if (isMultiSchoolYear) {
      return !subjectArr.length || !gradesArr.length
    }
    return false
  }, [testTermIds, subjects, grades])
  // build dropdown data

  const getTerm = (_termId) => schoolYears.find((sy) => sy.key === _termId)
  const dropdownData = useMemo(() => {
    const tests = isLongitudinalReport ? multiSchoolYearTestList : testList
    return tests.map((item) => {
      const term = isLongitudinalReport
        ? getTerm(item?.termId)
        : getTerm(testTermIds)
      return {
        key: `${!item.isExternal ? item._id : item.testName}_${term.key}`,
        title: `${item.title}${
          isLongitudinalReport ? ` [ SY:${term?.title || ''} ]` : ''
        } `,
        disabled: true,
      }
    })
  }, [testList, multiSchoolYearTestList])

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
    if (isLongitudinalReport) {
      q.search.termIds = testTermIdsArr
    } else {
      q.search.termId = termId
    }
    if (grades) {
      q.search.grades = gradesArr
    }
    if (subjects) {
      q.search.subjects = subjectArr
    }
    if (testTypes) {
      q.search.testTypes = convertItemToArray(testTypes)
    }
    if (tagIds) {
      q.search.tagIds = convertItemToArray(tagIds)
    }
    return q
  }, [
    searchTerms.text,
    testTermIds,
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
    if (selectedElements?.length > MAX_TEST_COUNT) {
      notification({
        type: 'warn',
        msg: `Max ${MAX_TEST_COUNT} test are allowed`,
      })
      return
    }
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
  const loadTestListDebounced = useCallback(
    debounce(loadTestList, 500, { trailing: true }),
    []
  )
  const loadMultiSchoolYearTestListDebounced = useCallback(
    debounce(loadMultiSchoolYearTestList, 500, { trailing: true }),
    []
  )

  // effects
  useEffect(() => {
    if ((!searchTerms.text && !searchTerms.selectedText) || searchTerms.text) {
      if (isLongitudinalReport) {
        loadMultiSchoolYearTestListDebounced({ ...query, externalTests })
      } else if (testTermIdsArr.length === 1) {
        loadTestListDebounced({ ...query, externalTests })
      }
    }
  }, [query])
  // Reset the selected test fields
  useEffect(() => {
    if (isDisable) {
      selectCB([])
    }
  }, [isDisable])

  // Reset when transitioning from multi to single school year and vice versa
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    selectCB([])
  }, [isMultiSchoolYear])

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
  }, [testList, multiSchoolYearTestList])
  const label = (
    <>
      Test
      {isMultiSchoolYear && (
        <>
          <MandatorySymbol>*</MandatorySymbol> (You can select Max 20)
        </>
      )}
    </>
  )

  const disabledPlaceholder = isDisable
    ? 'Select a Test Grade and Subject to activate the Test Filter'
    : 'Select Test'

  const placeholder = !isMultiSchoolYear ? 'All Tests' : disabledPlaceholder
  const multiSelectSearch = (
    <MultiSelectSearch
      dataCy={dataCy}
      label={label}
      placeholder={placeholder}
      el={assessmentFilterRef}
      onChange={onChange}
      onSearch={onSearch}
      value={selectedTestIds}
      disabled={isDisable}
      options={isLoading ? [] : dropdownData || []}
      loading={isLoading}
    />
  )
  if (isDisable) {
    return (
      <Tooltip
        placement="bottomLeft"
        overlayStyle={{ maxWidth: '100%' }}
        title="Select a Test Grade and Subject to activate the Test Filter"
      >
        {multiSelectSearch}
      </Tooltip>
    )
  }
  return <>{multiSelectSearch}</>
}

export default connect(
  (state) => ({
    userDetails: getUser(state),
    testList: getTestListSelector(state),
    multiSchoolYearTestList: getMultiSchoolYearTestList(state),
    loading: getTestListLoadingSelector(state),
    multiSchoolYearLoading: getMultiSchoolYearTestListLoadingSelector(state),
    districtId: getUserOrgId(state),
    institutionIds: currentDistrictInstitutionIds(state),
  }),
  {
    loadTestList: receiveTestListAction,
    loadMultiSchoolYearTestList: receiveMultiSchoolYearTestListAction,
  }
)(SelectAssessmentsForMultiSchoolYear)
