const value = {
  type: 'group',
  id: '9a99988a-0123-4456-b89a-b1607f326fd8',
  children1: {
    'abba9aba-cdef-4012-b456-71843dc76a14': {
      type: 'rule',
      properties: {
        field: 'school',
        operator: 'select_equals',
        value: ['yellow'],
        valueSrc: ['value'],
        valueType: ['select'],
      },
    },
    'a98888aa-89ab-4cde-b012-31843dc78726': {
      type: 'rule',
      properties: {
        field: 'network',
        operator: 'select_equals',
        value: ['net1'],
        valueSrc: ['value'],
        valueType: ['select'],
      },
    },
  },
  properties: {
    conjunction: 'AND',
    not: false,
  },
}
export default value
