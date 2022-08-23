import React, { useEffect, useMemo } from 'react'
import { FieldLabel, SelectInputStyled } from '@edulastic/common'
import { roleuser } from '@edulastic/constants'
import { Select } from 'antd'
import { connect } from 'react-redux'
import { debounce, get } from 'lodash'
import { getUserIdSelector, getUserOrgId } from '../../../src/selectors/user'
import {
  getTeachersListSelector,
  receiveTeachersListAction,
} from '../../../Teacher/ducks'
import { combineNames } from '../../../Reports/common/util'
import {
  getAdminTestIdsSelector,
  getAssignmentsLoadingSelector,
} from '../../../src/selectors/assignments'
import { getFilterFromSession } from '../../../../common/utils/helpers'

const LIST_FETCH_LIMIT = 35

const TeachersList = ({
  onChange,
  assignedBy,
  termId,
  loadTeacherList,
  teacherList: teacherListRaw,
  districtId,
  loading,
  testIds = [],
  testsLoading,
  userId,
}) => {
  const teacherList = useMemo(() => combineNames(teacherListRaw), [
    teacherListRaw,
  ])

  const query = {
    limit: LIST_FETCH_LIMIT,
    page: 1,
    districtId,
    search: {
      name: '',
    },
    role: roleuser.TEACHER,
    testIds,
    termId: termId || undefined,
  }

  const handleSearch = debounce((value) => {
    delete query.teacherIds
    if (value) {
      query.search.name = value
      delete query.testIds
      loadTeacherList(query)
    } else {
      loadTeacherList(query)
    }
  }, 500)
  useEffect(() => {
    const { assignedBy: _assignedBy } = getFilterFromSession({
      key: 'assignments_filter',
      userId,
      districtId,
    })
    if (
      _assignedBy &&
      !teacherList.some((teacher) => teacher._id === _assignedBy)
    ) {
      query.teacherIds = [_assignedBy]
      loadTeacherList(query)
    }
  }, [])

  return (
    <>
      <FieldLabel>Teachers</FieldLabel>
      <SelectInputStyled
        data-cy="filter-teachers"
        mode="default"
        showSearch
        placeholder="All Teacher(s)"
        value={assignedBy}
        onChange={onChange}
        onSearch={handleSearch}
        onFocus={() => {
          if (!testsLoading) {
            loadTeacherList(query)
          }
        }}
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
        filterOption={(input, option) =>
          option.props?.children?.toLowerCase()?.indexOf(input.toLowerCase()) >=
          0
        }
        loading={loading}
        margin="0px 0px 15px"
      >
        <Select.Option key="" value="">
          All Teacher(s)
        </Select.Option>
        {teacherList?.map(({ _id, name }, index) => (
          <Select.Option key={index} value={_id}>
            {name}
          </Select.Option>
        ))}
      </SelectInputStyled>
    </>
  )
}

export default connect(
  (state) => ({
    teacherList: getTeachersListSelector(state),
    districtId: getUserOrgId(state),
    loading: get(state, ['teacherReducer', 'loading'], false),
    testIds: getAdminTestIdsSelector(state),
    testsLoading: getAssignmentsLoadingSelector(state),
    userId: getUserIdSelector(state),
  }),
  {
    loadTeacherList: receiveTeachersListAction,
  }
)(TeachersList)
