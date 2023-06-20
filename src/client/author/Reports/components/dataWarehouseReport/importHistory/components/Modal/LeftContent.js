import React from 'react'
import { Divider } from 'antd'

import ContentRow from './ContentRow'
import {
  Header,
  ModalContentWrapper,
} from '../../../common/components/StyledComponents'

const LeftContent = ({ data, termsMap, isEditModal }) => {
  const { reportType, testName, termId, records } = data

  const leftHeaderText = isEditModal
    ? 'Edit External Data'
    : 'Delete Entire File'
  return (
    <ModalContentWrapper>
      <Header>
        {leftHeaderText} <Divider />
      </Header>
      <div style={{ padding: '60px 100px' }}>
        <ContentRow title="DATA TYPE" value={reportType} />
        <ContentRow title="NAME" value={testName} />
        <ContentRow
          title="SCHOOL YEAR"
          value={termsMap.get(termId)?.name || '-'}
        />
        <Divider dashed />
        <ContentRow title="NO. OF RECORDS" value={records || 'N/A'} />
      </div>
    </ModalContentWrapper>
  )
}

export default LeftContent
