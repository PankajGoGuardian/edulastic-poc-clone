import React from 'react'
import merge from 'lodash/merge'
import { BasicConfig } from 'react-awesome-query-builder'
import { Select } from 'antd'

const InitialConfig = BasicConfig

/// ///////////////////////////////////////////////////////////////////

const fields = {
  school: {
    label: 'School',
    type: 'select',
    valueSources: ['value'],
    excludeOperators: ['proximity'],
    fieldSettings: {
      listValues: [
        { value: 'yellow', title: 'Yellow' },
        { value: 'green', title: 'Green' },
        { value: 'orange', title: 'Orange' },
      ],
    },
    mainWidgetProps: {
      valueLabel: 'Color',
      valuePlaceholder: 'Enter color',
    },
  },
  network: {
    label: 'Network',
    type: 'select',
    valueSources: ['value'],
    fieldSettings: {
      listValues: [
        { value: 'net1', title: 'Net1' },
        { value: 'net2', title: 'Net2' },
        { value: 'net3', title: 'Net3' },
      ],
    },
    mainWidgetProps: {
      valueLabel: 'Color',
      valuePlaceholder: 'Enter color',
    },
  },
  course: {
    label: 'Course',
    type: 'text',
    excludeOperators: ['proximity'],
    mainWidgetProps: {
      valueLabel: 'Name',
      valuePlaceholder: 'Type to search Course',
    },
  },
  grade: {
    label: 'Grade',
    type: 'text',
    excludeOperators: ['proximity'],
    mainWidgetProps: {
      valueLabel: 'Name',
      valuePlaceholder: 'Type to search Grade',
    },
  },
  subject: {
    label: 'Subject',
    type: 'text',
    excludeOperators: ['proximity'],
    mainWidgetProps: {
      valueLabel: 'Name',
      valuePlaceholder: 'Type to search Subject',
    },
  },
  showGrp: {
    label: 'Show class/group',
    type: 'text',
    excludeOperators: ['proximity'],
    mainWidgetProps: {
      valueLabel: 'Name',
      valuePlaceholder: 'Type to search class/group',
    },
  },
  classes: {
    label: 'Classes',
    type: 'text',
    excludeOperators: ['proximity'],
    mainWidgetProps: {
      valueLabel: 'Name',
      valuePlaceholder: 'Type to search Classes',
    },
  },
  stdgrp: {
    label: 'Student Group',
    type: 'text',
    excludeOperators: ['proximity'],
    mainWidgetProps: {
      valueLabel: 'Name',
      valuePlaceholder: 'Type to search Student Group',
    },
  },
  tags: {
    label: 'Tags',
    type: 'text',
    excludeOperators: ['proximity'],
    mainWidgetProps: {
      valueLabel: 'Name',
      valuePlaceholder: 'Type to search Tags',
    },
  },
  // multicolor: {
  //   label: "Colors",
  //   type: "multiselect",
  //   fieldSettings: {
  //     listValues: {
  //       yellow: "Yellow",
  //       green: "Green",
  //       orange: "Orange",
  //     },
  //     allowCustomValues: true,
  //   },
  // },
  // stock: {
  //   label: "In stock",
  //   type: "boolean",
  //   defaultValue: true,
  //   mainWidgetProps: {
  //     labelYes: "+",
  //     labelNo: "-",
  //   },
  // },
}

/// ///////////////////////////////////////////////////////////////////

const conjunctions = {
  AND: InitialConfig.conjunctions.AND,
  OR: InitialConfig.conjunctions.OR,
}

const operators = {
  ...InitialConfig.operators,
  // examples of  overriding
  // between: {
  //   ...InitialConfig.operators.between,
  //   textSeparators: ['from', 'to'],
  // },
  equal: {
    ...InitialConfig.operators.equal,
    label: 'ISSS',
    // labelForFormat: "Is",
    // spelOps: ['Is', 'eq'],
  },
}
// console.log(operators, '===operators')

const widgets = {
  ...InitialConfig.widgets,
  // examples of  overriding
  slider: {
    ...InitialConfig.widgets.slider,
    customProps: {
      width: '300px',
    },
  },
  rangeslider: {
    ...InitialConfig.widgets.rangeslider,
    customProps: {
      width: '300px',
    },
  },
  date: {
    ...InitialConfig.widgets.date,
    dateFormat: 'DD.MM.YYYY',
    valueFormat: 'YYYY-MM-DD',
  },
  time: {
    ...InitialConfig.widgets.time,
    timeFormat: 'HH:mm',
    valueFormat: 'HH:mm:ss',
  },
  datetime: {
    ...InitialConfig.widgets.datetime,
    timeFormat: 'HH:mm',
    dateFormat: 'DD.MM.YYYY',
    valueFormat: 'YYYY-MM-DD HH:mm:ss',
  },
  treeselect: {
    ...InitialConfig.widgets.treeselect,
    customProps: {
      showSearch: true,
    },
  },
}

const types = {
  ...InitialConfig.types,
  // examples of  overriding
  boolean: merge(InitialConfig.types.boolean, {
    widgets: {
      boolean: {
        widgetProps: {
          hideOperator: true,
          operatorInlineLabel: 'is',
        },
      },
    },
  }),
}

const localeSettings = {
  locale: {
    moment: 'ru',
  },
  valueLabel: 'Value',
  valuePlaceholder: 'Value',
  fieldLabel: 'Field',
  operatorLabel: 'Operator',
  fieldPlaceholder: 'Select field',
  operatorPlaceholder: 'Select operator',
  deleteLabel: null,
  addGroupLabel: 'Add group',
  addRuleLabel: 'Add rule',
  addSubRuleLabel: 'Add sub rule',
  delGroupLabel: null,
  notLabel: 'Not',
  valueSourcesPopupTitle: 'Select value source',
  removeRuleConfirmOptions: {
    title: 'Are you sure delete this rule?',
    okText: 'Yes',
    okType: 'danger',
  },
  removeGroupConfirmOptions: {
    title: 'Are you sure delete this group?',
    okText: 'Yes',
    okType: 'danger',
  },
}

const settings = {
  ...InitialConfig.settings,
  ...localeSettings,

  valueSourcesInfo: {
    value: {
      label: 'Value',
    },
    field: {
      label: 'Field',
      widget: 'field',
    },
    func: {
      label: 'Function',
      widget: 'func',
    },
  },
  canReorder: false,
  // canRegroup: false,
  // showNot: false,
  // showLabels: true,
  maxNesting: 3,
  canLeaveEmptyGroup: true, // after deletion

  // renderField: (props) => <FieldCascader {...props} />,
  // renderOperator: (props) => <FieldDropdown {...props} />,
  // renderFunc: (props) => <FieldSelect {...props} />,
  renderConjs: (props) => {
    console.log(props, '===props')
    return (
      <select
        onChange={(value) => {
          console.log(value, '==-value')
          props.setConjunction(value)
        }}
      >
        <option value="AND">1</option>
        <option value="OR">2</option>
      </select>
      // <Select
      //   placeholder="Please select"
      //   value="1"
      //   onChange={(v) => {
      //     console.log(v)
      //   }}
      //   height="30px"
      // >
      //   <Select.Option value="1">this is conjunctions</Select.Option>
      //   <Select.Option value="2">this is second</Select.Option>
      //   this is conjunctions
      // </Select>
    )
  },
}

const funcs = {}

const config = {
  conjunctions,
  operators,
  widgets,
  types,
  settings,
  fields,
  funcs,
}

export default config
