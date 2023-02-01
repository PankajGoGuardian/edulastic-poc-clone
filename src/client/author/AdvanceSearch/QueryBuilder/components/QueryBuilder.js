import React, { useEffect, useState } from 'react'
import { CustomModalStyled, notification } from '@edulastic/common'
import { QueryBuilder, formatQuery } from 'react-querybuilder'
import 'react-querybuilder/dist/query-builder.css'
import './custom_style.css'
import { connect } from 'react-redux'
import { isArray, flattenDeep } from 'lodash'
import { inNotInOp, combinators } from '../config/qb-config'
import { allowedFields } from '../config/allowedFields-config'
import ValueEditor from './ValueEditor'
import { CancelButton, OkButton } from '../../../../common/styled'
import { ModalBody, ButtonsContainer } from './styled-components'
import {
  getAdvancedSearchFilterSelector,
  setAdvancedSearchFilterAction,
  setAdvancedSearchSchoolsAction,
  setAdvancedSearchClassesAction,
  setAdvancedSearchCoursesAction,
  setAdvancedSearchTagsAction,
  setIsAdvancedSearchSelectedAction,
  getAdvancedSearchSchoolsSelector,
  getAdvancedSearchClassesSelector,
  getAdvancedSearchTagsSelector,
  getAdvancedSearchCoursesSelector,
  advancedSearchRequestAction,
} from '../../ducks'
import {
  AddRule,
  AddRuleGroup,
  CombinatorSelector,
  FieldSelector,
  OperatorSelector,
  RemoveRuleAction,
} from '../config/control'

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

const _QueryBuilder = ({
  showAdvanceSearch,
  setShowAdvanceSearchModal,
  setIsAdvancedSearchSelected,
  setAdvancedSearchFilter,
  defaultQuery,
  loadSchoolsData,
  loadClassListData,
  loadCourseListData,
  loadTagsListData,
  schoolData,
  classData,
  courseData,
  tagData,
  loadAdvancedSearchClasses,
}) => {
  const [query, setQuery] = useState(defaultQuery)
  const formattedQuery = formatQuery(query, 'json_without_ids')

  useEffect(() => {
    const searchString = ''
    loadSchoolsData()
    loadClassListData({ searchString })
    loadCourseListData({ searchString })
    loadTagsListData({ searchString })
  }, [])

  const handleCancel = () => {
    setShowAdvanceSearchModal(false)
  }

  const handleQuickFilter = () => {
    const searchQuery = JSON.parse(formattedQuery)
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

    handleCancel()
    setIsAdvancedSearchSelected(true)
    setAdvancedSearchFilter(searchQuery)

    loadAdvancedSearchClasses({ query: searchQuery })
  }

  const footer = (
    <ButtonsContainer>
      <div style={{ display: 'flex', gap: '20px' }}>
        <CancelButton onClick={handleCancel} style={{ minWidth: '100px' }}>
          Cancel
        </CancelButton>
        <OkButton
          onClick={() => {
            handleQuickFilter()
          }}
          style={{ minWidth: '100px' }}
        >
          Find Classes
        </OkButton>
      </div>
    </ButtonsContainer>
  )

  const fields = allowedFields({ schoolData, classData, courseData, tagData })
  return (
    <CustomModalStyled
      width="900px"
      padding="32px"
      visible={showAdvanceSearch}
      title="Advanced Search"
      onCancel={handleCancel}
      footer={footer}
      destroyOnClose
      centered
    >
      <ModalBody>
        <QueryBuilder
          fields={fields}
          query={query}
          onQueryChange={(q) => setQuery(q)}
          operators={inNotInOp}
          combinators={combinators}
          controlClassnames={{ queryBuilder: 'queryBuilder-branches' }}
          enableDragAndDropProp={false}
          resetOnFieldChange
          listsAsArrays
          controlElements={{
            valueEditor: ValueEditor,
            fieldSelector: FieldSelector,
            combinatorSelector: CombinatorSelector,
            operatorSelector: OperatorSelector,
            addRuleAction: AddRule,
            addGroupAction: AddRuleGroup,
            removeRuleAction: RemoveRuleAction,
            removeGroupAction: RemoveRuleAction,
          }}
        />
      </ModalBody>
    </CustomModalStyled>
  )
}

export default connect(
  (state) => ({
    defaultQuery: getAdvancedSearchFilterSelector(state),
    schoolData: getAdvancedSearchSchoolsSelector(state),
    classData: getAdvancedSearchClassesSelector(state),
    courseData: getAdvancedSearchCoursesSelector(state),
    tagData: getAdvancedSearchTagsSelector(state),
  }),
  {
    setIsAdvancedSearchSelected: setIsAdvancedSearchSelectedAction,
    setAdvancedSearchFilter: setAdvancedSearchFilterAction,
    loadSchoolsData: setAdvancedSearchSchoolsAction,
    loadClassListData: setAdvancedSearchClassesAction,
    loadCourseListData: setAdvancedSearchCoursesAction,
    loadTagsListData: setAdvancedSearchTagsAction,
    loadAdvancedSearchClasses: advancedSearchRequestAction,
  }
)(_QueryBuilder)
