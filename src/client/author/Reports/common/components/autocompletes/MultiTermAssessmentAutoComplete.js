import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { connect } from 'react-redux'
import { debounce, keyBy } from 'lodash'

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
} from '../../../ducks'

import MultiSelectSearch from '../widgets/MultiSelectSearch'
import {
  currentDistrictInstitutionIds,
  getUser,
  getUserOrgId,
} from '../../../../src/selectors/user'
import { MandatorySymbol } from '../../../subPages/dataWarehouseReports/common/components/styledComponents'
import {
  convertItemToArray,
  getIsMultiSchoolYearDataPresent,
} from '../../../subPages/dataWarehouseReports/common/utils'

const { IN_PROGRESS, IN_GRADING, DONE } = assignmentStatusOptions
const DEFAULT_SEARCH_TERMS = {
  text: '',
  selectedText: '',
  selectedKey: '',
  searchedText: '',
}
const MAX_TEST_COUNT = 20

const MultiTermAssessmentAutoComplete = ({
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
  const isFieldRequired = isMultiSchoolYear || testTermIds !== termId
  const isLoading = isLongitudinalReport ? multiSchoolYearLoading : loading
  const isApplyDisabledForSelectedTests =
    isFieldRequired && (!subjectArr.length || !gradesArr.length)
  // build dropdown data

  const termsMap = keyBy(schoolYears, 'key')
  const tests = isLongitudinalReport ? multiSchoolYearTestList : testList
  const isMultiYearSelected = testTermIdsArr.length > 1
  const dropDownDataMapper = (_tests) => {
    return _tests.map((test) => {
      const testTermId = test.termId || testTermIdsArr[0]
      const testTermName = test.termName || termsMap[testTermId]?.title || ''
      return {
        key: `${!test.isExternal ? test._id : test.testName}_${testTermId}`,
        title: `${test.title}${
          isMultiYearSelected ? ` [ SY:${testTermName} ]` : ''
        } `,
        disabled: true,
      }
    })
  }
  const dropdownData = useMemo(() => {
    return dropDownDataMapper(tests)
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
    if (isApplyDisabledForSelectedTests) {
      selectCB([])
    }
  }, [isApplyDisabledForSelectedTests])

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
      {isFieldRequired && (
        <>
          <MandatorySymbol>*</MandatorySymbol> (You can select Max 20)
        </>
      )}
    </>
  )

  const disabledPlaceholder = isApplyDisabledForSelectedTests
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
      value={tests?.length ? selectedTestIds : []}
      disabled={isApplyDisabledForSelectedTests}
      options={isLoading ? [] : dropdownData || []}
      loading={isLoading}
    />
  )
  if (isApplyDisabledForSelectedTests) {
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
)(MultiTermAssessmentAutoComplete)
