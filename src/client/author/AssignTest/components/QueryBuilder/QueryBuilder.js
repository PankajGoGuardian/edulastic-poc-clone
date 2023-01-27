import React, { useEffect, useState } from 'react'
import { CustomModalStyled, notification } from '@edulastic/common'
import Styled from 'styled-components'
import { QueryBuilder, formatQuery } from 'react-querybuilder'
import 'react-querybuilder/dist/query-builder.css'
import './custom_style.css'
import { Select, Button } from 'antd'
import { connect } from 'react-redux'
import { isArray, flattenDeep } from 'lodash'
import { IconClose } from '@edulastic/icons'
import ValueEditor from './ValueEditor'
import { selectsData } from '../../../TestPage/components/common'
import { CancelButton, OkButton } from '../../../../common/styled'
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
} from '../../../TestPage/components/Assign/ducks'

const classGroup = [
  {
    value: 'all',
    label: 'All',
  },
  {
    value: 'class',
    label: 'Classes',
  },
  {
    value: 'custom',
    label: 'Student Groups',
  },
]

const ruleLimit = 100

const operators = [
  { name: 'in', label: 'Is In' },
  { name: 'notIn', label: 'Is Not In' },
]

const nullNotNullOp = [
  { name: 'null', label: 'Is Null' },
  { name: 'notNull', label: 'Is Not Null' },
]

const combinators = [
  { name: 'and', label: 'All criteria' },
  { name: 'or', label: 'Any criteria' },
]

const FieldSelector = (props) => {
  const { handleOnChange, options, value } = props
  return (
    <StyledSelect
      getPopupContainer={(triggerNode) => triggerNode.parentElement}
      style={{ minWidth: '150px' }}
      onChange={handleOnChange}
      value={value}
    >
      {options.map((item) => {
        return <Select.Option value={item.name}>{item.label}</Select.Option>
      })}
    </StyledSelect>
  )
}

const CombinatorSelector = (props) => {
  const { handleOnChange, options, value } = props
  return (
    <StyledSelect
      getPopupContainer={(triggerNode) => triggerNode.parentElement}
      onChange={handleOnChange}
      value={value}
    >
      {options.map((item) => {
        return <Select.Option value={item.name}>{item.label}</Select.Option>
      })}
    </StyledSelect>
  )
}

const OperatorSelector = (props) => {
  const { handleOnChange, options, value } = props
  return (
    <StyledSelect
      getPopupContainer={(triggerNode) => triggerNode.parentElement}
      onChange={handleOnChange}
      value={value}
    >
      {options.map((item) => {
        return <Select.Option value={item.name}>{item.label}</Select.Option>
      })}
    </StyledSelect>
  )
}

const AddRule = ({ handleOnClick, rules }) => {
  const isDisabled = rules.length >= ruleLimit
  return (
    <RuleButton onClick={handleOnClick} disabled={isDisabled}>
      +Rule
    </RuleButton>
  )
}

const AddRuleGroup = ({ handleOnClick, level, rules }) => {
  const isDisabled = rules.length >= ruleLimit

  if (level !== 0) return null
  return (
    <GroupButton onClick={handleOnClick} disabled={isDisabled}>
      +Group
    </GroupButton>
  )
}

const RemoveRuleAction = ({ handleOnClick }) => {
  return (
    <div className="ruleGroup-header-close">
      <Button onClick={handleOnClick}>
        <IconClose height={10} width={10} color="#3f85e5" />
      </Button>
    </div>
  )
}

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

  const fields = [
    {
      name: 'institutionId',
      label: 'Schools',
      valueEditorType: 'multiselect',
      values: schoolData.data,
    },
    {
      name: 'course.id',
      label: 'Courses',
      valueEditorType: 'multiselect',
      values: courseData.data,
      operators: [...operators, ...nullNotNullOp],
    },
    {
      name: 'grades',
      label: 'Grades',
      valueEditorType: 'multiselect',
      values: selectsData.allGrades.map((item) => ({
        value: item.value,
        label: item.text,
      })),
    },
    {
      name: 'subject.keyword',
      label: 'Subjects',
      valueEditorType: 'multiselect',
      values: selectsData.allSubjects.map((item) => ({
        value: item.value,
        label: item.text,
      })),
    },
    {
      name: 'type',
      label: 'Show Class/Groups',
      valueEditorType: 'select',
      operators: [
        { name: '=', label: '=' },
        { name: '!=', label: '!=' },
      ],
      values: classGroup,
    },
    {
      name: '_id',
      label: 'Classes',
      valueEditorType: 'multiselect',
      values: classData.data,
    },
    {
      name: 'tags._id',
      label: 'Tags',
      valueEditorType: 'multiselect',
      values: tagData.data,
      operators: [...operators, ...nullNotNullOp],
    },
  ]

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
          operators={operators}
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
        <div style={{ background: 'white', padding: '20px ' }}>
          <pre>
            <code>{formattedQuery}</code>
          </pre>
        </div>
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

const ModalBody = Styled.div`
  .ant-select-selection {
    border: 1px solid #b9b9b9;
    border-radius: 0;
    font-size: 12px;
    margin-bottom: 10px;
  }
  .ant-select-dropdown-menu-item {
    font-size: 12px;
  }
`

const ButtonsContainer = Styled.div`
  flex:1;
  margin-top:20px;
  display:flex;
  justify-content: flex-end;
`

export const StyledSelect = Styled(Select)`
  min-width: 100px;
  color:#6A737F;
  .ant-select-selection{
    border-radius: 2px;
    border: 1px solid #B9B9B9;
    background-color:#F8F8F8;
    margin:0;
  }
`

const StyledButton = Styled(Button)`
  border: 1px solid #3F85E5;
  border-radius: 4px;
  text-transform: uppercase;
  white-space: nowrap;
  font-size:10px;
  width:100px;
`

const RuleButton = Styled(StyledButton)`
  background-color:white;
  color: #3f85e5;
`

const GroupButton = Styled(StyledButton)`
  background-color:#3f85e5;
  color: white;
`
