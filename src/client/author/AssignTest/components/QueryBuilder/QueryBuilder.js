import React, { useState } from 'react'
import { CustomModalStyled } from '@edulastic/common'
import Styled from 'styled-components'
import { QueryBuilder, formatQuery } from 'react-querybuilder'
import 'react-querybuilder/dist/query-builder.css'
import './custom_style.css'
import { Select, Button } from 'antd'
import ValueEditor from './ValueEditor'
import { selectsData } from '../../../TestPage/components/common'
import { CancelButton, OkButton } from '../../../../common/styled'
import { connect } from 'react-redux'
import {
  getAdvancedSearchFilterSelector,
  setAdvancedSearchFilterAction,
  setIsAdvancedSearchSelectedAction,
} from '../../../TestPage/components/Assign/ducks'
import { IconClose } from '@edulastic/icons'

const schools = [
  {
    value: 's1',
    label: 'School 1',
  },
  {
    value: 's2',
    label: 'School 2',
  },
  {
    value: 's3',
    label: 'School 3',
  },
]

const courses = [
  {
    value: 'c1',
    label: 'Course 1',
  },
  {
    value: 'c2',
    label: 'Course 2',
  },
  {
    value: 'c3',
    label: 'Course 3',
  },
]

const fields = [
  {
    name: 'school',
    label: 'School',
    valueEditorType: 'select',
    values: schools,
  },
  {
    name: 'course',
    label: 'Course',
    valueEditorType: 'multiselect',
    values: courses,
  },
  {
    name: 'grade',
    label: 'Grades',
    valueEditorType: 'multiselect',
    values: selectsData.allGrades.map((item) => ({
      value: item.value,
      label: item.text,
    })),
  },
  {
    name: 'subject',
    label: 'Subjects',
    valueEditorType: 'select',
    values: selectsData.allSubjects.map((item) => ({
      value: item.value,
      label: item.text,
    })),
  },
  {
    name: 'class_or_groups',
    label: 'Show Class/Groups',
    valueEditorType: 'select',
    values: schools,
  },
  {
    name: 'classes',
    label: 'Classes',
    valueEditorType: 'select',
    values: schools,
  },
  {
    name: 'student_groups',
    label: 'Student Groups',
    valueEditorType: 'select',
    values: schools,
  },
  {
    name: 'tags',
    label: 'Tags',
    valueEditorType: 'select',
    values: schools,
  },
]

const operators = [
  { name: '=', label: 'Is In' },
  { name: '!=', label: 'Is Not In' },
]

const combinators = [
  { name: 'and', label: 'All criteria' },
  { name: 'or', label: 'Any criteria' },
]

const translations = {
  addRule: {
    label: 'Add more rules in the same condition',
    title: 'Add rule',
  },
  addGroup: {
    label: 'Add More conditions',
    title: 'Add group',
  },
  dragHandle: {
    label: '',
    title: '',
  },
}

const FieldSelector = (props) => {
  const { handleOnChange, options, value } = props
  return (
    <StyledSelect
      getPopupContainer={(triggerNode) => triggerNode.parentElement}
      style={{ width: '200px' }}
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
  const { handleOnChange, options } = props
  return (
    <StyledSelect
      getPopupContainer={(triggerNode) => triggerNode.parentElement}
      onChange={handleOnChange}
      defaultValue="and"
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
      style={{ width: '200px' }}
      onChange={handleOnChange}
      defaultValue="="
    >
      {options.map((item) => {
        return <Select.Option value={item.name}>{item.label}</Select.Option>
      })}
    </StyledSelect>
  )
}

const AddRule = ({ handleOnClick }) => {
  return <RuleButton onClick={handleOnClick}>+Rule</RuleButton>
}

const AddRuleGroup = ({ handleOnClick }) => {
  return <GroupButton onClick={handleOnClick}>+Group</GroupButton>
}

const RemoveRuleAction = ({ handleOnClick }) => {
  return (
    <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
      <Button onClick={handleOnClick}>
        <IconClose height={10} width={10} color="#3f85e5" />
      </Button>
    </div>
  )
}

const _QueryBuilder = ({
  showAdvanceSearch,
  setShowAdvanceSearchModal,
  setSaveQuickFilter,
  setIsAdvancedSearchSelected,
  setAdvancedSearchFilter,
  defaultQuery,
}) => {
  const [query, setQuery] = useState(defaultQuery)
  // const handleChange = () => {}
  const formattedQuery = formatQuery(query, 'json_without_ids')

  const handleQuickFilter = (isSafeQuickFilter = false) => {
    setShowAdvanceSearchModal(false)
    setIsAdvancedSearchSelected(true)
    setAdvancedSearchFilter(JSON.parse(formattedQuery))
    if (isSafeQuickFilter) setSaveQuickFilter(true)
  }

  const footer = (
    <ButtonsContainer>
      <SaveQuickFilters
        onClick={() => {
          handleQuickFilter(true)
        }}
      >
        Save As Quick Filter
      </SaveQuickFilters>
      <div style={{ display: 'flex', gap: '20px' }}>
        <CancelButton
          onClick={() => {
            setShowAdvanceSearchModal(false)
          }}
          style={{ minWidth: '100px' }}
        >
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
      visible={showAdvanceSearch}
      title="Advanced Search"
      onCancel={() => {
        setShowAdvanceSearchModal(false)
      }}
      footer={null}
      destroyOnClose
      centered
    >
      <ModalBody>
        <Title>Select Search criteria</Title>
        <QueryBuilder
          fields={fields}
          query={query}
          onQueryChange={(q) => setQuery(q)}
          operators={operators}
          combinators={combinators}
          translations={translations}
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
        {footer}
      </ModalBody>
    </CustomModalStyled>
  )
}

export default connect(
  (state) => ({
    defaultQuery: getAdvancedSearchFilterSelector(state),
  }),
  {
    setIsAdvancedSearchSelected: setIsAdvancedSearchSelectedAction,
    setAdvancedSearchFilter: setAdvancedSearchFilterAction,
  }
)(_QueryBuilder)

// const TagName = Styled.span`
//   color: #3f85e5;
//   font-weight: 600;
// `

// const Conjuction = Styled.span`
//   display: inline-block;
//   padding: 1px 6px;
//   background: #b6cbe4;
//   color: #5e7ca2;
//   border-radius: 15px;
// `

// const Filter = Styled.div`
//   background: #f5f5f5;
//   color: #6b737f;
//   padding: 6px 10px;
//   border-radius: 4px;
//   margin-bottom:3px;
//   font-size: 12px;
//   display: flex;
//   justify-content: space-between;
// `

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
const Title = Styled.p`
  color: #434b5d !important;
  font-size: 12px !important;
  margin-bottom: 18px !important;
`

// const IconWrapper = Styled.span`
//   display: inline-block;
//   svg {
//     cursor: pointer;
//   }
// `

const ButtonsContainer = Styled.div`
  margin-top:20px;
  display:flex;
  justify-content: space-between;
`

const SaveQuickFilters = Styled(CancelButton)`
  font: normal normal 600 11px/15px Open Sans;
  letter-spacing: 0.2px;
  color: #1AB395;
  text-transform: uppercase;
  border:none;
  box-shadow: none;
  text-align: left;
  padding: 0;
`

export const StyledSelect = Styled(Select)`
  width: 100px;
  .ant-select-selection{
    margin:0;
  }
`

const StyledButton = Styled(Button)`
  border: 1px solid #3F85E5;
  border-radius: 4px;
  text-transform: uppercase;
  white-space: nowrap;
  font-size:10px;
`

const RuleButton = Styled(StyledButton)`
  background-color:white;
  color: #3f85e5;
`

const GroupButton = Styled(StyledButton)`
  background-color:#3f85e5;
  color: white;
`
