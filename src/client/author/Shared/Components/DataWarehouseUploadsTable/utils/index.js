import next from 'immer'

const TABLE_COLUMNS_KEYS = {
  FILE_TYPE: 'reportType',
  FILE_NAME: 'testName',
  SCHOOL_TERM: 'termId',
  LAST_UPDATED: 'updatedAt',
  STATUS: 'status',
}

export const tableColumns = [
  {
    title: 'File Type',
    dataIndex: TABLE_COLUMNS_KEYS.FILE_TYPE,
    key: TABLE_COLUMNS_KEYS.FILE_TYPE,
  },
  {
    title: 'File Name',
    dataIndex: TABLE_COLUMNS_KEYS.FILE_NAME,
    key: TABLE_COLUMNS_KEYS.FILE_NAME,
  },
  {
    title: 'School Term',
    dataIndex: TABLE_COLUMNS_KEYS.SCHOOL_TERM,
    key: TABLE_COLUMNS_KEYS.SCHOOL_TERM,
  },
  {
    title: 'Last Updated',
    dataIndex: TABLE_COLUMNS_KEYS.LAST_UPDATED,
    key: TABLE_COLUMNS_KEYS.LAST_UPDATED,
  },
  {
    title: 'Status',
    dataIndex: TABLE_COLUMNS_KEYS.STATUS,
    key: TABLE_COLUMNS_KEYS.STATUS,
  },
]

export const sortText = (key) => (a, b) =>
  (a[key] || '').toLowerCase().localeCompare((b[key] || '').toLowerCase())

export const sortDate = (a = '', b = '') => new Date(a) - new Date(b)

const findColumnIndex = (columns, columnKey) =>
  columns.findIndex(({ key }) => key === columnKey)

export const getTableColumns = (termsMap, getTag) => {
  return next(tableColumns, (rawColumns) => {
    const fileTypeIdx = findColumnIndex(
      rawColumns,
      TABLE_COLUMNS_KEYS.FILE_TYPE
    )
    rawColumns[fileTypeIdx].sorter = sortText(TABLE_COLUMNS_KEYS.FILE_TYPE)

    const fileNameIdx = findColumnIndex(
      rawColumns,
      TABLE_COLUMNS_KEYS.FILE_NAME
    )
    rawColumns[fileNameIdx].render = (testName) => testName || '-'
    rawColumns[fileNameIdx].sorter = sortText(TABLE_COLUMNS_KEYS.FILE_NAME)

    const schoolTermIdx = findColumnIndex(
      rawColumns,
      TABLE_COLUMNS_KEYS.SCHOOL_TERM
    )
    rawColumns[schoolTermIdx].render = (termId) =>
      termsMap.has(termId) ? termsMap.get(termId).name : '-'
    rawColumns[schoolTermIdx].sorter = (a, b) =>
      sortDate(
        termsMap.get(a.termId)?.startDate,
        termsMap.get(b.termId)?.startDate
      )

    const lastUpdatedIdx = findColumnIndex(
      rawColumns,
      TABLE_COLUMNS_KEYS.LAST_UPDATED
    )
    rawColumns[lastUpdatedIdx].render = (dateTime) =>
      new Date(dateTime).toLocaleDateString()
    rawColumns[lastUpdatedIdx].sorter = (a, b) =>
      sortDate(a.updatedAt, b.updatedAt)

    const statusIdx = findColumnIndex(rawColumns, TABLE_COLUMNS_KEYS.STATUS)
    rawColumns[statusIdx].sorter = sortText(TABLE_COLUMNS_KEYS.STATUS)
    rawColumns[statusIdx].render = (status, record) =>
      getTag(status, record?.statusReason)
  })
}
