import React, { useEffect, useState } from 'react'
import { FieldLabel, SelectInputStyled } from '@edulastic/common'
import { roleuser } from '@edulastic/constants'
import { Select } from 'antd'
import { connect } from 'react-redux'
import { debounce } from 'lodash'
import {
  getTestListLoadingSelector,
  getTestListSelector,
  receiveTestListAction,
  setTestListLoadingAction,
} from '../../../Reports/ducks'
import {
  currentDistrictInstitutionIds,
  getUserIdSelector,
  getUserOrgId,
  getUserRole,
} from '../../../src/selectors/user'
import { getAssignmentTestsSelector } from '../../../src/selectors/assignments'
import { getFilterFromSession } from '../../../../common/utils/helpers'

const LIST_FETCH_LIMIT = 35

const TestNameList = ({
  onChange,
  userRole,
  loadTestList,
  testList,
  districtId,
  institutionIds,
  grades = [],
  subject,
  testType,
  termId,
  status,
  testId,
  loading,
  setTestListLoading,
  teacherTestList = [],
  userId,
}) => {
  const [changed, setFilterChanged] = useState(false)
  const query = {
    limit: LIST_FETCH_LIMIT,
    page: 1,
    search: {
      searchString: '',
      districtId,
    },
    aggregate: true,
  }
  if (userRole === roleuser.SCHOOL_ADMIN && institutionIds?.length) {
    query.search.institutionIds = institutionIds
  }
  if (termId) {
    query.search.termId = termId
  }
  if (grades?.length) {
    query.search.grades = Array.isArray(grades)
      ? grades.filter((item) => !!item)
      : grades.split(',')
  }
  if (subject) {
    query.search.subjects = [subject]
  }
  if (testType) {
    query.search.testTypes = [testType]
  }
  const handleSearch = debounce((value) => {
    if (roleuser.DA_SA_ROLE_ARRAY.includes(userRole)) {
      delete query.search.testIds
      if (value) {
        query.search.searchString = value
        loadTestList(query)
      } else {
        loadTestList(query)
      }
    }
  }, 500)

  useEffect(() => {
    setTestListLoading(false)
    const { testId: _testId } = getFilterFromSession({
      key: 'assignments_filter',
      userId,
      districtId,
    })
    if (
      _testId &&
      roleuser.DA_SA_ROLE_ARRAY.includes(userRole) &&
      !testList.some((test) => test._id === _testId)
    ) {
      query.search.testIds = [_testId]
      loadTestList(query)
    }
  }, [])

  useEffect(() => {
    setFilterChanged(true)
  }, [status, termId, grades, subject, testType])

  const _testList = roleuser.DA_SA_ROLE_ARRAY.includes(userRole)
    ? testList
    : teacherTestList

  return (
    <>
      <FieldLabel>Test Name</FieldLabel>
      <SelectInputStyled
        data-cy="filter-test-name"
        mode="default"
        showSearch
        placeholder="All Tests"
        value={testId}
        onChange={onChange}
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
        onSearch={handleSearch}
        onFocus={() => {
          if (
            (!testList.length || changed) &&
            roleuser.DA_SA_ROLE_ARRAY.includes(userRole)
          ) {
            loadTestList(query)
            if (changed) {
              setFilterChanged(false)
            }
          }
        }}
        filterOption={(input, option) =>
          option.props?.children?.toLowerCase()?.indexOf(input.toLowerCase()) >=
          0
        }
        margin="0px 0px 15px"
        loading={loading}
      >
        <Select.Option key={0} value="">
          All Tests
        </Select.Option>
        {_testList.map(({ _id, title }, index) => (
          <Select.Option key={index} value={_id}>
            {title}
          </Select.Option>
        ))}
      </SelectInputStyled>
    </>
  )
}

export default connect(
  (state) => ({
    testList: getTestListSelector(state),
    districtId: getUserOrgId(state),
    institutionIds: currentDistrictInstitutionIds(state),
    userRole: getUserRole(state),
    loading: getTestListLoadingSelector(state),
    teacherTestList: getAssignmentTestsSelector(state),
    userId: getUserIdSelector(state),
  }),
  {
    loadTestList: receiveTestListAction,
    setTestListLoading: setTestListLoadingAction,
  }
)(TestNameList)
