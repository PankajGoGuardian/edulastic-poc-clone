import React from 'react'
import next from 'immer'
import { Tooltip } from 'antd'
import { MdEdit, MdDelete } from 'react-icons/md'
import { capitalize } from 'lodash'
import { ATTENDANCE } from '@edulastic/constants/const/testTypes'

import { EduElse, EduIf, EduThen, notification } from '@edulastic/common'
import {
  COMMON_KEYS,
  MANAGE_EXTERNAL_DATA_KEYS,
  dwLogStatus,
  dwLogStatusColorMap,
  dwLogStatusLabel,
  manageExternalDataColumns,
  uploadLogColumns,
} from './constants'
import { StyledTag } from '../../common/components/StyledComponents'
import appConfig from '../../../../../../../app-config'
import TableActionIcon from '../components/TableActionIcon'

const { cdnURI } = appConfig

export const sortText = (a, b, key) =>
  (a[key] || '').toLowerCase().localeCompare((b[key] || '').toLowerCase())

export const sortByDate = (a = '', b = '') => new Date(a) - new Date(b)

export const getTagRender = (status, statusReason = '') => {
  const tag = (
    <StyledTag $color={dwLogStatusColorMap[status]}>
      {dwLogStatusLabel[status]}
    </StyledTag>
  )
  return (
    <EduIf condition={status === dwLogStatus.FAILED}>
      <EduThen>
        <Tooltip title={statusReason} placement="right">
          {tag}
        </Tooltip>
      </EduThen>
      <EduElse>{tag}</EduElse>
    </EduIf>
  )
}

const findColumnIndex = (columns, columnKey) =>
  columns.findIndex(({ key }) => key === columnKey)

export const getUploadLogColumns = (termsMap) => {
  return next(uploadLogColumns, (rawColumns) => {
    const schoolTermIdx = findColumnIndex(rawColumns, COMMON_KEYS.SCHOOL_TERM)
    rawColumns[schoolTermIdx].render = (termId) =>
      termsMap.has(termId) ? termsMap.get(termId).name : '-'
    rawColumns[schoolTermIdx].sorter = (a, b) =>
      sortByDate(
        termsMap.get(a.termId)?.startDate,
        termsMap.get(b.termId)?.startDate
      )
  })
}

export const getManageExternalDataColumns = (
  termsMap,
  handleEditClick,
  handleDeleteClick
) => {
  return next(manageExternalDataColumns, (rawColumns) => {
    const schoolTermIdx = findColumnIndex(rawColumns, COMMON_KEYS.SCHOOL_TERM)
    rawColumns[schoolTermIdx].render = (termId) =>
      termsMap.has(termId) ? termsMap.get(termId).name : '-'
    rawColumns[schoolTermIdx].sorter = (a, b) =>
      sortByDate(
        termsMap.get(a.termId)?.startDate,
        termsMap.get(b.termId)?.startDate
      )
    const editIdx = findColumnIndex(rawColumns, MANAGE_EXTERNAL_DATA_KEYS.EDIT)
    rawColumns[editIdx].render = (_, record) => (
      <TableActionIcon
        IconComponent={MdEdit}
        onClick={() => handleEditClick(record)}
        disabled={record.status === dwLogStatus.IN_PROGRESS}
        onDisabledClick={() =>
          notification({
            type: 'info',
            msg: 'Edit is disabled as upload is currently processing.',
          })
        }
      />
    )
    const deleteIdx = findColumnIndex(
      rawColumns,
      MANAGE_EXTERNAL_DATA_KEYS.DELETE
    )
    rawColumns[deleteIdx].render = (_, record) => (
      <TableActionIcon
        IconComponent={MdDelete}
        onClick={() => handleDeleteClick(record)}
        disabled={record.status === dwLogStatus.IN_PROGRESS}
        onDisabledClick={() =>
          notification({
            type: 'info',
            msg: 'Delete is disabled as upload is currently processing.',
          })
        }
      />
    )
  })
}

export const getTemplateFilePath = (type) => {
  const name = type === ATTENDANCE ? capitalize(type) : type
  return `${cdnURI}/JS/webresources/csv/${name}_Template.csv`
}
