import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Col } from 'antd'
import Term from '../../../formFields/Term'
import School from '../../../formFields/School'
import Teacher from '../../../formFields/Teacher'
import FormSelectDropdown from '../../../formFields/FormSelectDropdown'
import staticDropDownData from '../../../../static/json/staticDropdownData.json'
import MonthPicker from '../../../formFields/MonthPicker'

const defaultFieldDefinitions = {
  term: {
    title: 'School Year',
    element: <Term />,
    dependencies: [],
  },
  schools: {
    title: 'School',
    element: <School mode="multiple" placeholder="All Schools" />,
    dependencies: [],
  },
  teachers: {
    title: 'Teacher',
    element: <Teacher mode="multiple" placeholder="All Teachers" />,
    dependencies: ['school', 'schools', 'term'],
  },
  classGrades: {
    title: 'Class Grade',
    element: (
      <FormSelectDropdown
        mode="multiple"
        options={staticDropDownData.grades}
        placeholder="All Class Grade"
      />
    ),
    dependencies: [],
  },
  classSubjects: {
    title: 'Class Subject',
    element: (
      <FormSelectDropdown
        mode="multiple"
        options={staticDropDownData.subjects}
        placeholder="All Class Subject"
      />
    ),
    dependencies: [],
  },
  course: {
    title: 'Course',
    element: <>Course</>,
    dependencies: [],
  },
  classes: {
    title: 'Class',
    element: <></>,
    dependencies: [],
  },
  groups: {
    title: 'Group',
    element: <></>,
    dependencies: [],
  },
  period: {
    title: 'Period',
    element: (
      <FormSelectDropdown
        mode="default"
        options={staticDropDownData.periods}
        placeholder=""
        decoratorOptions={{ initialValue: staticDropDownData.periods[0] }}
      />
    ),
    dependencies: [],
  },
  customPeriodStart: {
    title: 'START DATE',
    element: <MonthPicker withinSelectedTerm maxFormDate="customPeriodEnd" />,
    when: (form) => form.getFieldValue('period')?.key === 'CUSTOM',
    dependencies: [],
  },
  customPeriodEnd: {
    title: 'END DATE',
    element: <MonthPicker withinSelectedTerm minFormDate="customPeriodStart" />,
    when: (form) => form.getFieldValue('period')?.key === 'CUSTOM',
    dependencies: [],
  },
}

const populateConfig = (config) => {
  return config.map((field) => {
    let fieldDef = field
    if (typeof field === 'string') {
      fieldDef = { key: field }
    }
    fieldDef = {
      span: 6,
      title: fieldDef.key,
      ...defaultFieldDefinitions[fieldDef.key],
      ...fieldDef,
    }
    return fieldDef
  })
}

function FormFields(props) {
  const { config, form } = props
  const fields = useMemo(() => populateConfig(config), [config])

  const shouldRender = useCallback(
    (_form, field) => field.when?.(_form) ?? true,
    []
  )
  return (
    <>
      {fields.map((field) => (
        <Col span={field.span}>
          {shouldRender(form, field) &&
            (field.element
              ? React.cloneElement(
                  field.element,
                  {
                    ...field.element.props,
                    config: field,
                    form,
                  },
                  field.element.children
                )
              : field.key)}
        </Col>
      ))}
    </>
  )
}

FormFields.propTypes = {}
FormFields.defaultProps = {}

export default FormFields
