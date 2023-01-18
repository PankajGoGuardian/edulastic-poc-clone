import React, { useState } from 'react'
import { CustomModalStyled } from '@edulastic/common'
import Styled from 'styled-components'
import { QueryBuilder, formatQuery } from 'react-querybuilder'
import 'react-querybuilder/dist/query-builder.css'
import './custom_style.css'
import { grades as gradesConst } from '@edulastic/constants'
import { Select, Button } from 'antd'
import ValueEditor from './ValueEditor'
import { selectsData } from '../../../TestPage/components/common'

console.log(gradesConst, '===grades')

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

const NullComponent = () => null

const FieldSelector = (props) => {
  const { handleOnChange, options } = props
  return (
    <Select
      getPopupContainer={(triggerNode) => triggerNode.parentElement}
      style={{ width: '200px' }}
      onChange={handleOnChange}
      defaultValue="school"
    >
      {options.map((item) => {
        return <Select.Option value={item.name}>{item.label}</Select.Option>
      })}
    </Select>
  )
}

const CombinatorSelector = (props) => {
  const { handleOnChange, options } = props
  return (
    <Select
      getPopupContainer={(triggerNode) => triggerNode.parentElement}
      style={{ width: '200px' }}
      onChange={handleOnChange}
      defaultValue="and"
    >
      {options.map((item) => {
        return <Select.Option value={item.name}>{item.label}</Select.Option>
      })}
    </Select>
  )
}

const OperatorSelector = (props) => {
  const { handleOnChange, options } = props
  return (
    <Select
      getPopupContainer={(triggerNode) => triggerNode.parentElement}
      style={{ width: '200px' }}
      onChange={handleOnChange}
      defaultValue="="
    >
      {options.map((item) => {
        return <Select.Option value={item.name}>{item.label}</Select.Option>
      })}
    </Select>
  )
}

const AddRule = (props) => {
  console.log(props)
  return <Button onClick={props.handleOnClick}>Add</Button>
}

const AddRuleGroup = (props) => {
  console.log(props)
  return <Button onClick={props.handleOnClick}>Add rule group</Button>
}

const RemoveRuleAction = (props) => {
  return <Button onClick={props.handleOnClick}>remoe this rule</Button>
}

const _QueryBuilder = ({ showAdvanceSearch, setShowAdvanceSearch }) => {
  const [query, setQuery] = useState({ combinator: 'and', rules: [] })
  const handleChange = () => {}
  return (
    <CustomModalStyled
      width="900px"
      visible={showAdvanceSearch}
      title="Advanced Search"
      onCancel={() => {
        setShowAdvanceSearch(false)
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
            // addGroupAction: NullComponent,
            valueEditor: ValueEditor,
            fieldSelector: FieldSelector,
            combinatorSelector: CombinatorSelector,
            operatorSelector: OperatorSelector,
            addRuleAction: AddRule,
            addGroupAction: AddRuleGroup,
            removeRuleAction: RemoveRuleAction,
          }}
        />
        <div style={{ background: 'white', padding: '20px ' }}>
          <pre>
            <code>
              {formatQuery(query, { format: 'mongodb', parseNumbers: true })}
            </code>
          </pre>
        </div>
      </ModalBody>
    </CustomModalStyled>
  )
}

export default _QueryBuilder

const TagName = Styled.span`
  color: #3f85e5;
  font-weight: 600;
`

const Conjuction = Styled.span`
  display: inline-block;
  padding: 1px 6px;
  background: #b6cbe4;
  color: #5e7ca2;
  border-radius: 15px;
`

const Filter = Styled.div`
  background: #f5f5f5;
  color: #6b737f;
  padding: 6px 10px;
  border-radius: 4px;
  margin-bottom:3px;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
`

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

const IconWrapper = Styled.span`
  display: inline-block;
  svg {
    cursor: pointer;
  }

`
