import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { get } from 'lodash'

import {
  MainWrapper,
  StyledContent,
  StyledLayout,
  SpinContainer,
  StyledSpin,
} from '../../../admin/Common/StyledComponents'
import AdminHeader from '../../src/components/common/AdminHeader/AdminHeader'

import ContentAuthorTable from './ContentAuthorTable'

const title = 'Manage District'
const menuActive = { mainMenu: 'Users', subMenu: 'Content Approvers' }

const ContentAuthor = ({
  loading,
  updating,
  creating,
  deleting,
  history,
  routeKey,
}) => {
  const showSpin = loading || updating || creating || deleting
  return (
    <MainWrapper key={routeKey}>
      <AdminHeader title={title} active={menuActive} history={history} />
      <StyledContent>
        <StyledLayout loading={showSpin ? 'true' : 'false'}>
          {showSpin && (
            <SpinContainer blur>
              <StyledSpin size="large" />
            </SpinContainer>
          )}
          <ContentAuthorTable history={history} />
        </StyledLayout>
      </StyledContent>
    </MainWrapper>
  )
}

const enhance = compose(
  connect((state) => ({
    loading: get(state, ['schoolAdminReducer', 'loading'], false),
    updating: get(state, ['schoolAdminReducer', 'updating'], false),
    creating: get(state, ['schoolAdminReducer', 'creating'], false),
    deleting: get(state, ['schoolAdminReducer', 'deleting'], false),
    routeKey: get(state, ['router', 'location', 'key']),
  }))
)

export default enhance(ContentAuthor)

ContentAuthor.propTypes = {
  loading: PropTypes.bool.isRequired,
  updating: PropTypes.bool.isRequired,
  creating: PropTypes.bool.isRequired,
  deleting: PropTypes.bool.isRequired,
}
