import React from 'react'
import { Divider } from 'antd'
import { upperCase } from 'lodash'
import moment from 'moment'

import { FEED_NAME_LABEL } from '@edulastic/constants/const/dataWarehouse'
import { formatDate } from '@edulastic/constants/reportUtils/common'
import { EduIf } from '@edulastic/common'
import ContentRow from './ContentRow'
import {
  Header,
  ModalContentWrapper,
} from '../../../common/components/StyledComponents'
import { FEED_TYPES_WITH_TEST_DATE_INPUT } from '../../../../../../Shared/Components/DataWarehouseUploadModal/utils'

const LeftContent = ({ data, termsMap, isEditModal }) => {
  const { feedType, feedName, termId, addedCount, testDate: testDateStr } = data
  const testDate = formatDate(+moment(testDateStr))

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
        <EduIf condition={FEED_TYPES_WITH_TEST_DATE_INPUT.includes(feedType)}>
          <ContentRow title="TEST DATE" value={testDate} />
        </EduIf>
        <Divider dashed />
        <ContentRow title="NO. OF RECORDS" value={addedCount || 'N/A'} />
      </div>
    </ModalContentWrapper>
  )
}

export default LeftContent
