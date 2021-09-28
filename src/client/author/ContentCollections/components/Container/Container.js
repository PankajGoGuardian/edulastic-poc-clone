import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { get } from 'lodash'

import {
  MainWrapper,
  SpinContainer,
  StyledContent,
  StyledLayout,
  StyledSpin,
} from '../../../../admin/Common/StyledComponents'
import AdminHeader from '../../../src/components/common/AdminHeader/AdminHeader'
import Collections from '../Collections/Collections'
import { uploadContnentStatus, contentImportJobIds } from '../../ducks'
import { UPLOAD_STATUS } from '../../../ImportTest/ducks'

const title = 'Manage District'
const menuActive = { mainMenu: 'Content', subMenu: 'Collections' }

export const Container = ({
  history,
  routeKey,
  uploadStatus = '',
  jobIds = [],
  loading,
  upserting,
}) => {
  useEffect(() => {
    if (uploadStatus !== UPLOAD_STATUS.DONE && jobIds.length) {
      history.push('/author/import-content')
    }
  }, [])

  const showSpin = loading || upserting

  return (
    <MainWrapper key={routeKey}>
      <AdminHeader title={title} active={menuActive} history={history} />
      <StyledContent>
        <StyledLayout>
          {showSpin && (
            <SpinContainer loading={showSpin}>
              <StyledSpin size="large" />
            </SpinContainer>
          )}
          <Collections history={history} />
        </StyledLayout>
      </StyledContent>
    </MainWrapper>
  )
}

const enhance = compose(
  connect((state) => ({
    routeKey: get(state, ['router', 'location', 'key']),
    uploadStatus: uploadContnentStatus(state),
    jobIds: contentImportJobIds(state),
  }))
)

export default enhance(Container)
