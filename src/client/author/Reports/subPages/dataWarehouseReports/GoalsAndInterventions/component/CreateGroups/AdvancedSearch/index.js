import {
  EduElse,
  EduIf,
  EduThen,
  SpinLoader,
  notification,
} from '@edulastic/common'
import { Divider, Spin } from 'antd'
import { flattenDeep, get, isArray, isEmpty } from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { QueryBuilder, formatQuery } from 'react-querybuilder'
import connect from 'react-redux/es/connect/connect'
import './queryBuilderStyles.scss'

import { lightRed2 } from '@edulastic/colors'
import {
  getPerformanceBandProfilesSelector,
  isPerformanceBandLoadingSelector,
  receivePerformanceBandAction,
} from '../../../../../../../PerformanceBand/ducks'
import {
  addNewTagAction,
  getAllTagsAction,
  getAllTagsSelector,
} from '../../../../../../../TestPage/ducks'
import { fetchGroupsAction } from '../../../../../../../sharedDucks/groups'
import { SpinnerContainer } from '../../../../../../../src/MainStyle'
import {
  StyledButton,
  StyledFormButtonsContainer,
  StyledFormHeader,
  StyledFormTitle,
} from '../../../common/components/Form/styled-components'
import { parsedBandData } from '../../../common/utils'
import { actions } from '../../../ducks'
import {
  getAdvanceSearchStudentsData,
  getAdvancedSearchAttendanceBandSelector,
  getAdvancedSearchClassesSelector,
  getAdvancedSearchGroupsSelector,
  getAdvancedSearchCoursesSelector,
  getAdvancedSearchFilterSelector,
  getAdvancedSearchSchoolsSelector,
  groupStatusSelector,
  isAdvancedSearchLoading,
  isAttendanceBandLoadingSelector,
  isGroupSavingSelector,
} from '../../../ducks/selectors'
import { getUserOrgData } from '../../../../../../../src/selectors/user'
import SaveGroup from '../SaveGroup'
import StudentList from './StudentList'
import ValueEditor from './ValueEditor'
import {
  allowedFields,
  combinators,
  groupType,
  inNotInOp,
} from './config/qb-config'
import {
  AddRule,
  FieldSelector,
  OperatorSelector,
  RemoveRuleAction,
} from './controls'
import { fieldKey } from '../../../ducks/constants'

const { classes, groups } = fieldKey

const getAllRules = (rules = []) => {
  const allRulesByRecur = []
  rules.forEach((rule) => {
    if (rule.rules) {
      allRulesByRecur.push(getAllRules(rule.rules))
    } else {
      allRulesByRecur.push(rule)
    }
  })
  return flattenDeep(allRulesByRecur)
}

// The fields would be Grade, Subject, School, Course, Class, Tag, Attendance Band - <band name>, Performance Band -<band name>, Standards Band -<Band name>, Avg score, Test types

const AdvancedSearch = ({
  loadSchools,
  loadClasses,
  loadGroups,
  loadCourses,
  schoolData,
  classData,
  groupData,
  courseData,
  attendanceBandData,
  defaultQuery,
  setAdvancedSearchQuery,
  loadAdvanceSearch,
  loadAttendanceBands,
  studentsData,
  saveGroup,
  isGroupSaving,
  isStudentLoading,
  onCancel,
  groupStatus,
  _resetGroupStatus,
  getAllTags,
  addNewTag,
  allTagsData,
  _getGroupList,
  loadPerformanceBands,
  performanceBandData,
  isPerformanceLoading,
  isAttendanceBandLoading,
  _resetAdvancedSearchData,
  resetAdvancedSearchDetails,
  userOrgData,
}) => {
  // may require duplicate method
  const [query, setQuery] = useState(defaultQuery)
  const formattedQuery = parsedBandData(formatQuery(query, 'json_without_ids'))
  const groupFormRef = useRef()

  const onClearFilter = () => {
    setQuery({ combinator: 'and', rules: [] })
    setAdvancedSearchQuery()
  }

  const onCancelClick = () => {
    groupFormRef?.current?.resetForm()
    onClearFilter()
    _resetGroupStatus()
    onCancel()
  }

  useEffect(() => {
    if (groupStatus === 'finished') {
      _getGroupList()
      onCancelClick()
    }
  }, [groupStatus])

  useEffect(() => {
    _resetAdvancedSearchData()
  }, [query])

  const fields = allowedFields({
    schoolData,
    classData,
    groupData,
    courseData,
    attendanceBandData,
    performanceBandData,
  })

  useEffect(() => {
    const searchString = ''
    loadSchools({ searchString })
    loadClasses({ searchString, type: groupType[classes] })
    loadGroups({ searchString, type: groupType[groups] })
    loadCourses({ searchString })
    if ((attendanceBandData || []).length === 0) loadAttendanceBands()
    if ((performanceBandData || []).length === 0) loadPerformanceBands()
    getAllTags({ type: 'group' })
  }, [])

  // cleanup
  useEffect(
    () => () => {
      setAdvancedSearchQuery()
      _resetAdvancedSearchData()
      resetAdvancedSearchDetails()
    },
    []
  )

  const handleQuickFilter = (paginationDetails = {}) => {
    const searchQuery = JSON.parse(formattedQuery)

    const noCriteriaAdded = isEmpty(get(searchQuery, ['rules'], []))

    if (noCriteriaAdded) {
      return notification({
        msg: 'Please select and apply at least one criterion',
      })
    }

    const allRulesArr = getAllRules(searchQuery?.rules)

    const isAllowed =
      allRulesArr.length &&
      allRulesArr.every((rule) => {
        if (rule.value) {
          if (isArray(rule.value)) return rule.value.length
          return true
        }
        return rule.operator === 'null' || rule.operator === 'notNull'
      })

    if (!isAllowed) {
      return notification({
        msg: 'Please provide atleast one value per filter',
      })
    }

    setAdvancedSearchQuery(searchQuery)

    loadAdvanceSearch({ query: searchQuery, paginationDetails })
  }

  const tagProps = {
    tags: [], // while edit
    addNewTag,
    allTagsData,
  }

  const pendingFields = (fields || [])
    .filter(({ name }) => {
      return !query?.rules?.some((rule) => rule.field === name)
    })
    .map((item) => item.name)

  return (
    <>
      <EduIf condition={isGroupSaving}>
        <SpinnerContainer>
          <SpinLoader />
        </SpinnerContainer>
      </EduIf>
      <SaveGroup
        formattedQuery={formattedQuery}
        wrappedComponentRef={groupFormRef}
        courseData={courseData}
        studentsData={studentsData}
        saveGroup={saveGroup}
        isGroupSaving={isGroupSaving}
        onCancel={onCancelClick}
        tagProps={tagProps}
        userOrgData={userOrgData}
      />
      <Divider />
      <StyledFormHeader>
        <StyledFormTitle>
          Select students for the Group{' '}
          <span style={{ color: lightRed2, marginLeft: 3 }}>*</span>
        </StyledFormTitle>
        <StyledFormButtonsContainer>
          <StyledButton isGhost onClick={onClearFilter}>
            Clear All
          </StyledButton>
          <StyledButton onClick={handleQuickFilter} disabled={isStudentLoading}>
            <EduIf condition={isStudentLoading}>
              <EduThen>Searching...</EduThen>
              <EduElse>Apply Criteria</EduElse>
            </EduIf>
          </StyledButton>
        </StyledFormButtonsContainer>
      </StyledFormHeader>
      <Spin spinning={isPerformanceLoading || isAttendanceBandLoading}>
        <QueryBuilder
          fields={fields}
          query={query}
          controlClassnames={{ queryBuilder: 'queryBuilder-branches' }}
          enableDragAndDropProp={false}
          getDefaultField={pendingFields?.[0] || fields?.[0].name}
          operators={inNotInOp}
          resetOnFieldChange
          listsAsArrays
          onQueryChange={(q) => setQuery(q)}
          combinators={combinators}
          // Reusable(s)
          controlElements={{
            valueEditor: ValueEditor,
            fieldSelector: (props) => (
              <FieldSelector {...props} pendingFields={pendingFields} />
            ),
            combinatorSelector: () => null,
            operatorSelector: OperatorSelector,
            addRuleAction: (props) => (
              <AddRule {...props} pendingFields={pendingFields} />
            ),
            addGroupAction: () => null,
            removeRuleAction: RemoveRuleAction,
            removeGroupAction: RemoveRuleAction,
          }}
        />
      </Spin>
      <Divider />
      <Spin spinning={isStudentLoading && isEmpty(studentsData)}>
        <StudentList
          studentsData={studentsData}
          isStudentLoading={isStudentLoading}
          handleQuickFilter={handleQuickFilter}
        />
      </Spin>
    </>
  )
}

export default connect(
  (state) => ({
    defaultQuery: getAdvancedSearchFilterSelector(state),
    schoolData: getAdvancedSearchSchoolsSelector(state),
    classData: getAdvancedSearchClassesSelector(state),
    groupData: getAdvancedSearchGroupsSelector(state),
    courseData: getAdvancedSearchCoursesSelector(state),
    performanceBandData: getPerformanceBandProfilesSelector(state),
    attendanceBandData: getAdvancedSearchAttendanceBandSelector(state),
    studentsData: getAdvanceSearchStudentsData(state),
    isGroupSaving: isGroupSavingSelector(state),
    isStudentLoading: isAdvancedSearchLoading(state),
    groupStatus: groupStatusSelector(state),
    allTagsData: getAllTagsSelector(state, 'group'),
    isPerformanceLoading: isPerformanceBandLoadingSelector(state),
    isAttendanceBandLoading: isAttendanceBandLoadingSelector(state),
    userOrgData: getUserOrgData(state),
  }),
  {
    setAdvancedSearchQuery: actions.setAdvancedSearchQuery,
    loadSchools: actions.getAdvancedSearchSchools,
    loadCourses: actions.getAdvancedSearchCourses,
    loadClasses: actions.getAdvancedSearchClasses,
    loadGroups: actions.getAdvancedSearchGroups,
    loadPerformanceBands: receivePerformanceBandAction,
    loadAttendanceBands: actions.getAdvancedSearchAttendanceBands,
    loadAdvanceSearch: actions.getAdvancedSearchData,
    saveGroup: actions.saveGroup,
    _resetGroupStatus: actions.resetGroupStatus,
    _resetAdvancedSearchData: actions.resetAdvancedSearchData,
    getAllTags: getAllTagsAction,
    addNewTag: addNewTagAction,
    _getGroupList: fetchGroupsAction,
    resetAdvancedSearchDetails: actions.resetAdvancedSearchDetails,
  }
)(AdvancedSearch)
