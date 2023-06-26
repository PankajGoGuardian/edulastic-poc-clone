import React from 'react'
import { Divider } from 'antd'

import ContentRow from './ContentRow'
import {
  Header,
  ModalContentWrapper,
} from '../../../common/components/StyledComponents'

const LeftContent = ({ data, termsMap, isEditModal }) => {
  const { reportType, testName, termId, addedCount } = data

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
        <ContentRow title="NAME" value={testName} showTooltip />
        <ContentRow
          title="SCHOOL YEAR"
          value={termsMap.get(termId)?.name || '-'}
        />
        <Divider dashed />
        <ContentRow title="NO. OF RECORDS" value={addedCount || 'N/A'} />
      </div>
    </ModalContentWrapper>
  )
}

export default LeftContent
