import React from 'react'
import { formatDate } from '@edulastic/constants/reportUtils/common'
import { MdFileDownload } from 'react-icons/md'

import { EduIf, EduThen } from '@edulastic/common'
import {
  lightGreen16,
  lightGrey16,
  lightRed8,
  yellow4,
} from '@edulastic/colors'

import { getTagRender, sortByDate, sortText } from './helpers'
import TableActionIcon from '../components/TableActionIcon'

export const dwLogStatus = {
  IN_PROGRESS: 0,
  SUCCESS: 1,
  FAILED: 2,
  PARTIALLY_FAILED: 3,
  ARCHIVED: 4,
}

export const dwLogStatusLabel = {
  [dwLogStatus.IN_PROGRESS]: 'Processing',
  [dwLogStatus.SUCCESS]: 'Success',
  [dwLogStatus.FAILED]: 'Failed',
  [dwLogStatus.PARTIALLY_FAILED]: 'Partially failed',
  [dwLogStatus.ARCHIVED]: 'Archived',
}

export const dwLogStatusColorMap = {
  [dwLogStatus.IN_PROGRESS]: lightGrey16,
  [dwLogStatus.SUCCESS]: lightGreen16,
  [dwLogStatus.FAILED]: lightRed8,
  [dwLogStatus.PARTIALLY_FAILED]: yellow4,
}

export const COMMON_KEYS = {
  FILE_TYPE: 'reportType',
  FILE_NAME: 'testName',
  SCHOOL_TERM: 'termId',
}

const commonColumns = [
  {
    title: 'File Type',
    dataIndex: COMMON_KEYS.FILE_TYPE,
    key: COMMON_KEYS.FILE_TYPE,
    sorter: (a, b) => sortText(a, b, COMMON_KEYS.FILE_TYPE),
  },
  {
    title: 'Name',
    dataIndex: COMMON_KEYS.FILE_NAME,
    key: COMMON_KEYS.FILE_NAME,
    render: (value) => value || '-',
    sorter: (a, b) => sortText(a, b, COMMON_KEYS.FILE_NAME),
  },
  {
    title: 'School Term',
    dataIndex: COMMON_KEYS.SCHOOL_TERM,
    key: COMMON_KEYS.SCHOOL_TERM,
  },
]

export const MANAGE_EXTERNAL_DATA_KEYS = {
  ...COMMON_KEYS,
  LAST_UPDATED: 'updatedAt',
  RECORDS: 'addedCount',
  DOWNLOAD: 'inputFileDownloadLink',
  EDIT: 'edit',
  DELETE: 'delete',
}

export const manageExternalDataColumns = [
  ...commonColumns,
  {
    title: 'Last Updated',
    dataIndex: MANAGE_EXTERNAL_DATA_KEYS.LAST_UPDATED,
    key: MANAGE_EXTERNAL_DATA_KEYS.LAST_UPDATED,
    render: (value) => formatDate(value),
    sorter: (a, b) => {
      const sortKey = MANAGE_EXTERNAL_DATA_KEYS.LAST_UPDATED
      return sortByDate(a[sortKey], b[sortKey])
    },
  },
  {
    title: 'No. Of Records',
    dataIndex: MANAGE_EXTERNAL_DATA_KEYS.RECORDS,
    key: MANAGE_EXTERNAL_DATA_KEYS.RECORDS,
    render: (value, record) =>
      record.status === dwLogStatus.IN_PROGRESS ? '-' : value,
    sorter: (a, b) => {
      const sortKey = MANAGE_EXTERNAL_DATA_KEYS.RECORDS
      return sortByDate(a[sortKey], b[sortKey])
    },
  },
  {
    title: 'Download',
    dataIndex: MANAGE_EXTERNAL_DATA_KEYS.DOWNLOAD,
    key: MANAGE_EXTERNAL_DATA_KEYS.DOWNLOAD,
    align: 'center',
    render: (value) => (
      <EduIf condition={value}>
        <EduThen>
          <a href={value} target="_blank" rel="noopener noreferrer">
            <TableActionIcon IconComponent={MdFileDownload} />
          </a>
        </EduThen>
      </EduIf>
    ),
  },
  {
    title: 'Edit',
    dataIndex: MANAGE_EXTERNAL_DATA_KEYS.EDIT,
    key: MANAGE_EXTERNAL_DATA_KEYS.EDIT,
    align: 'center',
  },
  {
    title: 'Delete',
    dataIndex: MANAGE_EXTERNAL_DATA_KEYS.DELETE,
    key: MANAGE_EXTERNAL_DATA_KEYS.DELETE,
    align: 'center',
  },
]

export const UPLOAD_LOG_KEYS = {
  ...COMMON_KEYS,
  UPLOAD_DATE: 'uploadDate',
  STATUS: 'status',
  ADDED: 'addedCount',
  FAILED: 'failedCount',
  DOWNLOAD_ERRORS: 'errorsFileDownloadLink',
}

export const uploadLogColumns = [
  ...commonColumns,
  {
    title: 'Upload Date',
    dataIndex: 'updatedAt',
    key: UPLOAD_LOG_KEYS.UPLOAD_DATE,
    render: (value) => formatDate(value),
    sorter: (a, b) => sortByDate(a.updatedAt, b.updatedAt),
  },
  {
    title: 'Status',
    dataIndex: UPLOAD_LOG_KEYS.STATUS,
    key: UPLOAD_LOG_KEYS.STATUS,
    render: (value, record) => getTagRender(value, record?.statusReason),
    sorter: (a, b) => sortText(a, b, UPLOAD_LOG_KEYS.STATUS),
  },
  {
    title: 'Added',
    dataIndex: UPLOAD_LOG_KEYS.ADDED,
    key: UPLOAD_LOG_KEYS.ADDED,
    sorter: (a, b) => a[UPLOAD_LOG_KEYS.ADDED] - b[UPLOAD_LOG_KEYS.ADDED],
  },
  {
    title: 'Failed',
    dataIndex: UPLOAD_LOG_KEYS.FAILED,
    key: UPLOAD_LOG_KEYS.FAILED,
    sorter: (a, b) => a[UPLOAD_LOG_KEYS.FAILED] - b[UPLOAD_LOG_KEYS.FAILED],
  },
  {
    title: 'Download Errors',
    dataIndex: UPLOAD_LOG_KEYS.DOWNLOAD_ERRORS,
    key: UPLOAD_LOG_KEYS.DOWNLOAD_ERRORS,
    align: 'center',
    render: (value, record) => (
      <EduIf condition={record.failedCount && value}>
        <EduThen>
          <a href={value} target="_blank" rel="noopener noreferrer">
            <TableActionIcon IconComponent={MdFileDownload} />
          </a>
        </EduThen>
      </EduIf>
    ),
  },
]
