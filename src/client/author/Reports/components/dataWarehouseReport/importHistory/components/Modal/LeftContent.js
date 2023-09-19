import React from 'react'
import { Divider } from 'antd'
import { upperCase } from 'lodash'

import { FEED_NAME_LABEL } from '@edulastic/constants/const/dataWarehouse'
import ContentRow from './ContentRow'
import {
  Header,
  ModalContentWrapper,
} from '../../../common/components/StyledComponents'

const LeftContent = ({ data, termsMap, isEditModal }) => {
  const { feedType, feedName, termId, addedCount } = data

  const leftHeaderText = isEditModal
    ? 'Edit External Data'
    : 'Delete Entire File'
  return (
    <ModalContentWrapper>
      <Header>
        {leftHeaderText} <Divider />
      </Header>
      <div style={{ padding: '50px' }}>
        <ContentRow title="FEED TYPE" value={feedType} />
        <ContentRow
          title={upperCase(FEED_NAME_LABEL)}
          value={feedName}
          showTooltip
        />
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
